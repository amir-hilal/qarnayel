import {
  localizedSeoSchema,
  localizedTextSchema,
  mediaReferenceSchema,
  placeResourceSchema,
  publishStatusSchema,
} from '@/lib/validation';
import { z } from 'zod';

// ---------------------------------------------------------------------------
// Place zod schema — used in the mapper to validate Firestore documents
// ---------------------------------------------------------------------------

const placeContactSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email().optional(),
  whatsapp: z.string().optional(),
  website: z.string().url().optional(),
});

const placeLocationSchema = z.object({
  mapUrl: z.string().url().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  address: localizedTextSchema.optional(),
});

export const placeSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  placeType: z.enum(['attraction', 'service']),
  category: z.enum([
    'forest',
    'lake',
    'restaurant',
    'shop',
    'pharmacy',
    'salon',
    'landmark',
    'other',
  ]),
  contactMode: z.enum(['guide', 'owner', 'none']),
  status: publishStatusSchema,
  featured: z.boolean().default(false),
  title: localizedTextSchema,
  subtitle: localizedTextSchema,
  shortDescription: localizedTextSchema,
  description: localizedTextSchema,
  seo: localizedSeoSchema,
  contact: placeContactSchema,
  location: placeLocationSchema,
  images: z.array(mediaReferenceSchema).default([]),
  resources: z.array(placeResourceSchema).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type PlaceSchemaInput = z.input<typeof placeSchema>;
export type PlaceSchemaOutput = z.output<typeof placeSchema>;
