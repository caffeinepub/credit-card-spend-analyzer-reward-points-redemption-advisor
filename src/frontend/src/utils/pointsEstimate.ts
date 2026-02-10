import type { Transaction } from '@/types/transactions';
import type { EarningRates, PointsEstimate } from '@/types/earningRates';

export function estimatePointsEarned(
  transactions: Transaction[],
  rates: EarningRates,
  from: Date,
  to: Date
): PointsEstimate {
  const filtered = transactions.filter((t) => {
    const date = new Date(t.date);
    return date >= from && date <= to;
  });

  const byCategory: Record<string, number> = {};

  filtered.forEach((t) => {
    // Check for card-specific override first
    let rate = rates.categoryRates[t.category] || 1;
    if (t.cardLabel && rates.cardOverrides[t.cardLabel]?.[t.category]) {
      rate = rates.cardOverrides[t.cardLabel][t.category];
    }

    const points = t.amount * rate;
    byCategory[t.category] = (byCategory[t.category] || 0) + points;
  });

  const total = Object.values(byCategory).reduce((sum, p) => sum + p, 0);

  return { byCategory, total };
}
