import {
  historySourceSchema,
  localizedTextSchema,
  publishStatusSchema,
} from '@/lib/validation';
import { z } from 'zod';

// ---------------------------------------------------------------------------
// History entry zod schema
// ---------------------------------------------------------------------------

export const historyEntrySchema = z.object({
  id: z.string().min(1),
  order: z.number().int().nonnegative(),
  title: localizedTextSchema,
  content: localizedTextSchema,
  period: z.preprocess((v) => v ?? undefined, z.string().optional()),
  sources: z.array(historySourceSchema).default([]),
  status: publishStatusSchema,
  updatedAt: z.string(),
});

export type HistoryEntrySchemaOutput = z.output<typeof historyEntrySchema>;
