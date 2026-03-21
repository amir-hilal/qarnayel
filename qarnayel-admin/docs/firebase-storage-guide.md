# Firebase Storage Guide

## Overview

Firebase Storage is used to store all media files (images) for the Qarnayel admin dashboard. One Storage bucket is shared across environments.

## Storage bucket

The bucket is identified by `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`. It is the same bucket for both `staging` and `production` environments. Content from both environments ends up in the same bucket.

## Upload path conventions

All files follow a structured path convention:

```
{collection}/{documentId}/{filename}
```

### Examples

```
places/abc123/hero.jpg
places/abc123/interior-1.jpg
media/uploads/site-logo.png
```

### Filename rules

- Use lowercase, hyphen-separated filenames
- Include a short unique suffix to prevent collisions (e.g. timestamp or nanoid)
- Preserve original file extension
- Do not use spaces or special characters in filenames

### Path helper

Use `buildStoragePath(collection, documentId, filename)` from `features/media/utils/index.ts` to generate upload paths consistently.

## Media metadata in Firestore

After uploading a file to Storage, always store a metadata record in the `media` Firestore collection:

```ts
type MediaAsset = {
  id: string;
  storagePath: string;   // The Storage path used to upload
  downloadUrl: string;   // The public download URL from getDownloadURL()
  altText?: { ar: string; en: string };
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  uploadedAt: string;    // ISO string
  uploadedBy?: string;   // Firebase UID
};
```

This decouples Storage paths from Firestore references and enables media browsing.

## Referencing media in place documents

When a media file is attached to a place, embed a `MediaReference` in the `place.images` array:

```ts
type MediaReference = {
  storagePath: string;
  downloadUrl: string;
  altText?: { ar: string; en: string };
  width?: number;
  height?: number;
};
```

`downloadUrl` is the public download URL returned by `getDownloadURL()`.

## Upload workflow

1. User selects a file in the `UploadZone` component
2. Component calls a repository function (not Firebase SDK directly)
3. `media.repository.ts` uploads the file to Storage using the correct path
4. After upload, `getDownloadURL()` retrieves the public URL
5. `media.repository.ts` creates a metadata record in the `media` Firestore collection
6. The `MediaReference` is returned to the form caller
7. The form embeds the reference in the images array

```
UI Component → media.repository.createMediaAsset(file, context)
  → uploadBytes(storageRef, file)
  → getDownloadURL(storageRef)
  → addDoc(mediaCollection(), metadataRecord)
  → returns MediaReference
```

## Deleting media

- Deleting a media asset removes both the Storage file and the Firestore metadata record
- Always check that the media is not referenced by any active documents before deleting
- TODO: Implement reference counting or soft-delete for safe media removal

## Security rules

- Storage bucket rules must allow only authenticated admin users to write
- Public read access is required so download URLs work on the public website
- See `docs/security-rules-plan.md` for the rule design

## File size limits

- Maximum image upload size: 10 MB (enforced client-side before upload)
- Accepted MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`
- Validate MIME type and size in the repository before calling `uploadBytes`
