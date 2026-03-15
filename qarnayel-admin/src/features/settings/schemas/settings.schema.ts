import { localizedTextSchema } from '@/lib/validation';
import { z } from 'zod';

// =============================================================================
// Site settings zod schema
// =============================================================================

export const siteSettingsSchema = z.object({
  id: z.string().min(1),
  siteName: localizedTextSchema,
  tagline: localizedTextSchema.optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  socialLinks: z
    .object({
      facebook: z.string().optional().or(z.literal('')),
      instagram: z.string().optional().or(z.literal('')),
      youtube: z.string().optional().or(z.literal('')),
    })
    .optional(),
  updatedAt: z.string(),
});

export const siteSettingsFormSchema = siteSettingsSchema.omit({
  id: true,
  updatedAt: true,
});

export type SiteSettingsSchemaOutput = z.output<typeof siteSettingsSchema>;
export type SiteSettingsFormSchemaOutput = z.output<
  typeof siteSettingsFormSchema
>;
