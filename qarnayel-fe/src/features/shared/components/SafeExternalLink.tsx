import type { ReactNode } from 'react';

type SafeExternalLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
};

// ---------------------------------------------------------------------------
// SafeExternalLink — always applies target="_blank" rel="noopener noreferrer"
// Use this for ALL external links in the project
// ---------------------------------------------------------------------------
export function SafeExternalLink({
  href,
  children,
  className,
  ariaLabel,
}: SafeExternalLinkProps): React.ReactElement {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
