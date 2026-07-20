import { useEffect, useRef, useState } from 'react';
import { decodeShare } from '@/shared/lib/shareLink';
import {
  trackAnalysisDepthSelected,
  trackCtaClicked,
  trackFlowStarted,
  trackPageView,
  trackPipelineCompleted,
  trackStepCompleted,
} from '@/shared/lib/analytics';
import type { AnalysisDepth } from './analysisDepth';
import { getNavSteps } from './analysisDepth';
import type { Page } from './routes';
import type { FormData, Card, Insights } from '@/shared/types';
import type { RealCard } from '@/features/perspectives/types';
import type { PRDData } from '@/features/decisions/types';
import type { OpportunitiesData } from '@/features/opportunities/types';
import type { DesignReviewData } from '@/features/design-review/types';
import type { ReasoningData } from '@/features/reasoning/types';
import LandingPage from '@/features/landing/LandingPage';
import InputPage from '@/features/intake/InputPage';
import AnalysisDepthPage from '@/features/analysis/AnalysisDepthPage';
import SimulationPage from '@/features/perspectives/SimulationPage';
import InsightPage from '@/features/insights/InsightPage';
import ReasoningPage from '@/features/reasoning/ReasoningPage';
import DesignReviewPage from '@/features/design-review/DesignReviewPage';
import DecisionsPage from '@/features/decisions/DecisionsPage';
import {
  DEMO_PRODUCT,
  DEMO_REASONING,
  DEMO_CARDS,
  DEMO_INSIGHTS,
  DEMO_OPPORTUNITIES,
  DEMO_DESIGN_REVIEW,
  DEMO_PRD,
} from './demoData';

const BLANK_FORM: FormData = {
  productName: '',
  productStage: '',
  productType: '',
  coreFunctions: '',
  webLink: '',
  requirements: '',
  featureConstraints: [],
  timeConstraints: [],
  screenshots: [],
  documents: [],
};

const hasPerspectiveEvidence = (cards: Card[], realCards: RealCard[]) =>
  cards.length > 0 || realCards.length > 0;

