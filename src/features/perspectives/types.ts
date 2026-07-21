export interface RealCard {
  source: string;
  sourceUrl?: string;
  persona: string;
  quote: string;
  highlight?: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export type UxExpertSeverity = 'Low' | 'Medium' | 'High';

export interface UxExpertFinding {
  id: number;
  title: string;
  finding: string;
  why: string;
  principle: string;
  recommendation: string;
  impact: UxExpertSeverity;
}

export interface UxExpertReviewData {
  title: string;
  findings: UxExpertFinding[];
}
