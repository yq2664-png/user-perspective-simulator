import type { UxExpertFinding, UxExpertReviewData, UxExpertSeverity } from '../types';

const IMPACT_COLOR: Record<UxExpertSeverity, string> = {
  High: '#ef4444',
  Medium: '#f59e0b',
  Low: '#22c55e',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 last:mb-0">
      <p className="text-[9px] tracking-[0.14em] uppercase mb-1" style={{ color: '#8E8E93' }}>{label}</p>
      <p className="text-sm leading-relaxed" style={{ color: '#6E6E73' }}>{children}</p>
    </div>
  );
}

function FindingCard({ finding, index }: { finding: UxExpertFinding; index: number }) {
  const impact = finding.impact ?? 'Medium';
  const color = IMPACT_COLOR[impact] ?? '#6E6E73';

  return (
    <div
      className="card-enter rounded-2xl overflow-hidden"
      style={{
        animationDelay: `${index * 60}ms`,
        background: 'white',
        border: '1px solid #D2D2D7',
      }}
    >
      <div className="flex gap-0">
        <div className="w-[3px] shrink-0" style={{ background: color }} />
        <div className="flex-1 min-w-0 px-6 sm:px-8 py-6">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-[10px] tracking-[0.18em] uppercase mb-1.5" style={{ color: '#A1A1A6' }}>
                {String(finding.id).padStart(2, '0')}
              </p>
              <p className="text-base font-semibold leading-snug" style={{ color: '#1D1D1F' }}>
                {finding.title}
              </p>
            </div>
            <span
              className="text-[10px] tracking-[0.12em] uppercase px-2 py-0.5 rounded-full shrink-0"
              style={{ color, background: `${color}18` }}
            >
              {impact}
            </span>
          </div>

          <Field label="UX Finding">{finding.finding}</Field>
          <Field label="Why">{finding.why}</Field>
          <Field label="UX Principle">{finding.principle}</Field>
          <Field label="Recommendation">{finding.recommendation}</Field>
        </div>
      </div>
    </div>
  );
}

interface Props {
  productName: string;
  loading: boolean;
  error: string;
  data: UxExpertReviewData | null;
  onRetry: () => void;
}

const LOADING_STEPS = [
  'Reviewing product screens and flows',
  'Identifying UX findings',
  'Mapping principles to recommendations',
];

export default function UxExpertReviewSection({ productName, loading, error, data, onRetry }: Props) {
  return (
    <section className="mt-20">
      <div className="flex items-baseline gap-4 mb-3">
        <h2 className="text-2xl font-semibold" style={{ color: '#1D1D1F' }}>UX Expert Perspective</h2>
        <span className="text-[9px] tracking-widest uppercase" style={{ color: '#6E6E73' }}>Expert lens</span>
      </div>
      <p className="text-sm mb-8" style={{ color: '#6E6E73' }}>
        Key UX findings about {productName || 'your product'} — for Insights, Reasoning, and Decisions to build on.
      </p>

      {loading && (
        <div className="space-y-4">
          {LOADING_STEPS.map((step, i) => (
            <div
              key={step}
              className="flex items-center gap-3 p-4 rounded-2xl"
              style={{ background: '#FBFAF6', opacity: i === 0 ? 1 : 0.5 }}
            >
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#127A74' }} />
              <span className="text-[10px] tracking-[0.15em] uppercase" style={{ color: '#127A74' }}>
                {step}…
              </span>
            </div>
          ))}
          <div className="p-8 rounded-2xl" style={{ background: '#FBFAF6' }}>
            <div className="loading-bar h-2.5 w-full rounded mb-2" />
            <div className="loading-bar h-2.5 w-4/6 rounded" />
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="p-6 rounded-2xl" style={{ background: '#FBFAF6' }}>
          <p className="text-sm mb-4" style={{ color: '#1D1D1F' }}>{error}</p>
          <button type="button" onClick={onRetry} className="btn-primary text-xs">Retry</button>
        </div>
      )}

      {data && !loading && (
        <>
          <p className="text-[10px] tracking-[0.18em] uppercase mb-4" style={{ color: '#A1A1A6' }}>
            Key Findings
          </p>
          <div className="space-y-3">
            {data.findings.map((finding, index) => (
              <FindingCard key={finding.id} finding={finding} index={index} />
            ))}
          </div>
          <p className="mt-6 text-xs" style={{ color: '#A1A1A6' }}>
            Based on Nielsen&apos;s Usability Heuristics
          </p>
        </>
      )}
    </section>
  );
}
