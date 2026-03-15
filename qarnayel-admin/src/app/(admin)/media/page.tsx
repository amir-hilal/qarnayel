'use client';

import { fetchAllMediaAssets } from '@/features/media/repositories/media.repository';
import { EmptyState } from '@/features/shared/components/EmptyState';
import type { MediaAsset } from '@/types';
import { useEffect, useState } from 'react';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllMediaAssets()
      .then(setAssets)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="admin-page-header">
        <div className="admin-page-header__text">
          <h1 className="admin-page-header__title">Media</h1>
          <p className="admin-page-header__subtitle">
            {loading
              ? 'Loading…'
              : `${assets.length} asset${assets.length !== 1 ? 's' : ''} in library`}
          </p>
        </div>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-page-loading">Loading…</div>
        ) : assets.length === 0 ? (
          <EmptyState
            title="No media assets yet"
            description="Uploaded images and files will appear here."
          />
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>File name</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Alt text (EN)</th>
                  <th>Uploaded</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset.id}>
                    <td>
                      {asset.mimeType.startsWith('image/') && (
                        <img
                          src={asset.downloadUrl}
                          alt={asset.altText?.en ?? ''}
                          width={48}
                          height={48}
                          style={{
                            objectFit: 'cover',
                            borderRadius: 'var(--radius-sm)',
                          }}
                          loading="lazy"
                        />
                      )}
                    </td>
                    <td className="truncate" style={{ maxWidth: '16rem' }}>
                      {asset.storagePath.split('/').pop() ?? asset.storagePath}
                    </td>
                    <td>{asset.mimeType}</td>
                    <td>{formatBytes(asset.sizeBytes)}</td>
                    <td className="truncate" style={{ maxWidth: '14rem' }}>
                      {asset.altText?.en ?? '—'}
                    </td>
                    <td>
                      {new Date(asset.uploadedAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
