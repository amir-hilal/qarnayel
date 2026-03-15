import '@/app/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Qarnayel',
    default: 'Qarnayel',
  },
  description: 'Discover the historic mountain village of Qarnayel, Lebanon.',
  metadataBase: new URL(
    process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://qarnayel.lb',
  ),
};

// ---------------------------------------------------------------------------
// Root layout — intentionally minimal.
// All routes are under [locale]/, which provides the <html>/<body> shell with
// the correct lang/dir attributes. Root-level fallbacks (error, not-found)
// render their own standalone document shells.
// ---------------------------------------------------------------------------
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <>{children}</>;
}
