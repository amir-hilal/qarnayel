import { DOCUMENT_IDS } from '@/config/collections';
import { toSiteSettings } from '@/features/settings/mappers/settings.mapper';
import { siteSettingsDoc } from '@/lib/firebase/collections';
import type {
  LocalizedText,
  NavItem,
  PublishStatus,
  SiteSettings,
  SiteSettingsFormValues,
} from '@/types';
import { getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

// =============================================================================
// Settings repository — read/write for the singleton site_settings document
// =============================================================================

// ---------------------------------------------------------------------------
// Read operations
// ---------------------------------------------------------------------------

/**
 * Fetch the singleton site settings document.
 * The document ID is defined by DOCUMENT_IDS.SITE_SETTINGS ('site_settings').
 */
export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  try {
    const snap = await getDoc(siteSettingsDoc());
    if (!snap.exists()) return null;
    return toSiteSettings(
      DOCUMENT_IDS.SITE_SETTINGS_GLOBAL,
      snap.data() as Record<string, unknown>,
    );
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[settings.repository] fetchSiteSettings failed', err);
    }
    return null;
  }
}

// ---------------------------------------------------------------------------
// Write operations
// ---------------------------------------------------------------------------

/**
 * Save (merge/create) the site settings document.
 * Uses setDoc with merge so partial saves do not wipe unset fields.
 */
export async function saveSiteSettings(
  data: SiteSettingsFormValues,
): Promise<void> {
  await setDoc(
    siteSettingsDoc(),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

/**
 * Update only the navItems field of the site settings document.
 * All other fields remain untouched.
 */
export async function updateNavItems(navItems: NavItem[]): Promise<void> {
  await updateDoc(siteSettingsDoc(), {
    navItems,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Automatically sync a pageContent page in/out of navItems based on its status.
 *
 * - `published`  → appended to navItems if not already present
 * - anything else → removed from navItems if present
 *
 * This is a best-effort operation; errors are swallowed so a nav sync failure
 * never blocks a page save.
 */
export async function syncNavItemForPage(page: {
  title: LocalizedText;
  slug: string;
  status: PublishStatus;
}): Promise<void> {
  const settings = await fetchSiteSettings();
  const currentNavItems = settings?.navItems ?? [];
  const path = `/${page.slug}`;
  const alreadyInNav = currentNavItems.some((n) => n.path === path);

  if (page.status === 'published' && !alreadyInNav) {
    await updateNavItems([...currentNavItems, { label: page.title, path }]);
  } else if (page.status !== 'published' && alreadyInNav) {
    await updateNavItems(currentNavItems.filter((n) => n.path !== path));
  }
}
