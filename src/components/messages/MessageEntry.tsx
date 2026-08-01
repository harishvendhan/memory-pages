import { motion } from "framer-motion";
import type { Message } from "@/data/conversation";
import { PaperCard } from "./PaperCard";
import { PhotoMessage } from "./PhotoMessage";
import { VoiceMessage } from "./VoiceMessage";
import { VideoMessage } from "./VideoMessage";

interface MessageEntryProps {
  message: Message;
  index: number;
  highlight?: string;
}

function Highlighted({ text, term }: { text: string; term?: string }) {
  if (!term) return <>{text}</>;
  const parts = text.split(new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === term.toLowerCase() ? (
          <mark key={i} className="rounded bg-gold/40 px-0.5 text-ink">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

/** Renders any message type onto the page with a soft, staggered reveal. */
export function MessageEntry({ message, index, highlight }: MessageEntryProps) {
  const tilt = (index % 2 === 0 ? 1 : -1) * (0.6 + (index % 3) * 0.4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.08 * index, ease: [0.22, 1, 0.36, 1] }}
      className="gpu"
    >
      {message.type === "text" && (
        <PaperCard time={message.time} author={message.author}>
          <p className="font-display text-[1.08rem] leading-relaxed sm:text-[1.18rem]">
            <Highlighted text={message.text} term={highlight} />
          </p>
        </PaperCard>
      )}

      {message.type === "photo" && (
        <div className={message.author === "me" ? "mr-auto max-w-[86%]" : "ml-auto max-w-[86%]"}>
          <PhotoMessage src={message.src} caption={message.caption} tilt={tilt} />
        </div>
      )}

      {message.type === "voice" && (
        <PaperCard time={message.time} author={message.author} className="w-full max-w-[92%]">
          <VoiceMessage duration={message.duration} caption={message.caption} />
        </PaperCard>
      )}

      {message.type === "video" && (
        <div className={message.author === "me" ? "mr-auto max-w-[86%]" : "ml-auto max-w-[86%]"}>
          <VideoMessage
            poster={message.poster}
            duration={message.duration}
            caption={message.caption}
          />
        </div>
      )}
    </motion.div>
  );
}