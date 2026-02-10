import { useEarningRates } from '@/hooks/useEarningRates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CATEGORIES } from '@/types/transactions';
import { Info } from 'lucide-react';

export default function EarningRatesEditor() {
  const { rates, updateCategoryRate } = useEarningRates();

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Set how many points you earn per dollar spent in each category. These rates are used to estimate points
          earned from your spending. Default is 1 point per dollar.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2">
        {CATEGORIES.map((category) => (
          <div key={category} className="space-y-2">
            <Label htmlFor={`rate-${category}`}>{category}</Label>
            <div className="flex items-center gap-2">
              <Input
                id={`rate-${category}`}
                type="number"
                step="0.1"
                min="0"
                value={rates.categoryRates[category] || 1}
                onChange={(e) => updateCategoryRate(category, parseFloat(e.target.value) || 1)}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">pts / $</span>
            </div>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Example Calculations</CardTitle>
          <CardDescription>How your rates translate to points earned</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {CATEGORIES.slice(0, 3).map((category) => {
            const rate = rates.categoryRates[category] || 1;
            const exampleSpend = 100;
            const points = exampleSpend * rate;
            return (
              <div key={category} className="flex justify-between">
                <span className="text-muted-foreground">
                  ${exampleSpend} in {category}:
                </span>
                <span className="font-medium">{points.toFixed(0)} points</span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