export default function App() {
  const [page, setPage] = useState<Page>('landing');
  const [formData, setFormData] = useState<FormData>({ ...BLANK_FORM });
  const [cards, setCards] = useState<Card[]>([]);
  const [realCards, setRealCards] = useState<RealCard[]>([]);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [reasoningData, setReasoningData] = useState<ReasoningData | null>(null);
  const [opportunitiesData, setOpportunitiesData] = useState<OpportunitiesData | null>(null);
  const [designReviewData, setDesignReviewData] = useState<DesignReviewData | null>(null);
  const [prdData, setPrdData] = useState<PRDData | null>(null);
  const [flowStarted, setFlowStarted] = useState(false);
  const [analysisDepth, setAnalysisDepth] = useState<AnalysisDepth | null>(null);
  const skipAnalytics = useRef(
    new URLSearchParams(window.location.search).has('demo'),
  );
  const pipelineCompletedTracked = useRef(false);

  useEffect(() => {
    if (skipAnalytics.current) return;
    trackPageView(page);
  }, [page]);

  useEffect(() => {
    if (skipAnalytics.current || !prdData || page !== 'decision' || pipelineCompletedTracked.current) {
      return;
    }
    pipelineCompletedTracked.current = true;
    trackPipelineCompleted();
  }, [prdData, page]);

  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has('demo')) return;
    skipAnalytics.current = true;
    setFormData(prev => ({ ...prev, productName: DEMO_PRODUCT, productStage: 'unpublished' }));
    setCards(DEMO_CARDS);
    setInsights(DEMO_INSIGHTS);
    setReasoningData(DEMO_REASONING);
    setOpportunitiesData(DEMO_OPPORTUNITIES);
    setDesignReviewData(DEMO_DESIGN_REVIEW);
    setPrdData(DEMO_PRD);
    setFlowStarted(true);
    setAnalysisDepth('deep');
    setPage('decision');
    window.history.replaceState(null, '', window.location.pathname);
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#insights=')) {
      try {
        const data = decodeShare<{ insights: Insights; productName: string }>(hash.slice(10));
        if (data.insights && data.productName) {
          setInsights(data.insights);
          setFormData(prev => ({ ...prev, productName: data.productName }));
          setFlowStarted(true);
          setPage('insights');
          window.history.replaceState(null, '', window.location.pathname);
        }
      } catch {}
    } else if (hash.startsWith('#decisions=') || hash.startsWith('#prd=')) {
      try {
        const payload = hash.startsWith('#decisions=') ? hash.slice(11) : hash.slice(5);
        const data = decodeShare<{
          prdData: PRDData;
          designReviewData?: DesignReviewData;
          uxReviewData?: DesignReviewData;
          opportunitiesData?: OpportunitiesData;
          productName: string;
        }>(payload);
        if (data.prdData && data.productName) {
          setPrdData(data.prdData);
          if (data.designReviewData || data.uxReviewData) {
            setDesignReviewData(data.designReviewData || data.uxReviewData!);
          }
          if (data.opportunitiesData) setOpportunitiesData(data.opportunitiesData);
          setFormData(prev => ({ ...prev, productName: data.productName }));
          setFlowStarted(true);
          setAnalysisDepth(data.designReviewData || data.uxReviewData ? 'deep' : 'standard');
          setPage('decision');
          window.history.replaceState(null, '', window.location.pathname);
        }
      } catch {}
    }
  }, []);

  const navigate = (p: Page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setPage(p), 50);
  };

  const steps = getNavSteps(analysisDepth);
  const stepIndex =
    page === 'analysis-depth'
      ? steps.findIndex(s => s.page === 'insights') + 1
      : steps.findIndex(s => s.page === page);

  const isReachable = (p: Page) => {
    if (p === 'input') return true;
    if (p === 'simulation') return flowStarted;
    if (p === 'insights') {
      return flowStarted && hasPerspectiveEvidence(cards, realCards);
    }
    if (p === 'reasoning') return analysisDepth === 'deep' && insights !== null;
    if (p === 'review') return analysisDepth === 'deep' && reasoningData !== null;
    if (p === 'decision') {
      if (analysisDepth === 'standard') return insights !== null;
      if (analysisDepth === 'deep') return designReviewData !== null;
    }
    return false;
  };

  const resetDownstream = (from: Page) => {
    if (from === 'input' || from === 'simulation' || from === 'insights') {
      setReasoningData(null);
      setOpportunitiesData(null);
      setDesignReviewData(null);
      setPrdData(null);
    } else if (from === 'reasoning') {
      setOpportunitiesData(null);
      setDesignReviewData(null);
      setPrdData(null);
    } else if (from === 'review') {
      setPrdData(null);
    }
  };

  const resetAll = () => {
    setFormData({ ...BLANK_FORM });
    setCards([]);
    setRealCards([]);
    setInsights(null);
    setReasoningData(null);
    setOpportunitiesData(null);
    setDesignReviewData(null);
    setPrdData(null);
    setFlowStarted(false);
    setAnalysisDepth(null);
  };

  return (
    <div className="min-h-screen" style={{ background: '#FDFCF9' }}>
      <nav
        className="sticky top-0 z-10"
        style={{
          background: '#FDFCF9',
          borderBottom: '1px solid rgba(224, 217, 203, 0.35)',
        }}
      >
        {page === 'landing' ? (
          <div className="page-container flex items-center h-11">
            <button
              onClick={() => navigate(page === 'landing' ? 'landing' : 'simulation')}
              className="text-xs font-semibold tracking-[0.12em] uppercase text-[#1D1D1F]"
            >
              User OS
            </button>
          </div>
        ) : (
          <div className="page-container py-2">
            <div className="flex items-stretch">
              <button
                onClick={() => navigate('landing')}
                className="text-xs font-semibold tracking-[0.12em] uppercase text-[#1D1D1F] pr-4 sm:pr-6 flex items-center shrink-0"
                style={{ borderRight: '1px solid rgba(224, 217, 203, 0.5)' }}
              >
                User OS
              </button>

              <div className="flex flex-1 pl-2 sm:pl-4 min-w-0 overflow-x-auto">
                <div className="flex min-w-max flex-1 gap-0">
                  {steps.map((step, i) => {
                    const isDone = stepIndex > i;
                    const isActive = stepIndex === i;
                    const clickable = isDone && isReachable(step.page);
                    return (
                      <button
                        key={step.page}
                        onClick={() => clickable && navigate(step.page)}
                        disabled={!clickable}
                        className={`flex flex-col gap-1.5 py-1 min-w-[68px] sm:min-w-0 sm:flex-1 px-1 sm:px-0 ${clickable ? 'cursor-pointer' : 'cursor-default'}`}
                      >
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{
                            background: isActive ? '#127A74' : isDone ? '#6E6E73' : '#A1A1A6',
                          }} />
                          <span
                            className="text-[10px] sm:text-[11px] font-medium truncate"
                            style={{ color: isActive ? '#127A74' : isDone ? '#1D1D1F' : '#A1A1A6' }}
                          >
                            {step.label}
                          </span>
                        </div>
                        <div className="h-px w-full overflow-hidden" style={{ background: '#EDE9E0' }}>
                          <div
                            className="h-full transition-all duration-500"
                            style={{
                              width: isDone || isActive ? '100%' : '0%',
                              background: isActive ? '#127A74' : '#6E6E73',
                              opacity: isDone ? 0.4 : isActive ? 1 : 0,
                            }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      <div key={page} className="animate-fade-in">
        {page === 'landing' && (
          <LandingPage onStart={() => {
            trackCtaClicked('get_started');
            navigate('input');
          }} />
        )}
        {page === 'input' && (
          <InputPage
            formData={formData}
            setFormData={setFormData}
            onSubmit={() => {
              setCards([]);
              setRealCards([]);
              setInsights(null);
              setReasoningData(null);
              setOpportunitiesData(null);
              setDesignReviewData(null);
              setPrdData(null);
              pipelineCompletedTracked.current = false;
              setFlowStarted(true);
              setAnalysisDepth(null);
              if (!skipAnalytics.current) {
                trackFlowStarted({ product_stage: formData.productStage });
              }
              navigate('simulation');
            }}
          />
        )}
        {page === 'simulation' && flowStarted && (
          <SimulationPage
            formData={formData}
            cards={cards}
            setCards={setCards}
            realCards={realCards}
            setRealCards={setRealCards}
            onNext={(cardsForAnalysis) => {
              setCards(cardsForAnalysis);
              setAnalysisDepth(null);
              setInsights(null);
              resetDownstream('simulation');
              if (!skipAnalytics.current) trackStepCompleted('simulation');
              navigate('insights');
            }}
          />
        )}
        {page === 'insights' && flowStarted && hasPerspectiveEvidence(cards, realCards) && (
          <InsightPage
            productName={formData.productName}
            cards={cards}
            insights={insights}
            setInsights={setInsights}
            onNext={(selectedInsights) => {
              setInsights(selectedInsights);
              resetDownstream('insights');
              if (!skipAnalytics.current) trackStepCompleted('insights');
              navigate('analysis-depth');
            }}
          />
        )}
        {page === 'analysis-depth' && flowStarted && hasPerspectiveEvidence(cards, realCards) && insights && (
          <AnalysisDepthPage
            productName={formData.productName || 'Your product'}
            onContinue={(depth) => {
              setAnalysisDepth(depth);
              if (depth === 'standard') {
                setReasoningData(null);
                setOpportunitiesData(null);
                setDesignReviewData(null);
                setPrdData(null);
              }
              if (!skipAnalytics.current) trackAnalysisDepthSelected(depth);
              navigate(depth === 'standard' ? 'decision' : 'reasoning');
            }}
          />
        )}
        {page === 'reasoning' && analysisDepth === 'deep' && insights && (
          <ReasoningPage
            productName={formData.productName}
            cards={cards}
            insights={insights}
            reasoningData={reasoningData}
            setReasoningData={setReasoningData}
            opportunitiesData={opportunitiesData}
            setOpportunitiesData={setOpportunitiesData}
            onNext={() => {
              resetDownstream('reasoning');
              if (!skipAnalytics.current) trackStepCompleted('reasoning');
              navigate('review');
            }}
          />
        )}
        {page === 'review' && analysisDepth === 'deep' && insights && (
          <DesignReviewPage
            productName={formData.productName}
            cards={cards}
            insights={insights}
            opportunitiesData={opportunitiesData}
            setOpportunitiesData={setOpportunitiesData}
            designReviewData={designReviewData}
            setDesignReviewData={setDesignReviewData}
            onNext={() => {
              resetDownstream('review');
              if (!skipAnalytics.current) trackStepCompleted('review');
              navigate('decision');
            }}
          />
        )}
        {page === 'decision' && insights && analysisDepth && (
          analysisDepth === 'standard' || designReviewData
        ) && (
          <DecisionsPage
            productName={formData.productName}
            insights={insights}
            opportunitiesData={opportunitiesData}
            designReviewData={designReviewData}
            prdData={prdData}
            setPrdData={setPrdData}
            onGoLanding={() => navigate('landing')}
            onNewProduct={() => { resetAll(); navigate('input'); }}
          />
        )}
      </div>
    </div>
  );
}
