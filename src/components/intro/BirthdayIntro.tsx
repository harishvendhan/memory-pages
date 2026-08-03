import { useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/components/intro/useReducedMotion";
import { useIntroAudio } from "@/components/intro/useIntroAudio";
import { useIntroTimeline } from "@/hooks/useIntroTimeline";
import { SkipIntroButton } from "@/components/intro/SkipIntroButton";

// Scenes
import { Scene1Fade } from "@/components/intro/scenes/Scene1Fade";
import { Scene2Moonlight } from "@/components/intro/scenes/Scene2Moonlight";
import { Scene3Cupid } from "@/components/intro/scenes/Scene3Cupid";
import { Scene4BowDraw } from "@/components/intro/scenes/Scene4BowDraw";
import { Scene5ArrowFlight } from "@/components/intro/scenes/Scene5ArrowFlight";
import { Scene6CrystalHeart } from "@/components/intro/scenes/Scene6CrystalHeart";
import { Scene7Letter } from "@/components/intro/scenes/Scene7Letter";
import { Scene8Petals } from "@/components/intro/scenes/Scene8Petals";
import { Scene9GiftBox } from "@/components/intro/scenes/Scene9GiftBox";
import { Scene10BookReveal } from "@/components/intro/scenes/Scene10BookReveal";
import { Scene11Handoff } from "@/components/intro/scenes/Scene11Handoff";

export interface BirthdayIntroProps {
  onComplete: () => void;
}

export function BirthdayIntro({ onComplete }: BirthdayIntroProps) {
  const isReducedMotion = useReducedMotion();
  const audioController = useIntroAudio();

  const handleComplete = useCallback(() => {
    audioController.cleanup();
    onComplete();
  }, [audioController, onComplete]);

  const { currentScene, canSkip, skipIntro, goToScene } = useIntroTimeline({
    isReducedMotion,
    audioController,
    onComplete: handleComplete,
  });

  // Attempt audio unlock on initial click anywhere on screen
  useEffect(() => {
    const handleFirstClick = () => {
      audioController.unlockAudio();
      window.removeEventListener("pointerdown", handleFirstClick);
    };
    window.addEventListener("pointerdown", handleFirstClick);
    return () => window.removeEventListener("pointerdown", handleFirstClick);
  }, [audioController]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden select-none"
    >
      {/* Top Right Controls */}
      <SkipIntroButton
        canSkip={canSkip}
        onSkip={skipIntro}
        audioController={audioController}
      />

      {/* Dynamic Cinematic Scenes */}
      <AnimatePresence mode="wait">
        {currentScene === 1 && (
          <motion.div
            key="scene-1"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <Scene1Fade />
          </motion.div>
        )}

        {currentScene === 2 && (
          <motion.div
            key="scene-2"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <Scene2Moonlight />
          </motion.div>
        )}

        {currentScene === 3 && (
          <motion.div
            key="scene-3"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <Scene3Cupid />
          </motion.div>
        )}

        {currentScene === 4 && (
          <motion.div
            key="scene-4"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <Scene4BowDraw />
          </motion.div>
        )}

        {currentScene === 5 && (
          <motion.div
            key="scene-5"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0 }}
          >
            <Scene5ArrowFlight />
          </motion.div>
        )}

        {currentScene === 6 && (
          <motion.div
            key="scene-6"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <Scene6CrystalHeart />
          </motion.div>
        )}

        {currentScene === 7 && (
          <motion.div
            key="scene-7"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <Scene7Letter
              audioController={audioController}
              isReducedMotion={isReducedMotion}
              onProceedToBook={() => goToScene(10)}
            />
          </motion.div>
        )}

        {currentScene === 8 && (
          <motion.div
            key="scene-8"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <Scene8Petals />
          </motion.div>
        )}

        {currentScene === 9 && (
          <motion.div
            key="scene-9"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <Scene9GiftBox />
          </motion.div>
        )}

        {currentScene === 10 && (
          <motion.div
            key="scene-10"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <Scene10BookReveal />
          </motion.div>
        )}

        {currentScene === 11 && (
          <motion.div
            key="scene-11"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0 }}
          >
            <Scene11Handoff />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
