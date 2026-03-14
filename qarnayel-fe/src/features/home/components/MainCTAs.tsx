import Link from 'next/link';

type MainCTAsProps = {
  explorePlacesLabel: string;
  explorePlacesHref: string;
  discoverHistoryLabel: string;
  discoverHistoryHref: string;
};

// ---------------------------------------------------------------------------
// MainCTAs — standalone pair of primary/secondary CTA buttons
// Used on pages that need a CTA block independent of the hero section
// ---------------------------------------------------------------------------
export function MainCTAs({
  explorePlacesLabel,
  explorePlacesHref,
  discoverHistoryLabel,
  discoverHistoryHref,
}: MainCTAsProps): React.ReactElement {
  return (
    <section className="main-ctas">
      <div className="main-ctas__inner">
        <Link href={explorePlacesHref} className="btn btn--primary">
          {explorePlacesLabel}
        </Link>
        <Link href={discoverHistoryHref} className="btn btn--secondary">
          {discoverHistoryLabel}
        </Link>
      </div>
    </section>
  );
}
