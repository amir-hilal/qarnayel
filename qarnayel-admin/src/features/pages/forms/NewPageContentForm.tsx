'use client';

import { ADMIN_ROUTES } from '@/config/routes';
import { createPageContent } from '@/features/pages/repositories/pages.repository';
import { pageContentFormSchema } from '@/features/pages/schemas/page.schema';
import { syncNavItemForPage } from '@/features/settings/repositories/settings.repository';
import { useToast } from '@/features/shared/components/Toast/Toast';
import { FormFieldError } from '@/features/shared/forms/FormFieldError';
import { FormSection } from '@/features/shared/forms/FormSection/FormSection';
import { LocalizedTextField } from '@/features/shared/forms/LocalizedTextField';
import { LocalizedTextareaField } from '@/features/shared/forms/LocalizedTextareaField';
import { StatusSelect } from '@/features/shared/forms/StatusSelect';
import { ValidationSummary } from '@/features/shared/forms/ValidationSummary';
import { checkPageContentTranslationCompleteness } from '@/features/shared/validation/translation-completeness';
import type { PageContentFormValues, PublishStatus } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

// =============================================================================
// NewPageContentForm — create a new static page content document
// =============================================================================

export function NewPageContentForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [translationErrors, setTranslationErrors] = useState<string[]>([]);

  const defaultValues: PageContentFormValues = {
    slug: '',
    status: 'draft',
    title: { ar: '', en: '' },
    body: { ar: '', en: '' },
    seo: {
      ar: { title: '', description: '' },
      en: { title: '', description: '' },
    },
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PageContentFormValues>({
    resolver: zodResolver(pageContentFormSchema),
    defaultValues,
  });

  const status = watch('status');

  async function onSubmit(values: PageContentFormValues) {
    if (values.status === 'published') {
      const check = checkPageContentTranslationCompleteness(values);
      if (!check.isComplete) {
        setTranslationErrors(check.missingFields);
        return;
      }
    }
    setTranslationErrors([]);
    setSaving(true);
    try {
      await createPageContent(values.slug, values);
      // Non-fatal: sync nav automatically based on publish status
      await syncNavItemForPage({
        title: values.title,
        slug: values.slug,
        status: values.status,
      }).catch(() => {});
      toast('Page created successfully.', 'success');
      router.push(ADMIN_ROUTES.PAGES);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to create page.';
      toast(message, 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <ValidationSummary errors={translationErrors} />

      <div className="admin-card" style={{ marginBlockEnd: 'var(--space-6)' }}>
        <div className="admin-card__body">
          <FormSection
            title="Page Identity"
            description="The slug becomes the URL path (e.g. slug 'tourism' → /en/tourism). Use lowercase letters, numbers, and hyphens only."
          >
            <div className="form-field">
              <label htmlFor="slug" className="form-field__label">
                Slug <span aria-hidden="true">*</span>
              </label>
              <input
                id="slug"
                type="text"
                className="form-field__control"
                placeholder="e.g. tourism"
                {...register('slug', {
                  pattern: {
                    value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                    message:
                      'Use only lowercase letters, numbers, and hyphens (no leading/trailing hyphens)',
                  },
                })}
              />
              <FormFieldError message={errors.slug?.message} />
            </div>

            <div className="form-field" style={{ maxWidth: '12rem' }}>
              <label htmlFor="status" className="form-field__label">
                Status
              </label>
              <StatusSelect
                id="status"
                value={status}
                onChange={(s: PublishStatus) => setValue('status', s)}
              />
            </div>
          </FormSection>
        </div>
      </div>

      <div className="admin-card" style={{ marginBlockEnd: 'var(--space-6)' }}>
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
            <LocalizedTextareaField
              label="Body"
              required
              rows={10}
              arField={register('body.ar')}
              enField={register('body.en')}
              arError={errors.body?.ar?.message}
              enError={errors.body?.en?.message}
            />
          </FormSection>
        </div>
      </div>

      <div className="admin-card" style={{ marginBlockEnd: 'var(--space-6)' }}>
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
        <div className="form-actions__left" />
        <div className="form-actions__right">
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Creating…' : 'Create page'}
          </button>
        </div>
      </div>
    </form>
  );
}
