/**
 * LAYER 2 — PARSER
 * Responsibility: Transform raw InstagramInboxExport[] → BookConversation.
 * - Fixes Instagram encoding bugs
 * - Normalises all message types into RawImportedMessage
 * - Sorts chronologically
 * - Detects participants
 *
 * No I/O. No fetch. No rendering. Pure data transformation.
 */

import type {
  InstagramInboxExport,
  InstagramRawMessage,
} from "@/types/instagram";
import type {
  BookConversation,
  BookParticipant,
  RawImportedMessage,
} from "@/types/importProvider";
import { fixInstagramEncoding, fixObjectEncoding } from "./encodingUtils";
import { parseDurationString } from "./audioUtils";

/** Stable participant ID derived from their name */
function participantId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "_");
}

/**
 * Map a raw Instagram message to a normalised RawImportedMessage.
 * Never throws — unknown types become placeholder messages.
 */
function mapMessage(
  raw: InstagramRawMessage,
  selfParticipantId: string,
  audioDurationMap: Map<string, string>,
  msgIndex: number,
): RawImportedMessage {
  const senderName = fixInstagramEncoding(raw.sender_name ?? "Unknown");
  const senderId = participantId(senderName);

  const base: Omit<RawImportedMessage, "type"> = {
    id: `msg_${raw.timestamp_ms}_${msgIndex}`,
    senderId,
    senderName,
    timestampMs: raw.timestamp_ms,
    isUnsent: raw.is_unsent ?? false,
    reactions: raw.reactions?.map((r) => ({
      reaction: fixInstagramEncoding(r.reaction),
      actor: fixInstagramEncoding(r.actor),
    })),
  };

  // Unsent / deleted messages
  if (raw.is_unsent) {
    return {
      ...base,
      type: "placeholder",
      originalType: "unsent",
    } satisfies RawImportedMessage;
  }

  // Call notifications
  if (raw.type === "Call") {
    const hasContent = raw.content ? raw.content.toLowerCase() : "";
    let callType: RawImportedMessage["callType"] = "call_ended";
    if (hasContent.includes("missed")) {
      callType = hasContent.includes("video") ? "missed_video" : "missed_voice";
    }
    return { ...base, type: "call", callType } satisfies RawImportedMessage;
  }

  // Photos
  if (raw.photos && raw.photos.length > 0) {
    const photo = raw.photos[0]!;
    return {
      ...base,
      type: "photo",
      mediaUrl: photo.uri,
      mediaType: "photo",
      content: raw.content ? fixInstagramEncoding(raw.content) : undefined,
    } satisfies RawImportedMessage;
  }

  // Videos
  if (raw.videos && raw.videos.length > 0) {
    const video = raw.videos[0]!;
    return {
      ...base,
      type: "video",
      mediaUrl: video.uri,
      mediaType: "video",
      content: raw.content ? fixInstagramEncoding(raw.content) : undefined,
    } satisfies RawImportedMessage;
  }

  // Voice / audio files
  if (raw.audio_files && raw.audio_files.length > 0) {
    const audio = raw.audio_files[0]!;
    const duration = audioDurationMap.get(audio.uri) ?? "0:00";
    return {
      ...base,
      type: "voice",
      mediaUrl: audio.uri,
      mediaType: "audio",
      mediaDuration: duration,
    } satisfies RawImportedMessage;
  }

  // GIFs (Instagram marks them as a share with gifs[] or sometimes a photo)
  if (raw.gifs && raw.gifs.length > 0) {
    const gif = (raw.gifs as Array<{ uri: string }>)[0]!;
    return {
      ...base,
      type: "gif",
      mediaUrl: gif.uri,
      mediaType: "gif",
    } satisfies RawImportedMessage;
  }

  // Stickers
  if (raw.sticker) {
    const sticker = raw.sticker as { uri?: string };
    return {
      ...base,
      type: "sticker",
      mediaUrl: sticker.uri,
      mediaType: "sticker",
    } satisfies RawImportedMessage;
  }

  // Shares (posts, reels, profiles, story replies, links)
  if (raw.share) {
    const link = raw.share.link;
    const shareText = raw.share.share_text
      ? fixInstagramEncoding(raw.share.share_text)
      : undefined;
    const originalAuthor = raw.share.original_content_owner
      ? fixInstagramEncoding(raw.share.original_content_owner)
      : undefined;

    if (link) {
      return {
        ...base,
        type: "link",
        shareUrl: link,
        shareText,
        shareOriginalAuthor: originalAuthor,
        content: raw.content ? fixInstagramEncoding(raw.content) : undefined,
      } satisfies RawImportedMessage;
    }

    return {
      ...base,
      type: "share",
      shareUrl: link,
      shareText,
      shareOriginalAuthor: originalAuthor,
      content: raw.content ? fixInstagramEncoding(raw.content) : undefined,
    } satisfies RawImportedMessage;
  }

  // Plain text (most common)
  if (raw.content) {
    return {
      ...base,
      type: "text",
      content: fixInstagramEncoding(raw.content),
    } satisfies RawImportedMessage;
  }

  // Unknown / future type — degrade gracefully
  return {
    ...base,
    type: "placeholder",
    originalType: raw.type ?? "unknown",
    content: raw.content ? fixInstagramEncoding(raw.content) : undefined,
  } satisfies RawImportedMessage;
}

