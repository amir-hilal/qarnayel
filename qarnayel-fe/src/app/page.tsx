import { redirect } from 'next/navigation';
import { DEFAULT_LOCALE } from '@/lib/i18n/locales';

// ---------------------------------------------------------------------------
// Root page — redirects directly to the default locale (Arabic)
// ---------------------------------------------------------------------------
export default function RootPage(): never {
  redirect(`/${DEFAULT_LOCALE}`);
}
