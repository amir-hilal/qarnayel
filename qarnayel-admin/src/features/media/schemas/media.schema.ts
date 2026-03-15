import { localizedTextSchema } from '@/lib/validation';
import { z } from 'zod';

// =============================================================================
// Media asset zod schema
// =============================================================================

export const mediaAssetSchema = z.object({
  id: z.string().min(1),
  storagePath: z.string().min(1),
  downloadUrl: z.string().url(),
  altText: localizedTextSchema.optional(),
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().positive(),
  width: z.number().optional(),
  height: z.number().optional(),
  uploadedAt: z.string(),
  uploadedBy: z.string().optional(),
});

export type MediaAssetSchemaOutput = z.output<typeof mediaAssetSchema>;
