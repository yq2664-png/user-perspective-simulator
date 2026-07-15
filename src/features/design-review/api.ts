import { postJson } from '@/shared/lib/apiClient';
import type { Card, Insights } from '@/shared/types';
import type { OpportunitiesData } from '@/features/opportunities/types';
import type { DesignReviewData } from './types';

export async function getDesignReview(
  productName: string,
  insights: Insights,
  cards: Card[],
  opportunities: OpportunitiesData,
): Promise<DesignReviewData> {
  const res = await postJson('/api/design-review', { productName, insights, cards, opportunities });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Design review failed (${res.status})`);
  if (data.error) throw new Error(data.error);
  return data;
}
