import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Transaction } from '@/types/transactions';
import { Currency } from '@/backend';
import { toast } from 'sonner';

// Convert backend Transaction to frontend Transaction
function backendToFrontend(backendTx: any): Transaction {
  return {
    id: backendTx.id.toString(),
    date: backendTx.date,
    merchant: backendTx.merchant,
    amount: backendTx.amount,
    currency: backendTx.currency,
    category: backendTx.category,
    cardLabel: backendTx.cardLabel,
    notes: backendTx.notes,
    rawDescription: backendTx.rawDescription,
  };
}

// Convert frontend currency string to backend Currency enum
function currencyToBackend(currency: string): Currency {
  const currencyMap: Record<string, Currency> = {
    USD: Currency.USD,
    EUR: Currency.EUR,
    GBP: Currency.FIAT,
    CAD: Currency.FIAT,
    BTC: Currency.BTC,
    ETH: Currency.ETH,
    ICP: Currency.ICP,
    XMR: Currency.XMR,
    RUB: Currency.RUB,
  };
  return currencyMap[currency] || Currency.USD;
}

export function useTransactions() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const backendTransactions = await actor.getTransactions();
      return backendTransactions.map(backendToFrontend);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddTransaction() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (transaction: Omit<Transaction, 'id'>) => {
      if (!actor) throw new Error('Actor not available');
      
      const id = await actor.createTransaction(
        transaction.date,
        transaction.merchant,
        transaction.amount,
        currencyToBackend(transaction.currency),
        transaction.category,
        transaction.cardLabel,
        transaction.notes,
        transaction.rawDescription
      );
      
      return { ...transaction, id: id.toString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaction added successfully');
    },
    onError: (error: Error) => {
      console.error('Add transaction error:', error);
      toast.error('Failed to add transaction: ' + error.message);
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (transaction: Transaction) => {
      if (!actor) throw new Error('Actor not available');
      
      const backendTransaction = {
        id: BigInt(transaction.id),
        date: transaction.date,
        merchant: transaction.merchant,
        amount: transaction.amount,
        currency: currencyToBackend(transaction.currency),
        category: transaction.category,
        cardLabel: transaction.cardLabel,
        notes: transaction.notes,
        rawDescription: transaction.rawDescription,
      };
      
      await actor.updateTransaction(BigInt(transaction.id), backendTransaction);
      return transaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaction updated successfully');
    },
    onError: (error: Error) => {
      console.error('Update transaction error:', error);
      toast.error('Failed to update transaction: ' + error.message);
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteTransaction(BigInt(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaction deleted successfully');
    },
    onError: (error: Error) => {
      console.error('Delete transaction error:', error);
      toast.error('Failed to delete transaction: ' + error.message);
    },
  });
}

export function useBulkAddTransactions() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (newTransactions: Omit<Transaction, 'id'>[]) => {
      if (!actor) throw new Error('Actor not available');
      
      // Convert frontend transactions to backend format
      const backendTransactions = newTransactions.map((t) => ({
        id: BigInt(0), // Backend will assign proper IDs
        date: t.date,
        merchant: t.merchant,
        amount: t.amount,
        currency: currencyToBackend(t.currency),
        category: t.category,
        cardLabel: t.cardLabel,
        notes: t.notes,
        rawDescription: t.rawDescription,
      }));
      
      await actor.bulkImportTransactions(backendTransactions);
      return newTransactions;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success(`${data.length} transactions imported successfully`);
    },
    onError: (error: Error) => {
      console.error('Bulk import error:', error);
      toast.error('Failed to import transactions: ' + error.message);
    },
  });
}
