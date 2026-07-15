import type { Card, Insights } from '@/shared/types';
import type { ReasoningData } from '@/features/reasoning/types';
import type { OpportunitiesData } from '@/features/opportunities/types';
import type { DesignReviewData } from '@/features/design-review/types';
import type { PRDData } from '@/features/decisions/types';

export const DEMO_PRODUCT = 'TaskFlow';

export const DEMO_CARDS: Card[] = [
  {
    perspective: 'Looking for Simplicity',
    driver: 'Wants to get started without a learning curve',
    thought: "I'd probably skip half these settings — I just need to add a task.",
    worry: 'The product will become another tool to maintain',
    assumption: 'Simple tools win over powerful ones for small teams',
    name: 'Emily',
    occupation: 'Product Manager',
  },
  {
    perspective: 'Recognition Rather Than Recall',
    driver: 'Needs to pick up where they left off',
    thought: 'Wait, what project was I in? I have to remember everything myself.',
    worry: 'Losing context when switching between tasks',
    assumption: 'Good software should show me where I was',
    name: 'Marcus',
    occupation: 'Designer',
  },
];

export const DEMO_INSIGHTS: Insights = {
  frustrations: [{
    rank: 1,
    title: 'Context disappears between sessions',
    observation: 'Users forget which project or view they were working in',
    interpretation: 'The interface relies on memory instead of visible state',
    behavioralInsight: 'Recognition beats recall — users abandon flows they cannot re-enter',
    score: 8.5,
    impact: 'Critical',
    valueNote: 'Drives repeat abandonment before habit forms',
  }],
  hiddenNeeds: [{
    rank: 1,
    title: 'Need visible history of recent work',
    observation: 'Users look for shortcuts back to recent projects',
    interpretation: 'They want the system to remember on their behalf',
    behavioralInsight: 'Users outsource memory to the interface when cognitive load is high',
    score: 7.8,
    impact: 'High',
    valueNote: 'Reduces time-to-resume and increases daily return rate',
  }],
  decisionBarriers: [],
  trustIssues: [],
  opportunities: [],
};

export const DEMO_REASONING: ReasoningData = {
  title: 'TaskFlow — Reasoning Synthesis',
  synthesis: 'Users outsource memory to the interface — re-entry cost drives abandonment.',
  threads: [
    {
      id: 1,
      perspective: 'Recognition Rather Than Recall',
      userEvidence: 'Wait, what project was I in? I have to remember everything myself.',
      behavioralInsight: 'Recognition beats recall — users abandon flows they cannot re-enter',
      insightTitle: 'Context disappears between sessions',
      pattern: 'Users outsource spatial memory to the product when re-entry cost is high',
      confidence: 92,
    },
    {
      id: 2,
      perspective: 'Looking for Simplicity',
      userEvidence: "I'd probably skip half these settings — I just need to add a task.",
      behavioralInsight: 'Users outsource memory to the interface when cognitive load is high',
      insightTitle: 'Need visible history of recent work',
      pattern: 'Extraneous configuration competes with core task completion',
      confidence: 85,
    },
  ],
};

export const DEMO_OPPORTUNITIES: OpportunitiesData = {
  title: 'TaskFlow — Design Opportunities',
  synthesis: 'Biggest leverage is reducing memory burden at re-entry and on first use.',
  opportunities: [
    {
      id: 1,
      title: 'Surface recent context',
      observation: 'Users forget which project they were in when returning',
      behavioralInsight: 'Recognition beats recall — users abandon flows they cannot re-enter',
      opportunity: 'Make recent work visible without requiring users to search',
      designDirection: 'Show 3 most recent projects and last-active board on the home screen',
      impact: 'Critical',
      confidence: 92,
      sourcePerspective: 'Recognition Rather Than Recall',
    },
    {
      id: 2,
      title: 'Progressive settings disclosure',
      observation: 'Users skip settings to get to core task creation',
      behavioralInsight: 'Users outsource memory to the interface when cognitive load is high',
      opportunity: 'Reduce upfront configuration burden on first use',
      designDirection: 'Collapse advanced settings behind progressive disclosure until first task is complete',
      impact: 'High',
      confidence: 85,
      sourcePerspective: 'Looking for Simplicity',
    },
  ],
};

