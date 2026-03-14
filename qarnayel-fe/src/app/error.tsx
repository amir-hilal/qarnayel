'use client';

// ---------------------------------------------------------------------------
// Root error boundary — catches unexpected errors outside the locale segment
// ---------------------------------------------------------------------------
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.ReactElement {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <main
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100dvh',
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'Cairo, sans-serif',
          }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>
            حدث خطأ غير متوقع
          </h1>
          <p style={{ color: '#666', marginBottom: '2rem' }}>{error.message}</p>
          <button
            onClick={reset}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#1a6b3a',
              color: '#fff',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            حاول مرة أخرى
          </button>
        </main>
      </body>
    </html>
  );
}
