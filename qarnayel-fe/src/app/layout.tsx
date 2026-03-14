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
// Root layout — sets minimal shell; locale-specific layout is in [locale]/layout.tsx
// ---------------------------------------------------------------------------
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
