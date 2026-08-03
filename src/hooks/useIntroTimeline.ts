/**
 * GSAP Master Timeline Hook for the 11-Scene Cinematic Birthday Intro
 */

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import type { IntroAudioController } from "@/components/intro/useIntroAudio";

export interface UseIntroTimelineOptions {
  isReducedMotion?: boolean;
  audioController?: IntroAudioController;
  onComplete?: () => void;
}

export interface UseIntroTimelineResult {
  currentScene: number;
  progress: number;
  isPaused: boolean;
  canSkip: boolean;
  skipIntro: () => void;
  goToScene: (sceneNum: number) => void;
  togglePause: () => void;
}

export function useIntroTimeline({
  isReducedMotion = false,
  audioController,
  onComplete,
}: UseIntroTimelineOptions): UseIntroTimelineResult {
  const [currentScene, setCurrentScene] = useState<number>(isReducedMotion ? 7 : 1);
  const [progress, setProgress] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [canSkip, setCanSkip] = useState<boolean>(false);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const hasCompletedRef = useRef<boolean>(false);

  // Set scene state and notify audio engine
  const transitionToScene = useCallback(
    (sceneNum: number) => {
      setCurrentScene(sceneNum);
      audioController?.setSceneAudio(sceneNum);
    },
    [audioController],
  );

  // Skip Intro immediately
  const skipIntro = useCallback(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;

    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    audioController?.cleanup();
    onComplete?.();
  }, [audioController, onComplete]);

  // Toggle Pause/Resume
  const togglePause = useCallback(() => {
    const tl = timelineRef.current;
    if (!tl) return;

    if (tl.isActive()) {
      tl.pause();
      setIsPaused(true);
    } else {
      tl.resume();
      setIsPaused(false);
    }
  }, []);

  // Show Skip button after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setCanSkip(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Build and run the master GSAP timeline
  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onUpdate: () => {
        if (tl) {
          setProgress(tl.progress());
        }
      },
      onComplete: () => {
        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true;
          onComplete?.();
        }
      },
    });

    timelineRef.current = tl;

    if (isReducedMotion) {
      // Reduced motion shortcut: Scene 7 Letter -> Scene 10 Book -> Scene 11 Handoff
      tl.call(() => transitionToScene(7))
        .to({}, { duration: 25.0 }) // allow reading the letter with reduced motion pauses
        .call(() => transitionToScene(10))
        .to({}, { duration: 4.0 })
        .call(() => transitionToScene(11))
        .to({}, { duration: 2.0 });
    } else {
      // Direct Cinematic Birthday Sequence: Starry Atmosphere -> Personalized Love Letter & Birthday Wishes -> Book Reveal -> Handoff
      tl.call(() => transitionToScene(1))
        .to({}, { duration: 1.5 }) // Scene 1: Candlelit Night & Stars (1.5s)

        .call(() => {
          transitionToScene(7);
          audioController?.playPaperRustle();
        })
        .to({}, { duration: 48.0 }) // Scene 7: Personalized Love Letter & Birthday Wishes for Jasmeena Farveen & Unavan

        .call(() => transitionToScene(10))
        .to({}, { duration: 4.5 }) // Scene 10: Leather Memory Book Reveal ("Our Story - For Jasmeena Farveen ❤️")

        .call(() => {
          transitionToScene(11);
          audioController?.playLeatherCreak();
        })
        .to({}, { duration: 3.0 }); // Scene 11: Seamless Book Landing & Cover Open Handoff (3s)
    }

    // Auto pause on background tab change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        tl.pause();
        setIsPaused(true);
      } else {
        tl.resume();
        setIsPaused(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      tl.kill();
      timelineRef.current = null;
    };
  }, [isReducedMotion, transitionToScene, audioController, onComplete]);

  const goToScene = useCallback((sceneNum: number) => {
    transitionToScene(sceneNum);
  }, [transitionToScene]);

  return {
    currentScene,
    progress,
    isPaused,
    canSkip,
    skipIntro,
    goToScene,
    togglePause,
  };
}
