import { PLACE_CATEGORIES, PLACE_TYPES, CONTACT_MODES } from '@/config/constants';
import type { PlaceCategory } from '@/features/places/types';

// ---------------------------------------------------------------------------
// Place feature constants
// ---------------------------------------------------------------------------

export const ALL_PLACE_CATEGORIES = Object.values(PLACE_CATEGORIES) as PlaceCategory[];
export const ALL_PLACE_TYPES = Object.values(PLACE_TYPES);
export const ALL_CONTACT_MODES = Object.values(CONTACT_MODES);

// URL search param keys for filtering
export const FILTER_PARAMS = {
  CATEGORY: 'category',
  TYPE: 'type',
} as const;
