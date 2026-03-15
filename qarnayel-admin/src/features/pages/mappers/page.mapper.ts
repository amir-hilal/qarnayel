import { pageContentSchema } from '@/features/pages/schemas/page.schema';
import type { PageContent } from '@/features/pages/types';
import { coerceTimestampToString } from '@/lib/validation';

// =============================================================================
// Page mapper — convert raw Firestore documents to typed PageContent models
// =============================================================================

/**
 * Map a raw Firestore document to a typed PageContent.
 * Returns null when parsing fails (treated as a data-schema mismatch in dev).
 */
export function toPageContent(
  id: string,
  raw: Record<string, unknown>,
): PageContent | null {
  const data: Record<string, unknown> = {
    ...raw,
    id,
    createdAt: coerceTimestampToString(raw.createdAt),
    updatedAt: coerceTimestampToString(raw.updatedAt),
  };

  const result = pageContentSchema.safeParse(data);

  if (!result.success) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[page.mapper] Failed to parse page content "${id}":`,
        result.error.flatten(),
      );
    }
    return null;
  }

  return result.data;
}
