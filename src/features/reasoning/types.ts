export interface ReasoningThread {
  id: number;
  perspective: string;
  userEvidence: string;
  behavioralInsight: string;
  insightTitle: string;
  pattern: string;
  confidence: number;
}

export interface ReasoningData {
  title: string;
  synthesis: string;
  threads: ReasoningThread[];
}
