/**
 * Framework-Agnostic React Hook for AI Memory Search Engine
 *
 * Exposes:
 * - query: string
 * - setQuery: (q: string) => void
 * - results: SearchResultItem[]
 * - isIndexing: boolean
 * - isReady: boolean
 */

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import type { Message, BookLeaf, MessageAuthor } from "@/types/conversation";
import {
  MemorySearchEngine,
  type SearchResultItem,
  type MatchType,
} from "@/lib/search/searchEngine";

export type { SearchResultItem, MatchType };

export interface UseSearchResult {
  query: string;
  setQuery: (q: string) => void;
  results: SearchResultItem[];
  isIndexing: boolean;
  isReady: boolean;
}

export interface UseSearchOptions {
  leaves?: BookLeaf[] | undefined;
  debounceMs?: number | undefined;
  maxResults?: number | undefined;
}

export function useSearch(
  messages: Message[],
  options?: UseSearchOptions,
): UseSearchResult {
  const debounceMs = options?.debounceMs ?? 130;
  const maxResults = options?.maxResults ?? 50;
  const leaves = options?.leaves;

  const [query, setQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isIndexing, setIsIndexing] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  const workerRef = useRef<Worker | null>(null);
  const localEngineRef = useRef<MemorySearchEngine | null>(null);
  const queryCacheRef = useRef<Map<string, SearchResultItem[]>>(new Map());
  const debounceTimerRef = useRef<number | null>(null);
  const requestIdRef = useRef<number>(0);

  // Build page map lookup: messageId -> pageNumber
  const pageMapEntries = useMemo<[string, number][]>(() => {
    if (!leaves || leaves.length === 0) return [];
    const entries: [string, number][] = [];
    for (const leaf of leaves) {
      for (const m of leaf.left) {
        entries.push([m.id, leaf.pageNumber]);
      }
      for (const m of leaf.right) {
        entries.push([m.id, leaf.pageNumber + 1]);
      }
    }
    return entries;
  }, [leaves]);

  // Initialize Worker or local fallback engine
  useEffect(() => {
    let worker: Worker | null = null;
    try {
      if (typeof window !== "undefined" && typeof Worker !== "undefined") {
        worker = new Worker(
          new URL("../lib/search/searchWorker.ts", import.meta.url),
          { type: "module" },
        );

        worker.onmessage = (e: MessageEvent) => {
          const { type, payload } = e.data;
          if (type === "INDEXED") {
            setIsIndexing(false);
            setIsReady(true);
          } else if (type === "SEARCH_RESULTS") {
            if (payload.requestId === requestIdRef.current) {
              setResults(payload.results);
            }
          }
        };

        workerRef.current = worker;
      }
    } catch {
      workerRef.current = null;
    }

    if (!workerRef.current) {
      localEngineRef.current = new MemorySearchEngine();
    }

    return () => {
      if (worker) {
        worker.terminate();
      }
      workerRef.current = null;
    };
  }, []);

  // Index messages whenever messages or pageMap change
  useEffect(() => {
    if (messages.length === 0) {
      setIsIndexing(false);
      setIsReady(true);
      setResults([]);
      queryCacheRef.current.clear();
      return;
    }

    setIsIndexing(true);
    setIsReady(false);
    queryCacheRef.current.clear();

    if (workerRef.current) {
      workerRef.current.postMessage({
        type: "INDEX",
        payload: {
          messages,
          pageMapEntries,
        },
      });
    } else if (localEngineRef.current) {
      // Chunked asynchronous main-thread indexing fallback
      const pageMap = new Map(pageMapEntries);
      const engine = localEngineRef.current;
      setTimeout(() => {
        engine.indexMessages(messages, pageMap);
        setIsIndexing(false);
        setIsReady(true);
      }, 0);
    }
  }, [messages, pageMapEntries]);

  // Debounce user input
  useEffect(() => {
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
    }

    const trimmed = query.trim();
    if (!trimmed) {
      setDebouncedQuery("");
      setResults([]);
      return;
    }

    debounceTimerRef.current = window.setTimeout(() => {
      setDebouncedQuery(trimmed);
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, debounceMs]);

  // Execute query on debounced input change
  const executeQuery = useCallback(
    (q: string) => {
      if (!q) {
        setResults([]);
        return;
      }

      // Check in-memory query cache
      const cached = queryCacheRef.current.get(q.toLowerCase());
      if (cached) {
        setResults(cached);
        return;
      }

      const reqId = ++requestIdRef.current;

      if (workerRef.current && isReady) {
        workerRef.current.postMessage({
          type: "SEARCH",
          payload: {
            query: q,
            maxResults,
            requestId: reqId,
          },
        });
      } else if (localEngineRef.current) {
        const res = localEngineRef.current.search(q, maxResults);
        queryCacheRef.current.set(q.toLowerCase(), res);
        setResults(res);
      }
    },
    [isReady, maxResults],
  );

  useEffect(() => {
    if (debouncedQuery) {
      executeQuery(debouncedQuery);
    }
  }, [debouncedQuery, executeQuery]);

  return {
    query,
    setQuery,
    results,
    isIndexing,
    isReady,
  };
}
