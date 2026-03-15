// =============================================================================
// Place feature utilities
// =============================================================================

/**
 * Generate a URL-safe slug from a string.
 * Uses the English title by convention.
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Build a storage path for a place image.
 * Convention: places/{placeId}/{filename}
 */
export function buildPlaceStoragePath(
  placeId: string,
  filename: string,
): string {
  const sanitised = filename.toLowerCase().replace(/\s+/g, '-');
  return `places/${placeId}/${sanitised}`;
}
