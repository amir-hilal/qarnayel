import React from 'react';

// =============================================================================
// FormFieldError — shows a react-hook-form field error message
// =============================================================================

interface FormFieldErrorProps {
  message?: string;
}

export function FormFieldError({ message }: FormFieldErrorProps) {
  if (!message) return null;
  return (
    <p className="form-field__error" role="alert">
      {message}
    </p>
  );
}
