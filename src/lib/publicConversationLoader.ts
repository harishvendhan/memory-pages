import { parseInstagramConversation } from "./parsers/InstagramConversationParser";
import type { BookConversation } from "@/types/importProvider";
import type { InstagramInboxExport } from "@/types/instagram";

const FOLDER_NAME = "ailurophile_17857455693623243";
const BASE_PATH = `/${FOLDER_NAME}`;

export async function loadPublicConversation(): Promise<BookConversation | null> {
  const exports: InstagramInboxExport[] = [];
  let index = 1;

  while (true) {
    try {
      const res = await fetch(`${BASE_PATH}/message_${index}.json`);
      if (!res.ok) {
        break; // Stop at first 404 or error
      }
      const data = await res.json() as InstagramInboxExport;
      exports.push(data);
      index++;
    } catch (e) {
      break; // Network error or parsing error
    }
  }

  if (exports.length === 0) {
    return null; // Conversation not found
  }

  // Determine self name: find Harish_vendhan / "Me"
  const selfParticipant = exports[0]?.participants?.find((p) => {
    const n = p.name.toLowerCase();
    return n.includes("harish") || n.includes("vendhan");
  });
  const selfName = selfParticipant?.name ?? "Harish_vendhan";

  const resolveMediaUrl = (rawUri: string) => {
    // rawUri from Instagram JSON might look like: "your_instagram_activity/messages/inbox/ailurophile_17857455693623243/photos/img.jpg"
    // We want it to be: "/ailurophile_17857455693623243/photos/img.jpg"
    const match = rawUri.match(/(photos|audio|videos|gifs|files)\/.*$/);
    const relativePath = match ? match[0] : rawUri;
    return `${BASE_PATH}/${relativePath}`;
  };

  // We are skipping audioDurationMap to lazily load and not block the UI.
  return parseInstagramConversation(exports, selfName, resolveMediaUrl);
}
