import {
  pageContentSchema,
  siteSettingsSchema,
} from '@/features/pages/schemas/page.schema';
import type { PageContent, SiteSettings } from '@/features/pages/types';
import { coerceTimestampToString } from '@/lib/validation';

function stripSeoKeywords(seo: {
  ar: { title: string; description: string; keywords?: string[] | undefined };
  en: { title: string; description: string; keywords?: string[] | undefined };
}): PageContent['seo'] {
  const mapLocale = (fields: {
    title: string;
    description: string;
    keywords?: string[] | undefined;
  }) => {
    const { keywords, ...rest } = fields;
    return { ...rest, ...(keywords !== undefined ? { keywords } : {}) };
  };
  return { ar: mapLocale(seo.ar), en: mapLocale(seo.en) };
}

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
      console.error(
        `[page.mapper] Failed to parse page "${id}":`,
        result.error.flatten(),
      );
    }
    return null;
  }
  return { ...result.data, seo: stripSeoKeywords(result.data.seo) };
}

export function toSiteSettings(
  raw: Record<string, unknown>,
): SiteSettings | null {
  const result = siteSettingsSchema.safeParse(raw);
  if (!result.success) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        '[page.mapper] Failed to parse siteSettings:',
        result.error.flatten(),
      );
    }
    return null;
  }

  const { contactEmail, contactPhone, socialLinks, ...rest } = result.data;

  const strippedSocialLinks: SiteSettings['socialLinks'] = socialLinks
    ? (() => {
        const { facebook, instagram } = socialLinks;
        return {
          ...(facebook !== undefined ? { facebook } : {}),
          ...(instagram !== undefined ? { instagram } : {}),
        };
      })()
    : undefined;

  return {
    ...rest,
    ...(contactEmail !== undefined ? { contactEmail } : {}),
    ...(contactPhone !== undefined ? { contactPhone } : {}),
    ...(strippedSocialLinks !== undefined
      ? { socialLinks: strippedSocialLinks }
      : {}),
  };
}
