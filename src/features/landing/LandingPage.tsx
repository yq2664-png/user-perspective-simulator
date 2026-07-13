import Hero from './components/Hero';

interface Props {
  onStart: () => void;
}

const STEPS = [
  {
    num: '01',
    title: 'Describe your product',
    body: "Tell us what you're building. Add the product type, core experience, and optionally upload supporting materials.",
  },
  {
    num: '02',
    title: 'Simulate user perspectives',
    body: 'AI generates diverse user perspectives that reveal how different people might perceive and respond to your product.',
  },
  {
    num: '03',
    title: 'Reveal design insights',
    body: 'Uncover hidden motivations, unmet needs, and opportunities behind user behavior.',
  },
  {
    num: '04',
    title: 'Generate the PRD',
    body: 'Convert research insights into a structured PRD with prioritized product opportunities.',
  },
];

const FEATURES = [
  {
    label: 'User Perspectives',
    title: 'See your product through different eyes',
    body: 'Explore how different users might think, feel, and respond before launching.',
  },
  {
    label: 'Design Insights',
    title: 'Understand why users behave the way they do',
    body: 'Reveal hidden motivations, unmet needs, and the opportunities behind user behavior.',
  },
  {
    label: 'Actionable PRD',
    title: 'From research to product decisions',
    body: 'Transform insights into a clear, structured PRD with evidence-backed recommendations.',
  },
];

export default function LandingPage({ onStart }: Props) {
  return (
    <main>

      <Hero onStart={onStart} />

      {/* ── How it works ──────────────────────────────────────── */}
      <section style={{ background: '#F7F5EF' }}>
        <div className="page-container pt-6 pb-10 sm:pt-7 sm:pb-12">
          <p className="section-title">How it works</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {STEPS.map((step) => (
              <div key={step.num} className="p-8 rounded-2xl" style={{ background: '#FDFCF9' }}>
                <span
                  className="font-semibold block mb-6 leading-none select-none"
                  style={{ fontSize: '3rem', color: '#A1A1A6' }}
                >
                  {step.num}
                </span>
                <p className="text-sm font-semibold text-[#1D1D1F] mb-2">{step.title}</p>
                <p className="text-sm text-[#6E6E73] leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section className="page-container pt-6 pb-10 sm:pt-7 sm:pb-12">
        <p className="section-title">What you get</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {FEATURES.map((f) => (
            <div key={f.label} className="p-8 rounded-2xl" style={{ background: '#F7F5EF' }}>
              <span className="label-tag block mb-5">{f.label}</span>
              <p className="text-xl font-semibold text-[#1D1D1F] mb-3 leading-snug">{f.title}</p>
              <p className="text-sm text-[#6E6E73] leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────── */}
      <section style={{ background: '#F7F5EF' }}>
        <div className="page-container py-16 sm:py-24 text-center">
          <h2
            className="font-semibold text-[#1D1D1F] mb-6"
            style={{ fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: '1.06', letterSpacing: '-0.3px' }}
          >
            Ready to see your product<br />through user eyes?
          </h2>
          <button onClick={onStart} className="btn-vintage-ghost">
            Start here
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </section>

    </main>
  );
}
