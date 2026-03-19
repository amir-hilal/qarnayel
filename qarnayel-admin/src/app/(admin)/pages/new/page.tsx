'use client';

import { ADMIN_ROUTES } from '@/config/routes';
import { NewPageContentForm } from '@/features/pages/forms/NewPageContentForm';
import Link from 'next/link';

export default function NewPageContentPage() {
  return (
    <>
      <div className="admin-page-header">
        <div className="admin-page-header__text">
          <h1 className="admin-page-header__title">New Page</h1>
          <p className="admin-page-header__subtitle">
            Create a new static content page. The slug becomes the URL path.
          </p>
        </div>
        <div className="admin-page-header__actions">
          <Link href={ADMIN_ROUTES.PAGES} className="btn btn--ghost">
            Back to list
          </Link>
        </div>
      </div>

      <NewPageContentForm />
    </>
  );
}
