export type OpportunityImpact = 'Critical' | 'High' | 'Medium' | 'Low';

export interface DesignOpportunity {
  id: number;
  title: string;
  observation: string;
  behavioralInsight: string;
  opportunity: string;
  designDirection: string;
  impact: OpportunityImpact;
  confidence: number;
  sourcePerspective: string;
}

export interface OpportunitiesData {
  title: string;
  synthesis: string;
  opportunities: DesignOpportunity[];
}
