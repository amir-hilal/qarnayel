type EmptyStateProps = {
  message: string;
  actionLabel?: string;
  actionHref?: string;
};

// ---------------------------------------------------------------------------
// EmptyState — shown when a list returns no results
// ---------------------------------------------------------------------------
export function EmptyState({
  message,
  actionLabel,
  actionHref,
}: EmptyStateProps): React.ReactElement {
  return (
    <div className="empty-state" role="status">
      <p className="empty-state__message">{message}</p>
      {actionLabel && actionHref && (
        <a href={actionHref} className="empty-state__action">
          {actionLabel}
        </a>
      )}
    </div>
  );
}
