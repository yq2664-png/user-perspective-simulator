import { useEffect, useRef, useState } from 'react';
import type { Card, Insights } from '@/shared/types';
import type { OpportunitiesData } from '@/features/opportunities/types';
import { getOpportunities } from '@/features/opportunities/api';
import type { DesignReviewData } from './types';
import { getDesignReview } from './api';
import { ReviewSynthesis, FrameworkSections } from './components/ReviewSections';

interface Props {
  productName: string;
  cards: Card[];
  insights: Insights;
  opportunitiesData: OpportunitiesData | null;
  setOpportunitiesData: (d: OpportunitiesData) => void;
  designReviewData: DesignReviewData | null;
  setDesignReviewData: (d: DesignReviewData) => void;
  onNext: () => void;
}

const LOADING_STEPS = [
  'Reading what users actually said',
  'Connecting patterns to behavioral insights',
  'Evaluating against Nielsen heuristics',
  'Checking WCAG, HIG, Material, cognitive load, and trust patterns',
];

export default function DesignReviewPage({
  productName,
  cards,
  insights,
  opportunitiesData,
  setOpportunitiesData,
  designReviewData,
  setDesignReviewData,
  onNext,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const startedRef = useRef(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (startedRef.current || designReviewData) return;
    startedRef.current = true;
    fetchReview();
  }, []);

  async function ensureOpportunities(): Promise<OpportunitiesData> {
    if (opportunitiesData) return opportunitiesData;
    const data = await getOpportunities(productName, insights, cards);
    setOpportunitiesData(data);
    return data;
  }

  async function fetchReview() {
    setLoading(true);
    setStep(0);
    setError('');
    let s = 0;
    timer.current = setInterval(() => {
      s = Math.min(s + 1, LOADING_STEPS.length - 1);
      setStep(s);
    }, 3000);
    try {
      const opps = await ensureOpportunities();
      const data = await getDesignReview(productName, insights, cards, opps);
      setDesignReviewData(data);
    } catch (e: any) {
      setError(e.message || 'Something went wrong.');
    } finally {
      if (timer.current) { clearInterval(timer.current); timer.current = null; }
      setLoading(false);
    }
  }

  return (
    <main className="step-page">
      <div className="step-header">
        <p className="label-tag">{productName}</p>
        <div className="flex items-end gap-5">
          <h1 className="font-semibold text-[#1D1D1F] leading-tight" style={{ fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-0.3px' }}>
            Review
          </h1>
          {loading && (
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="thinking-dot" /><div className="thinking-dot" /><div className="thinking-dot" />
            </div>
          )}
        </div>
        <p className="mt-3 text-sm" style={{ color: '#6E6E73' }}>
          Why does your design cause these problems?
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
          <button onClick={() => { startedRef.current = false; fetchReview(); }} className="btn-primary text-xs">Retry</button>
        </div>
      )}

      {loading && (
        <div className="space-y-4 mb-16">
          {[1, 2].map(i => (
            <div key={i} className="p-8 rounded-2xl" style={{ background: '#FBFAF6' }}>
              <div className="loading-bar h-2.5 w-full rounded mb-2" />
              <div className="loading-bar h-2.5 w-4/6 rounded" />
            </div>
          ))}
        </div>
      )}

      {designReviewData && !loading && (
        <>
          <ReviewSynthesis data={designReviewData} />
          <FrameworkSections data={designReviewData} />

          <div className="py-10 px-6 sm:px-10 rounded-2xl text-center" style={{ background: '#FBFAF6' }}>
            <p className="text-[10px] tracking-[0.18em] uppercase mb-3" style={{ color: '#127A74' }}>Ready to decide</p>
            <p className="text-sm mb-6 max-w-md mx-auto leading-relaxed" style={{ color: '#6E6E73' }}>
              The framework review is complete. Continue to generate evidence-backed product decisions.
            </p>
            <button onClick={onNext} className="btn-primary">
              Generate decisions
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
