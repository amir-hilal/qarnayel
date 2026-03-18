import '@/styles/admin-layout.css';
import '@/styles/admin-patterns.css';
import '@/styles/animations.css';
import '@/styles/buttons.css';
import '@/styles/feedback.css';
import '@/styles/forms.css';
import '@/styles/reset.css';
import '@/styles/tokens.css';
import '@/styles/utilities.css';
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
