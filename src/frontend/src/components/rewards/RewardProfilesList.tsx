import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import RedemptionOptionForm from './RedemptionOptionForm';
import { formatCPP, computeCPP } from '@/utils/rewardsMath';
import type { RewardPoints } from '@/backend';
import { Plus } from 'lucide-react';

interface RewardProfilesListProps {
  profiles: RewardPoints[];
}

export default function RewardProfilesList({ profiles }: RewardProfilesListProps) {
  const [addingOptionFor, setAddingOptionFor] = useState<bigint | null>(null);

  return (
    <div className="space-y-6">
      {profiles.map((profile) => (
        <Card key={profile.id.toString()}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Reward Program #{profile.id.toString()}</CardTitle>
                <CardDescription className="mt-1">
                  Current Balance: <span className="font-semibold">{profile.balance.toString()} points</span>
                </CardDescription>
              </div>
              <Dialog
                open={addingOptionFor === profile.id}
                onOpenChange={(open) => setAddingOptionFor(open ? profile.id : null)}
              >
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Option
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Redemption Option</DialogTitle>
                  </DialogHeader>
                  <RedemptionOptionForm rewardId={profile.id} onSuccess={() => setAddingOptionFor(null)} />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {profile.options.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No redemption options yet. Add your first option to start comparing values.
              </div>
            ) : (
              <div className="space-y-3">
                {profile.options.map((option) => {
                  const cpp = computeCPP(option.cashValue, option.fees, Number(option.pointsRequired));
                  const netValue = option.cashValue - option.fees;

                  return (
                    <div key={option.id.toString()} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-semibold capitalize">
                            {option.type.toString().replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {option.pointsRequired.toString()} points → ${option.cashValue.toFixed(2)}
                            {option.fees > 0 && ` (${option.fees.toFixed(2)} fee)`}
                          </div>
                        </div>
                        <Badge variant={cpp >= 1.5 ? 'default' : cpp >= 1.0 ? 'secondary' : 'destructive'}>
                          {formatCPP(cpp)}
                        </Badge>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Net Value:</span>{' '}
                        <span className="font-medium">${netValue.toFixed(2)}</span>
                      </div>
                      {option.restrictions && (
                        <div className="text-xs text-muted-foreground">{option.restrictions}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
