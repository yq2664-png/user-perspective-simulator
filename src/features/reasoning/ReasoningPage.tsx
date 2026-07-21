import { useEffect, useRef, useState } from 'react';
import type { Card, Insights } from '@/shared/types';
import type { UxExpertReviewData } from '@/features/perspectives/types';
import { ReasoningChain } from '@/features/ux-review/components/ReasoningChain';
import type { OpportunitiesData } from '@/features/opportunities/types';
import { getOpportunities } from '@/features/opportunities/api';
import type { ReasoningData, ReasoningThread } from './types';
import { getReasoning } from './api';

interface Props {
  productName: string;
  cards: Card[];
  insights: Insights;
  uxExpertReview?: UxExpertReviewData | null;
  reasoningData: ReasoningData | null;
  setReasoningData: (d: ReasoningData) => void;
  opportunitiesData: OpportunitiesData | null;
  setOpportunitiesData: (d: OpportunitiesData) => void;
  onNext: () => void;
}

const LOADING_STEPS = [
  'Reading user evidence',
  'Matching behavior patterns',
  'Connecting UX findings',
  'Building reasoning threads',
];

function ThreadCard({ thread, index }: { thread: ReasoningThread; index: number }) {
  const steps = [
    { label: 'User evidence', content: `${thread.perspective} — "${thread.userEvidence}"` },
    { label: 'Behavior pattern', content: thread.behavioralInsight, emphasis: true },
    ...(thread.uxFinding
      ? [{ label: 'UX finding', content: thread.uxFinding }]
      : []),
    { label: 'Underlying pattern', content: thread.pattern, emphasis: true },
  ];

  return (
    <div
      className="card-enter p-6 sm:p-8 rounded-2xl"
      style={{ animationDelay: `${index * 60}ms`, background: 'white', border: '1px solid #D2D2D7' }}
    >
      <ReasoningChain steps={steps} />
    </div>
  );
}

export default function ReasoningPage({
  productName,
  cards,
  insights,
  uxExpertReview,
  reasoningData,
  setReasoningData,
  opportunitiesData,
  setOpportunitiesData,
  onNext,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [continuing, setContinuing] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const startedRef = useRef(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (startedRef.current || reasoningData) return;
    startedRef.current = true;
    fetchReasoning();
  }, []);

  async function fetchReasoning() {
    setLoading(true);
    setStep(0);
    setError('');
    let s = 0;
    timer.current = setInterval(() => {
      s = Math.min(s + 1, LOADING_STEPS.length - 1);
      setStep(s);
    }, 2600);
    try {
      const data = await getReasoning(productName, insights, cards, uxExpertReview);
      setReasoningData(data);
    } catch (e: any) {
      setError(e.message || 'Something went wrong.');
    } finally {
      if (timer.current) { clearInterval(timer.current); timer.current = null; }
      setLoading(false);
    }
  }

  async function handleContinue() {
    setContinuing(true);
    setError('');
    try {
      if (!opportunitiesData) {
        const data = await getOpportunities(productName, insights, cards);
        setOpportunitiesData(data);
      }
      onNext();
    } catch (e: any) {
      setError(e.message || 'Something went wrong.');
    } finally {
      setContinuing(false);
    }
  }

  return (
    <main className="step-page">
      <div className="step-header">
        <p className="label-tag">{productName}</p>
        <div className="flex items-end gap-5">
          <h1 className="font-semibold text-[#1D1D1F] leading-tight" style={{ fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-0.3px' }}>
            Reasoning
          </h1>
          {loading && (
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="thinking-dot" /><div className="thinking-dot" /><div className="thinking-dot" />
            </div>
          )}
        </div>
        <p className="mt-3 text-sm" style={{ color: '#6E6E73' }}>
          Combine user evidence, behavior patterns, and UX findings into transparent reasoning threads.
        </p>

        {loading && (
          <div className="step-progress">
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
          <button onClick={() => { startedRef.current = false; fetchReasoning(); }} className="btn-primary text-xs">Retry</button>
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

      {reasoningData && !loading && (
        <>
          <section className="mb-10 card-enter">
            <p className="step-section-title">Synthesis</p>
            <div className="p-6 sm:p-8 rounded-2xl" style={{ background: '#FBFAF6' }}>
              <p className="text-sm leading-relaxed" style={{ color: '#6E6E73' }}>{reasoningData.synthesis}</p>
              <p className="text-xs mt-4" style={{ color: '#A1A1A6' }}>
                {reasoningData.threads.length} thread{reasoningData.threads.length !== 1 ? 's' : ''}
              </p>
            </div>
          </section>

          <section className="mb-10">
            <p className="step-section-title">Opportunity</p>
            <div className="space-y-4">
              {reasoningData.threads.map((thread, i) => (
                <ThreadCard key={thread.id} thread={thread} index={i} />
              ))}
            </div>
          </section>

          <div className="py-10 px-6 sm:px-10 rounded-2xl text-center" style={{ background: '#FBFAF6' }}>
            <p className="text-[10px] tracking-[0.18em] uppercase mb-3" style={{ color: '#127A74' }}>Next step</p>
            <p className="text-sm mb-6 max-w-md mx-auto leading-relaxed" style={{ color: '#6E6E73' }}>
              Reasoning complete. Continue to generate evidence-backed product decisions.
            </p>
            <button onClick={handleContinue} disabled={continuing} className="btn-primary">
              {continuing ? 'Preparing decisions…' : 'Generate decisions'}
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
