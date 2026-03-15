import React from 'react';
import { FormFieldError } from './FormFieldError';

// =============================================================================
// LocalizedTextareaField — bilingual textarea (AR + EN side by side)
// =============================================================================

interface LocalizedTextareaFieldProps {
  label: string;
  hint?: string;
  required?: boolean;
  rows?: number;
  arField: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  enField: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  arError?: string;
  enError?: string;
}

export function LocalizedTextareaField({
  label,
  hint,
  required,
  rows = 4,
  arField,
  enField,
  arError,
  enError,
}: LocalizedTextareaFieldProps) {
  return (
    <div
      className="bilingual-section"
      style={{ marginBlockEnd: 'var(--space-4)' }}
    >
      {/* Arabic */}
      <div className="form-field bilingual-section__column--arabic">
        <label
          className={`form-field__label${required ? ' form-field__label--required' : ''}`}
        >
          <span
            className="bilingual-section__locale-label"
            style={{ marginInlineEnd: 'var(--space-2)' }}
          >
            AR
          </span>
          {label}
        </label>
        <textarea
          {...arField}
          rows={rows}
          className={`form-field__textarea${arError ? ' form-field__textarea--error' : ''}`}
          dir="rtl"
          lang="ar"
        />
        {hint && <span className="form-field__hint">{hint}</span>}
        <FormFieldError message={arError} />
      </div>

      {/* English */}
      <div className="form-field">
        <label
          className={`form-field__label${required ? ' form-field__label--required' : ''}`}
        >
          <span
            className="bilingual-section__locale-label"
            style={{ marginInlineEnd: 'var(--space-2)' }}
          >
            EN
          </span>
          {label}
        </label>
        <textarea
          {...enField}
          rows={rows}
          className={`form-field__textarea${enError ? ' form-field__textarea--error' : ''}`}
          dir="ltr"
          lang="en"
        />
        <FormFieldError message={enError} />
      </div>
    </div>
  );
}
