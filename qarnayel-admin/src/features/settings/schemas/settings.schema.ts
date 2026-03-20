import { localizedTextSchema } from '@/lib/validation';
import { z } from 'zod';

// =============================================================================
// Site settings zod schema
// =============================================================================

const ctaItemSchema = z.object({
  label: localizedTextSchema,
  href: z.string().min(1),
});

const navItemSchema = z.object({
  label: localizedTextSchema,
  path: z.string().min(1),
});

export const siteSettingsSchema = z.object({
  id: z.string().min(1),
  siteName: localizedTextSchema,
  tagline: localizedTextSchema,
  heroTitle: localizedTextSchema,
  heroSubtitle: localizedTextSchema,
  ctas: z.array(ctaItemSchema).default([]),
  townIntroduction: localizedTextSchema,
  contactEmail: z.string().email().optional().or(z.literal('')),
  contactPhone: z.string().nullish(),
  socialLinks: z
    .object({
      facebook: z.string().nullish().or(z.literal('')),
      instagram: z.string().nullish().or(z.literal('')),
      youtube: z.string().nullish().or(z.literal('')),
    })
    .optional(),
  navItems: z.array(navItemSchema).default([]),
  updatedAt: z.string(),
});

/** Form schema — navItems excluded; managed separately via NavManager. */
export const siteSettingsFormSchema = siteSettingsSchema.omit({
  id: true,
  updatedAt: true,
  navItems: true,
});

export type SiteSettingsSchemaOutput = z.output<typeof siteSettingsSchema>;
export type SiteSettingsFormSchemaOutput = z.output<
  typeof siteSettingsFormSchema
>;
