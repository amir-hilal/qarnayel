import { SkeletonLoader } from '@/features/shared/components/SkeletonLoader';

export default function HistoryLoading(): React.ReactElement {
  return (
    <div className="container" style={{ paddingBlock: 'var(--space-12)' }}>
      <SkeletonLoader lines={2} label="Loading history..." />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} style={{ marginTop: 'var(--space-12)' }}>
          <SkeletonLoader lines={5} label={`Loading entry ${i + 1}...`} />
        </div>
      ))}
    </div>
  );
}
