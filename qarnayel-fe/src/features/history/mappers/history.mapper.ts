import { historyEntrySchema } from '@/features/history/schemas/history.schema';
import { coerceTimestampToString } from '@/lib/validation';
import type { HistoryEntry } from '@/features/history/types';

// ---------------------------------------------------------------------------
// toHistoryEntry — converts raw Firestore document to a typed HistoryEntry
// ---------------------------------------------------------------------------
export function toHistoryEntry(
  id: string,
  raw: Record<string, unknown>,
): HistoryEntry | null {
  const withCoercedDates = {
    ...raw,
    id,
    updatedAt: coerceTimestampToString(raw['updatedAt']),
  };

  const result = historyEntrySchema.safeParse(withCoercedDates);

  if (!result.success) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `[history.mapper] Failed to parse history entry "${id}":`,
        result.error.flatten(),
      );
    }
    return null;
  }

  return result.data;
}
