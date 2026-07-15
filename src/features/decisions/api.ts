import { postJson } from '@/shared/lib/apiClient';
import type { Insights } from '@/shared/types';
import type { OpportunitiesData } from '@/features/opportunities/types';
import type { DesignReviewData } from '@/features/design-review/types';
import type { PRDData } from './types';

export async function getPrd(
  productName: string,
  insights: Insights,
  designReview: DesignReviewData,
  opportunities: OpportunitiesData,
): Promise<PRDData> {
  const res = await postJson('/api/prd', { productName, insights, designReview, opportunities });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Product decisions failed (${res.status})`);
  if (data.error) throw new Error(data.error);
  return data;
}
