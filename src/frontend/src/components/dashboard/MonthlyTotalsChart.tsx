import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { MonthlyTotal } from '@/utils/analytics';

interface MonthlyTotalsChartProps {
  data: MonthlyTotal[];
}

export default function MonthlyTotalsChart({ data }: MonthlyTotalsChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Spending</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const maxTotal = Math.max(...data.map((d) => d.total));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Spending</CardTitle>
        <CardDescription>Total spending by month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item) => {
            const percentage = maxTotal > 0 ? (item.total / maxTotal) * 100 : 0;
            const [year, month] = item.month.split('-');
            const date = new Date(parseInt(year), parseInt(month) - 1);
            const label = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

            return (
              <div key={item.month} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{label}</span>
                  <span className="text-muted-foreground">${item.total.toFixed(2)}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-chart-1 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
