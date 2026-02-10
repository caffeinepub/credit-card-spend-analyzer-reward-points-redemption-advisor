import { useState, useMemo } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DateRangePicker from '@/components/dashboard/DateRangePicker';
import MonthlyTotalsChart from '@/components/dashboard/MonthlyTotalsChart';
import CategoryBreakdownChart from '@/components/dashboard/CategoryBreakdownChart';
import TopMerchantsList from '@/components/dashboard/TopMerchantsList';
import PointsEstimateSummary from '@/components/dashboard/PointsEstimateSummary';
import { computeAnalytics } from '@/utils/analytics';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: transactions = [], isLoading } = useTransactions();
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1),
    to: new Date(),
  });

  const analytics = useMemo(() => {
    return computeAnalytics(transactions, dateRange.from, dateRange.to);
  }, [transactions, dateRange]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-32 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <img
              src="/assets/generated/spend-dashboard-illustration.dim_1600x900.png"
              alt="No transactions"
              className="w-full max-w-md mb-8 rounded-lg opacity-80"
            />
            <h3 className="text-2xl font-semibold mb-2">No Transactions Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start by adding your credit card transactions to see spending analytics and insights.
            </p>
            <Button onClick={() => navigate({ to: '/transactions' })}>Add Transactions</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Spend
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${analytics.totalSpend.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Avg Monthly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${analytics.avgMonthlySpend.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Per month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Top Category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">{analytics.biggestCategory || 'N/A'}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.biggestCategoryAmount > 0 ? `$${analytics.biggestCategoryAmount.toFixed(2)}` : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              {analytics.momChange >= 0 ? (
                <TrendingUp className="h-4 w-4 text-chart-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              MoM Change
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-bold ${analytics.momChange >= 0 ? 'text-chart-1' : 'text-destructive'}`}
            >
              {analytics.momChange >= 0 ? '+' : ''}
              {analytics.momChange.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">vs previous month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <MonthlyTotalsChart data={analytics.monthlyTotals} />
        <CategoryBreakdownChart data={analytics.categoryTotals} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TopMerchantsList merchants={analytics.topMerchants} />
        <PointsEstimateSummary transactions={transactions} dateRange={dateRange} />
      </div>
    </div>
  );
}
