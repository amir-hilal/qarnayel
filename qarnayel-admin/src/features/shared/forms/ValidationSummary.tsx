// =============================================================================
// ValidationSummary — shows a list of validation errors above a form
// =============================================================================

interface ValidationSummaryProps {
  errors: string[];
}

export function ValidationSummary({ errors }: ValidationSummaryProps) {
  if (errors.length === 0) return null;

  return (
    <div className="alert alert--error" role="alert" aria-live="assertive">
      <div>
        <p
          style={{
            fontWeight: 'var(--font-weight-semibold)',
            marginBlockEnd: 'var(--space-1)',
          }}
        >
          Please fix the following errors before saving:
        </p>
        <ul
          style={{
            paddingInlineStart: 'var(--space-4)',
            marginBlockStart: 'var(--space-2)',
          }}
        >
          {errors.map((err, i) => (
            <li key={i} style={{ marginBlockStart: 'var(--space-1)' }}>
              {err}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
