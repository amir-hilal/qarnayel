'use client';

import {
  ACCEPTED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
} from '@/features/media/utils';
import {
  deletePlaceImage,
  uploadPlaceImage,
} from '@/features/places/repositories/place-images.repository';
import type { MediaReference } from '@/types';
import { useRef, useState } from 'react';

// =============================================================================
// PlaceImagePicker — hero image picker + gallery management
//
// Hero slot (images[0]): profile-style square with hover overlay + edit icon.
// Gallery (images[1+]): compact thumbnail strip with per-image delete.
// =============================================================================

// --- SVG icons (Material Icons, inlined) ------------------------------------ //

function EditIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="26"
      viewBox="0 0 24 24"
      width="26"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.9959.9959 0 0 0 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    </svg>
  );
}

function AddPhotoIcon({ size = 36 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z" />
    </svg>
  );
}

// --- Static empty state (new-place form, not yet saved) --------------------- //

export function PlaceImagePickerEmpty() {
  return (
    <div
      style={{
        width: 180,
        height: 180,
        borderRadius: 'var(--radius-xl)',
        border: '2px dashed var(--color-border-strong)',
        background: 'var(--color-surface)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        color: 'var(--color-text-muted)',
        opacity: 0.55,
        userSelect: 'none',
      }}
    >
      <AddPhotoIcon size={36} />
      <span
        style={{
          fontSize: 'var(--font-size-xs)',
          fontWeight: 'var(--font-weight-medium)',
          textAlign: 'center',
          paddingInline: 'var(--space-3)',
          lineHeight: 'var(--line-height-tight)',
        }}
      >
        Save first to
        <br />
        add images
      </span>
    </div>
  );
}

// --- Main interactive component --------------------------------------------- //

interface PlaceImagePickerProps {
  placeId: string;
  images: MediaReference[];
  onChange: (images: MediaReference[]) => void;
}

