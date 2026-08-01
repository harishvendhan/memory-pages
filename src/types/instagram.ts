/**
 * Type definitions matching Instagram's official Data Download JSON export format.
 * Instagram splits conversations into multiple files: message_1.json, message_2.json, ... message_N.json.
 *
 * NOTE: These types describe raw, unprocessed Instagram data.
 * Strings may be Latin-1 encoded (Instagram encoding bug).
 * These types must ONLY be used inside Layer 2 parsers.
 * The rest of the application uses BookConversation from importProvider.ts.
 */

export interface InstagramRawPhoto {
  uri: string;
  creation_timestamp?: number | undefined;
}

export interface InstagramRawVideo {
  uri: string;
  creation_timestamp?: number | undefined;
  thumbnail?: { uri: string } | undefined;
}

export interface InstagramRawAudio {
  uri: string;
  creation_timestamp?: number | undefined;
}

export interface InstagramRawGif {
  uri: string;
}

export interface InstagramRawSticker {
  uri?: string | undefined;
  ai_stickers?: unknown[] | undefined;
}

export interface InstagramRawReaction {
  reaction: string;
  actor: string;
}

export interface InstagramRawShare {
  link?: string | undefined;
  share_text?: string | undefined;
  original_content_owner?: string | undefined;
}

export interface InstagramRawMessage {
  sender_name: string;
  timestamp_ms: number;
  /** Plain text content. May be absent for media messages. */
  content?: string | undefined;
  photos?: InstagramRawPhoto[] | undefined;
  videos?: InstagramRawVideo[] | undefined;
  audio_files?: InstagramRawAudio[] | undefined;
  gifs?: InstagramRawGif[] | undefined;
  sticker?: InstagramRawSticker | undefined;
  reactions?: InstagramRawReaction[] | undefined;
  share?: InstagramRawShare | undefined;
  /**
   * Instagram message type string.
   * Known values: "Generic", "Call", "Subscribe", "Share"
   * Unknown values must degrade gracefully.
   */
  type?: string | undefined;
  /** true when the sender deleted/unsent a message */
  is_unsent?: boolean | undefined;
}

export interface InstagramParticipant {
  name: string;
}

export interface InstagramInboxExport {
  participants: InstagramParticipant[];
  messages: InstagramRawMessage[];
  title: string;
  is_still_participant: boolean;
  thread_path: string;
  magic_words: unknown[];
}
