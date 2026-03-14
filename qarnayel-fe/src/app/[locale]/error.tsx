'use client';

import Link from 'next/link';

// ---------------------------------------------------------------------------
// Locale-level error boundary
// ---------------------------------------------------------------------------
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.ReactElement {
  return (
    <div className="empty-state" style={{ minHeight: '60vh' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
        حدث خطأ — Something went wrong
      </h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
        {error.message}
      </p>
      <button className="btn btn--primary" onClick={reset}>
        إعادة المحاولة / Try again
      </button>
    </div>
  );
}
