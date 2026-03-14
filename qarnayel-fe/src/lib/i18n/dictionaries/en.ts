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
    metaDescription:
      'Discover Qarnayel, a Lebanese village in the heart of the Metn known for its breathtaking nature and rich history.',
    aboutHeading: 'About Qarnayel',
  },
  cta: {
    explorePlaces: 'Explore Places',
    discoverHistory: 'Discover History',
  },
  places: {
    pageTitle: 'Places',
    metaDescription: 'Explore the places of Qarnayel — restaurants, landmarks, forests, lakes, and local services.',
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
    backToPlaces: 'Back to Places',
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
    metaDescription: 'Explore the history of Qarnayel across the ages, from Phoenician civilisation to the modern era.',
    sources: 'Sources',
    loadingHistory: 'Loading...',
    noHistory: 'No history entries available yet.',
  },
  about: {
    pageTitle: 'About Qarnayel',
    metaDescription: 'Learn about the history, nature, and character of Qarnayel in the heart of Mount Lebanon.',
  },
  contact: {
    pageTitle: 'Contact Us',
    metaDescription: 'Get in touch with the Qarnayel website team for any enquiry or suggestion.',
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    socialLabel: 'Social media',
  },
  common: {
    siteName: 'Qarnayel',
    loading: 'Loading...',
    error: 'Something went wrong. Please try again.',
    notFound: 'Page not found',
    backHome: 'Back to Home',
    openInNewTab: 'Opens in a new tab',
  },
} as const;
