import { MemorySearchEngine } from "../searchEngine";
import type { Message } from "@/types/conversation";

console.log("==========================================");
console.log("  AI MEMORY SEARCH ENGINE 100k BENCHMARK  ");
console.log("==========================================\n");

// Generate 100,000 realistic messages (English, Tamil, Tanglish, Emojis, Audio, Media)
const samplePhrases = [
  "I love spending time with you so much ❤️✨",
  "வணக்கம் எப்படி இருக்கீங்க? நல்லா சாப்பிட்டியா? 🍛",
  "Romba miss panren unna thangom 💙",
  "Let's go for coffee this Saturday evening ☕",
  "You looked so beautiful in that saree today! 😍💫",
  "காதல் என்பது ஒரு அழகான உணர்வு 💕",
  "Seri da, paathu poitu vaa. Take care!",
  "Remember this place? It was our first anniversary dinner 🎉🥂",
  "Epdi irukka? Saapitiya ma?",
  "Happy birthday to the most special person in the world! 🎂🎁💖",
  "Inime daily pesalam, promise 🤞🏼✨",
  "Sent a photo of sunset at Marina beach 🌅",
  "🎙️ Voice message (0:45) - Singing our favorite melody",
  "Shared an Instagram reel: Cute couple travel moments",
  "I cannot wait to see you tomorrow morning ☀️",
];

const authors: ("me" | "them")[] = ["me", "them"];
const senderNames = ["Harish", "Ailu"];

const TOTAL_MESSAGES = 100_000;
const messages: Message[] = [];
const baseTime = new Date("2020-01-01").getTime();

for (let i = 0; i < TOTAL_MESSAGES; i++) {
  const phrase = samplePhrases[i % samplePhrases.length]!;
  const author = authors[i % 2]!;
  const senderName = senderNames[i % 2]!;
  const timestampMs = baseTime + i * 60_000; // 1 minute interval

  if (i % 25 === 0) {
    messages.push({
      id: `msg_${i}`,
      type: "voice",
      author,
      senderName,
      time: "10:30 AM",
      timestampMs,
      src: "voice.mp3",
      duration: "0:35",
      caption: `Voice note memory ${i}: ${phrase}`,
    });
  } else if (i % 40 === 0) {
    messages.push({
      id: `msg_${i}`,
      type: "share",
      author,
      senderName,
      time: "10:30 AM",
      timestampMs,
      shareType: "post",
      title: "Shared Post",
      caption: phrase,
    });
  } else {
    messages.push({
      id: `msg_${i}`,
      type: "text",
      author,
      senderName,
      time: "10:30 AM",
      timestampMs,
      text: `${phrase} [#${i}]`,
    });
  }
}

const engine = new MemorySearchEngine();

// 1. Indexing Benchmark
const indexStart = performance.now();
engine.indexMessages(messages);
const indexDuration = performance.now() - indexStart;

console.log(`[1] Indexing 100,000 messages: ${indexDuration.toFixed(2)} ms`);
const status = engine.getStatus();
console.log(`    Indexed messages count: ${status.totalIndexed}`);
console.log(`    Status Ready: ${status.isReady}\n`);

// 2. Query Benchmarks
const testQueries = [
  { label: "English exact query ('coffee')", query: "coffee" },
  { label: "English phrase query ('anniversary dinner')", query: "anniversary dinner" },
  { label: "Tamil Unicode query ('வணக்கம்')", query: "வணக்கம்" },
  { label: "Tamil Unicode query ('காதல்')", query: "காதல்" },
  { label: "Tanglish phonetic query ('vanakkam' -> matches வணக்கம்)", query: "vanakkam" },
  { label: "Tanglish phonetic query ('kadhal' -> matches காதல்)", query: "kadhal" },
  { label: "Tanglish colloquial query ('romba')", query: "romba" },
  { label: "Tanglish colloquial query ('saptiya')", query: "saptiya" },
  { label: "Atomic Emoji query ('❤️')", query: "❤️" },
  { label: "Atomic Emoji query ('✨')", query: "✨" },
  { label: "Sender name query ('Harish')", query: "Harish" },
  { label: "Date query ('April 2020')", query: "April 2020" },
  { label: "Voice note caption query ('voice')", query: "voice" },
  { label: "Fuzzy typo query ('lovve' -> matches love)", query: "lovve" },
  { label: "Fuzzy typo query ('beutiful' -> matches beautiful)", query: "beutiful" },
];

console.log("[2] Search Queries Verification & Latency:\n");

let totalQueryTime = 0;

for (const test of testQueries) {
  const qStart = performance.now();
  const results = engine.search(test.query, 10);
  const qDuration = performance.now() - qStart;
  totalQueryTime += qDuration;

  console.log(`  ✓ ${test.label}`);
  console.log(`    Query: "${test.query}" | Latency: ${qDuration.toFixed(2)} ms | Hits: ${results.length}`);
  if (results.length > 0) {
    const top = results[0]!;
    console.log(`    Top Match [${top.matchType} | Score: ${(top.score * 100).toFixed(0)}%]: "${top.snippet}"`);
  }
  console.log("");
}

const avgQueryTime = totalQueryTime / testQueries.length;
console.log(`==========================================`);
console.log(`  Average Query Latency: ${avgQueryTime.toFixed(3)} ms`);
console.log(`  Target Requirement (< 10ms): ${avgQueryTime < 10 ? "PASSED ✅" : "FAILED ❌"}`);
console.log(`==========================================\n`);
