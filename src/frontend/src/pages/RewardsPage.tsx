import { useState } from 'react';
import { useRewardProfiles } from '@/hooks/useRewardProfiles';
import RewardProfilesList from '@/components/rewards/RewardProfilesList';
import RewardProfileForm from '@/components/rewards/RewardProfileForm';
import RedemptionRecommendations from '@/components/rewards/RedemptionRecommendations';
import EarningRatesEditor from '@/components/settings/EarningRatesEditor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';

export default function RewardsPage() {
  const { data: profiles = [], isLoading } = useRewardProfiles();
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Rewards</h1>
          <p className="text-muted-foreground mt-1">Manage reward programs and optimize redemptions</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Reward Program
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Reward Program</DialogTitle>
            </DialogHeader>
            <RewardProfileForm onSuccess={() => setShowAddDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="programs" className="space-y-6">
        <TabsList>
          <TabsTrigger value="programs">Programs & Options</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="earning">Earning Rates</TabsTrigger>
        </TabsList>

        <TabsContent value="programs" className="space-y-6">
          {isLoading ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">Loading reward programs...</CardContent>
            </Card>
          ) : profiles.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center">
                <h3 className="text-xl font-semibold mb-2">No Reward Programs Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Add your first reward program to start tracking points and redemption options.
                </p>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Reward Program
                </Button>
              </CardContent>
            </Card>
          ) : (
            <RewardProfilesList profiles={profiles} />
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <RedemptionRecommendations profiles={profiles} />
        </TabsContent>

        <TabsContent value="earning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Earning Rate Assumptions</CardTitle>
              <CardDescription>
                Define how many points you earn per dollar spent in each category. These assumptions are used to
                estimate points earned from your spending.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EarningRatesEditor />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
