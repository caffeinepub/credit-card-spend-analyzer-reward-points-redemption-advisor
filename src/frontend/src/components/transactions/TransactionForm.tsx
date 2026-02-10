import { useState, useEffect } from 'react';
import { useAddTransaction, useUpdateTransaction } from '@/hooks/useTransactions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import type { Transaction } from '@/types/transactions';
import { CATEGORIES, CURRENCIES } from '@/types/transactions';

interface TransactionFormProps {
  transaction?: Transaction;
  onSuccess: () => void;
}

export default function TransactionForm({ transaction, onSuccess }: TransactionFormProps) {
  const addTransaction = useAddTransaction();
  const updateTransaction = useUpdateTransaction();
  const isEditing = !!transaction;

  const [formData, setFormData] = useState({
    date: transaction?.date || new Date().toISOString().split('T')[0],
    merchant: transaction?.merchant || '',
    amount: transaction?.amount?.toString() || '',
    currency: transaction?.currency || 'USD',
    category: transaction?.category || 'Other',
    cardLabel: transaction?.cardLabel || '',
    notes: transaction?.notes || '',
    rawDescription: transaction?.rawDescription || '',
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        date: transaction.date,
        merchant: transaction.merchant,
        amount: transaction.amount.toString(),
        currency: transaction.currency,
        category: transaction.category,
        cardLabel: transaction.cardLabel,
        notes: transaction.notes,
        rawDescription: transaction.rawDescription,
      });
    }
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      return;
    }

    const data = {
      date: formData.date,
      merchant: formData.merchant.trim(),
      amount,
      currency: formData.currency,
      category: formData.category,
      cardLabel: formData.cardLabel.trim(),
      notes: formData.notes.trim(),
      rawDescription: formData.rawDescription.trim(),
    };

    if (isEditing) {
      await updateTransaction.mutateAsync({ ...data, id: transaction.id });
    } else {
      await addTransaction.mutateAsync(data);
    }

    onSuccess();
  };

  const isPending = addTransaction.isPending || updateTransaction.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
            disabled={isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount *</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
            disabled={isPending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="merchant">Merchant *</Label>
        <Input
          id="merchant"
          value={formData.merchant}
          onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
          required
          disabled={isPending}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger disabled={isPending}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
            <SelectTrigger disabled={isPending}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((curr) => (
                <SelectItem key={curr} value={curr}>
                  {curr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardLabel">Card Label</Label>
        <Input
          id="cardLabel"
          value={formData.cardLabel}
          onChange={(e) => setFormData({ ...formData, cardLabel: e.target.value })}
          placeholder="e.g., Chase Sapphire, Amex Gold"
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={2}
          disabled={isPending}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditing ? 'Updating...' : 'Adding...'}
          </>
        ) : isEditing ? (
          'Update Transaction'
        ) : (
          'Add Transaction'
        )}
      </Button>
    </form>
  );
}
