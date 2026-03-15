'use client';

import { ADMIN_ROUTES } from '@/config/routes';
import { createHistoryEntry } from '@/features/history/repositories/history.repository';
import { historyEntryFormSchema } from '@/features/history/schemas/history.schema';
import { useToast } from '@/features/shared/components/Toast';
import { FormSection } from '@/features/shared/forms/FormSection';
import { LocalizedTextField } from '@/features/shared/forms/LocalizedTextField';
import { LocalizedTextareaField } from '@/features/shared/forms/LocalizedTextareaField';
import { StatusSelect } from '@/features/shared/forms/StatusSelect';
import { ValidationSummary } from '@/features/shared/forms/ValidationSummary';
import { checkHistoryEntryTranslationCompleteness } from '@/features/shared/validation/translation-completeness';
import type { HistoryEntryFormValues, PublishStatus } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

// =============================================================================
// NewHistoryEntryForm — create a new history entry
// =============================================================================

const DEFAULT_VALUES: HistoryEntryFormValues = {
  status: 'draft',
  title: { ar: '', en: '' },
  summary: { ar: '', en: '' },
  content: { ar: '', en: '' },
  periodStart: '',
  periodEnd: '',
  sources: [],
  order: 0,
  seo: {
    ar: { title: '', description: '' },
    en: { title: '', description: '' },
  },
};

export function NewHistoryEntryForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [translationErrors, setTranslationErrors] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<HistoryEntryFormValues>({
    resolver: zodResolver(historyEntryFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const status = watch('status');

  async function onSubmit(values: HistoryEntryFormValues) {
    if (values.status === 'published') {
      const check = checkHistoryEntryTranslationCompleteness(values);
      if (!check.isComplete) {
        setTranslationErrors(check.missingFields);
        return;
      }
    }
    setTranslationErrors([]);
    setSaving(true);
    try {
      const id = await createHistoryEntry(values);
      toast('History entry created successfully.', 'success');
      router.push(ADMIN_ROUTES.HISTORY_EDIT(id));
    } catch {
      toast('Failed to create entry. Please try again.', 'error');
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
            title="Period"
            description="The historical time span this entry covers."
          >
            <div className="form-section__grid">
              <div className="form-field">
                <label
                  htmlFor="periodStart"
                  className="form-field__label form-field__label--required"
                >
                  Period start
                </label>
                <input
                  id="periodStart"
                  {...register('periodStart')}
                  className={`form-field__input${errors.periodStart ? ' form-field__input--error' : ''}`}
                  placeholder="e.g. 1920"
                />
                {errors.periodStart && (
                  <p className="form-field__error">
                    {errors.periodStart.message}
                  </p>
                )}
              </div>
              <div className="form-field">
                <label htmlFor="periodEnd" className="form-field__label">
                  Period end
                </label>
                <input
                  id="periodEnd"
                  {...register('periodEnd')}
                  className="form-field__input"
                  placeholder="e.g. 1943 (leave blank if ongoing)"
                />
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
              label="Summary"
              rows={3}
              arField={register('summary.ar')}
              enField={register('summary.en')}
            />
            <LocalizedTextareaField
              label="Full content"
              required
              rows={8}
              arField={register('content.ar')}
              enField={register('content.en')}
              arError={errors.content?.ar?.message}
              enError={errors.content?.en?.message}
            />
          </FormSection>
        </div>
      </div>

      <div className="form-actions">
        <div className="form-actions__left" />
        <div className="form-actions__right">
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Saving…' : 'Create entry'}
          </button>
        </div>
      </div>
    </form>
  );
}
