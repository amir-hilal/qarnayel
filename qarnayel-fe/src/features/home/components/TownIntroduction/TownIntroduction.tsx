import './TownIntroduction.css';

type TownIntroductionProps = {
  heading: string;
  body: string;
};

// ---------------------------------------------------------------------------
// TownIntroduction — short descriptive block about Qarnayel on the homepage
// ---------------------------------------------------------------------------
export function TownIntroduction({
  heading,
  body,
}: TownIntroductionProps): React.ReactElement {
  return (
    <section className="town-intro">
      <div className="town-intro__inner">
        <h2 className="town-intro__heading">{heading}</h2>
        <p className="town-intro__body">{body}</p>
      </div>
    </section>
  );
}
