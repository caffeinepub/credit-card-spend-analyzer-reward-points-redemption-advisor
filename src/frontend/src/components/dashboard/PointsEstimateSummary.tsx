import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEarningRates } from '@/hooks/useEarningRates';
import { estimatePointsEarned } from '@/utils/pointsEstimate';
import type { Transaction } from '@/types/transactions';
import { Sparkles } from 'lucide-react';

interface PointsEstimateSummaryProps {
  transactions: Transaction[];
  dateRange: { from: Date; to: Date };
}

export default function PointsEstimateSummary({ transactions, dateRange }: PointsEstimateSummaryProps) {
  const { rates } = useEarningRates();
  const estimate = estimatePointsEarned(transactions, rates, dateRange.from, dateRange.to);

  const topCategories = Object.entries(estimate.byCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-chart-1" />
          Estimated Points Earned
        </CardTitle>
        <CardDescription>
          Based on your earning rate assumptions{' '}
          <Badge variant="outline" className="ml-1">
            Estimate
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center py-4 border-b">
            <div className="text-4xl font-bold text-chart-1">{Math.round(estimate.total).toLocaleString()}</div>
            <div className="text-sm text-muted-foreground mt-1">Total Points</div>
          </div>

          {topCategories.length > 0 ? (
            <div className="space-y-2">
              <div className="text-sm font-medium">By Category</div>
              {topCategories.map(([category, points]) => (
                <div key={category} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{category}</span>
                  <span className="font-medium">{Math.round(points).toLocaleString()} pts</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground text-sm py-4">
              No transactions in selected range
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
