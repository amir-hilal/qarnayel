import {
  CONTACT_MODES,
  PLACE_CATEGORIES,
  PLACE_TYPES,
} from '@/config/constants';
import type {
  ContactMode,
  PlaceCategory,
  PlaceType,
} from '@/features/places/types';

// =============================================================================
// Place feature constants
// =============================================================================

export const ALL_PLACE_CATEGORIES = Object.values(
  PLACE_CATEGORIES,
) as PlaceCategory[];
export const ALL_PLACE_TYPES = Object.values(PLACE_TYPES) as PlaceType[];
export const ALL_CONTACT_MODES = Object.values(CONTACT_MODES) as ContactMode[];

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
