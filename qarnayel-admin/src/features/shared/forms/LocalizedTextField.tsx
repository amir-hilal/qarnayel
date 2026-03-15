import React from 'react';
import { FormFieldError } from './FormFieldError';

// =============================================================================
// LocalizedTextField — bilingual text input (AR + EN side by side)
//
// Usage with react-hook-form:
//   <LocalizedTextField
//     label="Title"
//     arField={register('title.ar')}
//     enField={register('title.en')}
//     arError={errors.title?.ar?.message}
//     enError={errors.title?.en?.message}
//     required
//   />
// =============================================================================

interface LocalizedTextFieldProps {
  label: string;
  hint?: string;
  required?: boolean;
  arField: React.InputHTMLAttributes<HTMLInputElement>;
  enField: React.InputHTMLAttributes<HTMLInputElement>;
  arError?: string;
  enError?: string;
}

export function LocalizedTextField({
  label,
  hint,
  required,
  arField,
  enField,
  arError,
  enError,
}: LocalizedTextFieldProps) {
  return (
    <div
      className="form-section__grid"
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
        <input
          {...arField}
          className={`form-field__input${arError ? ' form-field__input--error' : ''}`}
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
        <input
          {...enField}
          className={`form-field__input${enError ? ' form-field__input--error' : ''}`}
          dir="ltr"
          lang="en"
        />
        <FormFieldError message={enError} />
      </div>
    </div>
  );
}
