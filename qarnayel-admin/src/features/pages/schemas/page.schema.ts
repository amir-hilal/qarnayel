import {
  localizedSeoSchema,
  localizedTextSchema,
  publishStatusSchema,
} from '@/lib/validation';
import { z } from 'zod';

// =============================================================================
// Page content zod schemas
// =============================================================================

export const pageContentSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  status: publishStatusSchema,
  title: localizedTextSchema,
  body: localizedTextSchema,
  seo: localizedSeoSchema,
  updatedAt: z.string(),
});

export const pageContentFormSchema = pageContentSchema.omit({
  id: true,
  updatedAt: true,
});

export type PageContentSchemaOutput = z.output<typeof pageContentSchema>;
export type PageContentFormSchemaOutput = z.output<
  typeof pageContentFormSchema
>;
