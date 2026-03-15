'use client';

import { SettingsForm } from '@/features/settings/forms/SettingsForm';
import { fetchSiteSettings } from '@/features/settings/repositories/settings.repository';
import type { SiteSettings } from '@/types';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSiteSettings()
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

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

      {loading ? (
        <div className="admin-page-loading">Loading…</div>
      ) : (
        <SettingsForm initialData={settings} />
      )}
    </>
  );
}
