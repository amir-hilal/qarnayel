import { toMediaAsset } from '@/features/media/mappers/media.mapper';
import type { MediaAsset } from '@/features/media/types';
import { mediaCollection, mediaDoc } from '@/lib/firebase/collections';
import {
  addDoc,
  deleteDoc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

// =============================================================================
// Media repository — all Firestore read/write for the media collection
// =============================================================================

// ---------------------------------------------------------------------------
// Read operations
// ---------------------------------------------------------------------------

/**
 * Fetch all media assets ordered by upload date (newest first).
 */
export async function fetchAllMediaAssets(): Promise<MediaAsset[]> {
  try {
    const q = query(mediaCollection(), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);

    return snap.docs
      .map((d) => toMediaAsset(d.id, d.data() as Record<string, unknown>))
      .filter((m): m is MediaAsset => m !== null);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[media.repository] fetchAllMediaAssets failed', err);
    }
    return [];
  }
}

/**
 * Fetch a single media asset by ID.
 */
export async function fetchMediaAssetById(
  id: string,
): Promise<MediaAsset | null> {
  try {
    const snap = await getDoc(mediaDoc(id));
    if (!snap.exists()) return null;
    return toMediaAsset(snap.id, snap.data() as Record<string, unknown>);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `[media.repository] fetchMediaAssetById("${id}") failed`,
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
 * Register a new media asset in Firestore after uploading to Storage.
 * Returns the new document ID.
 */
export async function createMediaRecord(
  asset: Omit<MediaAsset, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<string> {
  const docRef = await addDoc(mediaCollection(), {
    ...asset,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Update the metadata of an existing media asset.
 */
export async function updateMediaRecord(
  id: string,
  data: Partial<Pick<MediaAsset, 'altText' | 'storagePath' | 'downloadUrl'>>,
): Promise<void> {
  await updateDoc(mediaDoc(id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete the Firestore record for a media asset.
 * The caller is responsible for also deleting the Storage file.
 */
export async function deleteMediaRecord(id: string): Promise<void> {
  await deleteDoc(mediaDoc(id));
}
