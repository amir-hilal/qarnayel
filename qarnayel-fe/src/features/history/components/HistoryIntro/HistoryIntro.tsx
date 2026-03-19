import './HistoryIntro.css';

type LocalizedText = { ar: string; en?: string };

type HistoryIntroProps = {
  body: LocalizedText;
  locale: string;
};

// ---------------------------------------------------------------------------
// HistoryIntro — renders the history page body content
// ---------------------------------------------------------------------------
export function HistoryIntro({
  body,
  locale,
}: HistoryIntroProps): React.ReactElement {
  const l = locale as 'ar' | 'en';
  const resolvedBody = body[l] ?? body.ar;

  return (
    <section className="history-intro">
      <div className="history-intro__body">
        {resolvedBody.split('\n\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
