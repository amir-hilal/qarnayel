import { toHistoryEntry } from '@/features/history/mappers/history.mapper';
import type {
  HistoryEntry,
  HistoryEntryFormValues,
} from '@/features/history/types';
import { historyCollection, historyDoc } from '@/lib/firebase/collections';
import {
  addDoc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

// =============================================================================
// History repository — all Firestore read/write for the history collection
// =============================================================================

// ---------------------------------------------------------------------------
// Read operations
// ---------------------------------------------------------------------------

/**
 * Fetch all history entries ordered by period start (descending).
 */
export async function fetchAllHistoryEntries(): Promise<HistoryEntry[]> {
  try {
    const q = query(historyCollection(), orderBy('updatedAt', 'desc'));
    const snap = await getDocs(q);

    return snap.docs
      .map((d) => toHistoryEntry(d.id, d.data() as Record<string, unknown>))
      .filter((e): e is HistoryEntry => e !== null);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[history.repository] fetchAllHistoryEntries failed', err);
    }
    return [];
  }
}

/**
 * Fetch a single history entry by ID.
 */
export async function fetchHistoryEntryById(
  id: string,
): Promise<HistoryEntry | null> {
  try {
    const snap = await getDoc(historyDoc(id));
    if (!snap.exists()) return null;
    return toHistoryEntry(snap.id, snap.data() as Record<string, unknown>);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `[history.repository] fetchHistoryEntryById("${id}") failed`,
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
 * Create a new history entry document. Returns the new document ID.
 */
export async function createHistoryEntry(
  data: HistoryEntryFormValues,
): Promise<string> {
  const docRef = await addDoc(historyCollection(), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Update an existing history entry document.
 */
export async function updateHistoryEntry(
  id: string,
  data: Partial<HistoryEntryFormValues>,
): Promise<void> {
  await updateDoc(historyDoc(id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Set the status of a history entry.
 */
export async function setHistoryEntryStatus(
  id: string,
  status: 'draft' | 'published' | 'archived',
): Promise<void> {
  await updateDoc(historyDoc(id), {
    status,
    updatedAt: serverTimestamp(),
  });
}
