/**
 * Build a storage path for a media upload.
 * Convention: {collection}/{documentId}/{filename}
 */
export function buildStoragePath(
  collection: string,
  documentId: string,
  filename: string,
): string {
  const sanitised = filename.toLowerCase().replace(/\s+/g, '-');
  return `${collection}/${documentId}/${sanitised}`;
}

/**
 * Format a file size in bytes to a human-readable string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const ACCEPTED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
