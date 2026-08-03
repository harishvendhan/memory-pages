/**
 * Layered Procedural Audio Engine for the Cinematic Birthday Intro
 * Uses Web Audio API for zero-latency, lightweight, self-contained sound synthesis.
 */

import { useRef, useState, useCallback, useEffect } from "react";

export interface IntroAudioController {
  isMuted: boolean;
  isUnlocked: boolean;
  toggleMute: () => void;
  unlockAudio: () => Promise<boolean>;
  setSceneAudio: (sceneNumber: number) => void;
  playTypewriterKey: () => void;
  playFeatherPen: () => void;
  playArrowWhoosh: () => void;
  playCrystalChime: () => void;
  playPaperRustle: () => void;
  playRibbonUntie: () => void;
  playLeatherCreak: () => void;
  playMagicalChime: () => void;
  cleanup: () => void;
}

export function useIntroAudio(): IntroAudioController {
  const [isMuted, setIsMuted] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);
  const ambienceGainRef = useRef<GainNode | null>(null);
  const sfxGainRef = useRef<GainNode | null>(null);

  const isPlayingRef = useRef<boolean>(false);
  const musicTimerRef = useRef<number | null>(null);
  const heartTimerRef = useRef<number | null>(null);
  const currentSceneRef = useRef<number>(1);

  // Initialize Web Audio Context
  const getOrCreateContext = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;

    if (!ctxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return null;

      const ctx = new AudioCtx();
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.85, ctx.currentTime);
      masterGain.connect(ctx.destination);

      const musicGain = ctx.createGain();
      musicGain.gain.setValueAtTime(0.65, ctx.currentTime);
      musicGain.connect(masterGain);

      const ambienceGain = ctx.createGain();
      ambienceGain.gain.setValueAtTime(0.4, ctx.currentTime);
      ambienceGain.connect(masterGain);

      const sfxGain = ctx.createGain();
      sfxGain.gain.setValueAtTime(0.55, ctx.currentTime);
      sfxGain.connect(masterGain);

      ctxRef.current = ctx;
      masterGainRef.current = masterGain;
      musicGainRef.current = musicGain;
      ambienceGainRef.current = ambienceGain;
      sfxGainRef.current = sfxGain;
    }

    return ctxRef.current;
  }, []);

  // Unlock AudioContext on user interaction
  const unlockAudio = useCallback(async (): Promise<boolean> => {
    const ctx = getOrCreateContext();
    if (!ctx) return false;

    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {
        return false;
      }
    }

    setIsUnlocked(ctx.state === "running");
    return ctx.state === "running";
  }, [getOrCreateContext]);

  // Toggle Mute
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      const ctx = ctxRef.current;
      const master = masterGainRef.current;
      if (ctx && master) {
        const now = ctx.currentTime;
        master.gain.cancelScheduledValues(now);
        master.gain.linearRampToValueAtTime(next ? 0 : 0.85, now + 0.15);
      }
      return next;
    });
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // Sound Synthesis Helpers
  // ─────────────────────────────────────────────────────────────────────────────

  /** Play a rich emotional piano note */
  const playPianoNote = useCallback(
    (freq: number, duration = 3.5, velocity = 0.5) => {
      const ctx = ctxRef.current;
      const dest = musicGainRef.current;
      if (!ctx || !dest || ctx.state !== "running") return;

      const now = ctx.currentTime;

      // Dual harmonic oscillators
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = "sine";
      osc2.type = "triangle";
      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq * 2.002, now); // subtle overtone

      const noteGain = ctx.createGain();
      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(velocity * 0.45, now + 0.03);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(400, now + duration * 0.7);

      osc1.connect(noteGain);
      osc2.connect(noteGain);
      noteGain.connect(filter);
      filter.connect(dest);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    },
    [],
  );

  /** Play a warm sustained string chord */
  const playStringPad = useCallback((freqs: number[], duration = 5.0) => {
    const ctx = ctxRef.current;
    const dest = musicGainRef.current;
    if (!ctx || !dest || ctx.state !== "running") return;

    const now = ctx.currentTime;
    freqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, now);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(600, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 1.2);
      gain.gain.linearRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      osc.start(now);
      osc.stop(now + duration);
    });
  }, []);

  /** Play a gentle heartbeat thump */
  const playHeartbeat = useCallback((intensity = 0.5) => {
    const ctx = ctxRef.current;
    const dest = ambienceGainRef.current;
    if (!ctx || !dest || ctx.state !== "running") return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(58, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.18);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(intensity * 0.45, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.3);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // Dynamic SFX Handlers
  // ─────────────────────────────────────────────────────────────────────────────

  /** Typewriter keystroke sound: subtle organic mechanical click */
  const playTypewriterKey = useCallback(() => {
    const ctx = ctxRef.current;
    const dest = sfxGainRef.current;
    if (!ctx || !dest || ctx.state !== "running") return;

    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.025; // 25ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(900 + Math.random() * 400, now);
    filter.Q.setValueAtTime(3.5, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18 + Math.random() * 0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    noise.start(now);
  }, []);

  /** Quiet feather pen writing scratch: delicate nib glide over parchment */
  const playFeatherPen = useCallback(() => {
    const ctx = ctxRef.current;
    const dest = sfxGainRef.current;
    if (!ctx || !dest || ctx.state !== "running") return;

    const now = ctx.currentTime;
    const bufferSize = Math.floor(ctx.sampleRate * 0.035);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(2200 + Math.random() * 600, now);
    filter.Q.setValueAtTime(4.0, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12 + Math.random() * 0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    noise.start(now);
  }, []);

  /** Arrow whoosh sound: quick resonant high-velocity sweep */
  const playArrowWhoosh = useCallback(() => {
    const ctx = ctxRef.current;
    const dest = sfxGainRef.current;
    if (!ctx || !dest || ctx.state !== "running") return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1600, now + 0.18);
    osc.frequency.exponentialRampToValueAtTime(250, now + 0.7);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2200, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.8);
  }, []);

  /** Crystal chime impact: sparkling faceted harmonic bell */
  const playCrystalChime = useCallback(() => {
    const ctx = ctxRef.current;
    const dest = sfxGainRef.current;
    if (!ctx || !dest || ctx.state !== "running") return;

    const now = ctx.currentTime;
    const freqs = [1046.5, 1318.5, 1567.98, 2093.0, 3135.96]; // C6, E6, G6, C7, G7

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now + idx * 0.04);
      gain.gain.linearRampToValueAtTime(0.22 / (idx + 1), now + idx * 0.04 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(now + idx * 0.04);
      osc.stop(now + 3.0);
    });
  }, []);

  /** Paper rustle sound */
  const playPaperRustle = useCallback(() => {
    const ctx = ctxRef.current;
    const dest = sfxGainRef.current;
    if (!ctx || !dest || ctx.state !== "running") return;

    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.35;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1800, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    noise.start(now);
  }, []);

  /** Ribbon untie chime */
  const playRibbonUntie = useCallback(() => {
    const ctx = ctxRef.current;
    const dest = sfxGainRef.current;
    if (!ctx || !dest || ctx.state !== "running") return;

    const now = ctx.currentTime;
    const notes = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(now + idx * 0.08);
      osc.stop(now + 2.2);
    });
  }, []);

  /** Leather creak sound for book opening */
  const playLeatherCreak = useCallback(() => {
    const ctx = ctxRef.current;
    const dest = sfxGainRef.current;
    if (!ctx || !dest || ctx.state !== "running") return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.linearRampToValueAtTime(85, now + 0.4);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(320, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.6);
  }, []);

  /** Magical celestial chime at the conclusion of the letter */
  const playMagicalChime = useCallback(() => {
    const ctx = ctxRef.current;
    const dest = sfxGainRef.current;
    if (!ctx || !dest || ctx.state !== "running") return;

    const now = ctx.currentTime;
    const notes = [659.25, 830.61, 987.77, 1318.51, 1661.22, 1975.53]; // E5, G#5, B5, E6, G#6, B6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(now + idx * 0.1);
      osc.stop(now + 3.5);
    });
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // Background Music Bed Loop (Continuous Emotional Progression)
  // ─────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isUnlocked || isPlayingRef.current) return;
    isPlayingRef.current = true;

    // Emotional Chord Progressions in D Major / B Minor
    // I - V - vi - IV -> D - A - Bm - G
    const chords = [
      { root: 293.66, notes: [293.66, 369.99, 440.0, 587.33] }, // D Maj
      { root: 220.0, notes: [220.0, 277.18, 329.63, 440.0] }, // A Maj
      { root: 246.94, notes: [246.94, 293.66, 369.99, 493.88] }, // B min
      { root: 196.0, notes: [196.0, 246.94, 293.66, 392.0] }, // G Maj
    ];

    let chordIndex = 0;

    const playNextBar = () => {
      const chord = chords[chordIndex % chords.length]!;
      chordIndex++;

      // Arpeggiate piano notes
      chord.notes.forEach((note, idx) => {
        setTimeout(() => {
          playPianoNote(note, 3.8, 0.45 + idx * 0.05);
        }, idx * 650);
      });

      // Pad layers for scenes > 3
      if (currentSceneRef.current >= 3) {
        playStringPad([chord.notes[0]!, chord.notes[2]!], 3.8);
      }

      // Violin harmonics for scene 8 peak
      if (currentSceneRef.current === 8) {
        setTimeout(() => {
          playPianoNote(chord.notes[3]! * 1.5, 4.0, 0.6);
        }, 1200);
      }

      musicTimerRef.current = window.setTimeout(playNextBar, 2800);
    };

    playNextBar();

    // Heartbeat loop (Scene 1 and Scene 4)
    const heartLoop = () => {
      const scene = currentSceneRef.current;
      if (scene === 1) {
        playHeartbeat(0.3);
      } else if (scene === 4) {
        playHeartbeat(0.7);
      }
      heartTimerRef.current = window.setTimeout(heartLoop, 1200);
    };
    heartLoop();

    return () => {
      if (musicTimerRef.current !== null) clearTimeout(musicTimerRef.current);
      if (heartTimerRef.current !== null) clearTimeout(heartTimerRef.current);
      isPlayingRef.current = false;
    };
  }, [isUnlocked, playPianoNote, playStringPad, playHeartbeat]);

  const setSceneAudio = useCallback((sceneNumber: number) => {
    currentSceneRef.current = sceneNumber;
  }, []);

  const cleanup = useCallback(() => {
    if (musicTimerRef.current !== null) clearTimeout(musicTimerRef.current);
    if (heartTimerRef.current !== null) clearTimeout(heartTimerRef.current);
    isPlayingRef.current = false;

    if (ctxRef.current && ctxRef.current.state !== "closed") {
      try {
        ctxRef.current.close();
      } catch {
        // Safe ignore
      }
      ctxRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return {
    isMuted,
    isUnlocked,
    toggleMute,
    unlockAudio,
    setSceneAudio,
    playTypewriterKey,
    playFeatherPen,
    playArrowWhoosh,
    playCrystalChime,
    playPaperRustle,
    playRibbonUntie,
    playLeatherCreak,
    playMagicalChime,
    cleanup,
  };
}
