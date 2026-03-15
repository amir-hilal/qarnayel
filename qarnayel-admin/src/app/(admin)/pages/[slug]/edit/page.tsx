import { ADMIN_ROUTES } from '@/config/routes';
import { EditPageContentForm } from '@/features/pages/forms/EditPageContentForm';
import { fetchPageContentBySlug } from '@/features/pages/repositories/pages.repository';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await fetchPageContentBySlug(slug);
  return { title: page ? `Edit Page: ${slug}` : 'Edit Page' };
}

export const dynamic = 'force-dynamic';

export default async function EditPageContentPage({ params }: Props) {
  const { slug } = await params;
  const page = await fetchPageContentBySlug(slug);

  if (!page) notFound();

  return (
    <>
      <div className="admin-page-header">
        <div className="admin-page-header__text">
          <h1 className="admin-page-header__title">Edit Page</h1>
          <p className="admin-page-header__subtitle">
            <code
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              {slug}
            </code>
          </p>
        </div>
        <div className="admin-page-header__actions">
          <Link href={ADMIN_ROUTES.PAGES} className="btn btn--ghost">
            Back to list
          </Link>
        </div>
      </div>

      <EditPageContentForm page={page} />
    </>
  );
}
