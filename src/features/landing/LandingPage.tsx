import Hero from './components/Hero';

interface Props {
  onStart: () => void;
}

const STEPS = [
  {
    num: '01',
    title: 'Product Input',
    question: 'What product did you build?',
    body: 'Describe your product type, core experience, and optionally upload supporting materials.',
  },
  {
    num: '02',
    title: 'User Perspectives',
    question: 'How would users see it?',
    body: 'AI generates diverse user perspectives that reveal how different people might perceive and respond to your product.',
  },
  {
    num: '03',
    title: 'Behavioral Insights',
    question: 'Why would users think that way?',
    body: 'Uncover hidden motivations, unmet needs, and friction behind user behavior.',
  },
  {
    num: '04',
    title: 'Reasoning',
    question: 'How does the evidence connect?',
    body: 'Trace how user perspectives connect to behavioral patterns — the reasoning bridge before design evaluation.',
  },
  {
    num: '05',
    title: 'AI Design Review',
    question: 'Why does your design cause these problems?',
    body: 'Evaluate evidence against Nielsen, WCAG, Apple HIG, Material, Cognitive Load, and Trust patterns.',
  },
  {
    num: '06',
    title: 'Product Decisions',
    question: 'How should you change it?',
    body: 'Generate evidence-backed requirements — every decision traces back to user proof.',
  },
];

const FEATURES = [
  {
    label: 'Product Input',
    question: 'What product did you build?',
    title: 'Start with what you built',
    body: 'Describe the product before simulating how anyone might react to it.',
  },
  {
    label: 'User Perspectives',
    question: 'How would users see it?',
    title: 'See your product through different eyes',
    body: 'Explore how different users might think, feel, and respond before launching.',
  },
  {
    label: 'Behavioral Insights',
    question: 'Why would users think that way?',
    title: 'Understand why users behave the way they do',
    body: 'Reveal hidden motivations, unmet needs, and friction behind user behavior.',
  },
  {
    label: 'AI Design Review',
    question: 'Why does your design cause these problems?',
    title: 'Six frameworks, one evidence chain',
    body: 'Nielsen · WCAG · Apple HIG · Material · Cognitive Load · Trust — only where evidence applies.',
  },
  {
    label: 'Export',
    question: 'How do you hand this off to the team?',
    title: 'Hand off to your team',
    body: 'Share links or export PDFs — every decision stays traceable to its evidence chain.',
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
                <p className="text-sm font-semibold text-[#1D1D1F] mb-1">{step.title}</p>
                <p className="text-xs mb-3" style={{ color: '#127A74' }}>{step.question}</p>
                <p className="text-sm text-[#6E6E73] leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-container pt-6 pb-10 sm:pt-7 sm:pb-12">
        <p className="section-title">What you get</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEATURES.map((f) => (
            <div key={f.label} className="p-8 rounded-2xl" style={{ background: '#F7F5EF' }}>
              <span className="label-tag block mb-2">{f.label}</span>
              <p className="text-xs mb-4" style={{ color: '#127A74' }}>{f.question}</p>
              <p className="text-xl font-semibold text-[#1D1D1F] mb-3 leading-snug">{f.title}</p>
              <p className="text-sm text-[#6E6E73] leading-relaxed">{f.body}</p>
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
