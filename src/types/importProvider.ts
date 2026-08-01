/**
 * Import Abstraction Types
 *
 * These types define the universal contract between every import provider
 * and the rest of the application. The Memory Book only ever sees BookConversation.
 *
 * Strict separation of concerns:
 * - Providers return BookConversation
 * - Parsers produce BookConversation from raw data
 * - Adapters consume BookConversation to produce BookVolume
 * - Rendering never sees a File, ZIP, or raw JSON
 */

/** A single participant in a conversation */
export interface BookParticipant {
  /** Stable lowercase ID derived from the participant's name */
  id: string;
  /** Display name (encoding-fixed) */
  name: string;
  /** Optional resolved avatar URL (blob URL or public path) */
  avatarUrl?: string | undefined;
  /** true = this is the current user → renders on LEFT side */
  isSelf: boolean;
}

/**
 * A single message normalised from any import source.
 * All string fields have been encoding-fixed.
 * All media URLs have been resolved to usable browser URLs.
 */
export interface RawImportedMessage {
  /** Unique stable ID for pagination caching */
  id: string;
  /** Matches BookParticipant.id */
  senderId: string;
  /** Human-readable sender name */
  senderName: string;
  /** Unix timestamp in milliseconds */
  timestampMs: number;
  /** Normalised message type */
  type:
    | "text"
    | "photo"
    | "video"
    | "voice"
    | "gif"
    | "sticker"
    | "share"
    | "link"
    | "call"
    | "placeholder";
  /** Text content (for text messages, captions, share text) */
  content?: string | undefined;
  /** Resolved media URL (blob URL or public path) */
  mediaUrl?: string | undefined;
  /** Media type hint for renderers */
  mediaType?: "photo" | "video" | "audio" | "gif" | "sticker" | "file" | undefined;
  /** Formatted duration string e.g. "0:34" for voice / video */
  mediaDuration?: string | undefined;
  /** Resolved URL for a shared post/reel/profile */
  shareUrl?: string | undefined;
  /** Caption or description from a share */
  shareText?: string | undefined;
  /** Original author of a shared post */
  shareOriginalAuthor?: string | undefined;
  /** Whether this message was unsent/deleted */
  isUnsent?: boolean | undefined;
  /** Emoji reactions on this message */
  reactions?: Array<{ reaction: string; actor: string }> | undefined;
  /** For call messages */
  callType?: "missed_voice" | "missed_video" | "call_ended" | undefined;
  /** For attachment messages */
  fileName?: string | undefined;
  /** Original raw type string preserved for unknown/future graceful degradation */
  originalType?: string | undefined;
  /** Pre-resolved GIF array from raw data */
  gifs?: Array<{ uri: string }> | undefined;
  /** Raw sticker data */
  sticker?: unknown | undefined;
}

/**
 * The universal conversation contract.
 * This is the ONLY type the adapter and Memory Book engine ever receive.
 * It contains no raw JSON, no ZIP objects, no File handles.
 */
export interface BookConversation {
  /** Human-readable conversation title */
  title: string;
  /** All participants in the conversation */
  participants: BookParticipant[];
  /** The ID of the current user (for left/right alignment) */
  selfParticipantId: string;
  /** All messages sorted chronologically ascending */
  messages: RawImportedMessage[];
  /** Date of the first message */
  startDate: Date;
  /** Date of the last message */
  endDate: Date;
  /** Statistics */
  totalPhotos: number;
  totalVideos: number;
  totalVoiceNotes: number;
}

/**
 * A conversation folder discovered inside a ZIP file.
 * Used to power the ConversationSelector UI.
 */
export interface ZipConversationFolder {
  /** Path inside the ZIP (e.g. "your_instagram_activity/messages/inbox/username_abc/") */
  path: string;
  /** Human-readable conversation name */
  title: string;
  /** Number of message_*.json files found */
  messageFileCount: number;
}

/**
 * The universal import provider interface.
 *
 * Every provider (PublicFolder, ZIP, Google Drive, Dropbox, etc.)
 * implements this interface. The Memory Book never knows which provider is used.
 */
export interface ConversationImportProvider {
  /**
   * Load and return the complete, normalised BookConversation.
   * All encoding fixes, media resolution, and sorting must be done
   * before returning. The receiver gets clean data.
   */
  loadConversation(): Promise<BookConversation>;
}
