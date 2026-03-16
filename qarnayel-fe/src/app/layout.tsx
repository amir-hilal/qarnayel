import '@/styles/globals.css';
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

// Inline script runs synchronously before first paint:
// • Reads theme from localStorage (or prefers-color-scheme) → sets data-theme
// • Reads locale from URL path → corrects lang/dir if not the default (ar/rtl)
const INIT_SCRIPT = `try{
  var t=localStorage.getItem('theme');
  if(!t)t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
  document.documentElement.setAttribute('data-theme',t);
  var loc=location.pathname.split('/')[1];
  if(loc==='en'){document.documentElement.lang='en';document.documentElement.dir='ltr';}
}catch(e){}`;

// ---------------------------------------------------------------------------
// Root layout — owns the document shell.
// • lang/dir default to Arabic (primary locale); the init script corrects them
//   for English before the first paint, avoiding any layout flash.
// • suppressHydrationWarning silences the expected data-theme / lang / dir
//   attribute mismatches between SSR and the init-script-modified DOM.
// ---------------------------------------------------------------------------
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: INIT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
