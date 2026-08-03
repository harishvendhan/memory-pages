/**
 * Web Worker for running inverted indexing and fuzzy queries off the main thread.
 */

import { MemorySearchEngine, type SearchResultItem } from "./searchEngine";
import type { Message } from "@/types/conversation";

const engine = new MemorySearchEngine();

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data;

  switch (type) {
    case "INDEX": {
      const messages: Message[] = payload.messages ?? [];
      const pageMapEntries: [string, number][] | undefined = payload.pageMapEntries;
      const pageMap = pageMapEntries ? new Map(pageMapEntries) : undefined;

      const startTime = performance.now();
      engine.indexMessages(messages, pageMap);
      const elapsed = performance.now() - startTime;

      self.postMessage({
        type: "INDEXED",
        payload: {
          count: messages.length,
          elapsedMs: elapsed,
        },
      });
      break;
    }

    case "SEARCH": {
      const { query, maxResults = 50, requestId } = payload;
      const results: SearchResultItem[] = engine.search(query, maxResults);

      self.postMessage({
        type: "SEARCH_RESULTS",
        payload: {
          results,
          requestId,
        },
      });
      break;
    }

    case "CLEAR": {
      engine.clear();
      self.postMessage({ type: "CLEARED" });
      break;
    }
  }
};
