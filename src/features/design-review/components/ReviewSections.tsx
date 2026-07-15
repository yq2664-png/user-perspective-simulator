import type { DesignReviewData, ReviewFinding } from '../types';
import { ReasoningChain } from '@/features/ux-review/components/ReasoningChain';

const SECTION_GAP = 'mb-10';

export function ReviewSynthesis({ data }: { data: DesignReviewData }) {
  const totalFindings = data.frameworks.reduce((n, f) => n + f.findings.length, 0);

  return (
    <section className={`${SECTION_GAP} card-enter`} style={{ animationDelay: '0ms' }}>
      <p className="step-section-title">Review synthesis</p>
      <div className="p-6 sm:p-8 rounded-2xl" style={{ background: '#FBFAF6' }}>
        <p className="text-sm leading-relaxed" style={{ color: '#6E6E73' }}>
          {data.synthesis}
        </p>
        <p className="text-xs mt-4" style={{ color: '#A1A1A6' }}>
          {totalFindings} finding{totalFindings !== 1 ? 's' : ''} · {data.frameworks.length} framework{data.frameworks.length !== 1 ? 's' : ''}
        </p>
      </div>
    </section>
  );
}

function FindingThread({ finding, index }: { finding: ReviewFinding; index: number }) {
  const steps = [
    { label: 'User perspective', content: `${finding.sourcePerspective} — "${finding.evidence}"` },
    { label: 'Behavioral insight', content: finding.behavioralInsight, emphasis: true },
    { label: 'Design principle', content: `${finding.principle}. ${finding.relevance}` },
    { label: 'Design implication', content: finding.implication, emphasis: true },
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

export function FrameworkSections({ data }: { data: DesignReviewData }) {
  const findings = data.frameworks.flatMap(fw => fw.findings);

  return (
    <section className="mb-10">
      <p className="step-section-title">Framework review</p>
      <div className="space-y-4">
        {findings.map((finding, i) => (
          <FindingThread key={finding.id} finding={finding} index={i} />
        ))}
      </div>
    </section>
  );
}
