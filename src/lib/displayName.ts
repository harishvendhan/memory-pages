const DISPLAY_NAME_MAP: Record<string, string> = {
  "Harish_vendhan": "Me",
  "Harishvendhan": "Me",
  "harish_vendhan": "Me",
  "Harish": "Me",
  "harish": "Me",

  "『Ailurophile♡』": "You",
  "『𝔸𝕚𝕝𝕦𝕣𝕠𝕡𝕙𝕚𝕝𝕖 ♡』": "You",
  "Ailurophile": "You",
  "ailurophile": "You",
  "Aishu": "You",
  "aishu": "You",
  // In case encoding fix was bypassed
  "ã\u0080\u008eð\u009d\u0094¸ð\u009d\u0095\u009að\u009d\u0095\u009dð\u009d\u0095¦ð\u009d\u0095£ð\u009d\u0095 ð\u009d\u0095¡ð\u009d\u0095\u0099ð\u009d\u0095\u009að\u009d\u0095\u009dð\u009d\u0095\u0096 â\u0099¡ã\u0080\u008f": "You",
};

/**
 * Returns the mapped friendly display name for a participant,
 * or returns the original string if no mapping exists.
 */
export function getDisplayName(originalName?: string | null): string {
  if (!originalName) return "";
  
  // Direct match
  if (DISPLAY_NAME_MAP[originalName]) {
    return DISPLAY_NAME_MAP[originalName];
  }

  // Normalized case/trim match
  const trimmed = originalName.trim();
  if (DISPLAY_NAME_MAP[trimmed]) {
    return DISPLAY_NAME_MAP[trimmed];
  }

  const lower = trimmed.toLowerCase();
  for (const [key, val] of Object.entries(DISPLAY_NAME_MAP)) {
    if (key.toLowerCase() === lower) {
      return val;
    }
  }

  // Robust fallback checks for mathematical unicode and mojibake
  if (lower.includes("harish") || lower.includes("vendhan")) {
    return "Me";
  }
  
  if (
    lower.includes("aishu") || 
    lower.includes("ailurophile") || 
    originalName.includes("♡") || 
    originalName.includes("』") ||
    originalName.includes("𝔸") // The mathematical A
  ) {
    return "You";
  }

  return originalName;
}
