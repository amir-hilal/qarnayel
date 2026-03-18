import type { HistorySource } from '@/features/history/types';
import { SafeExternalLink } from '@/features/shared/components/SafeExternalLink';
import './SourceList.css';

type SourceListProps = {
  sources: HistorySource[];
  heading: string;
  locale: string;
};

// ---------------------------------------------------------------------------
// SourceList — renders a list of cited historical sources with optional links
// ---------------------------------------------------------------------------
export function SourceList({
  sources,
  heading,
  locale,
}: SourceListProps): React.ReactElement | null {
  if (sources.length === 0) return null;

  return (
    <section className="source-list">
      <h4 className="source-list__heading">{heading}</h4>
      <ol className="source-list__items">
        {sources.map((source, index) => {
          const label =
            source.label[locale as keyof typeof source.label] ??
            source.label.ar;
          return (
            <li key={index} className="source-list__item">
              {source.url ? (
                <SafeExternalLink
                  href={source.url}
                  className="source-list__link"
                >
                  {label}
                </SafeExternalLink>
              ) : (
                <span className="source-list__title">{label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
