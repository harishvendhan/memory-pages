import { useMemo, useState, useCallback } from "react";
import type { BookVolume, SearchHit, Message } from "@/types/conversation";
import type { BookConversation } from "@/types/importProvider";
import {
  IMemoryBookAdapter,
  InstagramConversationAdapter,
} from "@/lib/adapters/dataAdapter";
import { useAsyncPaginator } from "./useAsyncPaginator";

export function useMemoryBook(initialAdapter?: IMemoryBookAdapter) {
  const [adapter, setAdapter] = useState<IMemoryBookAdapter | null>(
    () => initialAdapter ?? null,
  );

  if (adapter && adapter.constructor.name === "StaticMemoryAdapter") {
    throw new Error("StaticMemoryAdapter should never be used after successful import.");
  }

  console.log("Adapter:", adapter?.constructor.name ?? "null");

  const rawVolume: BookVolume | null = useMemo(() => adapter ? adapter.getVolume() : null, [adapter]);

  // Extract all messages for dynamic async height-cached pagination
  const allMessages = useMemo(() => {
    if (!rawVolume) return [];
    const msgs: Message[] = [];
    rawVolume.leaves.forEach((l) => msgs.push(...l.left, ...l.right));
    return msgs;
  }, [rawVolume]);

  const { leaves: asyncLeaves, isPaginating, isLocked, forceRepaginate } = useAsyncPaginator({
    messages: allMessages,
  });

  const leaves = asyncLeaves.length > 0 ? asyncLeaves : (rawVolume?.leaves ?? []);

  /**
   * Load a BookConversation from any import provider.
   * The book never knows whether it came from a ZIP, public folder, or future source.
   */
  const loadBookConversation = useCallback((conversation: BookConversation) => {
    const newAdapter = new InstagramConversationAdapter(conversation);
    setAdapter(newAdapter);
  }, []);

  const search = useCallback(
    (term: string): SearchHit[] => {
      if (!adapter) return [];
      return adapter.searchMessages(term);
    },
    [adapter],
  );

  return {
    volume: rawVolume,
    leaves,
    chapters: rawVolume?.chapters ?? [],
    totalPages: rawVolume?.totalPages ?? 0,
    isPaginating,
    isLocked,
    forceRepaginate,
    loadBookConversation,
    search,
  };
}
