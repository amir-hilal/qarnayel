import { z } from 'zod';
import {
  localizedTextSchema,
  historySourceSchema,
  publishStatusSchema,
} from '@/lib/validation';

// ---------------------------------------------------------------------------
// History entry zod schema
// ---------------------------------------------------------------------------

export const historyEntrySchema = z.object({
  id: z.string().min(1),
  order: z.number().int().nonnegative(),
  title: localizedTextSchema,
  body: localizedTextSchema,
  period: localizedTextSchema.optional(),
  sources: z.array(historySourceSchema).default([]),
  status: publishStatusSchema,
  updatedAt: z.string(),
});

export type HistoryEntrySchemaOutput = z.output<typeof historyEntrySchema>;
