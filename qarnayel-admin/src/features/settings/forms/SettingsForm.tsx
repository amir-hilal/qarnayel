'use client';

import { saveSiteSettings } from '@/features/settings/repositories/settings.repository';
import { siteSettingsFormSchema } from '@/features/settings/schemas/settings.schema';
import { useToast } from '@/features/shared/components/Toast';
import { FormSection } from '@/features/shared/forms/FormSection';
import { LocalizedTextField } from '@/features/shared/forms/LocalizedTextField';
import { LocalizedTextareaField } from '@/features/shared/forms/LocalizedTextareaField';
import type { SiteSettings, SiteSettingsFormValues } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

// =============================================================================
// SettingsForm — view/edit the singleton site settings document
// =============================================================================

interface SettingsFormProps {
  initialData: SiteSettings | null;
}

const DEFAULT_VALUES: SiteSettingsFormValues = {
  siteName: { ar: '', en: '' },
  tagline: { ar: '', en: '' },
  contactEmail: '',
  contactPhone: '',
  socialLinks: { facebook: '', instagram: '', youtube: '' },
};

export function SettingsForm({ initialData }: SettingsFormProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const defaultValues: SiteSettingsFormValues = initialData
    ? {
        siteName: initialData.siteName,
        tagline: initialData.tagline ?? { ar: '', en: '' },
        contactEmail: initialData.contactEmail ?? '',
        contactPhone: initialData.contactPhone ?? '',
        socialLinks: initialData.socialLinks ?? {
          facebook: '',
          instagram: '',
          youtube: '',
        },
      }
    : DEFAULT_VALUES;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsFormSchema),
    defaultValues,
  });

  async function onSubmit(values: SiteSettingsFormValues) {
    setSaving(true);
    try {
      await saveSiteSettings(values);
      toast('Settings saved successfully.', 'success');
    } catch {
      toast('Failed to save settings.', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="admin-card" style={{ marginBlockEnd: 'var(--space-6)' }}>
        <div className="admin-card__body">
          <FormSection
            title="Site identity"
            description="Bilingual name and tagline for the public website."
          >
            <LocalizedTextField
              label="Site name"
              required
              arField={register('siteName.ar')}
              enField={register('siteName.en')}
              arError={errors.siteName?.ar?.message}
              enError={errors.siteName?.en?.message}
            />
            <LocalizedTextareaField
              label="Tagline"
              rows={3}
              arField={register('tagline.ar')}
              enField={register('tagline.en')}
            />
          </FormSection>
        </div>
      </div>

      <div className="admin-card" style={{ marginBlockEnd: 'var(--space-6)' }}>
        <div className="admin-card__body">
          <FormSection
            title="Contact"
            description="Global contact details shown across the public site."
          >
            <div className="form-section__grid">
              <div className="form-field">
                <label htmlFor="contactEmail" className="form-field__label">
                  Contact email
                </label>
                <input
                  id="contactEmail"
                  type="email"
                  {...register('contactEmail')}
                  className="form-field__input"
                />
                {errors.contactEmail && (
                  <p className="form-field__error">
                    {errors.contactEmail.message}
                  </p>
                )}
              </div>
              <div className="form-field">
                <label htmlFor="contactPhone" className="form-field__label">
                  Contact phone
                </label>
                <input
                  id="contactPhone"
                  type="tel"
                  {...register('contactPhone')}
                  className="form-field__input"
                />
              </div>
            </div>
          </FormSection>
        </div>
      </div>

      <div className="admin-card" style={{ marginBlockEnd: 'var(--space-6)' }}>
        <div className="admin-card__body">
          <FormSection title="Social links">
            <div className="form-section__grid">
              <div className="form-field">
                <label htmlFor="facebook" className="form-field__label">
                  Facebook URL
                </label>
                <input
                  id="facebook"
                  type="url"
                  {...register('socialLinks.facebook')}
                  className="form-field__input"
                />
              </div>
              <div className="form-field">
                <label htmlFor="instagram" className="form-field__label">
                  Instagram URL
                </label>
                <input
                  id="instagram"
                  type="url"
                  {...register('socialLinks.instagram')}
                  className="form-field__input"
                />
              </div>
              <div className="form-field">
                <label htmlFor="youtube" className="form-field__label">
                  YouTube URL
                </label>
                <input
                  id="youtube"
                  type="url"
                  {...register('socialLinks.youtube')}
                  className="form-field__input"
                />
              </div>
            </div>
          </FormSection>
        </div>
      </div>

      <div className="form-actions">
        <div className="form-actions__left" />
        <div className="form-actions__right">
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save settings'}
          </button>
        </div>
      </div>
    </form>
  );
}
