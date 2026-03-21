import { buildStoragePath } from '@/features/media/utils';
import { deleteFile, uploadFile } from '@/lib/firebase/storage';
import type { MediaReference } from '@/types';

// =============================================================================
// Place images repository — Storage upload/delete for place images
//
// All Firebase Storage calls for place images live here.
// Components and forms must never import from lib/firebase/storage directly.
// =============================================================================

/**
 * Upload an image file for a place and return a MediaReference.
 * Caller is responsible for updating Firestore (via updatePlace) after upload.
 */
export async function uploadPlaceImage(
  placeId: string,
  file: File,
): Promise<MediaReference> {
  const safeName = `${Date.now()}-${file.name.toLowerCase().replace(/\s+/g, '-')}`;
  const storagePath = buildStoragePath('places', placeId, safeName);
  const { downloadUrl } = await uploadFile(storagePath, file);
  return {
    storagePath,
    downloadUrl,
    altText: { ar: '', en: '' },
  };
}

/**
 * Delete a place image from Storage by its storage path.
 * This is best-effort — callers should not throw if this fails.
 */
export async function deletePlaceImage(storagePath: string): Promise<void> {
  await deleteFile(storagePath);
}
