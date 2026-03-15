import { DOCUMENT_IDS } from '@/config/collections';
import { toSiteSettings } from '@/features/settings/mappers/settings.mapper';
import { siteSettingsDoc } from '@/lib/firebase/collections';
import type { SiteSettings, SiteSettingsFormValues } from '@/types';
import { getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

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
