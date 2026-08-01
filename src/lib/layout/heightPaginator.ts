import type { Message, BookLeaf } from "@/types/conversation";

/** Height Measurement Cache keyed by `${message.id}:${containerWidth}:${fontScale}` */
class HeightMeasurementCache {
  private cache = new Map<string, number>();

  getKey(messageId: string, containerWidth: number, fontScale: number = 1.0): string {
    return `${messageId}:${Math.round(containerWidth)}:${fontScale}`;
  }

  get(key: string): number | undefined {
    return this.cache.get(key);
  }

  set(key: string, height: number): void {
    this.cache.set(key, height);
  }

  invalidate(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }
}

export const heightCache = new HeightMeasurementCache();

/** Pre-resolves media dimensions (photos/videos) to prevent late-loading page overflow. */
export async function preloadMediaDimensions(messages: Message[]): Promise<Map<string, { width: number; height: number }>> {
  const dimensions = new Map<string, { width: number; height: number }>();
  const mediaPromises: Array<Promise<void>> = [];

  for (const msg of messages) {
    if (msg.type === "photo" && msg.src) {
      const p = new Promise<void>((resolve) => {
        const img = new Image();
        img.src = msg.src;
        if (img.complete && img.naturalWidth) {
          dimensions.set(msg.id, { width: img.naturalWidth, height: img.naturalHeight });
          resolve();
        } else {
          img.onload = () => {
            dimensions.set(msg.id, { width: img.naturalWidth || 1024, height: img.naturalHeight || 768 });
            resolve();
          };
          img.onerror = () => {
            dimensions.set(msg.id, { width: 1024, height: 768 });
            resolve();
          };
        }
      });
      mediaPromises.push(p);
    }
  }

  await Promise.all(mediaPromises);
  return dimensions;
}

/** Calculates rendered pixel height of a printed conversation entry. */
export function getOrCalculateMessageHeight(
  message: Message,
  containerWidth: number = 380,
  fontScale: number = 1.0,
  mediaDimensions?: Map<string, { width: number; height: number }>,
): number {
  const cacheKey = heightCache.getKey(message.id, containerWidth, fontScale);
  const cachedHeight = heightCache.get(cacheKey);

  if (cachedHeight !== undefined) {
    return cachedHeight;
  }

  const SENDER_NAME_HEIGHT = 20;
  const TIMESTAMP_HEIGHT = 14;
  const AVATAR_MIN_HEIGHT = 52;
  let calculatedHeight = 52;

  if (message.type === "photo") {
    const dim = mediaDimensions?.get(message.id);
    let photoHeight = 160;
    if (dim && dim.width > 0) {
      const aspectRatio = dim.height / dim.width;
      const targetWidth = Math.min(containerWidth * 0.7, 240);
      photoHeight = Math.min(180, Math.max(100, targetWidth * aspectRatio));
    }
    const captionHeight = message.caption ? 20 : 0;
    calculatedHeight = SENDER_NAME_HEIGHT + photoHeight + captionHeight + TIMESTAMP_HEIGHT + 8;
  } else if (message.type === "video") {
    const captionHeight = message.caption ? 20 : 0;
    calculatedHeight = SENDER_NAME_HEIGHT + 160 + captionHeight + TIMESTAMP_HEIGHT + 8;
  } else if (message.type === "voice") {
    const captionHeight = message.caption ? 16 : 0;
    calculatedHeight = SENDER_NAME_HEIGHT + 44 + captionHeight + TIMESTAMP_HEIGHT + 6;
  } else if (message.type === "gif") {
    calculatedHeight = SENDER_NAME_HEIGHT + 140 + TIMESTAMP_HEIGHT + 8;
  } else if (message.type === "share") {
    const hasPreview = message.previewUrl ? 90 : 0;
    calculatedHeight = SENDER_NAME_HEIGHT + 36 + hasPreview + TIMESTAMP_HEIGHT + 8;
  } else if (message.type === "link") {
    calculatedHeight = SENDER_NAME_HEIGHT + 24 + TIMESTAMP_HEIGHT + 6;
  } else if (message.type === "sticker") {
    calculatedHeight = SENDER_NAME_HEIGHT + 70 + TIMESTAMP_HEIGHT + 6;
  } else if (message.type === "call") {
    calculatedHeight = SENDER_NAME_HEIGHT + 20 + TIMESTAMP_HEIGHT + 4;
  } else if (message.type === "attachment") {
    calculatedHeight = SENDER_NAME_HEIGHT + 26 + TIMESTAMP_HEIGHT + 6;
  } else if (message.type === "placeholder") {
    calculatedHeight = SENDER_NAME_HEIGHT + 28 + TIMESTAMP_HEIGHT + 6;
  } else {
    // Text message line calculation for printed text
    const textStr = "text" in message && message.text ? message.text : "Content";
    const printableCharsPerLine = Math.max(14, Math.floor((containerWidth * 0.7) / 9.5));
    const estimatedLines = Math.max(1, Math.ceil(textStr.length / printableCharsPerLine));
    const lineHeight = 22 * fontScale;
    const textHeight = estimatedLines * lineHeight;
    const reactionHeight = message.reactions && message.reactions.length > 0 ? 18 : 0;

    calculatedHeight = Math.max(
      AVATAR_MIN_HEIGHT,
      SENDER_NAME_HEIGHT + textHeight + TIMESTAMP_HEIGHT + reactionHeight + 12
    );
  }

  heightCache.set(cacheKey, calculatedHeight);
  return calculatedHeight;
}

/** Dynamic async height-based paginator */
export function paginateMessagesWithCache(
  messages: Message[],
  containerWidth: number = 360,
  fontScale: number = 1.0,
  printableHeight: number = 460,
  gapHeight: number = 12,
  initialPageNumber: number = 1,
  mediaDimensions?: Map<string, { width: number; height: number }>,
): BookLeaf[] {
  const leaves: BookLeaf[] = [];
  if (messages.length === 0) return leaves;

  const pagesOfMessages: Message[][] = [];
  let currentPage: Message[] = [];
  let currentHeight = 0;

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i]!;
    const prevMsg = i > 0 ? messages[i - 1] : undefined;
    const isDifferentSpeaker = prevMsg && prevMsg.author !== message.author;
    const effectiveGap = isDifferentSpeaker ? 32 : gapHeight;

    const cardHeight = getOrCalculateMessageHeight(message, containerWidth, fontScale, mediaDimensions);
    const addedHeight = currentPage.length > 0 ? cardHeight + effectiveGap : cardHeight;

    if (currentPage.length > 0 && currentHeight + addedHeight > printableHeight) {
      pagesOfMessages.push(currentPage);
      currentPage = [message];
      currentHeight = cardHeight;
    } else {
      currentPage.push(message);
      currentHeight += addedHeight;
    }
  }

  if (currentPage.length > 0) {
    pagesOfMessages.push(currentPage);
  }

  let leafNum = initialPageNumber;
  for (let i = 0; i < pagesOfMessages.length; i += 2) {
    const leftMsgs = pagesOfMessages[i] ?? [];
    const rightMsgs = pagesOfMessages[i + 1] ?? [];

    const firstMsg = leftMsgs[0] ?? rightMsgs[0];
    const dateStr = firstMsg
      ? new Date(firstMsg.timestampMs).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "Memories";

    leaves.push({
      pageNumber: leafNum,
      chapter: "Our Story",
      date: dateStr,
      left: leftMsgs,
      right: rightMsgs,
    });

    leafNum += 2;
  }

  return leaves;
}
