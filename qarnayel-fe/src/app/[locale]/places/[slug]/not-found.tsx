import Link from 'next/link';
import { DEFAULT_LOCALE } from '@/lib/i18n/locales';
import { getDictionary } from '@/lib/i18n';
import { ROUTES } from '@/config/constants';

// ---------------------------------------------------------------------------
// Place detail not-found — shown when a slug doesn't resolve to a published place
// ---------------------------------------------------------------------------
export default async function PlaceNotFound(): Promise<React.ReactElement> {
  const dict = await getDictionary(DEFAULT_LOCALE);

  return (
    <div className="empty-state" style={{ minHeight: '60vh' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
        {dict.places.notFound}
      </h1>
      <Link href={ROUTES.places(DEFAULT_LOCALE)} className="btn btn--primary">
        {dict.places.backToPlaces}
      </Link>
    </div>
  );
}
