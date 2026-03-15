import type { HistoryEntry } from '@/features/history/types';
import { SourceList } from './SourceList';

type HistorySectionProps = {
  entry: HistoryEntry;
  locale: string;
  sourcesHeading: string;
};

// ---------------------------------------------------------------------------
// HistorySection — renders a single HistoryEntry: title, period, body, sources
// ---------------------------------------------------------------------------
export function HistorySection({
  entry,
  locale,
  sourcesHeading,
}: HistorySectionProps): React.ReactElement {
  const l = locale as 'ar' | 'en';

  const title = entry.title[l] ?? entry.title.ar;
  const body = entry.content[l] ?? entry.content.ar;
  const period = entry.period;

  return (
    <section className="history-section">
      <header className="history-section__header">
        <h2 className="history-section__title">{title}</h2>
        {period && <p className="history-section__period">{period}</p>}
      </header>

      <div className="history-section__body">
        {body.split('\n\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {entry.sources && entry.sources.length > 0 && (
        <SourceList
          sources={entry.sources}
          heading={sourcesHeading}
          locale={locale}
        />
      )}
    </section>
  );
}
