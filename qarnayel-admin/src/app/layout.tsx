import '@/styles/admin.css';
import '@/styles/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s — Qarnayel Admin',
    default: 'Qarnayel Admin',
  },
  description: 'Content management dashboard for the Qarnayel website.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
