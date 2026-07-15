import Hero from './components/Hero';

interface Props {
  onStart: () => void;
}

const STEPS = [
  {
    num: '01',
    title: 'Input',
    question: 'Describe your product',
    body: 'Provide your product name, website, and supporting materials.',
  },
  {
    num: '02',
    title: 'Perspectives',
    question: 'Bring every user voice together',
    body: 'Combine real user feedback with AI-simulated perspectives to build a richer understanding of your users.',
  },
  {
    num: '03',
    title: 'Insights',
    question: 'Discover hidden needs',
    body: 'Reveal motivations, trust issues, unmet needs, and decision barriers behind user behavior.',
  },
  {
    num: '04',
    title: 'Reasoning',
    question: 'Connect the dots',
    body: 'AI links research evidence, behavioral patterns, and UX knowledge to explain why problems emerge.',
  },
  {
    num: '05',
    title: 'Review',
    question: 'Review your design',
    body: 'Evaluate the experience, identify usability issues, and recommend improvements backed by research evidence.',
  },
  {
    num: '06',
    title: 'Decisions',
    question: 'Turn insights into action',
    body: 'Generate prioritized product decisions and requirements grounded in user research.',
  },
];

const FEATURES = [
  {
    label: 'Perspectives',
    title: "See through your users' eyes",
    body: 'Combine real user feedback and AI-generated perspectives to understand how different users experience your product.',
  },
  {
    label: 'Insights',
    title: 'Reveal hidden patterns',
    body: 'Discover motivations, unmet needs, trust issues, and decision barriers behind user behavior.',
  },
  {
    label: 'Recommendations',
    title: 'Improve with confidence',
    body: 'Receive evidence-backed design recommendations that explain what to improve and why.',
  },
  {
    label: 'Decisions',
    title: 'Turn insights into action',
    body: 'Generate prioritized product decisions and requirements grounded in user research.',
  },
];

export default function LandingPage({ onStart }: Props) {
  return (
    <main>

      <Hero onStart={onStart} />

      <section style={{ background: '#F7F5EF' }}>
        <div className="page-container pt-6 pb-10 sm:pt-7 sm:pb-12">
          <p className="section-title">How it works</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {STEPS.map((step) => (
              <div key={step.num} className="p-8 rounded-2xl" style={{ background: '#FDFCF9' }}>
                <span
                  className="font-semibold block mb-6 leading-none select-none"
                  style={{ fontSize: '3rem', color: '#A1A1A6' }}
                >
                  {step.num}
                </span>
                <p className="mb-2 text-base font-semibold leading-snug text-[#1D1D1F] sm:text-lg">{step.title}</p>
                <p className="mb-3 text-sm leading-snug" style={{ color: '#127A74' }}>{step.question}</p>
                <p className="text-xs leading-relaxed text-[#6E6E73]">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-container pt-6 pb-10 sm:pt-7 sm:pb-12">
        <p className="section-title">What you get</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:items-stretch">
          {FEATURES.map((f) => (
            <div
              key={f.label}
              className="flex h-full min-h-[220px] flex-col rounded-2xl p-6 sm:p-7"
              style={{ background: '#F7F5EF' }}
            >
              <span className="mb-2 block text-base font-semibold leading-snug sm:text-lg text-[#1D1D1F]">{f.label}</span>
              <p className="mb-3 text-sm leading-snug" style={{ color: '#127A74' }}>{f.title}</p>
              <p className="flex-1 text-xs leading-relaxed text-[#6E6E73]">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

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
