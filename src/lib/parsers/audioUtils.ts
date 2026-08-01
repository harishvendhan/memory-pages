/**
 * LAYER 2 — PARSER UTILITY
 * Responsibility: Parse audio file binary headers to extract duration.
 * No I/O. No rendering. Pure transformation of ArrayBuffer data.
 */

/**
 * Format seconds into Instagram-style duration string: "0:34", "1:02", etc.
 */
export function formatDuration(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Attempt to parse duration from a WAV file ArrayBuffer.
 * WAV RIFF header format:
 *   Offset 0:  "RIFF"
 *   Offset 4:  file size - 8 (uint32 LE)
 *   Offset 8:  "WAVE"
 *   Offset 12: "fmt " chunk ...
 *   Offset 20: audio format (uint16 LE)
 *   Offset 22: num channels (uint16 LE)
 *   Offset 24: sample rate (uint32 LE)
 *   Offset 28: byte rate (uint32 LE)
 *   ... data chunk follows
 * Duration = data chunk size / byte rate
 */
export function parseWavDuration(buffer: ArrayBuffer): number | null {
  try {
    const view = new DataView(buffer);
    const riff = String.fromCharCode(
      view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3),
    );
    if (riff !== "RIFF") return null;

    const byteRate = view.getUint32(28, true); // bytes per second
    if (byteRate === 0) return null;

    // Walk chunks to find "data"
    let offset = 36;
    while (offset + 8 < buffer.byteLength) {
      const chunkId = String.fromCharCode(
        view.getUint8(offset),
        view.getUint8(offset + 1),
        view.getUint8(offset + 2),
        view.getUint8(offset + 3),
      );
      const chunkSize = view.getUint32(offset + 4, true);
      if (chunkId === "data") {
        return chunkSize / byteRate;
      }
      offset += 8 + chunkSize;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Attempt to parse duration from an M4A/AAC (MP4 container) ArrayBuffer.
 * Looks for the 'mdhd' atom which contains duration + timescale.
 */
export function parseMp4Duration(buffer: ArrayBuffer): number | null {
  try {
    const bytes = new Uint8Array(buffer);
    // Search for 'mdhd' atom marker bytes: 0x6D, 0x64, 0x68, 0x64
    for (let i = 0; i < bytes.length - 20; i++) {
      if (
        bytes[i] === 0x6d && bytes[i + 1] === 0x64 &&
        bytes[i + 2] === 0x68 && bytes[i + 3] === 0x64
      ) {
        const view = new DataView(buffer, i + 4);
        const version = view.getUint8(0);
        if (version === 0) {
          // version 0: timescale at offset 8, duration at offset 12 (both uint32 BE)
          const timescale = view.getUint32(8, false);
          const duration = view.getUint32(12, false);
          if (timescale > 0) return duration / timescale;
        } else if (version === 1) {
          // version 1: timescale at offset 16 (uint32), duration at offset 20 (uint64)
          const timescale = view.getUint32(16, false);
          const durationHigh = view.getUint32(20, false);
          const durationLow = view.getUint32(24, false);
          const duration = durationHigh * 0x100000000 + durationLow;
          if (timescale > 0) return duration / timescale;
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Try to extract audio duration from a binary ArrayBuffer.
 * Attempts WAV, then M4A. Falls back to null if unrecognized format.
 */
export function parseAudioDuration(buffer: ArrayBuffer): number | null {
  return parseWavDuration(buffer) ?? parseMp4Duration(buffer);
}

/**
 * Parse duration from a binary ArrayBuffer and format it.
 * Returns "0:00" if detection fails.
 */
export function parseDurationString(buffer: ArrayBuffer): string {
  const seconds = parseAudioDuration(buffer);
  if (seconds === null || !isFinite(seconds) || seconds <= 0) return "0:00";
  return formatDuration(seconds);
}
