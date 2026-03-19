// =============================================================================
// Admin route path helpers
// Never hard-code route strings — always import from here.
// =============================================================================

export const ADMIN_ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',

  PLACES: '/places',
  PLACE_NEW: '/places/new',
  PLACE_EDIT: (id: string) => `/places/${id}/edit`,

  PAGES: '/pages',
  PAGE_EDIT: (slug: string) => `/pages/${slug}/edit`,

  MEDIA: '/media',

  SETTINGS: '/settings',
} as const;
