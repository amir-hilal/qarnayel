import { toPageContent } from '@/features/pages/mappers/page.mapper';
import type {
  PageContent,
  PageContentFormValues,
} from '@/features/pages/types';
import {
  pageContentCollection,
  pageContentDoc,
} from '@/lib/firebase/collections';
import {
  deleteDoc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

// =============================================================================
// Pages repository — all Firestore read/write for the page_content collection
// =============================================================================

// ---------------------------------------------------------------------------
// Read operations
// ---------------------------------------------------------------------------

/**
 * Fetch all page content documents.
 */
export async function fetchAllPageContent(): Promise<PageContent[]> {
  try {
    const q = query(pageContentCollection(), orderBy('updatedAt', 'desc'));
    const snap = await getDocs(q);

    return snap.docs
      .map((d) => toPageContent(d.id, d.data() as Record<string, unknown>))
      .filter((p): p is PageContent => p !== null);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[pages.repository] fetchAllPageContent failed', err);
    }
    return [];
  }
}

/**
 * Fetch a single page content document by its slug (document ID).
 */
export async function fetchPageContentBySlug(
  slug: string,
): Promise<PageContent | null> {
  try {
    const snap = await getDoc(pageContentDoc(slug));
    if (!snap.exists()) return null;
    return toPageContent(snap.id, snap.data() as Record<string, unknown>);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `[pages.repository] fetchPageContentBySlug("${slug}") failed`,
        err,
      );
    }
    return null;
  }
}

// ---------------------------------------------------------------------------
// Write operations
// ---------------------------------------------------------------------------

/**
 * Create or fully overwrite a page content document.
 * The document ID is the page slug.
 */
export async function upsertPageContent(
  slug: string,
  data: PageContentFormValues,
): Promise<void> {
  await setDoc(pageContentDoc(slug), {
    ...data,
    slug,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Create a new page content document. Throws if a document with the given slug
 * already exists, preventing accidental overwrites.
 */
export async function createPageContent(
  slug: string,
  data: PageContentFormValues,
): Promise<void> {
  const existing = await getDoc(pageContentDoc(slug));
  if (existing.exists()) {
    throw new Error(`A page with slug "${slug}" already exists.`);
  }
  await setDoc(pageContentDoc(slug), {
    ...data,
    slug,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Partially update a page content document.
 */
export async function updatePageContent(
  slug: string,
  data: Partial<PageContentFormValues>,
): Promise<void> {
  await updateDoc(pageContentDoc(slug), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Set the status of a page content document.
 */
export async function setPageContentStatus(
  slug: string,
  status: 'draft' | 'published' | 'archived',
): Promise<void> {
  await updateDoc(pageContentDoc(slug), {
    status,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Permanently delete a page content document.
 */
export async function deletePageContent(slug: string): Promise<void> {
  await deleteDoc(pageContentDoc(slug));
}
