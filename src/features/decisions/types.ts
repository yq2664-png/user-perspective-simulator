export type EffortLevel = 'High' | 'Medium' | 'Low';

export interface PRDSection {
  id: number;
  name: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  impact: 'High' | 'Medium' | 'Low';
  confidence: number;
  effort: EffortLevel;
  problem: string;
  userStory: string;
  requirement: string;
  successMetric: string;
  userEvidence: string;
  behavioralInsight: string;
  relatedHeuristic: string;
}

export interface PRDData {
  title: string;
  sections: PRDSection[];
}
