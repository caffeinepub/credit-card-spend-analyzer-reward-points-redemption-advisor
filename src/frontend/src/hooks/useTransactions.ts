import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Transaction } from '@/types/transactions';
import { toast } from 'sonner';

// Local storage key for transactions (until backend support is added)
const STORAGE_KEY = 'spendwise_transactions';

function getStoredTransactions(): Transaction[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setStoredTransactions(transactions: Transaction[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export function useTransactions() {
  return useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      return getStoredTransactions();
    },
  });
}

export function useAddTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transaction: Omit<Transaction, 'id'>) => {
      const transactions = getStoredTransactions();
      const newTransaction: Transaction = {
        ...transaction,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      };
      transactions.push(newTransaction);
      setStoredTransactions(transactions);
      return newTransaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaction added successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to add transaction: ' + error.message);
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transaction: Transaction) => {
      const transactions = getStoredTransactions();
      const index = transactions.findIndex((t) => t.id === transaction.id);
      if (index === -1) throw new Error('Transaction not found');
      transactions[index] = transaction;
      setStoredTransactions(transactions);
      return transaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaction updated successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to update transaction: ' + error.message);
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const transactions = getStoredTransactions();
      const filtered = transactions.filter((t) => t.id !== id);
      setStoredTransactions(filtered);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaction deleted successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete transaction: ' + error.message);
    },
  });
}

export function useBulkAddTransactions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTransactions: Omit<Transaction, 'id'>[]) => {
      const transactions = getStoredTransactions();
      const withIds = newTransactions.map((t) => ({
        ...t,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      }));
      transactions.push(...withIds);
      setStoredTransactions(transactions);
      return withIds;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success(`${data.length} transactions imported successfully`);
    },
    onError: (error: Error) => {
      toast.error('Failed to import transactions: ' + error.message);
    },
  });
}
