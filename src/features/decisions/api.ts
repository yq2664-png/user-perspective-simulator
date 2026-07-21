import { postJson } from '@/shared/lib/apiClient';
import type { Insights } from '@/shared/types';
import type { OpportunitiesData } from '@/features/opportunities/types';
import type { UxExpertReviewData } from '@/features/perspectives/types';
import type { ReasoningData } from '@/features/reasoning/types';
import type { PRDData } from './types';

export async function getPrd(
  productName: string,
  insights: Insights,
  uxExpertReview: UxExpertReviewData | null,
  opportunities: OpportunitiesData,
  reasoning?: ReasoningData | null,
): Promise<PRDData> {
  const res = await postJson('/api/prd', {
    productName,
    insights,
    uxExpertReview,
    opportunities,
    reasoning,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Product decisions failed (${res.status})`);
  if (data.error) throw new Error(data.error);
  return data;
}
