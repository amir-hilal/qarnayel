import type { PublishStatus } from '@/types';
import './StatusBadge.css';

// =============================================================================
// StatusBadge — visual indicator for draft / published / archived status
// =============================================================================

const STATUS_LABELS: Record<PublishStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
};

interface StatusBadgeProps {
  status: PublishStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const cls = ['status-badge', `status-badge--${status}`, className]
    .filter(Boolean)
    .join(' ');

  return <span className={cls}>{STATUS_LABELS[status]}</span>;
}
