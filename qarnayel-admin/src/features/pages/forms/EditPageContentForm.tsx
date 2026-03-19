'use client';

import { ADMIN_ROUTES } from '@/config/routes';
import {
  setPageContentStatus,
  updatePageContent,
} from '@/features/pages/repositories/pages.repository';
import { pageContentFormSchema } from '@/features/pages/schemas/page.schema';
import { useToast } from '@/features/shared/components/Toast/Toast';
import { FormSection } from '@/features/shared/forms/FormSection/FormSection';
import { LocalizedTextField } from '@/features/shared/forms/LocalizedTextField';
import { LocalizedTextareaField } from '@/features/shared/forms/LocalizedTextareaField';
import { StatusSelect } from '@/features/shared/forms/StatusSelect';
import { ValidationSummary } from '@/features/shared/forms/ValidationSummary';
import { checkPageContentTranslationCompleteness } from '@/features/shared/validation/translation-completeness';
import type {
  PageContent,
  PageContentFormValues,
  PublishStatus,
} from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

// =============================================================================
// EditPageContentForm — edit a static page content document
// =============================================================================

interface EditPageContentFormProps {
  page: PageContent;
  backRoute?: string;
}

export function EditPageContentForm({
  page,
  backRoute = ADMIN_ROUTES.PAGES,
}: EditPageContentFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [translationErrors, setTranslationErrors] = useState<string[]>([]);

  const defaultValues: PageContentFormValues = {
    slug: page.slug,
    status: page.status,
    title: page.title,
    body: page.body,
    seo: page.seo ?? {
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
      await updatePageContent(page.slug, values);
      toast('Page saved successfully.', 'success');
      router.refresh();
    } catch {
      toast('Failed to save page.', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    const check = checkPageContentTranslationCompleteness(defaultValues);
    if (!check.isComplete) {
      setTranslationErrors(check.missingFields);
      return;
    }
    setSaving(true);
    try {
      await setPageContentStatus(page.slug, 'published');
      toast('Page published.', 'success');
      router.push(backRoute);
    } catch {
      toast('Failed to publish page.', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <ValidationSummary errors={translationErrors} />

      <div className="admin-card" style={{ marginBlockEnd: 'var(--space-6)' }}>
        <div className="admin-card__body">
          <FormSection title="Status">
            <div
              style={{
                display: 'flex',
                gap: 'var(--space-4)',
                alignItems: 'flex-start',
              }}
            >
              <div className="form-field" style={{ flex: '0 0 12rem' }}>
                <label htmlFor="status" className="form-field__label">
                  Status
                </label>
                <StatusSelect
                  id="status"
                  value={status}
                  onChange={(s: PublishStatus) => setValue('status', s)}
                />
              </div>
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
        <div className="form-actions__left">
          {page.status !== 'published' && (
            <button
              type="button"
              className="btn btn--secondary"
              onClick={handlePublish}
              disabled={saving}
            >
              Publish
            </button>
          )}
        </div>
        <div className="form-actions__right">
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </form>
  );
}
