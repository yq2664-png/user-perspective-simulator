import { postJson } from '@/shared/lib/apiClient';
import type { Card, Insights } from '@/shared/types';
import type { UxExpertReviewData } from '@/features/perspectives/types';
import type { ReasoningData } from './types';

export async function getReasoning(
  productName: string,
  insights: Insights,
  cards: Card[],
  uxExpertReview?: UxExpertReviewData | null,
): Promise<ReasoningData> {
  const res = await postJson('/api/reasoning', { productName, insights, cards, uxExpertReview });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Reasoning synthesis failed (${res.status})`);
  if (data.error) throw new Error(data.error);
  return data;
}
