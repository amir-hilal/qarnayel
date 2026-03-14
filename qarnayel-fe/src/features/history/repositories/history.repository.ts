import { query, where, getDocs, orderBy } from 'firebase/firestore';
import { historyCollection } from '@/lib/firebase/collections';
import { PUBLISH_STATUS } from '@/config/constants';
import { toHistoryEntry } from '@/features/history/mappers/history.mapper';
import type { HistoryEntry } from '@/features/history/types';

// ---------------------------------------------------------------------------
// fetchPublishedHistory — returns all published history entries, ordered
// ---------------------------------------------------------------------------
export async function fetchPublishedHistory(): Promise<HistoryEntry[]> {
  try {
    const q = query(
      historyCollection(),
      where('status', '==', PUBLISH_STATUS.PUBLISHED),
      orderBy('order', 'asc'),
    );
    const snap = await getDocs(q);

    return snap.docs
      .map(d => toHistoryEntry(d.id, d.data() as Record<string, unknown>))
      .filter((h): h is HistoryEntry => h !== null);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[history.repository] fetchPublishedHistory failed', err);
    }
    return [];
  }
}
