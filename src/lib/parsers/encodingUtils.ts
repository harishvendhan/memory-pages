/**
 * LAYER 2 — PARSER UTILITY
 * Responsibility: Fix Instagram's known Latin-1 / UTF-8 encoding bug on strings.
 * No I/O. No rendering. Pure transformation.
 */

/**
 * Instagram exports encode UTF-8 characters (emoji, Tamil, Arabic, etc.)
 * as Latin-1 byte sequences inside JSON strings.
 *
 * Example raw:  "à®¤à®®à®¿à®´à¯\u008d"
 * Correct:      "தமிழ்"
 *
 * Fix: re-interpret the string's char codes as UTF-8 bytes.
 */
export function fixInstagramEncoding(str: string): string {
  if (!str) return str;
  try {
    // Convert JS string (Latin-1 codepoints) back to UTF-8 bytes, then decode
    return decodeURIComponent(escape(str));
  } catch {
    // If already valid UTF-8 or decoding fails, return as-is
    return str;
  }
}

/**
 * Apply fixInstagramEncoding recursively to all string values in an object.
 * Used to sanitise an entire raw Instagram JSON blob in one pass.
 */
export function fixObjectEncoding<T>(obj: T): T {
  if (typeof obj === "string") {
    return fixInstagramEncoding(obj) as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj.map(fixObjectEncoding) as unknown as T;
  }
  if (obj !== null && typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(obj as Record<string, unknown>)) {
      result[key] = fixObjectEncoding((obj as Record<string, unknown>)[key]);
    }
    return result as T;
  }
  return obj;
}
