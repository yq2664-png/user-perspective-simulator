import { useEffect, useRef, useState } from 'react';
import { encodeShare } from '@/shared/lib/shareLink';
import type { Insights } from '@/shared/types';
import type { OpportunitiesData } from '@/features/opportunities/types';
import type { DesignReviewData } from '@/features/design-review/types';
import { ReasoningChain } from '@/features/ux-review/components/ReasoningChain';
import type { PRDData, PRDSection } from './types';
import { getPrd } from './api';

interface Props {
  productName: string;
  insights: Insights;
  opportunitiesData: OpportunitiesData | null;
  designReviewData: DesignReviewData;
  prdData: PRDData | null;
  setPrdData: (d: PRDData) => void;
  onGoLanding: () => void;
  onNewProduct: () => void;
}

const PRIORITY_ORDER = ['Critical', 'High', 'Medium', 'Low'] as const;

const DECISION_STEPS = [
  'Following the evidence chains forward',
  'Connecting opportunities to framework findings',
  'Grounding each decision in user proof',
  'Defining how success would be measured',
];

function DecisionThread({ section, index }: { section: PRDSection; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);

  const reasoningSteps = [
    { label: 'User evidence', content: section.userEvidence },
    { label: 'Behavioral insight', content: section.behavioralInsight, emphasis: true },
    { label: 'Design principle', content: section.relatedHeuristic },
    { label: 'Product decision', content: section.requirement, emphasis: true },
  ];

  return (
    <div
      className="card-enter rounded-2xl overflow-hidden"
      style={{ animationDelay: `${index * 70}ms`, background: 'white', border: '1px solid #D2D2D7' }}
    >
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full px-6 sm:px-8 py-5 text-left flex items-start justify-between gap-4"
        style={{ background: expanded ? '#FBFAF6' : 'white' }}
      >
        <div className="min-w-0">
          <p className="text-[10px] tracking-[0.18em] uppercase mb-2" style={{ color: '#A1A1A6' }}>
            Decision {String(index + 1).padStart(2, '0')}
          </p>
          <p className="text-sm font-semibold leading-snug" style={{ color: '#1D1D1F' }}>
            {section.name}
          </p>
          {!expanded && (
            <p className="text-xs mt-2 line-clamp-2 leading-relaxed" style={{ color: '#6E6E73' }}>
              {section.requirement}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0 pt-1">
          <span className="text-[9px] tracking-widest uppercase hidden sm:block" style={{ color: '#6E6E73' }}>
            {section.confidence}% grounded
          </span>
          <svg
            width="12" height="12" viewBox="0 0 12 12" fill="none"
            className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            style={{ color: '#A1A1A6' }}
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-6 sm:px-8 pb-8" style={{ borderTop: '1px solid #FBFAF6' }}>
          <div className="pt-6 mb-6">
            <ReasoningChain steps={reasoningSteps} />
          </div>
          <div className="pt-5 space-y-4" style={{ borderTop: '1px solid #FBFAF6' }}>
            <div>
              <p className="text-[9px] tracking-[0.14em] uppercase mb-1.5" style={{ color: '#8E8E93' }}>Problem</p>
              <p className="text-sm leading-relaxed" style={{ color: '#6E6E73' }}>{section.problem}</p>
            </div>
            <div>
              <p className="text-[9px] tracking-[0.14em] uppercase mb-1.5" style={{ color: '#8E8E93' }}>User story</p>
              <p className="text-sm leading-relaxed" style={{ color: '#6E6E73' }}>{section.userStory}</p>
            </div>
            <div>
              <p className="text-[9px] tracking-[0.14em] uppercase mb-1.5" style={{ color: '#8E8E93' }}>Success signal</p>
              <p className="text-sm leading-relaxed" style={{ color: '#6E6E73' }}>{section.successMetric}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DecisionsPage({
  productName,
  insights,
  opportunitiesData,
  designReviewData,
  prdData,
  setPrdData,
  onGoLanding,
  onNewProduct,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const startedRef = useRef(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (startedRef.current || prdData) return;
    startedRef.current = true;
    fetchDecisions();
  }, []);

  async function fetchDecisions() {
    setLoading(true);
    setStep(0);
    setError('');
    let s = 0;
    timer.current = setInterval(() => {
      s = Math.min(s + 1, DECISION_STEPS.length - 1);
      setStep(s);
    }, 2800);
    try {
      const data = await getPrd(productName, insights, designReviewData, opportunitiesData ?? {
        title: `${productName} — Design Opportunities`,
        synthesis: '',
        opportunities: [],
      });
      setPrdData(data);
    } catch (e: any) {
      setError(e.message || 'Something went wrong.');
    } finally {
      if (timer.current) { clearInterval(timer.current); timer.current = null; }
      setLoading(false);
    }
  }

  function copyShareLink() {
    if (!prdData) return;
    const payload = encodeShare({ prdData, designReviewData, opportunitiesData, productName });
    const url = `${window.location.origin}/#decisions=${payload}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function exportPDF() {
    if (!prdData) return;
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const margin = 20;
    const pageW = 210;
    const contentW = pageW - margin * 2;
    let y = margin;

    const write = (text: string, size: number, style: 'normal' | 'bold', color: [number, number, number], gap = 4) => {
      doc.setFontSize(size);
      doc.setFont('helvetica', style);
      doc.setTextColor(...color);
      for (const line of doc.splitTextToSize(text, contentW)) {
        if (y > 272) { doc.addPage(); y = margin; }
        doc.text(line, margin, y);
        y += size * 0.45;
      }
      y += gap;
    };

    write('Evidence-backed Product Decisions', 16, 'bold', [10, 10, 10]);
    write(productName, 11, 'normal', [80, 80, 80], 8);

    for (const section of prdData.sections) {
      if (y > 230) { doc.addPage(); y = margin; }
      write(section.name, 11, 'bold', [20, 20, 20], 2);
      write(`Evidence: ${section.userEvidence}`, 9, 'normal', [100, 100, 100], 1);
      write(`Insight: ${section.behavioralInsight}`, 9, 'normal', [80, 80, 80], 1);
      write(`Principle: ${section.relatedHeuristic}`, 9, 'normal', [80, 80, 80], 1);
      write(`Decision: ${section.requirement}`, 9, 'normal', [50, 50, 50], 6);
    }

    doc.save(`${productName.replace(/\s+/g, '-').toLowerCase()}-decisions.pdf`);
  }

  return (
    <main className="step-page">
      <div className="step-header">
        <p className="label-tag">{productName}</p>
        <div className="flex items-end gap-5">
          <h1 className="font-semibold text-[#1D1D1F] leading-tight" style={{ fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-0.3px' }}>
            Decision
          </h1>
          {loading && (
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="thinking-dot" /><div className="thinking-dot" /><div className="thinking-dot" />
            </div>
          )}
        </div>
        <p className="mt-3 text-sm" style={{ color: '#6E6E73' }}>
          How should you change it?
        </p>

        {loading && (
          <div className="step-progress">
            {DECISION_STEPS.map((s, i) => (
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
          <button onClick={() => { startedRef.current = false; fetchDecisions(); }} className="btn-primary text-xs">Retry</button>
        </div>
      )}

      {loading && (
        <div className="space-y-4 mb-16">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-6 rounded-2xl" style={{ background: '#FBFAF6' }}>
              <div className="loading-bar h-2.5 w-full rounded" />
            </div>
          ))}
        </div>
      )}

      {prdData && !loading && (
        <section className="mb-10">
          <div className="space-y-4">
            {[...prdData.sections]
              .sort((a, b) => PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority))
              .map((section, i) => (
                <DecisionThread key={section.id} section={section} index={i} />
              ))}
          </div>

          <div className="mt-10 pt-10 space-y-6" style={{ borderTop: '1px solid #D2D2D7' }}>
            <div>
              <p className="step-section-title">Export</p>
              <p className="text-sm mb-4" style={{ color: '#6E6E73' }}>How do you hand this off to the team?</p>
            </div>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <p className="text-sm" style={{ color: '#6E6E73' }}>
                {prdData.sections.length} grounded decisions
              </p>
              <div className="flex items-center gap-3">
                <button onClick={copyShareLink} className="btn-secondary">
                  {copied ? 'Link copied' : 'Copy link to share'}
                </button>
                <button onClick={exportPDF} className="btn-primary">Export decisions</button>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2" style={{ borderTop: '1px solid #D2D2D7' }}>
              <button onClick={onGoLanding} className="btn-secondary">Back to home</button>
              <button onClick={onNewProduct} className="btn-secondary">New product</button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
