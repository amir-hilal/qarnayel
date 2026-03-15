'use client';

import { ADMIN_ROUTES } from '@/config/routes';
import {
  setHistoryEntryStatus,
  updateHistoryEntry,
} from '@/features/history/repositories/history.repository';
import { historyEntryFormSchema } from '@/features/history/schemas/history.schema';
import { useToast } from '@/features/shared/components/Toast';
import { ConfirmDialog } from '@/features/shared/forms/ConfirmDialog';
import { FormSection } from '@/features/shared/forms/FormSection';
import { LocalizedTextField } from '@/features/shared/forms/LocalizedTextField';
import { LocalizedTextareaField } from '@/features/shared/forms/LocalizedTextareaField';
import { StatusSelect } from '@/features/shared/forms/StatusSelect';
import { ValidationSummary } from '@/features/shared/forms/ValidationSummary';
import { checkHistoryEntryTranslationCompleteness } from '@/features/shared/validation/translation-completeness';
import type {
  HistoryEntry,
  HistoryEntryFormValues,
  PublishStatus,
} from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

// =============================================================================
// EditHistoryEntryForm — edit an existing history entry
// =============================================================================

interface EditHistoryEntryFormProps {
  entry: HistoryEntry;
}

export function EditHistoryEntryForm({ entry }: EditHistoryEntryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [translationErrors, setTranslationErrors] = useState<string[]>([]);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);

  const defaultValues: HistoryEntryFormValues = {
    status: entry.status,
    title: entry.title,
    summary: entry.summary ?? { ar: '', en: '' },
    content: entry.content,
    periodStart: entry.periodStart,
    periodEnd: entry.periodEnd ?? '',
    sources: entry.sources ?? [],
    order: entry.order,
    seo: entry.seo ?? {
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
  } = useForm<HistoryEntryFormValues>({
    resolver: zodResolver(historyEntryFormSchema),
    defaultValues,
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
      await updateHistoryEntry(entry.id, values);
      toast('Entry updated successfully.', 'success');
      router.refresh();
    } catch {
      toast('Failed to update entry.', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleArchive() {
    setShowArchiveDialog(false);
    setSaving(true);
    try {
      await setHistoryEntryStatus(entry.id, 'archived');
      toast('Entry archived.', 'success');
      router.push(ADMIN_ROUTES.HISTORY);
    } catch {
      toast('Failed to archive entry.', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <ValidationSummary errors={translationErrors} />

        <div
          className="admin-card"
          style={{ marginBlockEnd: 'var(--space-6)' }}
        >
          <div className="admin-card__body">
            <FormSection title="Period">
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
                    className="form-field__input"
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

        <div
          className="admin-card"
          style={{ marginBlockEnd: 'var(--space-6)' }}
        >
          <div className="admin-card__body">
            <FormSection title="Content">
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
          <div className="form-actions__left">
            {entry.status !== 'archived' && (
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
        title="Archive entry?"
        message="This entry will be hidden from the public website. You can restore it by changing its status."
        confirmLabel="Archive"
        isDangerous
        onConfirm={handleArchive}
        onCancel={() => setShowArchiveDialog(false)}
      />
    </>
  );
}
