import { query, where, getDocs, getDoc, limit } from 'firebase/firestore';
import { pageContentCollection, siteSettingsDoc } from '@/lib/firebase/collections';
import { toPageContent, toSiteSettings } from '@/features/pages/mappers/page.mapper';
import type { PageContent, SiteSettings } from '@/features/pages/types';

// ---------------------------------------------------------------------------
// fetchPageContent — fetch a static page by slug (e.g. 'about', 'contact')
// ---------------------------------------------------------------------------
export async function fetchPageContent(slug: string): Promise<PageContent | null> {
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
    return toPageContent(firstDoc.id, firstDoc.data() as Record<string, unknown>);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[pages.repository] fetchPageContent("${slug}") failed`, err);
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
