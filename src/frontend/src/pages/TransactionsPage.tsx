import { useState } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import TransactionForm from '@/components/transactions/TransactionForm';
import TransactionsTable from '@/components/transactions/TransactionsTable';
import TransactionFilters from '@/components/transactions/TransactionFilters';
import CsvImportWizard from '@/components/transactions/CsvImportWizard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Upload } from 'lucide-react';
import type { Transaction, TransactionFilters as FilterType } from '@/types/transactions';

export default function TransactionsPage() {
  const { data: transactions = [], isLoading } = useTransactions();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState<FilterType>({
    dateFrom: null,
    dateTo: null,
    merchant: '',
    category: null,
    cardLabel: null,
  });

  const filteredTransactions = transactions.filter((t) => {
    if (filters.dateFrom && new Date(t.date) < filters.dateFrom) return false;
    if (filters.dateTo && new Date(t.date) > filters.dateTo) return false;
    if (filters.merchant && !t.merchant.toLowerCase().includes(filters.merchant.toLowerCase())) return false;
    if (filters.category && t.category !== filters.category) return false;
    if (filters.cardLabel && t.cardLabel !== filters.cardLabel) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground mt-1">Track and manage your credit card spending</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import CSV
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Import Transactions from CSV</DialogTitle>
              </DialogHeader>
              <CsvImportWizard onComplete={() => setShowImportDialog(false)} />
            </DialogContent>
          </Dialog>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Transaction</DialogTitle>
              </DialogHeader>
              <TransactionForm onSuccess={() => setShowAddDialog(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter transactions by date, merchant, category, or card</CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionFilters filters={filters} onChange={setFilters} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            All Transactions
            {filteredTransactions.length !== transactions.length && (
              <span className="text-muted-foreground font-normal ml-2">
                ({filteredTransactions.length} of {transactions.length})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transactions yet. Add your first transaction or import from CSV.
            </div>
          ) : (
            <TransactionsTable
              transactions={filteredTransactions}
              onEdit={(transaction) => {
                setEditingTransaction(transaction);
              }}
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingTransaction} onOpenChange={(open) => !open && setEditingTransaction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm
            transaction={editingTransaction || undefined}
            onSuccess={() => setEditingTransaction(null)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
