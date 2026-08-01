import { memo } from "react";
import { HiOutlinePhoneXMark, HiOutlineVideoCamera } from "react-icons/hi2";

interface CallMessageProps {
  callType: "missed_voice" | "missed_video" | "call_ended";
  duration?: string | undefined;
}

export const CallMessage = memo(function CallMessage({
  callType,
  duration,
}: CallMessageProps) {
  const isVideo = callType === "missed_video";
  return (
    <div className="inline-flex items-center gap-2 py-0.5 font-display text-[0.88rem] italic text-[#7d7365] select-none">
      {isVideo ? (
        <HiOutlineVideoCamera className="size-4 text-[#801b1b]" />
      ) : (
        <HiOutlinePhoneXMark className="size-4 text-[#801b1b]" />
      )}
      <span>
        {callType === "missed_video"
          ? "Missed video call"
          : callType === "missed_voice"
          ? "Missed audio call"
          : `Call ended ${duration ? `• ${duration}` : ""}`}
      </span>
    </div>
  );
});
