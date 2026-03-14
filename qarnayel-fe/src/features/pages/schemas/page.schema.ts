import { localizedSeoSchema, localizedTextSchema } from '@/lib/validation';
import { z } from 'zod';

export const pageContentSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: localizedTextSchema,
  body: localizedTextSchema,
  seo: localizedSeoSchema,
  updatedAt: z.string(),
});

export const siteSettingsSchema = z.object({
  siteName: localizedTextSchema,
  tagline: localizedTextSchema,
  heroTitle: localizedTextSchema,
  heroSubtitle: localizedTextSchema,
  ctaExplorePlaces: localizedTextSchema,
  ctaDiscoverHistory: localizedTextSchema,
  townIntroduction: localizedTextSchema,
  contactEmail: z.preprocess(
    (v) => v ?? undefined,
    z.string().email().optional(),
  ),
  contactPhone: z.preprocess((v) => v ?? undefined, z.string().optional()),
  socialLinks: z
    .object({
      facebook: z.preprocess(
        (v) => v ?? undefined,
        z.string().url().optional(),
      ),
      instagram: z.preprocess(
        (v) => v ?? undefined,
        z.string().url().optional(),
      ),
    })
    .optional(),
});
