import {
  toPageContent,
  toSiteSettings,
} from '@/features/pages/mappers/page.mapper';
import type { PageContent, SiteSettings } from '@/features/pages/types';
import {
  pageContentCollection,
  pageContentDoc,
  siteSettingsDoc,
} from '@/lib/firebase/collections';
import { getDoc, getDocs, limit, query, where } from 'firebase/firestore';

// ---------------------------------------------------------------------------
// fetchPageContent — fetch a static page by slug (e.g. 'history', 'contact')
// ---------------------------------------------------------------------------
export async function fetchPageContent(
  slug: string,
): Promise<PageContent | null> {
  try {
    const q = query(
      pageContentCollection(),
      where('slug', '==', slug),
      limit(1),
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const firstDoc = snap.docs[0];
    if (!firstDoc) return null;
    return toPageContent(
      firstDoc.id,
      firstDoc.data() as Record<string, unknown>,
    );
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `[pages.repository] fetchPageContent("${slug}") failed`,
        err,
      );
    }
    return null;
  }
}

// ---------------------------------------------------------------------------
// fetchPublishedPageBySlug — fetch a published page by slug using doc ID lookup.
// Used by the dynamic [slug] route for admin-created pages.
// Only returns the page if status === 'published'.
// ---------------------------------------------------------------------------
export async function fetchPublishedPageBySlug(
  slug: string,
): Promise<PageContent | null> {
  try {
    const snap = await getDoc(pageContentDoc(slug));
    if (!snap.exists()) return null;
    const raw = snap.data() as Record<string, unknown>;
    // Filter unpublished pages at the data level (FE schema omits status field)
    if (raw['status'] !== 'published') return null;
    return toPageContent(snap.id, raw);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `[pages.repository] fetchPublishedPageBySlug("${slug}") failed`,
        err,
      );
    }
    return null;
  }
}

// ---------------------------------------------------------------------------
// fetchSiteSettings — fetch the global site settings document
// ---------------------------------------------------------------------------
export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  try {
    const snap = await getDoc(siteSettingsDoc());
    if (!snap.exists()) return null;
    return toSiteSettings(snap.data() as Record<string, unknown>);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[pages.repository] fetchSiteSettings failed', err);
    }
    return null;
  }
}
