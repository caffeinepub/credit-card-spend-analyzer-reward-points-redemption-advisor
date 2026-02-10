import { useState } from 'react';
import { useAddRewardProfile } from '@/hooks/useRewardProfiles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface RewardProfileFormProps {
  onSuccess: () => void;
}

export default function RewardProfileForm({ onSuccess }: RewardProfileFormProps) {
  const addProfile = useAddRewardProfile();
  const [balance, setBalance] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const balanceNum = parseInt(balance);
    if (isNaN(balanceNum) || balanceNum < 0) return;

    await addProfile.mutateAsync({
      balance: BigInt(balanceNum),
      options: [],
    });

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="balance">Current Point Balance *</Label>
        <Input
          id="balance"
          type="number"
          min="0"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          placeholder="e.g., 50000"
          required
          disabled={addProfile.isPending}
        />
      </div>

      <Button type="submit" className="w-full" disabled={addProfile.isPending}>
        {addProfile.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          'Add Program'
        )}
      </Button>
    </form>
  );
}
