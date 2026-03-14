import { SkeletonLoader } from '@/features/shared/components/SkeletonLoader';

export default function PlaceDetailLoading(): React.ReactElement {
  return (
    <div>
      <SkeletonLoader lines={3} label="Loading hero..." />
      <div className="container" style={{ paddingBlock: 'var(--space-12)' }}>
        <SkeletonLoader lines={2} label="Loading title..." />
        <div style={{ marginTop: 'var(--space-8)' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonLoader key={i} lines={4} label={`Loading section ${i + 1}...`} />
          ))}
        </div>
      </div>
    </div>
  );
}
