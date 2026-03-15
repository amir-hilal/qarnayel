import type { PublishStatus } from '@/types';

// =============================================================================
// StatusSelect — dropdown for selecting a publish status
// =============================================================================

const STATUS_OPTIONS: { value: PublishStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

interface StatusSelectProps {
  value: PublishStatus;
  onChange: (status: PublishStatus) => void;
  disabled?: boolean;
  id?: string;
}

export function StatusSelect({
  value,
  onChange,
  disabled,
  id,
}: StatusSelectProps) {
  return (
    <select
      id={id}
      className="form-field__select"
      value={value}
      onChange={(e) => onChange(e.target.value as PublishStatus)}
      disabled={disabled}
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
