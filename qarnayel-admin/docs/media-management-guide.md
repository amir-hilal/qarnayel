# Media Management Guide

## Overview

The media manager handles image uploads and media metadata for the Qarnayel admin dashboard.

## Uploading images

1. Navigate to **Media** in the sidebar, or use the Media section inside a place form
2. Drag and drop an image or click **Upload Image**
3. Supported formats: JPEG, PNG, WebP
4. Maximum file size: 10 MB

## Storage paths

Images are stored in Firebase Storage following this convention:

```
{collection}/{documentId}/{filename}
```

Examples:
- `places/abc123/hero-photo.jpg`
- `places/abc123/interior-view.webp`
- `media/uploads/general-photo.jpg`

Use the `buildStoragePath()` helper from `features/media/utils/` to generate paths — never construct storage paths manually.

## Alt text

Every image should have alt text in both Arabic and English for accessibility and SEO. Fill in the alt text fields when uploading.

## Deleting images

1. Find the image in the Media manager
2. Click **Delete**
3. Confirm the action in the dialog
4. The image is removed from Firebase Storage and the metadata record is removed from Firestore
5. Any places referencing this image will have a broken image reference — check and update affected places

## Attaching images to places

When editing a place, scroll to the **Media** section:
1. Click **+ Add Image**
2. Choose from the media library or upload a new image
3. Images can be reordered (first image is used as the main photo)
4. Each image can have its own alt text override

## Technical notes

- Upload logic lives in `features/media/repositories/media.repository.ts`
- Never call Firebase Storage SDK methods directly from components
- `downloadUrl` is stored permanently in Firestore — it does not expire
- If a storage path changes (e.g. file moved), the `downloadUrl` must be updated
- Metadata is stored in the `media` Firestore collection

## File naming conventions

- Use lowercase, hyphen-separated names
- Include a unique suffix to prevent naming conflicts (e.g. `beach-view-20241201.jpg`)
- Do not use spaces, special characters, or Arabic text in filenames
- Filenames are for storage organisation only — use alt text for human-readable descriptions
