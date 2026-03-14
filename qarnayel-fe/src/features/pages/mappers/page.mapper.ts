import { pageContentSchema, siteSettingsSchema } from '@/features/pages/schemas/page.schema';
import { coerceTimestampToString } from '@/lib/validation';
import type { PageContent, SiteSettings } from '@/features/pages/types';

export function toPageContent(
  id: string,
  raw: Record<string, unknown>,
): PageContent | null {
  const result = pageContentSchema.safeParse({
    ...raw,
    id,
    updatedAt: coerceTimestampToString(raw['updatedAt']),
  });
  if (!result.success) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[page.mapper] Failed to parse page "${id}":`, result.error.flatten());
    }
    return null;
  }
  return result.data;
}

export function toSiteSettings(raw: Record<string, unknown>): SiteSettings | null {
  const result = siteSettingsSchema.safeParse(raw);
  if (!result.success) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[page.mapper] Failed to parse siteSettings:', result.error.flatten());
    }
    return null;
  }
  return result.data;
}
