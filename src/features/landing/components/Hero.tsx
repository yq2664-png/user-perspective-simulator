import HeroPersonaCluster from './HeroPersonaCluster';

interface Props {
  onStart: () => void;
}

export default function Hero({ onStart }: Props) {
  return (
    <section className="hero-section">
      <div className="hero-section__inner">
      {/* Eyebrow */}
      <p style={{
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: '#8E8E93',
        marginBottom: 18,
      }}>
        User Perspective Simulator
      </p>

      {/* Headline */}
      <h1 style={{
        fontSize: 'clamp(38px, 4vw, 54px)',
        fontWeight: 700,
        color: '#1D1D1F',
        lineHeight: 1.05,
        letterSpacing: '-1.4px',
        margin: '0 0 104px',
        maxWidth: 720,
      }}>
        Know what your users might actually think.
      </h1>

      {/* Persona cluster — spans full content width, aligned with the nav.
          Extra top room so hover info bubbles don't reach the headline. */}
      <div style={{ width: 'calc(100% + 120px)', marginLeft: -60, marginRight: -60, marginBottom: 48 }}>
        <HeroPersonaCluster />
      </div>

      <p className="hero-subheadline">
        <span className="hero-subheadline__detail">
          Explore AI-generated user perspectives and behavioral insights that reveal hidden motivations, reactions, and design opportunities.
        </span>
      </p>

      {/* CTA */}
      <button onClick={onStart} className="btn-vintage">
        Start for free
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      </div>
    </section>
  );
}
