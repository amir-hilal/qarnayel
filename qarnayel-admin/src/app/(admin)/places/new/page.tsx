import { ADMIN_ROUTES } from '@/config/routes';
import { NewPlaceForm } from '@/features/places/forms/NewPlaceForm';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'New Place' };

export default function NewPlacePage() {
  return (
    <>
      <div className="admin-page-header">
        <div className="admin-page-header__text">
          <h1 className="admin-page-header__title">New Place</h1>
        </div>
        <div className="admin-page-header__actions">
          <Link href={ADMIN_ROUTES.PLACES} className="btn btn--ghost">
            Cancel
          </Link>
        </div>
      </div>

      <NewPlaceForm />
    </>
  );
}
