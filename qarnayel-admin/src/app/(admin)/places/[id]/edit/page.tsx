import { ADMIN_ROUTES } from '@/config/routes';
import { EditPlaceForm } from '@/features/places/forms/EditPlaceForm';
import { fetchPlaceById } from '@/features/places/repositories/places.repository';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const place = await fetchPlaceById(id);
  return { title: place ? `Edit: ${place.title.en}` : 'Edit Place' };
}

export const dynamic = 'force-dynamic';

export default async function EditPlacePage({ params }: Props) {
  const { id } = await params;
  const place = await fetchPlaceById(id);

  if (!place) notFound();

  return (
    <>
      <div className="admin-page-header">
        <div className="admin-page-header__text">
          <h1 className="admin-page-header__title">Edit Place</h1>
          <p className="admin-page-header__subtitle">{place.title.en}</p>
        </div>
        <div className="admin-page-header__actions">
          <Link href={ADMIN_ROUTES.PLACES} className="btn btn--ghost">
            Back to list
          </Link>
        </div>
      </div>

      <EditPlaceForm place={place} />
    </>
  );
}
