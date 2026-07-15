import type { UXReviewData, UXReviewIssue } from '../types';
import { ReasoningChain } from './ReasoningChain';

export function ReasoningSynthesis({ data }: { data: UXReviewData }) {
  const { summary, issues } = data;
  const strength =
    summary.overallScore >= 75 ? 'strong' :
    summary.overallScore >= 50 ? 'moderate' :
    'fragile';

  return (
    <section className="mb-16 card-enter" style={{ animationDelay: '0ms' }}>
      <p className="text-[10px] tracking-[0.18em] uppercase mb-3" style={{ color: '#127A74' }}>
        Reasoning synthesis
      </p>
      <p className="text-xl sm:text-2xl font-medium leading-snug mb-6" style={{ color: '#1D1D1F', letterSpacing: '-0.2px' }}>
        {summary.criticalIssueCount > 0
          ? `User evidence points to ${summary.criticalIssueCount} high-impact pattern${summary.criticalIssueCount !== 1 ? 's' : ''} before product decisions can be made.`
          : 'User evidence shows manageable friction — the reasoning can proceed to product decisions.'}
      </p>

      <div className="p-6 sm:p-8 rounded-2xl" style={{ background: '#FBFAF6' }}>
        <p className="text-sm leading-relaxed mb-5" style={{ color: '#6E6E73' }}>
          Traced {issues.length} evidence thread{issues.length !== 1 ? 's' : ''} from user perspectives through behavioral insights to UX principles.
          Reasoning strength is <span style={{ color: '#1D1D1F', fontWeight: 500 }}>{strength}</span>.
        </p>

        <div className="space-y-3">
          {summary.topUsabilityRisks.map((risk, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="text-[10px] font-medium shrink-0 mt-0.5 tabular-nums" style={{ color: '#127A74' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-sm leading-relaxed" style={{ color: '#1D1D1F' }}>{risk}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReasoningThread({ issue, index }: { issue: UXReviewIssue; index: number }) {
  const steps = [
    {
      label: 'User perspective',
      content: `${issue.sourcePerspective} — "${issue.evidence}"`,
    },
    {
      label: 'Behavioral insight',
      content: issue.behavioralInsight,
      emphasis: true,
    },
    {
      label: 'UX principle',
      content: `${issue.heuristic}. ${issue.heuristicRelevance}`,
    },
    {
      label: 'Design implication',
      content: issue.recommendation,
      emphasis: true,
    },
  ];

  return (
    <div
      className="card-enter p-6 sm:p-8 rounded-2xl"
      style={{ animationDelay: `${index * 80}ms`, background: 'white', border: '1px solid #D2D2D7' }}
    >
      <div className="flex items-center justify-between gap-4 mb-6">
        <p className="text-[10px] tracking-[0.18em] uppercase" style={{ color: '#A1A1A6' }}>
          Reasoning thread {String(index + 1).padStart(2, '0')}
        </p>
        <span className="text-[9px] tracking-widest uppercase" style={{ color: '#6E6E73' }}>
          {issue.confidence}% confidence
        </span>
      </div>

      <ReasoningChain steps={steps} />
    </div>
  );
}

export function ReasoningThreadsSection({ data }: { data: UXReviewData }) {
  const sorted = [...data.issues].sort((a, b) => b.confidence - a.confidence);

  return (
    <section className="mb-16">
      <p className="text-[10px] tracking-[0.18em] uppercase mb-3" style={{ color: '#127A74' }}>
        Evidence → principle
      </p>
      <h2 className="text-xl font-semibold mb-2" style={{ color: '#1D1D1F' }}>
        How research connects to UX principles
      </h2>
      <p className="text-sm mb-8" style={{ color: '#6E6E73' }}>
        Each thread shows how a user observation led to a Nielsen heuristic, and what that implies for design.
        No checklist — only connections the evidence supports.
      </p>

      <div className="space-y-4">
        {sorted.map((issue, i) => (
          <ReasoningThread key={issue.id} issue={issue} index={i} />
        ))}
      </div>
    </section>
  );
}
