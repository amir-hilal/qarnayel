// =============================================================================
// Site-wide constants — enums, status values, domain constants
// Never use magic strings inline — always import from here.
// =============================================================================

// Publish status values
export const PUBLISH_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

// Place type values
export const PLACE_TYPES = {
  ATTRACTION: 'attraction',
  SERVICE: 'service',
} as const;

// Place category values
export const PLACE_CATEGORIES = {
  FOREST: 'forest',
  LAKE: 'lake',
  RESTAURANT: 'restaurant',
  SHOP: 'shop',
  PHARMACY: 'pharmacy',
  SALON: 'salon',
  LANDMARK: 'landmark',
  OTHER: 'other',
} as const;

// Contact mode values
export const CONTACT_MODES = {
  GUIDE: 'guide',
  OWNER: 'owner',
  NONE: 'none',
} as const;

// Page content slugs
export const PAGE_SLUGS = {
  HISTORY: 'history',
  ABOUT: 'about',
  CONTACT: 'contact',
} as const;
