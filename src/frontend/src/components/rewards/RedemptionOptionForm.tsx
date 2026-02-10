import { useState, useEffect } from 'react';
import { useAddRedemptionOption } from '@/hooks/useRewardProfiles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { computeCPP, formatCPP } from '@/utils/rewardsMath';
import { Variant_other_statementCredit_travelPortal_giftCard_transferToPartner } from '@/backend';

interface RedemptionOptionFormProps {
  rewardId: bigint;
  onSuccess: () => void;
}

export default function RedemptionOptionForm({ rewardId, onSuccess }: RedemptionOptionFormProps) {
  const addOption = useAddRedemptionOption();
  const [formData, setFormData] = useState({
    type: 'statementCredit' as keyof typeof Variant_other_statementCredit_travelPortal_giftCard_transferToPartner,
    pointsRequired: '',
    cashValue: '',
    fees: '',
    restrictions: '',
  });

  const [previewCPP, setPreviewCPP] = useState<number | null>(null);

  useEffect(() => {
    const points = parseInt(formData.pointsRequired);
    const cash = parseFloat(formData.cashValue);
    const fees = parseFloat(formData.fees) || 0;

    if (!isNaN(points) && !isNaN(cash) && points > 0) {
      setPreviewCPP(computeCPP(cash, fees, points));
    } else {
      setPreviewCPP(null);
    }
  }, [formData.pointsRequired, formData.cashValue, formData.fees]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const points = parseInt(formData.pointsRequired);
    const cash = parseFloat(formData.cashValue);
    const fees = parseFloat(formData.fees) || 0;

    if (isNaN(points) || isNaN(cash) || points <= 0 || cash <= 0) return;

    await addOption.mutateAsync({
      rewardId,
      option: {
        id: BigInt(0), // Will be set by backend
        type: Variant_other_statementCredit_travelPortal_giftCard_transferToPartner[formData.type],
        pointsRequired: BigInt(points),
        cashValue: cash,
        fees,
        restrictions: formData.restrictions.trim(),
      },
    });

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type">Redemption Type *</Label>
        <Select
          value={formData.type}
          onValueChange={(value: any) => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger disabled={addOption.isPending}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="statementCredit">Statement Credit</SelectItem>
            <SelectItem value="travelPortal">Travel Portal</SelectItem>
            <SelectItem value="transferToPartner">Transfer to Partner</SelectItem>
            <SelectItem value="giftCard">Gift Card</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pointsRequired">Points Required *</Label>
          <Input
            id="pointsRequired"
            type="number"
            min="1"
            value={formData.pointsRequired}
            onChange={(e) => setFormData({ ...formData, pointsRequired: e.target.value })}
            required
            disabled={addOption.isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cashValue">Cash Value ($) *</Label>
          <Input
            id="cashValue"
            type="number"
            step="0.01"
            min="0"
            value={formData.cashValue}
            onChange={(e) => setFormData({ ...formData, cashValue: e.target.value })}
            required
            disabled={addOption.isPending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fees">Fees/Surcharges ($)</Label>
        <Input
          id="fees"
          type="number"
          step="0.01"
          min="0"
          value={formData.fees}
          onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
          disabled={addOption.isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="restrictions">Restrictions/Notes</Label>
        <Textarea
          id="restrictions"
          value={formData.restrictions}
          onChange={(e) => setFormData({ ...formData, restrictions: e.target.value })}
          rows={2}
          placeholder="e.g., Limited availability, blackout dates, etc."
          disabled={addOption.isPending}
        />
      </div>

      {previewCPP !== null && (
        <div className="bg-muted p-4 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Estimated Value</div>
          <div className="text-2xl font-bold">{formatCPP(previewCPP)}</div>
          <div className="text-xs text-muted-foreground mt-1">cents per point</div>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={addOption.isPending}>
        {addOption.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          'Add Redemption Option'
        )}
      </Button>
    </form>
  );
}
