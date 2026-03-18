import { SkeletonLoader } from '@/features/shared/components/SkeletonLoader/SkeletonLoader';

export default function PlacesLoading(): React.ReactElement {
  return (
    <div className="container" style={{ paddingBlock: 'var(--space-12)' }}>
      <SkeletonLoader lines={2} label="Loading filters..." />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(18rem, 1fr))',
          gap: 'var(--space-6)',
          marginTop: 'var(--space-8)',
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonLoader
            key={i}
            lines={5}
            label={`Loading place ${i + 1}...`}
          />
        ))}
      </div>
    </div>
  );
}
