import Link from 'next/link';
import { DEFAULT_LOCALE } from '@/lib/i18n/locales';
import { getDictionary } from '@/lib/i18n';
import { ROUTES } from '@/config/constants';

// ---------------------------------------------------------------------------
// Root not-found — fallback when no locale segment is matched
// Renders a minimal page without Firebase dependency
// ---------------------------------------------------------------------------
export default async function NotFound(): Promise<React.ReactElement> {
  const dict = await getDictionary(DEFAULT_LOCALE);

  return (
    <html lang={DEFAULT_LOCALE} dir="rtl">
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
          <h1 style={{ fontSize: '5rem', fontWeight: 700, margin: 0 }}>404</h1>
          <p style={{ fontSize: '1.25rem', margin: '1rem 0 2rem' }}>
            {dict.common.pageNotFound}
          </p>
          <Link
            href={ROUTES.home(DEFAULT_LOCALE)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#1a6b3a',
              color: '#fff',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            {dict.common.backHome}
          </Link>
        </main>
      </body>
    </html>
  );
}
