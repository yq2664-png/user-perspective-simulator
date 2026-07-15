import { useEffect, useRef, useState } from 'react';
import type { Card, Insights } from '@/shared/types';
import type { OpportunitiesData } from '@/features/opportunities/types';
import { getOpportunities } from '@/features/opportunities/api';
import { ReasoningChain } from '@/features/ux-review/components/ReasoningChain';
import type { DesignOpportunity } from './types';

interface Props {
  productName: string;
  cards: Card[];
  insights: Insights;
  opportunitiesData: OpportunitiesData | null;
  setOpportunitiesData: (d: OpportunitiesData) => void;
  onNext: () => void;
}

const LOADING_STEPS = [
  'Reading behavioral patterns from insights',
  'Identifying where design could intervene',
  'Tracing evidence to design directions',
  'Prioritizing by impact',
];

function OpportunityCard({ opp, index }: { opp: DesignOpportunity; index: number }) {
  const steps = [
    { label: 'User observation', content: opp.observation },
    { label: 'Behavioral insight', content: opp.behavioralInsight, emphasis: true },
    { label: 'Design opportunity', content: opp.opportunity },
    { label: 'Design direction', content: opp.designDirection, emphasis: true },
  ];

  return (
    <div
      className="card-enter p-6 sm:p-8 rounded-2xl"
      style={{ animationDelay: `${index * 70}ms`, background: 'white', border: '1px solid #D2D2D7' }}
    >
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-[10px] tracking-[0.18em] uppercase mb-1" style={{ color: '#A1A1A6' }}>
            Opportunity {String(index + 1).padStart(2, '0')}
          </p>
          <p className="text-sm font-semibold" style={{ color: '#1D1D1F' }}>{opp.title}</p>
        </div>
        <span className="text-[9px] tracking-widest uppercase shrink-0" style={{ color: '#6E6E73' }}>
          {opp.impact} · {opp.confidence}%
        </span>
      </div>
      <ReasoningChain steps={steps} />
    </div>
  );
}

export default function OpportunitiesPage({
  productName,
  cards,
  insights,
  opportunitiesData,
  setOpportunitiesData,
  onNext,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const startedRef = useRef(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (startedRef.current || opportunitiesData) return;
    startedRef.current = true;
    fetchOpportunities();
  }, []);

  async function fetchOpportunities() {
    setLoading(true);
    setStep(0);
    setError('');
    let s = 0;
    timer.current = setInterval(() => {
      s = Math.min(s + 1, LOADING_STEPS.length - 1);
      setStep(s);
    }, 2600);
    try {
      const data = await getOpportunities(productName, insights, cards);
      setOpportunitiesData(data);
    } catch (e: any) {
      setError(e.message || 'Something went wrong.');
    } finally {
      if (timer.current) { clearInterval(timer.current); timer.current = null; }
      setLoading(false);
    }
  }

  return (
    <main className="page-container py-20 sm:py-28">
      <div className="mb-12">
        <p className="label-tag mb-6">{productName}</p>
        <div className="flex items-end gap-5">
          <h1 className="font-semibold text-[#1D1D1F] leading-tight" style={{ fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-0.3px' }}>
            Design Opportunities
          </h1>
          {loading && (
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="thinking-dot" /><div className="thinking-dot" /><div className="thinking-dot" />
            </div>
          )}
        </div>
        <p className="mt-3 text-sm" style={{ color: '#6E6E73' }}>
          Where user evidence points to specific design interventions — before framework evaluation.
        </p>

        {loading && (
          <div className="mt-8 space-y-2">
            {LOADING_STEPS.map((s, i) => (
              <div key={i} className={`flex items-center gap-3 transition-all duration-300 ${i <= step ? 'opacity-100' : 'opacity-20'}`}>
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{
                  background: i < step ? '#6E6E73' : i === step ? '#127A74' : '#A1A1A6',
                }} />
                <span className="text-[10px] tracking-[0.15em] uppercase" style={{ color: i === step ? '#127A74' : '#6E6E73' }}>
                  {s}{i === step && <span className="ml-1">…</span>}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="p-6 mb-12 max-w-lg rounded-2xl" style={{ background: '#FBFAF6' }}>
          <p className="text-sm mb-4" style={{ color: '#1D1D1F' }}>{error}</p>
          <button onClick={() => { startedRef.current = false; fetchOpportunities(); }} className="btn-primary text-xs">Retry</button>
        </div>
      )}

      {loading && (
        <div className="space-y-4 mb-16">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-8 rounded-2xl" style={{ background: '#FBFAF6' }}>
              <div className="loading-bar h-2.5 w-full rounded mb-2" />
              <div className="loading-bar h-2.5 w-4/6 rounded" />
            </div>
          ))}
        </div>
      )}

      {opportunitiesData && !loading && (
        <>
          <section className="mb-16 card-enter">
            <p className="text-[10px] tracking-[0.18em] uppercase mb-3" style={{ color: '#127A74' }}>Synthesis</p>
            <div className="p-6 sm:p-8 rounded-2xl" style={{ background: '#FBFAF6' }}>
              <p className="text-sm leading-relaxed" style={{ color: '#6E6E73' }}>{opportunitiesData.synthesis}</p>
            </div>
          </section>

          <section className="mb-16">
            <p className="text-[10px] tracking-[0.18em] uppercase mb-3" style={{ color: '#127A74' }}>Insight → opportunity</p>
            <h2 className="text-xl font-semibold mb-8" style={{ color: '#1D1D1F' }}>
              {opportunitiesData.opportunities.length} evidence-backed opportunities
            </h2>
            <div className="space-y-4">
              {opportunitiesData.opportunities.map((opp, i) => (
                <OpportunityCard key={opp.id} opp={opp} index={i} />
              ))}
            </div>
          </section>

          <div className="py-10 px-6 sm:px-10 rounded-2xl text-center" style={{ background: '#FBFAF6' }}>
            <p className="text-[10px] tracking-[0.18em] uppercase mb-3" style={{ color: '#127A74' }}>Next step</p>
            <p className="text-sm mb-6 max-w-md mx-auto leading-relaxed" style={{ color: '#6E6E73' }}>
              Evaluate these opportunities against Nielsen, WCAG, Apple HIG, Material Design, Cognitive Load, and Trust patterns.
            </p>
            <button onClick={onNext} className="btn-primary">
              Run AI design review
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </>
      )}
    </main>
  );
}
