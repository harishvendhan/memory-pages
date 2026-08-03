import { motion } from "framer-motion";
import { Volume2, VolumeX, FastForward } from "lucide-react";
import type { IntroAudioController } from "@/components/intro/useIntroAudio";

interface SkipIntroButtonProps {
  canSkip: boolean;
  onSkip: () => void;
  audioController: IntroAudioController;
}

export function SkipIntroButton({
  canSkip,
  onSkip,
  audioController,
}: SkipIntroButtonProps) {
  const { isMuted, toggleMute, isUnlocked, unlockAudio } = audioController;

  const handleAudioClick = () => {
    if (!isUnlocked) {
      unlockAudio();
    } else {
      toggleMute();
    }
  };

  return (
    <div className="fixed top-5 right-5 z-50 flex items-center gap-3 select-none">
      {/* Audio Mute / Unmute Button */}
      <motion.button
        type="button"
        onClick={handleAudioClick}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        aria-label={
          !isUnlocked
            ? "Unmute Audio"
            : isMuted
              ? "Unmute Audio"
              : "Mute Audio"
        }
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#d4af37]/60 bg-[#16120c]/80 text-[#f5ebd7] text-xs font-display tracking-widest uppercase shadow-[0_4px_14px_rgba(0,0,0,0.6)] backdrop-blur-sm transition-all hover:bg-[#2a2217] hover:border-[#ffd700] hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
      >
        {!isUnlocked || isMuted ? (
          <>
            <VolumeX className="size-3.5 text-amber-300" />
            <span>Unmute</span>
          </>
        ) : (
          <>
            <Volume2 className="size-3.5 text-amber-300" />
            <span>Sound</span>
          </>
        )}
      </motion.button>

      {/* Skip Intro Button (Visible after 5s) */}
      {canSkip && (
        <motion.button
          type="button"
          onClick={onSkip}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Skip Intro and Open Memory Book"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#d4af37]/70 bg-gradient-to-r from-[#241a10]/90 to-[#382a1a]/90 text-[#fcedc7] text-xs font-display font-medium tracking-widest uppercase shadow-[0_4px_16px_rgba(212,175,55,0.3)] backdrop-blur-sm transition-all hover:border-[#ffd700] hover:bg-[#4a3722] hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#ffd700]"
        >
          <span>Skip</span>
          <FastForward className="size-3 text-amber-300" />
        </motion.button>
      )}
    </div>
  );
}
