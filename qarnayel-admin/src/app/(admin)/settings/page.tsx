import { SettingsForm } from '@/features/settings/forms/SettingsForm';
import { fetchSiteSettings } from '@/features/settings/repositories/settings.repository';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Settings' };
export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const settings = await fetchSiteSettings();

  return (
    <>
      <div className="admin-page-header">
        <div className="admin-page-header__text">
          <h1 className="admin-page-header__title">Settings</h1>
          <p className="admin-page-header__subtitle">
            Global site configuration
          </p>
        </div>
      </div>

      <SettingsForm initialData={settings} />
    </>
  );
}
