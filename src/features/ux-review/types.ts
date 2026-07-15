export type SeverityLevel = 'Low' | 'Medium' | 'High';

export interface UXReviewSummary {
  overallScore: number;
  topUsabilityRisks: string[];
  criticalIssueCount: number;
}

export interface UXReviewIssue {
  id: number;
  heuristic: string;
  heuristicNumber: number;
  heuristicRelevance: string;
  evidence: string;
  behavioralInsight: string;
  recommendation: string;
  severity: SeverityLevel;
  confidence: number;
  sourcePerspective: string;
  sourceInsightTitle: string;
}

export interface UXReviewData {
  title: string;
  framework: string;
  summary: UXReviewSummary;
  issues: UXReviewIssue[];
}

export interface HeuristicGroup {
  heuristic: string;
  heuristicNumber: number;
  issues: UXReviewIssue[];
}
