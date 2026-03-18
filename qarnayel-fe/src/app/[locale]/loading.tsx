import { SkeletonLoader } from '@/features/shared/components/SkeletonLoader/SkeletonLoader';

export default function HomeLoading(): React.ReactElement {
  return (
    <div>
      <SkeletonLoader lines={4} label="Loading hero..." />
      <div style={{ padding: '3rem 1.5rem' }}>
        <SkeletonLoader lines={2} label="Loading intro..." />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(18rem, 1fr))',
            gap: '1.5rem',
            marginTop: '2rem',
          }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonLoader
              key={i}
              lines={5}
              label={`Loading place ${i + 1}...`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