export function PlaceImagePicker({
  placeId,
  images,
  onChange,
}: PlaceImagePickerProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [heroHovered, setHeroHovered] = useState(false);
  const [deletingGalleryIndex, setDeletingGalleryIndex] = useState<
    number | null
  >(null);

  const heroInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const heroImage = images[0] ?? null;
  const galleryImages = images.slice(1);

  // -------------------------------------------------------------------------

  function validateFile(file: File): string | null {
    if (
      !ACCEPTED_MIME_TYPES.includes(
        file.type as (typeof ACCEPTED_MIME_TYPES)[number],
      )
    ) {
      return 'File must be JPEG, PNG, or WebP.';
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return 'File must be under 10 MB.';
    }
    return null;
  }

  async function handleHeroFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (e.target) e.target.value = '';
    if (!file) return;

    const err = validateFile(file);
    if (err) {
      setUploadError(err);
      return;
    }

    setUploadError(null);
    setUploading(true);
    try {
      const newRef = await uploadPlaceImage(placeId, file);

      // Delete the old hero from Storage (best-effort)
      if (heroImage) {
        try {
          await deletePlaceImage(heroImage.storagePath);
        } catch {}
      }

      onChange([
        {
          ...newRef,
          // Preserve existing alt text when replacing hero
          altText: heroImage?.altText ?? { ar: '', en: '' },
        },
        ...galleryImages,
      ]);
    } catch {
      setUploadError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  async function handleGalleryFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];
    if (e.target) e.target.value = '';
    if (!file) return;

    const err = validateFile(file);
    if (err) {
      setUploadError(err);
      return;
    }

    setUploadError(null);
    setUploading(true);
    try {
      const newRef = await uploadPlaceImage(placeId, file);
      onChange([...images, newRef]);
    } catch {
      setUploadError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteGalleryImage(galleryIndex: number) {
    setDeletingGalleryIndex(galleryIndex);
    const img = images[galleryIndex + 1];
    if (img) {
      try {
        await deletePlaceImage(img.storagePath);
      } catch {}
    }
    onChange(images.filter((_, i) => i !== galleryIndex + 1));
    setDeletingGalleryIndex(null);
  }

  function handleHeroAltChange(locale: 'ar' | 'en', value: string) {
    if (!heroImage) return;
    onChange([
      {
        ...heroImage,
        altText: {
          ...(heroImage.altText ?? { ar: '', en: '' }),
          [locale]: value,
        },
      },
      ...galleryImages,
    ]);
  }

  function handleGalleryAltChange(
    galleryIndex: number,
    locale: 'ar' | 'en',
    value: string,
  ) {
    onChange(
      images.map((img, i) => {
        if (i !== galleryIndex + 1) return img;
        return {
          ...img,
          altText: { ...(img.altText ?? { ar: '', en: '' }), [locale]: value },
        };
      }),
    );
  }

  // -------------------------------------------------------------------------

  return (
    <div>
      {/* --- Hero picker + alt text --- */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-6)',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        {/* Hero square */}
        <div style={{ flexShrink: 0 }}>
          <button
            type="button"
            disabled={uploading}
            onClick={() => heroInputRef.current?.click()}
            onMouseEnter={() => setHeroHovered(true)}
            onMouseLeave={() => setHeroHovered(false)}
            aria-label={heroImage ? 'Change hero image' : 'Add hero image'}
            style={{
              position: 'relative',
              width: 180,
              height: 180,
              borderRadius: 'var(--radius-xl)',
              border: heroImage
                ? '1px solid var(--color-border)'
                : '2px dashed var(--color-border-strong)',
              background: heroImage
                ? 'var(--color-surface)'
                : 'var(--color-surface)',
              overflow: 'hidden',
              cursor: uploading ? 'wait' : 'pointer',
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-2)',
              color: 'var(--color-text-muted)',
              transition: 'border-color 0.15s',
            }}
          >
            {heroImage ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroImage.downloadUrl}
                  alt={heroImage.altText?.en ?? ''}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                {/* Hover / uploading overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.48)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    opacity: heroHovered || uploading ? 1 : 0,
                    transition: 'opacity 0.18s ease',
                    pointerEvents: 'none',
                  }}
                >
                  {uploading ? (
                    <span style={{ fontSize: 'var(--font-size-sm)' }}>
                      Uploading…
                    </span>
                  ) : (
                    <EditIcon />
                  )}
                </div>
              </>
            ) : uploading ? (
              <span style={{ fontSize: 'var(--font-size-sm)' }}>
                Uploading…
              </span>
            ) : (
              <>
                <AddPhotoIcon size={36} />
                <span
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    textAlign: 'center',
                    paddingInline: 'var(--space-3)',
                    lineHeight: 'var(--line-height-tight)',
                  }}
                >
                  Add hero image
                </span>
              </>
            )}
          </button>
        </div>

        {/* Alt text — visible once a hero exists */}
        {heroImage && (
          <div
            style={{
              flex: 1,
              minWidth: 200,
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
              paddingBlockStart: 'var(--space-1)',
            }}
          >
            <p
              style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text)',
                margin: 0,
              }}
            >
              Hero image alt text
            </p>
            <div className="form-field">
              <label className="form-field__label">Alt text — Arabic</label>
              <input
                type="text"
                className="form-field__input"
                dir="rtl"
                lang="ar"
                value={heroImage.altText?.ar ?? ''}
                onChange={(e) => handleHeroAltChange('ar', e.target.value)}
                placeholder="وصف الصورة بالعربية"
              />
            </div>
            <div className="form-field">
              <label className="form-field__label">Alt text — English</label>
              <input
                type="text"
                className="form-field__input"
                value={heroImage.altText?.en ?? ''}
                onChange={(e) => handleHeroAltChange('en', e.target.value)}
                placeholder="Describe the image in English"
              />
            </div>
          </div>
        )}
      </div>

      {/* Hidden hero file input */}
      <input
        ref={heroInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
        onChange={handleHeroFileChange}
      />

      {/* Upload error */}
      {uploadError && (
        <p
          className="form-field__error"
          style={{ marginBlockStart: 'var(--space-3)' }}
        >
          {uploadError}
        </p>
      )}

      {/* --- Gallery strip --- */}
      {heroImage && (
        <div
          style={{
            marginBlockStart: 'var(--space-5)',
            paddingBlockStart: 'var(--space-5)',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <p
            style={{
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text)',
              marginBlockEnd: 'var(--space-3)',
            }}
          >
            Gallery
          </p>
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-3)',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
            }}
          >
            {galleryImages.map((img, gi) => (
              <div
                key={img.storagePath}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-2)',
                  width: 96,
                }}
              >
                {/* Thumbnail with delete */}
                <div style={{ position: 'relative' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.downloadUrl}
                    alt={img.altText?.en ?? ''}
                    style={{
                      width: 96,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-md)',
                      display: 'block',
                      border: '1px solid var(--color-border)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteGalleryImage(gi)}
                    disabled={deletingGalleryIndex === gi}
                    aria-label="Delete image"
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: 'rgba(0, 0, 0, 0.65)',
                      color: '#ffffff',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      lineHeight: 1,
                      padding: 0,
                    }}
                  >
                    {deletingGalleryIndex === gi ? '…' : '✕'}
                  </button>
                </div>
                {/* Compact alt inputs */}
                <input
                  type="text"
                  className="form-field__input"
                  dir="rtl"
                  lang="ar"
                  value={img.altText?.ar ?? ''}
                  onChange={(e) =>
                    handleGalleryAltChange(gi, 'ar', e.target.value)
                  }
                  placeholder="AR alt"
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    padding: 'var(--space-1) var(--space-2)',
                  }}
                />
                <input
                  type="text"
                  className="form-field__input"
                  value={img.altText?.en ?? ''}
                  onChange={(e) =>
                    handleGalleryAltChange(gi, 'en', e.target.value)
                  }
                  placeholder="EN alt"
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    padding: 'var(--space-1) var(--space-2)',
                  }}
                />
              </div>
            ))}

            {/* Add gallery image button */}
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              disabled={uploading}
              style={{
                width: 96,
                height: 80,
                borderRadius: 'var(--radius-md)',
                border: '2px dashed var(--color-border)',
                background: 'var(--color-surface)',
                cursor: uploading ? 'wait' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-1)',
                color: 'var(--color-text-muted)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-medium)',
                transition: 'border-color 0.15s',
              }}
            >
              <span style={{ fontSize: 20, lineHeight: 1 }}>+</span>
              Add
            </button>
          </div>

          {/* Hidden gallery file input */}
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={handleGalleryFileChange}
          />
        </div>
      )}
    </div>
  );
}
