import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { TopMerchant } from '@/utils/analytics';

interface TopMerchantsListProps {
  merchants: TopMerchant[];
}

export default function TopMerchantsList({ merchants }: TopMerchantsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Merchants</CardTitle>
        <CardDescription>Your most frequent spending destinations</CardDescription>
      </CardHeader>
      <CardContent>
        {merchants.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">No data available</div>
        ) : (
          <div className="space-y-3">
            {merchants.slice(0, 5).map((merchant, idx) => (
              <div key={merchant.merchant} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-medium">{merchant.merchant}</div>
                    <div className="text-xs text-muted-foreground">
                      {merchant.count} transaction{merchant.count !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <div className="text-right font-semibold">${merchant.total.toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
