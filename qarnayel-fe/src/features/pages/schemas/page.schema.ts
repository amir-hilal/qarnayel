import { z } from 'zod';
import { localizedTextSchema, localizedSeoSchema } from '@/lib/validation';

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
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  socialLinks: z
    .object({
      facebook: z.string().url().optional(),
      instagram: z.string().url().optional(),
    })
    .optional(),
});
