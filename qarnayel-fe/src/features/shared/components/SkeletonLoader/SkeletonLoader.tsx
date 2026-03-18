import './SkeletonLoader.css';

type SkeletonLoaderProps = {
  lines?: number;
  className?: string;
  label?: string;
};

// ---------------------------------------------------------------------------
// SkeletonLoader — generic loading placeholder
// ---------------------------------------------------------------------------
export function SkeletonLoader({
  lines = 3,
  className,
  label = 'Loading...',
}: SkeletonLoaderProps): React.ReactElement {
  return (
    <div
      className={`skeleton-loader ${className ?? ''}`}
      role="status"
      aria-label={label}
      aria-live="polite"
    >
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton-loader__line" aria-hidden="true" />
      ))}
    </div>
  );
}