export const DEMO_DESIGN_REVIEW: DesignReviewData = {
  title: 'TaskFlow — AI Design Review',
  synthesis: 'Evidence converges on memory burden and missing visible state across frameworks.',
  frameworks: [
    {
      frameworkId: 'nielsen',
      framework: 'Nielsen Heuristics',
      findings: [
        {
          id: 1,
          principle: 'Recognition Rather Than Recall',
          relevance: 'Users must remember their previous project — the interface does not surface recent context.',
          evidence: 'Wait, what project was I in? I have to remember everything myself.',
          behavioralInsight: 'Recognition beats recall — users abandon flows they cannot re-enter',
          implication: 'Persist previous selections and display recent history on the home screen.',
          severity: 'High',
          confidence: 92,
          sourcePerspective: 'Recognition Rather Than Recall',
          sourceInsightTitle: 'Context disappears between sessions',
        },
        {
          id: 2,
          principle: 'Visibility of System Status',
          relevance: 'Users cannot see which project is currently active.',
          evidence: 'Users repeatedly forget previous selections and need to re-enter information.',
          behavioralInsight: 'Users outsource memory to the interface when cognitive load is high',
          implication: 'Show active project and last-visited board persistently in the nav.',
          severity: 'High',
          confidence: 88,
          sourcePerspective: 'Looking for Simplicity',
          sourceInsightTitle: 'Need visible history of recent work',
        },
      ],
    },
    {
      frameworkId: 'cognitive-load',
      framework: 'Cognitive Load',
      findings: [
        {
          id: 3,
          principle: 'Extraneous cognitive load',
          relevance: 'Settings complexity competes with the core task-creation flow.',
          evidence: "I'd probably skip half these settings — I just need to add a task.",
          behavioralInsight: 'Users outsource memory to the interface when cognitive load is high',
          implication: 'Defer non-essential configuration until after first successful task.',
          severity: 'Medium',
          confidence: 81,
          sourcePerspective: 'Looking for Simplicity',
          sourceInsightTitle: 'Context disappears between sessions',
        },
      ],
    },
    {
      frameworkId: 'apple-hig',
      framework: 'Apple HIG',
      findings: [
        {
          id: 4,
          principle: 'Clarity',
          relevance: 'Users cannot quickly orient to where they are in the product hierarchy.',
          evidence: 'Wait, what project was I in? I have to remember everything myself.',
          behavioralInsight: 'Need visible history of recent work',
          implication: 'Add persistent breadcrumb showing active project and board.',
          severity: 'High',
          confidence: 86,
          sourcePerspective: 'Recognition Rather Than Recall',
          sourceInsightTitle: 'Need visible history of recent work',
        },
      ],
    },
  ],
};

export const DEMO_PRD: PRDData = {
  title: 'TaskFlow — Product Decision Framework',
  sections: [
    {
      id: 1,
      name: 'Persist recent context',
      priority: 'Critical',
      impact: 'High',
      confidence: 91,
      effort: 'Medium',
      problem: 'Users lose project context between sessions and cannot resume work',
      userStory: 'When a user returns after a break, they need to see their last project so they can continue without searching',
      requirement: 'Display the 3 most recent projects and last-active board on the home screen',
      successMetric: '80% of returning users open a recent project within 10 seconds',
      userEvidence: 'Users repeatedly forget previous selections and need to re-enter information.',
      behavioralInsight: 'Context disappears between sessions',
      relatedHeuristic: 'Recognition Rather Than Recall (Nielsen)',
    },
    {
      id: 2,
      name: 'Show active state',
      priority: 'High',
      impact: 'High',
      confidence: 86,
      effort: 'Low',
      problem: 'Users cannot tell which project is currently active',
      userStory: 'When a user is deep in a project, they need persistent wayfinding so they do not feel lost',
      requirement: 'Add a persistent breadcrumb showing active project and board in the top nav',
      successMetric: 'Reduce navigation-related support questions by 40%',
      userEvidence: 'Wait, what project was I in? I have to remember everything myself.',
      behavioralInsight: 'Need visible history of recent work',
      relatedHeuristic: 'Clarity (Apple HIG)',
    },
  ],
};

// Legacy aliases for hash migration
export const DEMO_UX_REVIEW = DEMO_DESIGN_REVIEW;
