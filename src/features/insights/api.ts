import { postJson } from '@/shared/lib/apiClient';
import type { Card, Insights } from '@/shared/types';
import type { UxExpertReviewData } from '@/features/perspectives/types';

export async function getInsights(
  cards: Card[],
  productName: string,
  uxExpertReview?: UxExpertReviewData | null,
): Promise<Insights> {
  const res = await postJson('/api/insights', { cards, productName, uxExpertReview });
  if (!res.ok) throw new Error('Server error');
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}
