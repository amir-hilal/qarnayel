import { historyEntrySchema } from '@/features/history/schemas/history.schema';
import type { HistoryEntry } from '@/features/history/types';
import { coerceTimestampToString } from '@/lib/validation';

// =============================================================================
// History mapper — convert raw Firestore documents to typed HistoryEntry models
// =============================================================================

/**
 * Map a raw Firestore document to a typed HistoryEntry.
 * Returns null when parsing fails (treated as a data-schema mismatch in dev).
 */
export function toHistoryEntry(
  id: string,
  raw: Record<string, unknown>,
): HistoryEntry | null {
  const data: Record<string, unknown> = {
    ...raw,
    id,
    createdAt: coerceTimestampToString(raw.createdAt),
    updatedAt: coerceTimestampToString(raw.updatedAt),
  };

  const result = historyEntrySchema.safeParse(data);

  if (!result.success) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[history.mapper] Failed to parse history entry "${id}":`,
        result.error.flatten(),
      );
    }
    return null;
  }

  return result.data;
}
