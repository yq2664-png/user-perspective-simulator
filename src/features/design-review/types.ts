export type SeverityLevel = 'Low' | 'Medium' | 'High';

export const REVIEW_FRAMEWORKS = [
  { id: 'nielsen', name: 'Nielsen Heuristics' },
  { id: 'wcag', name: 'WCAG Accessibility' },
  { id: 'apple-hig', name: 'Apple HIG' },
  { id: 'material', name: 'Material Design' },
  { id: 'cognitive-load', name: 'Cognitive Load' },
  { id: 'trust', name: 'Trust & UX Patterns' },
] as const;

export type FrameworkId = typeof REVIEW_FRAMEWORKS[number]['id'];

export interface ReviewFinding {
  id: number;
  principle: string;
  relevance: string;
  evidence: string;
  behavioralInsight: string;
  implication: string;
  severity: SeverityLevel;
  confidence: number;
  sourcePerspective: string;
  sourceInsightTitle: string;
}

export interface FrameworkReview {
  frameworkId: FrameworkId;
  framework: string;
  findings: ReviewFinding[];
}

export interface DesignReviewData {
  title: string;
  synthesis: string;
  frameworks: FrameworkReview[];
}

// Legacy alias for migration
export type UXReviewData = DesignReviewData;
