'use client';

// ---------------------------------------------------------------------------
// Places list error boundary
// ---------------------------------------------------------------------------
export default function PlacesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.ReactElement {
  return (
    <div className="empty-state" style={{ minHeight: '60vh' }}>
      <p style={{ marginBottom: 'var(--space-4)' }}>{error.message}</p>
      <button className="btn btn--primary" onClick={reset}>
        إعادة المحاولة / Try again
      </button>
    </div>
  );
}
