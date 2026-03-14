import { SkeletonLoader } from '@/features/shared/components/SkeletonLoader';

export default function PlaceDetailLoading(): React.ReactElement {
  return (
    <div>
      <SkeletonLoader height="45vh" />
      <div className="container" style={{ paddingBlock: 'var(--space-12)' }}>
        <SkeletonLoader height="1rem" width="8rem" style={{ marginBottom: 'var(--space-3)' }} />
        <SkeletonLoader height="3rem" width="60%" style={{ marginBottom: 'var(--space-4)' }} />
        <SkeletonLoader height="1.5rem" width="80%" style={{ marginBottom: 'var(--space-8)' }} />
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonLoader
            key={i}
            height="1rem"
            width={`${70 + Math.random() * 20}%`}
            style={{ marginBottom: 'var(--space-3)' }}
          />
        ))}
      </div>
    </div>
  );
}
