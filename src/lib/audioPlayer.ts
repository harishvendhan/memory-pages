// Unified Global Audio Player Engine
// Supports HTML5 Audio with automatic Web Audio API ArrayBuffer decoding fallback

type AudioListener = () => void;

interface AudioState {
  playingId: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  src: string | null;
}

class GlobalAudioEngine {
  private state: AudioState = {
    playingId: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    isLoading: false,
    src: null,
  };

  private listeners: Set<AudioListener> = new Set();
  private htmlAudio: HTMLAudioElement | null = null;
  
  // Web Audio Fallback state
  private audioCtx: AudioContext | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private webAudioStartTime: number = 0;
  private webAudioStartOffset: number = 0;
  private rafId: number | null = null;
  private isWebAudioMode: boolean = false;

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error("Audio listener error:", err);
      }
    });
  }

  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): AudioState {
    return this.state;
  }

  private stopCurrent() {
    // Stop HTML5 Audio
    if (this.htmlAudio) {
      this.htmlAudio.pause();
      this.htmlAudio.removeAttribute("src");
      this.htmlAudio.load();
      this.htmlAudio = null;
    }

    // Stop Web Audio
    if (this.sourceNode) {
      try {
        this.sourceNode.stop();
        this.sourceNode.disconnect();
      } catch {
        // ignore already stopped error
      }
      this.sourceNode = null;
    }

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    this.isWebAudioMode = false;
  }

  public async toggle(id: string, src: string, fallbackDuration: number = 0) {
    if (this.state.playingId === id && this.state.isPlaying) {
      this.pause();
    } else {
      await this.play(id, src, fallbackDuration);
    }
  }

  public async play(id: string, src: string, fallbackDuration: number = 0) {
    if (!src) return;

    // If already playing this exact ID and paused, resume
    if (this.state.playingId === id && !this.state.isPlaying && (this.htmlAudio || this.audioBuffer)) {
      if (this.isWebAudioMode) {
        this.resumeWebAudio();
      } else if (this.htmlAudio) {
        try {
          await this.htmlAudio.play();
          this.state.isPlaying = true;
          this.notify();
          return;
        } catch (err) {
          console.warn("HTML5 audio resume failed, restarting via fallback:", err);
        }
      }
    }

    // Stop whatever was playing before
    this.stopCurrent();

    this.state = {
      playingId: id,
      isPlaying: false,
      currentTime: 0,
      duration: fallbackDuration,
      isLoading: true,
      src,
    };
    this.notify();

    // Primary path: Try HTML5 Audio
    try {
      await this.playViaHTML5(id, src);
    } catch (htmlErr) {
      console.warn("HTML5 audio playback failed, switching to Web Audio API fallback:", htmlErr);
      // Fallback path: Web Audio API ArrayBuffer decoding
      await this.playViaWebAudio(id, src);
    }
  }

  private playViaHTML5(id: string, src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.preload = "auto";
      audio.crossOrigin = "anonymous";
      this.htmlAudio = audio;

      let hasResolved = false;

      const cleanup = () => {
        audio.removeEventListener("canplay", onCanPlay);
        audio.removeEventListener("error", onError);
      };

      const onCanPlay = () => {
        cleanup();
        if (!hasResolved) {
          hasResolved = true;
          audio.play().then(() => {
            this.state.isLoading = false;
            this.state.isPlaying = true;
            if (isFinite(audio.duration) && audio.duration > 0) {
              this.state.duration = audio.duration;
            }
            this.notify();
            resolve();
          }).catch(reject);
        }
      };

      const onError = (e: Event) => {
        cleanup();
        if (!hasResolved) {
          hasResolved = true;
          reject(new Error(`HTML5 Audio error: ${audio.error?.message || "format unsupported"}`));
        }
      };

      audio.addEventListener("canplay", onCanPlay);
      audio.addEventListener("error", onError);

      audio.addEventListener("timeupdate", () => {
        if (this.state.playingId === id) {
          this.state.currentTime = audio.currentTime;
          if (isFinite(audio.duration) && audio.duration > 0) {
            this.state.duration = audio.duration;
          }
          this.notify();
        }
      });

      audio.addEventListener("ended", () => {
        if (this.state.playingId === id) {
          this.state.isPlaying = false;
          this.state.currentTime = 0;
          this.notify();
        }
      });

      audio.addEventListener("pause", () => {
        if (this.state.playingId === id && !audio.ended) {
          this.state.isPlaying = false;
          this.notify();
        }
      });

      audio.addEventListener("play", () => {
        if (this.state.playingId === id) {
          this.state.isPlaying = true;
          this.state.isLoading = false;
          this.notify();
        }
      });

      audio.src = src;
      audio.load();

      // Immediate play attempt
      const p = audio.play();
      if (p !== undefined) {
        p.then(() => {
          if (!hasResolved) {
            hasResolved = true;
            cleanup();
            this.state.isLoading = false;
            this.state.isPlaying = true;
            if (isFinite(audio.duration) && audio.duration > 0) {
              this.state.duration = audio.duration;
            }
            this.notify();
            resolve();
          }
        }).catch((err) => {
          // If not ready yet, wait for canplay
        });
      }

      // Safety timeout: if canplay doesn't fire in 2.5s, fall back to Web Audio
      setTimeout(() => {
        if (!hasResolved) {
          hasResolved = true;
          cleanup();
          reject(new Error("HTML5 Audio loading timeout"));
        }
      }, 2500);
    });
  }

  private async playViaWebAudio(id: string, src: string) {
    try {
      this.isWebAudioMode = true;
      if (!this.audioCtx) {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioCtx = new AudioCtxClass();
      }

      if (this.audioCtx.state === "suspended") {
        await this.audioCtx.resume();
      }

      const res = await fetch(src);
      if (!res.ok) throw new Error(`HTTP ${res.status} fetching audio`);
      const arrayBuffer = await res.arrayBuffer();

      const decodedBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
      this.audioBuffer = decodedBuffer;
      this.state.duration = decodedBuffer.duration;
      this.state.isLoading = false;

      this.startWebAudioSource(0);
    } catch (err) {
      console.error("Web Audio playback failed:", err);
      this.state.isLoading = false;
      this.state.isPlaying = false;
      this.notify();
    }
  }

  private startWebAudioSource(offset: number) {
    if (!this.audioCtx || !this.audioBuffer) return;

    if (this.sourceNode) {
      try {
        this.sourceNode.stop();
        this.sourceNode.disconnect();
      } catch {
        // ignore
      }
    }

    const source = this.audioCtx.createBufferSource();
    source.buffer = this.audioBuffer;

    if (!this.gainNode) {
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.connect(this.audioCtx.destination);
    }

    source.connect(this.gainNode);

    source.onended = () => {
      if (this.state.currentTime >= (this.state.duration - 0.1)) {
        this.state.isPlaying = false;
        this.state.currentTime = 0;
        if (this.rafId !== null) {
          cancelAnimationFrame(this.rafId);
          this.rafId = null;
        }
        this.notify();
      }
    };

    this.sourceNode = source;
    this.webAudioStartTime = this.audioCtx.currentTime;
    this.webAudioStartOffset = offset;
    this.state.currentTime = offset;
    this.state.isPlaying = true;

    source.start(0, offset);
    this.notify();

    this.runWebAudioLoop();
  }

  private runWebAudioLoop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }

    const loop = () => {
      if (this.audioCtx && this.state.isPlaying && this.isWebAudioMode) {
        const elapsed = this.audioCtx.currentTime - this.webAudioStartTime;
        const current = Math.min(this.state.duration, this.webAudioStartOffset + elapsed);
        this.state.currentTime = current;
        this.notify();
        this.rafId = requestAnimationFrame(loop);
      }
    };
    this.rafId = requestAnimationFrame(loop);
  }

  private resumeWebAudio() {
    if (!this.audioCtx || !this.audioBuffer) return;
    this.startWebAudioSource(this.state.currentTime);
  }

  public pause() {
    if (this.htmlAudio) {
      this.htmlAudio.pause();
    }

    if (this.sourceNode && this.isWebAudioMode) {
      try {
        this.sourceNode.stop();
        this.sourceNode.disconnect();
      } catch {
        // ignore
      }
      this.sourceNode = null;
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }

    this.state.isPlaying = false;
    this.notify();
  }

  public seek(seconds: number) {
    const target = Math.max(0, Math.min(seconds, this.state.duration || 300));
    this.state.currentTime = target;

    if (this.htmlAudio && !this.isWebAudioMode) {
      this.htmlAudio.currentTime = target;
    } else if (this.isWebAudioMode && this.audioBuffer) {
      if (this.state.isPlaying) {
        this.startWebAudioSource(target);
      }
    }

    this.notify();
  }
}

export const globalAudioPlayer = new GlobalAudioEngine();
