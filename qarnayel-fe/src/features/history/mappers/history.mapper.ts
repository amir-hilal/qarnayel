import { historyEntrySchema } from '@/features/history/schemas/history.schema';
import type { HistoryEntry } from '@/features/history/types';
import { coerceTimestampToString } from '@/lib/validation';

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
        JSON.stringify(result.error.flatten(), null, 2),
      );
    }
    return null;
  }

  const { period, ...rest } = result.data;
  return {
    ...rest,
    sources: result.data.sources.map(({ url, ...src }) => ({
      ...src,
      ...(url !== undefined ? { url } : {}),
    })),
    ...(period !== undefined ? { period } : {}),
  };
}
