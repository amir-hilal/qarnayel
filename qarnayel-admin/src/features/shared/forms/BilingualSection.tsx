import React from 'react';

// =============================================================================
// BilingualSection — layout wrapper for two-column AR / EN content blocks
// =============================================================================

interface BilingualSectionProps {
  children: React.ReactNode;
}

export function BilingualSection({ children }: BilingualSectionProps) {
  return <div className="bilingual-section">{children}</div>;
}
