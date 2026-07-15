import { postJson } from '@/shared/lib/apiClient';
import type { Card, Insights } from '@/shared/types';
import type { UXReviewData } from './types';

export async function getUxReview(
  productName: string,
  insights: Insights,
  cards: Card[],
): Promise<UXReviewData> {
  const res = await postJson('/api/ux-review', { productName, insights, cards });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `UX review failed (${res.status})`);
  if (data.error) throw new Error(data.error);
  return data;
}
