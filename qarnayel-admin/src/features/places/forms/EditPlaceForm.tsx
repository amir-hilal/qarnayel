'use client';

import { ADMIN_ROUTES } from '@/config/routes';
import {
  ALL_CONTACT_MODES,
  ALL_PLACE_CATEGORIES,
  ALL_PLACE_TYPES,
} from '@/features/places/constants';
import {
  setPlaceStatus,
  updatePlace,
} from '@/features/places/repositories/places.repository';
import { placeFormSchema } from '@/features/places/schemas/place.schema';
import { useToast } from '@/features/shared/components/Toast/Toast';
import { ConfirmDialog } from '@/features/shared/forms/ConfirmDialog/ConfirmDialog';
import { FormSection } from '@/features/shared/forms/FormSection/FormSection';
import { LocalizedTextField } from '@/features/shared/forms/LocalizedTextField';
import { LocalizedTextareaField } from '@/features/shared/forms/LocalizedTextareaField';
import { StatusSelect } from '@/features/shared/forms/StatusSelect';
import { ValidationSummary } from '@/features/shared/forms/ValidationSummary';
import { checkPlaceTranslationCompleteness } from '@/features/shared/validation/translation-completeness';
import type { Place, PlaceFormValues, PublishStatus } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

// =============================================================================
// EditPlaceForm — edit an existing place document
// =============================================================================

interface EditPlaceFormProps {
  place: Place;
}

export function EditPlaceForm({ place }: EditPlaceFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [translationErrors, setTranslationErrors] = useState<string[]>([]);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);

  const defaultValues: PlaceFormValues = {
    slug: place.slug,
    placeType: place.placeType,
    category: place.category,
    contactMode: place.contactMode,
    status: place.status,
    featured: place.featured,
    title: place.title,
    subtitle: place.subtitle ?? { ar: '', en: '' },
    shortDescription: place.shortDescription,
    description: place.description,
    seo: place.seo ?? {
      ar: { title: '', description: '' },
      en: { title: '', description: '' },
    },
    contact: place.contact ?? {},
    location: place.location ?? {},
    images: place.images ?? [],
    resources: place.resources ?? [],
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PlaceFormValues>({
    resolver: zodResolver(placeFormSchema),
    defaultValues,
  });

  const status = watch('status');

  async function onSubmit(values: PlaceFormValues) {
    if (values.status === 'published') {
      const check = checkPlaceTranslationCompleteness(values);
      if (!check.isComplete) {
        setTranslationErrors(check.missingFields);
        return;
      }
    }
    setTranslationErrors([]);
    setSaving(true);
    try {
      await updatePlace(place.id, values);
      toast('Place updated successfully.', 'success');
      router.refresh();
    } catch {
      toast('Failed to update place. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleArchive() {
    setShowArchiveDialog(false);
    setSaving(true);
    try {
      await setPlaceStatus(place.id, 'archived');
      toast('Place archived.', 'success');
      router.push(ADMIN_ROUTES.PLACES);
    } catch {
      toast('Failed to archive place.', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <ValidationSummary errors={translationErrors} />

        {/* Identity */}
        <div
          className="admin-card"
          style={{ marginBlockEnd: 'var(--space-6)' }}
        >
          <div className="admin-card__body">
            <FormSection
              title="Identity"
              description="Slug, type, and classification."
            >
              <div className="form-section__grid">
                <div className="form-field">
                  <label
                    htmlFor="slug"
                    className="form-field__label form-field__label--required"
                  >
                    Slug
                  </label>
                  <input
                    id="slug"
                    {...register('slug')}
                    className={`form-field__input${errors.slug ? ' form-field__input--error' : ''}`}
                  />
                  {errors.slug && (
                    <p className="form-field__error">{errors.slug.message}</p>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="placeType" className="form-field__label">
                    Place type
                  </label>
                  <select
                    id="placeType"
                    {...register('placeType')}
                    className="form-field__select"
                  >
                    {ALL_PLACE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="category" className="form-field__label">
                    Category
                  </label>
                  <select
                    id="category"
                    {...register('category')}
                    className="form-field__select"
                  >
                    {ALL_PLACE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="contactMode" className="form-field__label">
                    Contact mode
                  </label>
                  <select
                    id="contactMode"
                    {...register('contactMode')}
                    className="form-field__select"
                  >
                    {ALL_CONTACT_MODES.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="status" className="form-field__label">
                    Status
                  </label>
                  <StatusSelect
                    id="status"
                    value={status}
                    onChange={(s: PublishStatus) => setValue('status', s)}
                  />
                </div>

                <div
                  className="form-field"
                  style={{ justifyContent: 'flex-end' }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      cursor: 'pointer',
                    }}
                  >
                    <input type="checkbox" {...register('featured')} />
                    <span
                      className="form-field__label"
                      style={{ marginBlockEnd: 0 }}
                    >
                      Featured on homepage
                    </span>
                  </label>
                </div>
              </div>
            </FormSection>
          </div>
        </div>

        {/* Content */}
        <div
          className="admin-card"
          style={{ marginBlockEnd: 'var(--space-6)' }}
        >
          <div className="admin-card__body">
            <FormSection
              title="Content"
              description="Both Arabic and English are required before publishing."
            >
              <LocalizedTextField
                label="Title"
                required
                arField={register('title.ar')}
                enField={register('title.en')}
                arError={errors.title?.ar?.message}
                enError={errors.title?.en?.message}
              />
              <LocalizedTextField
                label="Subtitle"
                arField={register('subtitle.ar')}
                enField={register('subtitle.en')}
              />
              <LocalizedTextareaField
                label="Short description"
                required
                rows={3}
                arField={register('shortDescription.ar')}
                enField={register('shortDescription.en')}
                arError={errors.shortDescription?.ar?.message}
                enError={errors.shortDescription?.en?.message}
              />
              <LocalizedTextareaField
                label="Full description"
                required
                rows={6}
                arField={register('description.ar')}
                enField={register('description.en')}
                arError={errors.description?.ar?.message}
                enError={errors.description?.en?.message}
              />
            </FormSection>
          </div>
        </div>

        {/* SEO */}
        <div
          className="admin-card"
          style={{ marginBlockEnd: 'var(--space-6)' }}
        >
          <div className="admin-card__body">
            <FormSection title="SEO">
              <LocalizedTextField
                label="Meta title"
                arField={register('seo.ar.title')}
                enField={register('seo.en.title')}
              />
              <LocalizedTextareaField
                label="Meta description"
                rows={3}
                arField={register('seo.ar.description')}
                enField={register('seo.en.description')}
              />
            </FormSection>
          </div>
        </div>

        <div className="form-actions">
          <div className="form-actions__left">
            {place.status !== 'archived' && (
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setShowArchiveDialog(true)}
                disabled={saving}
              >
                Archive
              </button>
            )}
          </div>
          <div className="form-actions__right">
            <button
              type="submit"
              className="btn btn--primary"
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </form>

      <ConfirmDialog
        isOpen={showArchiveDialog}
        title="Archive place?"
        message="This place will no longer appear on the public website. You can restore it later by changing its status."
        confirmLabel="Archive"
        isDangerous
        onConfirm={handleArchive}
        onCancel={() => setShowArchiveDialog(false)}
      />
    </>
  );
}
