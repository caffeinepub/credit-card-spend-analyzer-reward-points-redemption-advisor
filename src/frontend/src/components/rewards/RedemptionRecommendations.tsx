import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useRewardAdvisorySettings } from '@/hooks/useRewardAdvisorySettings';
import { rankRedemptionOptions } from '@/utils/recommendations';
import { formatCPP } from '@/utils/rewardsMath';
import type { RewardPoints } from '@/backend';
import { TrendingUp, AlertTriangle } from 'lucide-react';

interface RedemptionRecommendationsProps {
  profiles: RewardPoints[];
}

export default function RedemptionRecommendations({ profiles }: RedemptionRecommendationsProps) {
  const { settings, updateSettings } = useRewardAdvisorySettings();
  const [sortBy, setSortBy] = useState<'cpp' | 'netValue'>('cpp');

  const allOptions = useMemo(() => {
    const options: Array<{ profileId: bigint; ranked: ReturnType<typeof rankRedemptionOptions> }> = [];
    profiles.forEach((profile) => {
      if (profile.options.length > 0) {
        options.push({
          profileId: profile.id,
          ranked: rankRedemptionOptions(profile.options, settings.lowValueThreshold),
        });
      }
    });
    return options;
  }, [profiles, settings.lowValueThreshold]);

  const sortedOptions = useMemo(() => {
    const flat = allOptions.flatMap((o) => o.ranked.map((r) => ({ ...r, profileId: o.profileId })));
    return flat.sort((a, b) => {
      if (sortBy === 'cpp') return b.cpp - a.cpp;
      return b.netValue - a.netValue;
    });
  }, [allOptions, sortBy]);

  if (profiles.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Add reward programs and redemption options to see recommendations.
        </CardContent>
      </Card>
    );
  }

  const totalOptions = profiles.reduce((sum, p) => sum + p.options.length, 0);

  if (totalOptions === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Add redemption options to your reward programs to see recommendations.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Advisory Settings</CardTitle>
          <CardDescription>Configure how recommendations are calculated</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="threshold">Low Value Threshold (CPP)</Label>
            <Input
              id="threshold"
              type="number"
              step="0.1"
              min="0"
              value={settings.lowValueThreshold}
              onChange={(e) => updateSettings({ lowValueThreshold: parseFloat(e.target.value) || 1.0 })}
            />
            <p className="text-xs text-muted-foreground">
              Options below this value will be flagged as low value
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Redemption Recommendations</CardTitle>
              <CardDescription>Ranked by value - best options first</CardDescription>
            </div>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cpp">Sort by CPP</SelectItem>
                <SelectItem value="netValue">Sort by Net Value</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedOptions.map((item, idx) => (
            <div key={item.option.id.toString()} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {idx === 0 && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-chart-1/20">
                      <TrendingUp className="h-4 w-4 text-chart-1" />
                    </div>
                  )}
                  <div>
                    <div className="font-semibold capitalize">
                      {item.option.type.toString().replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Program #{item.profileId.toString()} • {item.option.pointsRequired.toString()} points
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={item.cpp >= 1.5 ? 'default' : item.cpp >= 1.0 ? 'secondary' : 'destructive'}>
                    {formatCPP(item.cpp)}
                  </Badge>
                  {idx === 0 && (
                    <div className="text-xs text-chart-1 font-medium mt-1">Best Value</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Cash Value:</span>{' '}
                  <span className="font-medium">${item.option.cashValue.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Net Value:</span>{' '}
                  <span className="font-medium">${item.netValue.toFixed(2)}</span>
                </div>
                {item.option.fees > 0 && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Fees:</span>{' '}
                    <span className="font-medium">${item.option.fees.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="text-sm bg-muted/50 p-3 rounded">
                {item.explanation}
              </div>

              {item.isLowValue && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Low value redemption - consider other options for better value
                  </AlertDescription>
                </Alert>
              )}

              {item.option.restrictions && (
                <div className="text-xs text-muted-foreground border-t pt-2">
                  <strong>Restrictions:</strong> {item.option.restrictions}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
