import {
  localizedSeoSchema,
  localizedTextSchema,
  placeResourceSchema,
  publishStatusSchema,
} from '@/lib/validation';
import { z } from 'zod';

// =============================================================================
// History entry zod schemas
// =============================================================================

// ---------------------------------------------------------------------------
// Firestore document schema
// ---------------------------------------------------------------------------
export const historyEntrySchema = z.object({
  id: z.string().min(1),
  title: localizedTextSchema,
  summary: localizedTextSchema.optional(),
  content: localizedTextSchema,
  periodStart: z.string().min(1),
  periodEnd: z.string().optional(),
  sources: z.array(placeResourceSchema).default([]),
  status: publishStatusSchema,
  order: z.number().int().default(0),
  seo: localizedSeoSchema.optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ---------------------------------------------------------------------------
// Form schema — excludes system fields
// ---------------------------------------------------------------------------
export const historyEntryFormSchema = historyEntrySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type HistoryEntrySchemaOutput = z.output<typeof historyEntrySchema>;
export type HistoryEntryFormSchemaOutput = z.output<
  typeof historyEntryFormSchema
>;
