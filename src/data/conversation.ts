import memory1 from "@/assets/memory-1.jpg";
import memory2 from "@/assets/memory-2.jpg";

export type MessageAuthor = "me" | "them";

export type Message =
  | { id: string; author: MessageAuthor; type: "text"; time: string; text: string }
  | {
      id: string;
      author: MessageAuthor;
      type: "photo";
      time: string;
      src: string;
      caption?: string;
    }
  | {
      id: string;
      author: MessageAuthor;
      type: "voice";
      time: string;
      duration: string;
      caption?: string;
    }
  | {
      id: string;
      author: MessageAuthor;
      type: "video";
      time: string;
      duration: string;
      poster: string;
      caption?: string;
    };

export interface BookLeaf {
  /** Number of the left page; the right page is this + 1. */
  pageNumber: number;
  chapter: string;
  date: string;
  left: Message[];
  right: Message[];
}

export interface Chapter {
  title: string;
  subtitle: string;
  page: number;
}

/** Total pages the finished book will hold (placeholder for backend data). */
export const TOTAL_PAGES = 300;

export const chapters: Chapter[] = [
  { title: "The First Word", subtitle: "How it all began", page: 12 },
  { title: "Golden Hours", subtitle: "Coffee, rain and long calls", page: 14 },
  { title: "The Sea Letter", subtitle: "An evening we kept", page: 16 },
  { title: "Things Left Unsaid", subtitle: "Voices in the dark", page: 18 },
];

export const leaves: BookLeaf[] = [
  {
    pageNumber: 12,
    chapter: "The First Word",
    date: "14 February 2021",
    left: [
      {
        id: "m1",
        author: "me",
        type: "text",
        time: "21:04",
        text: "I have started this message eleven times tonight. This is the twelfth, and I am sending it before I lose my courage.",
      },
      {
        id: "m2",
        author: "me",
        type: "text",
        time: "21:06",
        text: "You looked like someone I already knew.",
      },
      {
        id: "m3",
        author: "me",
        type: "voice",
        time: "21:19",
        duration: "0:34",
        caption: "Read out loud, badly",
      },
    ],
    right: [
      {
        id: "t1",
        author: "them",
        type: "text",
        time: "21:22",
        text: "Twelve attempts. I am keeping that number forever.",
      },
      {
        id: "t2",
        author: "them",
        type: "text",
        time: "21:23",
        text: "I read it three times before answering. Then once more, slowly.",
      },
      {
        id: "t3",
        author: "them",
        type: "text",
        time: "21:41",
        text: "Tell me something true about your day. The small kind of true.",
      },
    ],
  },
  {
    pageNumber: 14,
    chapter: "Golden Hours",
    date: "3 April 2021",
    left: [
      {
        id: "m4",
        author: "me",
        type: "photo",
        time: "07:52",
        src: memory1,
        caption: "Two cups. One of them is always yours.",
      },
      {
        id: "m5",
        author: "me",
        type: "text",
        time: "07:55",
        text: "The sun arrived before you did. I made yours anyway.",
      },
    ],
    right: [
      {
        id: "t4",
        author: "them",
        type: "text",
        time: "08:10",
        text: "You made mine anyway. That sentence is going in the book.",
      },
      {
        id: "t5",
        author: "them",
        type: "voice",
        time: "08:14",
        duration: "1:12",
        caption: "Half asleep, entirely happy",
      },
      {
        id: "t6",
        author: "them",
        type: "text",
        time: "08:31",
        text: "Keep the window seat. I am on my way.",
      },
    ],
  },
  {
    pageNumber: 16,
    chapter: "The Sea Letter",
    date: "29 August 2022",
    left: [
      {
        id: "m6",
        author: "me",
        type: "text",
        time: "19:40",
        text: "We walked until the tide caught up with us and neither of us said the word 'home'. We did not need to.",
      },
      {
        id: "m7",
        author: "me",
        type: "video",
        time: "19:47",
        duration: "0:48",
        poster: memory2,
        caption: "The last of the light",
      },
    ],
    right: [
      {
        id: "t7",
        author: "them",
        type: "photo",
        time: "19:52",
        src: memory2,
        caption: "Our shadows, longer than us",
      },
      {
        id: "t8",
        author: "them",
        type: "text",
        time: "20:15",
        text: "If someone ever asks me what happiness looked like, I will describe this exact hour.",
      },
    ],
  },
  {
    pageNumber: 18,
    chapter: "Things Left Unsaid",
    date: "11 January 2024",
    left: [
      {
        id: "m8",
        author: "me",
        type: "text",
        time: "23:58",
        text: "Some pages of this book are quiet. I love those too.",
      },
      {
        id: "m9",
        author: "me",
        type: "voice",
        time: "00:02",
        duration: "2:05",
        caption: "Whispered, so the house would not hear",
      },
    ],
    right: [
      {
        id: "t9",
        author: "them",
        type: "text",
        time: "00:09",
        text: "Play it again for me tomorrow, when I am awake enough to cry properly.",
      },
      {
        id: "t10",
        author: "them",
        type: "text",
        time: "00:11",
        text: "Goodnight, my favourite chapter.",
      },
    ],
  },
];