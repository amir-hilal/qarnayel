import { DEFAULT_LOCALE, LOCALE_DIRS } from '@/lib/i18n/locales';
import '@/styles/tokens.css';
import '@/styles/reset.css';
import '@/styles/layout.css';
import '@/styles/utilities.css';
import '@/styles/buttons.css';
import '@/styles/animations.css';
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
// Root layout — owns the document shell.
// • lang/dir default to the primary locale; public/scripts/init.js corrects
//   them for other locales before the first paint, avoiding any layout flash.
// • suppressHydrationWarning silences the expected data-theme / lang / dir
//   attribute mismatches between SSR and the init-script-modified DOM.
// ---------------------------------------------------------------------------
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html
      lang={DEFAULT_LOCALE}
      dir={LOCALE_DIRS[DEFAULT_LOCALE]}
      suppressHydrationWarning
    >
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/scripts/init.js" />
      </head>
      <body>{children}</body>
    </html>
  );
}
