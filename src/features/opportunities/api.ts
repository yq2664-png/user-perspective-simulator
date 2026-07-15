import { postJson } from '@/shared/lib/apiClient';
import type { Card, Insights } from '@/shared/types';
import type { OpportunitiesData } from './types';

export async function getOpportunities(
  productName: string,
  insights: Insights,
  cards: Card[],
): Promise<OpportunitiesData> {
  const res = await postJson('/api/opportunities', { productName, insights, cards });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Design opportunities failed (${res.status})`);
  if (data.error) throw new Error(data.error);
  return data;
}
