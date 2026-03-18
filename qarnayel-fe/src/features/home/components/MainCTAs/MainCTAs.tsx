import Link from 'next/link';
import './MainCTAs.css';

type MainCTAsProps = {
  ctas: Array<{ label: string; href: string }>;
};

// ---------------------------------------------------------------------------
// MainCTAs — dynamic list of CTA buttons
// First button gets primary style; subsequent ones get secondary
// ---------------------------------------------------------------------------
export function MainCTAs({ ctas }: MainCTAsProps): React.ReactElement {
  return (
    <section className="main-ctas">
      <div className="main-ctas__inner">
        {ctas.map((cta, i) => (
          <Link
            key={cta.href}
            href={cta.href}
            className={i === 0 ? 'btn btn--primary' : 'btn btn--secondary'}
          >
            {cta.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
