import { ROUTES } from '@/config/constants';
import { getDictionary } from '@/lib/i18n';
import { DEFAULT_LOCALE } from '@/lib/i18n/locales';
import Link from 'next/link';

// ---------------------------------------------------------------------------
// Root not-found — fallback when no locale segment is matched
// Renders a minimal page without Firebase dependency
// ---------------------------------------------------------------------------
export default async function NotFound(): Promise<React.ReactElement> {
  const dict = await getDictionary(DEFAULT_LOCALE);

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        padding: 'var(--space-8)',
        textAlign: 'center',
        fontFamily: 'var(--font-body)',
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-text)',
      }}
    >
      <h1
        style={{
          fontSize: '5rem',
          fontWeight: 700,
          margin: 0,
          color: 'var(--color-primary)',
        }}
      >
        404
      </h1>
      <p
        style={{
          fontSize: 'var(--font-size-lg)',
          color: 'var(--color-text-muted)',
          margin: 'var(--space-4) 0 var(--space-8)',
        }}
      >
        {dict.common.notFound}
      </p>
      <Link href={ROUTES.HOME(DEFAULT_LOCALE)} className="btn btn--primary">
        {dict.common.backHome}
      </Link>
    </main>
  );
}
