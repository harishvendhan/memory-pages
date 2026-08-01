import { memo } from "react";

interface FallbackPlaceholderProps {
  placeholderText?: string | undefined;
  originalType?: string | undefined;
}

export const FallbackPlaceholder = memo(function FallbackPlaceholder({
  placeholderText = "Attachment or media unavailable",
  originalType,
}: FallbackPlaceholderProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-sm border border-[#d6c5ad]/50 bg-[#ebdcb9]/20 px-3 py-1.5 font-display text-[0.82rem] italic text-[#7d7365] select-none">
      <span className="text-[#9c814b]">❖</span>
      <span>{placeholderText}</span>
      {originalType ? <span className="opacity-60 font-body text-[0.65rem]">({originalType})</span> : null}
    </div>
  );
});
