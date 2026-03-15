import { storage } from '@/lib/firebase/client';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
  type UploadResult,
} from 'firebase/storage';

// =============================================================================
// Storage helper utilities
// Keep all Firebase Storage SDK calls here — never use them in components.
// =============================================================================

/**
 * Upload a file to Firebase Storage at the given path.
 * Returns the download URL after upload.
 */
export async function uploadFile(
  storagePath: string,
  file: File,
): Promise<{
  storagePath: string;
  downloadUrl: string;
  uploadResult: UploadResult;
}> {
  const storageRef = ref(storage, storagePath);
  const uploadResult = await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(uploadResult.ref);
  return { storagePath, downloadUrl, uploadResult };
}

/**
 * Get the download URL for an existing storage path.
 */
export async function getFileDownloadUrl(storagePath: string): Promise<string> {
  const storageRef = ref(storage, storagePath);
  return getDownloadURL(storageRef);
}

/**
 * Delete a file from Firebase Storage by path.
 */
export async function deleteFile(storagePath: string): Promise<void> {
  const storageRef = ref(storage, storagePath);
  await deleteObject(storageRef);
}
