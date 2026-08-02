/**
 * LAYER 3 — ADAPTERS
 * Responsibility: Convert BookConversation → Message[] and BookVolume for the Memory Book engine.
 *
 * Rules:
 * - Receives ONLY BookConversation (never raw JSON, ZIP, or File)
 * - Maps RawImportedMessage → typed Message union (the app's internal type)
 * - Calls paginateMessagesWithCache to build BookLeaf[]
 * - Must NOT perform I/O, fetch, or JSON parsing
 * - Must NOT render anything
 */

import type { BookVolume, Message, SearchHit } from "@/types/conversation";
import type { BookConversation, RawImportedMessage } from "@/types/importProvider";
import { paginateMessagesWithCache } from "@/lib/layout/heightPaginator";

export interface IMemoryBookAdapter {
  getVolume(): BookVolume;
  searchMessages(term: string): SearchHit[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Instagram Conversation Adapter
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Converts a BookConversation (from any import provider) into the Memory Book's
 * internal BookVolume representation.
 *
 * This is the ONLY place where RawImportedMessage → Message conversion happens.
 */
export class InstagramConversationAdapter implements IMemoryBookAdapter {
  private volume: BookVolume;

  constructor(conversation: BookConversation) {
    const messages = this.mapMessages(conversation);
    const leaves = paginateMessagesWithCache(
      messages,
      360,   // containerWidth
      1.0,   // fontScale
      460,   // printableHeight (calibrated to fit comfortably without overlap)
      12,    // gapHeight
      1,     // initialPageNumber
    );

    this.volume = {
      title: conversation.title,
      totalPages: Math.max(leaves.length * 2, 300),
      chapters: this.buildChapters(conversation, leaves),
      leaves,
    };
  }

  getVolume(): BookVolume {
    return this.volume;
  }

  searchMessages(term: string): SearchHit[] {
    return searchVolume(this.volume, term);
  }

  /**
   * Map every RawImportedMessage → typed Message union.
   * Author is determined by comparing senderId to selfParticipantId.
   * senderName and avatarUrl come from the BookParticipant registry.
   */
  private mapMessages(conversation: BookConversation): Message[] {
    const participantMap = new Map(
      conversation.participants.map((p) => [p.id, p]),
    );

    return conversation.messages.map((raw): Message => {
      const participant = participantMap.get(raw.senderId);
      const author = (
        raw.senderId === conversation.selfParticipantId ? "me" : "them"
      ) satisfies "me" | "them";

      const time = new Date(raw.timestampMs).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      type BaseMsg = {
        id: string;
        author: "me" | "them";
        time: string;
        timestampMs: number;
        senderName: string;
        avatarUrl?: string;
        reactions?: Array<{ reaction: string; actor: string }>;
      };

      const base: BaseMsg = {
        id: raw.id,
        author,
        time,
        timestampMs: raw.timestampMs,
        senderName: raw.senderName,
      };
      if (participant?.avatarUrl !== undefined) base.avatarUrl = participant.avatarUrl;
      if (raw.reactions !== undefined) base.reactions = raw.reactions;

      return this.mapMessageType(raw, base);
    });
  }

  private mapMessageType(
    raw: RawImportedMessage,
    base: {
      id: string;
      author: "me" | "them";
      time: string;
      timestampMs: number;
      senderName: string;
      avatarUrl?: string;
      reactions?: Array<{ reaction: string; actor: string }>;
    },
  ): Message {
    switch (raw.type) {
      case "text":
        return { ...base, type: "text", text: raw.content ?? "" };

      case "photo":
        return {
          ...base,
          type: "photo",
          src: raw.mediaUrl ?? "",
          caption: raw.content,
        };

      case "video":
        return {
          ...base,
          type: "video",
          src: raw.mediaUrl,
          duration: raw.mediaDuration ?? "0:00",
          poster: raw.mediaUrl ?? "",
          caption: raw.content,
        };

      case "voice":
        return {
          ...base,
          type: "voice",
          src: raw.mediaUrl,
          duration: raw.mediaDuration ?? "0:00",
          caption: raw.content,
        };

      case "gif":
        return {
          ...base,
          type: "gif",
          src: raw.mediaUrl ?? "",
          caption: raw.content,
        };

      case "sticker":
        return {
          ...base,
          type: "sticker",
          src: raw.mediaUrl,
          stickerName: raw.content,
        };

      case "link":
        return {
          ...base,
          type: "link",
          url: raw.shareUrl ?? raw.content ?? "",
          title: raw.shareText,
          text: raw.content,
        };

      case "share":
        return {
          ...base,
          type: "share",
          shareType: "post",
          title: raw.shareText,
          previewUrl: raw.shareUrl,
          authorName: raw.shareOriginalAuthor,
          caption: raw.content,
        };

      case "call":
        return {
          ...base,
          type: "call",
          callType: raw.callType ?? "call_ended",
        };

      case "placeholder":
      default:
        return {
          ...base,
          type: "placeholder",
          placeholderText: raw.isUnsent
            ? "Message was deleted"
            : raw.content ?? "Content unavailable",
          originalType: raw.originalType,
        };
    }
  }

  /**
   * Build chapter markers based on date ranges in the paginated leaves.
   * Creates a chapter entry for each unique month in the conversation.
   */
  private buildChapters(
    conversation: BookConversation,
    leaves: ReturnType<typeof paginateMessagesWithCache>,
  ) {
    const seenMonths = new Set<string>();
    const chapters: Array<{ title: string; subtitle: string; page: number }> = [];

    for (const leaf of leaves) {
      const firstMsg = leaf.left[0] ?? leaf.right[0];
      if (!firstMsg) continue;

      const date = new Date(firstMsg.timestampMs);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

      if (!seenMonths.has(monthKey)) {
        seenMonths.add(monthKey);
        chapters.push({
          title: date.toLocaleDateString("en-GB", { month: "long", year: "numeric" }).toUpperCase(),
          subtitle: conversation.title,
          page: leaf.pageNumber,
        });
      }
    }

    return chapters;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared search utility
// ─────────────────────────────────────────────────────────────────────────────

function searchVolume(volume: BookVolume, term: string): SearchHit[] {
  const q = term.trim().toLowerCase();
  if (q.length < 2) return [];

  const found: SearchHit[] = [];
  volume.leaves.forEach((leaf, leafIndex) => {
    [...leaf.left, ...leaf.right].forEach((m) => {
      const text =
        m.type === "text"
          ? m.text
          : "caption" in m && m.caption
          ? m.caption
          : "";
      if (text.toLowerCase().includes(q)) {
        found.push({
          leafIndex,
          page: leaf.pageNumber,
          chapter: leaf.chapter,
          author: m.author,
          excerpt: text,
        });
      }
    });
  });
  return found;
}

// Legacy adapters removed
