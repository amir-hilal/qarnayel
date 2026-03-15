import React from 'react';

// =============================================================================
// FormSection — groups a set of related form fields with a visible heading
// =============================================================================

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function FormSection({
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <section className="form-section">
      <h2 className="form-section__title">{title}</h2>
      {description && (
        <p className="form-section__description">{description}</p>
      )}
      {children}
    </section>
  );
}
