import type { Transaction } from '@/types/transactions';

export interface MonthlyTotal {
  month: string;
  total: number;
}

export interface CategoryTotal {
  category: string;
  total: number;
}

export interface TopMerchant {
  merchant: string;
  total: number;
  count: number;
}

export interface Analytics {
  totalSpend: number;
  monthlyTotals: MonthlyTotal[];
  categoryTotals: CategoryTotal[];
  topMerchants: TopMerchant[];
  biggestCategory: string;
  biggestCategoryAmount: number;
  momChange: number;
  avgMonthlySpend: number;
}

export function computeAnalytics(transactions: Transaction[], from: Date, to: Date): Analytics {
  const filtered = transactions.filter((t) => {
    const date = new Date(t.date);
    return date >= from && date <= to;
  });

  const totalSpend = filtered.reduce((sum, t) => sum + t.amount, 0);

  // Monthly totals
  const monthlyMap = new Map<string, number>();
  filtered.forEach((t) => {
    const date = new Date(t.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyMap.set(key, (monthlyMap.get(key) || 0) + t.amount);
  });
  const monthlyTotals = Array.from(monthlyMap.entries())
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => a.month.localeCompare(b.month));

  // Category totals
  const categoryMap = new Map<string, number>();
  filtered.forEach((t) => {
    categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
  });
  const categoryTotals = Array.from(categoryMap.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  // Top merchants
  const merchantMap = new Map<string, { total: number; count: number }>();
  filtered.forEach((t) => {
    const existing = merchantMap.get(t.merchant) || { total: 0, count: 0 };
    merchantMap.set(t.merchant, {
      total: existing.total + t.amount,
      count: existing.count + 1,
    });
  });
  const topMerchants = Array.from(merchantMap.entries())
    .map(([merchant, data]) => ({ merchant, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  // Biggest category
  const biggestCategory = categoryTotals[0]?.category || '';
  const biggestCategoryAmount = categoryTotals[0]?.total || 0;

  // Month-over-month change
  let momChange = 0;
  if (monthlyTotals.length >= 2) {
    const lastMonth = monthlyTotals[monthlyTotals.length - 1].total;
    const prevMonth = monthlyTotals[monthlyTotals.length - 2].total;
    if (prevMonth > 0) {
      momChange = ((lastMonth - prevMonth) / prevMonth) * 100;
    }
  }

  // Average monthly spend
  const monthCount = monthlyTotals.length || 1;
  const avgMonthlySpend = totalSpend / monthCount;

  return {
    totalSpend,
    monthlyTotals,
    categoryTotals,
    topMerchants,
    biggestCategory,
    biggestCategoryAmount,
    momChange,
    avgMonthlySpend,
  };
}
