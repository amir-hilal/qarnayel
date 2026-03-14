import { SkeletonLoader } from '@/features/shared/components/SkeletonLoader';

export default function HomeLoading(): React.ReactElement {
  return (
    <div>
      <SkeletonLoader height="60vh" />
      <div style={{ padding: '3rem 1.5rem' }}>
        <SkeletonLoader height="2rem" width="40%" style={{ margin: '0 auto 2rem' }} />
        <SkeletonLoader height="1rem" width="60%" style={{ margin: '0 auto 3rem' }} />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(18rem, 1fr))',
            gap: '1.5rem',
          }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonLoader key={i} height="20rem" />
          ))}
        </div>
      </div>
    </div>
  );
}
