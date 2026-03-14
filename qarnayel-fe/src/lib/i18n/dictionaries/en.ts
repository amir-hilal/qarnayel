// =============================================================================
// English (en) dictionary — static UI strings
// =============================================================================

import type { Dictionary } from './ar';

export const en: Dictionary = {
  nav: {
    home: 'Home',
    places: 'Places',
    history: 'History',
    about: 'About',
    contact: 'Contact',
    switchLocale: 'العربية',
  },
  home: {
    heroImageAlt: 'Aerial view of Qarnayel village',
    featuredPlacesTitle: 'Featured Places',
    exploreMorePlaces: 'Explore More Places',
  },
  cta: {
    explorePlaces: 'Explore Places',
    discoverHistory: 'Discover History',
  },
  places: {
    pageTitle: 'Places',
    filterByCategory: 'Filter by category',
    filterByType: 'Filter by type',
    allCategories: 'All categories',
    allTypes: 'All types',
    noResults: 'No places match your filters.',
    clearFilters: 'Clear filters',
    viewOnMap: 'View on Map',
    contactGuide: 'Contact a Guide',
    contactPlace: 'Contact this Place',
    resources: 'Resources & References',
    images: 'Photos',
    loadingPlaces: 'Loading places...',
    errorLoading: 'Could not load places. Please try again later.',
    notFound: 'Place not found.',
  },
  categories: {
    forest: 'Forest',
    lake: 'Lake',
    restaurant: 'Restaurant',
    shop: 'Shop',
    pharmacy: 'Pharmacy',
    salon: 'Salon',
    landmark: 'Landmark',
    other: 'Other',
  },
  placeTypes: {
    attraction: 'Attraction',
    service: 'Service',
  },
  history: {
    pageTitle: 'History of Qarnayel',
    sources: 'Sources',
    loadingHistory: 'Loading...',
    noHistory: 'No history entries available yet.',
  },
  about: {
    pageTitle: 'About Qarnayel',
  },
  contact: {
    pageTitle: 'Contact Us',
  },
  common: {
    loading: 'Loading...',
    error: 'Something went wrong. Please try again.',
    notFound: 'Page not found',
    backHome: 'Back to Home',
    openInNewTab: 'Opens in a new tab',
  },
} as const;
