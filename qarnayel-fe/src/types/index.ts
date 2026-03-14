// =============================================================================
// Global shared TypeScript types
// These are the canonical domain model types for the entire application
// =============================================================================

// ---------------------------------------------------------------------------
// Locale
// ---------------------------------------------------------------------------
export type Locale = 'ar' | 'en';

// ---------------------------------------------------------------------------
// Localised text — used for all bilingual user-visible content
// ---------------------------------------------------------------------------
export type LocalizedText = {
  ar: string;
  en: string;
};

// ---------------------------------------------------------------------------
// SEO fields per locale
// ---------------------------------------------------------------------------
export type SeoFields = {
  title: string;
  description: string;
  keywords?: string[];
};

export type LocalizedSeo = {
  ar: SeoFields;
  en: SeoFields;
};

// ---------------------------------------------------------------------------
// Publish status
// ---------------------------------------------------------------------------
export type PublishStatus = 'draft' | 'published' | 'archived';

// ---------------------------------------------------------------------------
// Place domain types
// ---------------------------------------------------------------------------
export type PlaceType = 'attraction' | 'service';

export type PlaceCategory =
  | 'forest'
  | 'lake'
  | 'restaurant'
  | 'shop'
  | 'pharmacy'
  | 'salon'
  | 'landmark'
  | 'other';

export type ContactMode = 'guide' | 'owner' | 'none';

export type PlaceContact = {
  phone?: string;
  email?: string;
  whatsapp?: string;
  website?: string;
};

export type PlaceLocation = {
  mapUrl?: string;
  lat?: number;
  lng?: number;
  address?: LocalizedText;
};

export type PlaceResource = {
  label: LocalizedText;
  url: string;
  type: 'article' | 'video' | 'pdf' | 'website' | 'other';
};

export type MediaReference = {
  path: string;
  url: string;
  alt: LocalizedText;
  isPrimary: boolean;
};

export type Place = {
  id: string;
  slug: string;
  placeType: PlaceType;
  category: PlaceCategory;
  contactMode: ContactMode;
  status: PublishStatus;
  featured: boolean;
  title: LocalizedText;
  subtitle: LocalizedText;
  shortDescription: LocalizedText;
  description: LocalizedText;
  seo: LocalizedSeo;
  contact: PlaceContact;
  location: PlaceLocation;
  images: MediaReference[];
  resources: PlaceResource[];
  createdAt: string;
  updatedAt: string;
};

// ---------------------------------------------------------------------------
// History domain types
// ---------------------------------------------------------------------------
export type HistorySource = {
  label: LocalizedText;
  url?: string;
  // TODO: All history content must be verified against primary or secondary academic sources
};

export type HistoryEntry = {
  id: string;
  order: number;
  title: LocalizedText;
  body: LocalizedText;
  period?: LocalizedText;
  sources: HistorySource[];
  status: PublishStatus;
  updatedAt: string;
};

// ---------------------------------------------------------------------------
// Page content (About, Contact, etc.)
// ---------------------------------------------------------------------------
export type PageContent = {
  id: string;
  slug: string;
  title: LocalizedText;
  body: LocalizedText;
  seo: LocalizedSeo;
  updatedAt: string;
};

// ---------------------------------------------------------------------------
// CTA
// ---------------------------------------------------------------------------
export type CTA = {
  label: LocalizedText;
  href: string;
};

// ---------------------------------------------------------------------------
// Site settings
// ---------------------------------------------------------------------------
export type SocialLinks = {
  facebook?: string;
  instagram?: string;
};

export type SiteSettings = {
  siteName: LocalizedText;
  tagline: LocalizedText;
  heroTitle: LocalizedText;
  heroSubtitle: LocalizedText;
  ctaExplorePlaces: LocalizedText;
  ctaDiscoverHistory: LocalizedText;
  townIntroduction: LocalizedText;
  contactEmail?: string;
  contactPhone?: string;
  socialLinks?: SocialLinks;
};
