import { SkeletonLoader } from '@/features/shared/components/SkeletonLoader';

export default function HistoryLoading(): React.ReactElement {
  return (
    <div className="container" style={{ paddingBlock: 'var(--space-12)' }}>
      <SkeletonLoader height="3rem" width="40%" style={{ marginBottom: 'var(--space-12)' }} />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} style={{ marginBottom: 'var(--space-12)' }}>
          <SkeletonLoader height="2rem" width="50%" style={{ marginBottom: 'var(--space-3)' }} />
          <SkeletonLoader height="1rem" width="30%" style={{ marginBottom: 'var(--space-6)' }} />
          {Array.from({ length: 4 }).map((_, j) => (
            <SkeletonLoader
              key={j}
              height="1rem"
              width={`${75 + Math.random() * 20}%`}
              style={{ marginBottom: 'var(--space-3)' }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
