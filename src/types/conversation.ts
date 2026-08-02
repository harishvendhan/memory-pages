export type MessageAuthor = "me" | "them";

export interface Reaction {
  reaction: string;
  actor: string;
}

export interface LinkMetadata {
  url: string;
  title?: string | undefined;
  originalText?: string | undefined;
}

export interface ShareMetadata {
  shareUrl?: string | undefined;
  shareText?: string | undefined;
  originalAuthor?: string | undefined;
  previewUrl?: string | undefined;
  shareType?: "post" | "reel" | "profile" | "story_reply" | undefined;
}

export interface BaseMessage {
  id: string;
  author: MessageAuthor;
  time: string;
  timestampMs: number;
  reactions?: Reaction[] | undefined;
  link?: LinkMetadata | undefined;
  share?: ShareMetadata | undefined;
  senderName?: string | undefined;
  avatarUrl?: string | undefined;
}

export interface TextMessage extends BaseMessage {
  type: "text";
  text: string;
}

export interface PhotoMessageData extends BaseMessage {
  type: "photo";
  src: string;
  caption?: string | undefined;
}

export interface VoiceMessageData extends BaseMessage {
  type: "voice";
  duration: string;
  src?: string | undefined;
  caption?: string | undefined;
}

export interface VideoMessageData extends BaseMessage {
  type: "video";
  duration: string;
  poster: string;
  src?: string | undefined;
  caption?: string | undefined;
}

export interface GifMessageData extends BaseMessage {
  type: "gif";
  src: string;
  caption?: string | undefined;
}

export interface SharedMessageData extends BaseMessage {
  type: "share";
  shareType: "post" | "reel" | "profile" | "story_reply";
  title?: string | undefined;
  previewUrl?: string | undefined;
  authorName?: string | undefined;
  caption?: string | undefined;
}

export interface LinkMessageData extends BaseMessage {
  type: "link";
  url: string;
  title?: string | undefined;
  text?: string | undefined;
}

export interface StickerMessageData extends BaseMessage {
  type: "sticker";
  src?: string | undefined;
  stickerName?: string | undefined;
}

export interface CallMessageData extends BaseMessage {
  type: "call";
  callType: "missed_voice" | "missed_video" | "call_ended";
  duration?: string | undefined;
}

export interface AttachmentMessageData extends BaseMessage {
  type: "attachment";
  fileName?: string | undefined;
  fileSize?: string | undefined;
  fileUrl?: string | undefined;
}

export interface FallbackPlaceholderMessageData extends BaseMessage {
  type: "placeholder";
  placeholderText?: string | undefined;
  originalType?: string | undefined;
}

export type Message =
  | TextMessage
  | PhotoMessageData
  | VoiceMessageData
  | VideoMessageData
  | GifMessageData
  | SharedMessageData
  | LinkMessageData
  | StickerMessageData
  | CallMessageData
  | AttachmentMessageData
  | FallbackPlaceholderMessageData;

/** A conversation block represents a natural exchange between the two people. */
export interface ConversationBlock {
  id: string;
  messages: Message[];
  hasMedia: boolean;
  weight: number;
}

export interface BookLeaf {
  pageNumber: number;
  chapter: string;
  date: string;
  left: Message[];
  right: Message[];
  leftBlocks?: ConversationBlock[] | undefined;
  rightBlocks?: ConversationBlock[] | undefined;
}

export interface Chapter {
  title: string;
  subtitle: string;
  page: number;
}

export interface BookVolume {
  title: string;
  totalPages: number;
  chapters: Chapter[];
  leaves: BookLeaf[];
}

export interface SearchHit {
  leafIndex: number;
  page: number;
  chapter: string;
  author: MessageAuthor;
  excerpt: string;
}