export interface ParseOptions {
  /** Pre-resolved audio durations keyed by the raw `uri` string from the JSON */
  audioDurationMap?: Map<string, string>;
}

/**
 * Parse an array of raw Instagram inbox JSON exports into a BookConversation.
 *
 * @param exports - Raw JSON objects from message_1.json, message_2.json, ...
 * @param selfName - The name of the current user (participants[0].name in the export)
 * @param resolveMediaUrl - Callback: given a raw URI from the JSON, return a usable URL
 * @param options - Additional options (pre-computed audio durations, etc.)
 */
export function parseInstagramConversation(
  exports: InstagramInboxExport[],
  selfName: string,
  resolveMediaUrl: (rawUri: string) => string,
  options: ParseOptions = {},
): BookConversation {
  if (exports.length === 0) {
    throw new Error("No Instagram export data provided");
  }

  // Fix encoding on every raw export
  const fixedExports = exports.map((e) => fixObjectEncoding(e));

  // Merge all participants (deduplicate by name)
  const participantMap = new Map<string, BookParticipant>();
  const selfId = participantId(selfName);

  for (const exp of fixedExports) {
    for (const p of exp.participants ?? []) {
      const id = participantId(p.name);
      if (!participantMap.has(id)) {
        participantMap.set(id, {
          id,
          name: p.name,
          isSelf: id === selfId,
        });
      }
    }
  }

  // Ensure self is always present even if not in participants list
  if (!participantMap.has(selfId)) {
    participantMap.set(selfId, { id: selfId, name: selfName, isSelf: true });
  }

  const participants = Array.from(participantMap.values());
  const audioDurationMap = options.audioDurationMap ?? new Map<string, string>();

  // Merge all messages from all export files
  const allRaw: InstagramRawMessage[] = [];
  for (const exp of fixedExports) {
    if (Array.isArray(exp.messages)) {
      allRaw.push(...exp.messages);
    }
  }

  // Sort chronologically ascending
  allRaw.sort((a, b) => a.timestamp_ms - b.timestamp_ms);

  // Map to normalised messages
  let totalPhotos = 0;
  let totalVideos = 0;
  let totalVoiceNotes = 0;

  const messages: RawImportedMessage[] = allRaw.map((raw, idx) => {
    const msg = mapMessage(raw, selfId, audioDurationMap, idx);

    // Resolve media URLs
    if (msg.mediaUrl) {
      msg.mediaUrl = resolveMediaUrl(msg.mediaUrl);
    }

    // Count media
    if (msg.type === "photo") totalPhotos++;
    else if (msg.type === "video") totalVideos++;
    else if (msg.type === "voice") totalVoiceNotes++;

    return msg;
  });

  // Derive conversation title from the first export
  const title = fixedExports[0]?.title
    ? fixInstagramEncoding(fixedExports[0].title)
    : participants.filter((p) => !p.isSelf).map((p) => p.name).join(", ");

  const timestamps = messages.map((m) => m.timestampMs).filter(Boolean);
  const startDate = new Date(Math.min(...timestamps));
  const endDate = new Date(Math.max(...timestamps));

  if (import.meta.env.DEV) {
    console.group("[MemoryBook] Conversation parsed");
    console.log("Title:", title);
    console.log("Participants:", participants.map((p) => `${p.name}${p.isSelf ? " (self)" : ""}`).join(", "));
    console.log("parsedMessages.length:", messages.length);
    console.log("parsedMessages (first 10):", messages.slice(0, 10));
    console.log("Photos:", totalPhotos, "| Videos:", totalVideos, "| Voice notes:", totalVoiceNotes);
    console.log("Date range:", startDate.toLocaleDateString(), "→", endDate.toLocaleDateString());
    console.groupEnd();
  }

  return {
    title,
    participants,
    selfParticipantId: selfId,
    messages,
    startDate,
    endDate,
    totalPhotos,
    totalVideos,
    totalVoiceNotes,
  };
}
