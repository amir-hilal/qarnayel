import {
  localizedSeoSchema,
  localizedTextSchema,
  mediaReferenceSchema,
  placeResourceSchema,
  publishStatusSchema,
} from '@/lib/validation';
import { z } from 'zod';

// =============================================================================
// Place zod schemas
// =============================================================================

const placeContactSchema = z.object({
  phone: z.string().optional(),
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .optional()
    .or(z.literal('')),
  whatsapp: z.string().optional(),
  website: z
    .string()
    .url({ message: 'Invalid URL' })
    .optional()
    .or(z.literal('')),
});

const placeLocationSchema = z.object({
  mapUrl: z
    .string()
    .url({ message: 'Invalid URL' })
    .optional()
    .or(z.literal('')),
  lat: z.number().optional(),
  lng: z.number().optional(),
  address: localizedTextSchema.optional(),
});

// ---------------------------------------------------------------------------
// Firestore document schema — includes system fields
// ---------------------------------------------------------------------------
export const placeSchema = z.object({
  id: z.string().min(1),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug must be lowercase letters, numbers, and hyphens only',
    ),
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

// ---------------------------------------------------------------------------
// Form schema — excludes system fields, for create/edit forms
// ---------------------------------------------------------------------------
export const placeFormSchema = placeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type PlaceSchemaOutput = z.output<typeof placeSchema>;
export type PlaceFormSchemaOutput = z.output<typeof placeFormSchema>;
