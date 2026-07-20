import { useState } from 'react';
import type { AnalysisDepth } from '@/app/analysisDepth';

interface Props {
  productName: string;
  onContinue: (depth: AnalysisDepth) => void;
}

function WorkflowChain({ steps }: { steps: string[] }) {
  return (
    <div className="mt-4">
      {steps.map((step, i) => (
        <div key={step} className="flex gap-3">
          <div className="flex flex-col items-center w-4 shrink-0 pt-1">
            <div
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: i === 0 ? '#127A74' : '#A1A1A6' }}
            />
            {i < steps.length - 1 && (
              <div className="w-px flex-1 my-1" style={{ background: '#D2D2D7', minHeight: 16 }} />
            )}
          </div>
          <div className={`flex-1 min-w-0 ${i < steps.length - 1 ? 'pb-3' : ''}`}>
            <p className="text-xs leading-relaxed" style={{ color: '#8E8E93' }}>{step}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChoiceOption({
  selected,
  onSelect,
  title,
  subtitle,
  workflow,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  subtitle: string;
  workflow: string[];
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="h-full w-full text-left rounded-2xl p-6 sm:p-8 transition-colors"
      style={{
        background: selected ? '#FBFAF6' : 'white',
        border: selected ? '1px solid #127A74' : '1px solid #D2D2D7',
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="mt-0.5 w-4 h-4 rounded-full shrink-0 flex items-center justify-center"
          style={{ border: `2px solid ${selected ? '#127A74' : '#C7C7CC'}` }}
        >
          {selected && <div className="w-2 h-2 rounded-full" style={{ background: '#127A74' }} />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-[#1D1D1F] mb-1">{title}</p>
          <p className="text-sm leading-relaxed mb-2" style={{ color: '#6E6E73' }}>{subtitle}</p>
          <WorkflowChain steps={workflow} />
        </div>
      </div>
    </button>
  );
}

export default function AnalysisDepthPage({ productName, onContinue }: Props) {
  const [depth, setDepth] = useState<AnalysisDepth>('standard');

  return (
    <main className="step-page">
      <div className="step-header">
        <p className="label-tag">{productName}</p>
        <h1
          className="font-semibold text-[#1D1D1F] leading-tight"
          style={{ fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-0.3px' }}
        >
          Choose analysis depth
        </h1>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6E6E73' }}>
          Your insights are ready. Choose how deep you want to go next.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:items-stretch">
        <ChoiceOption
          selected={depth === 'standard'}
          onSelect={() => setDepth('standard')}
          title="Standard Analysis"
          subtitle="Turn insights into product decisions."
          workflow={['Product Decisions']}
        />
        <ChoiceOption
          selected={depth === 'deep'}
          onSelect={() => setDepth('deep')}
          title="Deep Analysis"
          subtitle="Continue into design reasoning and review before deciding."
          workflow={['Reasoning', 'Review', 'Product Decisions']}
        />
      </div>

      <div className="mt-10 flex justify-center">
        <button type="button" onClick={() => onContinue(depth)} className="btn-primary">
          Continue
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </main>
  );
}
