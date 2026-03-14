import { SkeletonLoader } from '@/features/shared/components/SkeletonLoader';

export default function PlacesLoading(): React.ReactElement {
  return (
    <div className="container" style={{ paddingBlock: 'var(--space-12)' }}>
      <SkeletonLoader height="2.5rem" width="30%" style={{ marginBottom: 'var(--space-6)' }} />
      <SkeletonLoader height="3.5rem" style={{ marginBottom: 'var(--space-8)' }} />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(18rem, 1fr))',
          gap: 'var(--space-6)',
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonLoader key={i} height="22rem" />
        ))}
      </div>
    </div>
  );
}
