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

const ctaItemSchema = z.object({
  label: localizedTextSchema,
  href: z.string().min(1),
});

const navItemSchema = z.object({
  label: localizedTextSchema,
  path: z.string().min(1),
});

export const siteSettingsSchema = z.object({
  siteName: localizedTextSchema,
  tagline: localizedTextSchema,
  heroTitle: localizedTextSchema,
  heroSubtitle: localizedTextSchema,
  ctas: z.array(ctaItemSchema).default([]),
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
  navItems: z.array(navItemSchema).default([]),
});
