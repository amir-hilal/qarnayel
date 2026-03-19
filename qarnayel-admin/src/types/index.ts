// =============================================================================
// Global type definitions
// No imports — types only
// =============================================================================

// ---------------------------------------------------------------------------
// Locale and i18n
// ---------------------------------------------------------------------------

export type Locale = 'ar' | 'en';

export type LocalizedText = {
  ar: string;
  en: string;
};

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
// Place domain
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
};

export type MediaReference = {
  storagePath: string;
  downloadUrl: string;
  altText?: LocalizedText;
  width?: number;
  height?: number;
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

export type PlaceFormValues = Omit<Place, 'id' | 'createdAt' | 'updatedAt'>;

// ---------------------------------------------------------------------------
// Page content domain
// ---------------------------------------------------------------------------

export type PageContent = {
  id: string;
  slug: string;
  status: PublishStatus;
  title: LocalizedText;
  body: LocalizedText;
  seo: LocalizedSeo;
  updatedAt: string;
};

export type PageContentFormValues = Omit<PageContent, 'id' | 'updatedAt'>;

// ---------------------------------------------------------------------------
// Media domain
// ---------------------------------------------------------------------------

export type MediaAsset = {
  id: string;
  storagePath: string;
  downloadUrl: string;
  altText?: LocalizedText;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  uploadedAt: string;
  uploadedBy?: string;
};

// ---------------------------------------------------------------------------
// Home CTA
// ---------------------------------------------------------------------------

export type HomeCTA = {
  label: LocalizedText;
  href: string;
};

// ---------------------------------------------------------------------------
// Site settings domain
// ---------------------------------------------------------------------------

export type SiteSettings = {
  id: string;
  siteName: LocalizedText;
  tagline: LocalizedText;
  heroTitle: LocalizedText;
  heroSubtitle: LocalizedText;
  ctas: HomeCTA[];
  townIntroduction: LocalizedText;
  contactEmail?: string;
  contactPhone?: string | null;
  socialLinks?: {
    facebook?: string | null;
    instagram?: string | null;
    youtube?: string | null;
  };
  updatedAt: string;
};

export type SiteSettingsFormValues = Omit<SiteSettings, 'id' | 'updatedAt'>;

// ---------------------------------------------------------------------------
// Auth / user
// ---------------------------------------------------------------------------

export type AdminRole = 'admin' | 'editor' | 'reviewer';

export type AdminUser = {
  uid: string;
  email: string;
  displayName?: string;
  role: AdminRole;
};
