import { useState } from 'react';
import { useBulkAddTransactions } from '@/hooks/useTransactions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { parseCSV, coerceAmount, coerceDate } from '@/utils/csv';
import { CATEGORIES } from '@/types/transactions';
import { Upload, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import type { Transaction } from '@/types/transactions';

interface CsvImportWizardProps {
  onComplete: () => void;
}

export default function CsvImportWizard({ onComplete }: CsvImportWizardProps) {
  const bulkAdd = useBulkAddTransactions();
  const [step, setStep] = useState<'upload' | 'map' | 'preview'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<ReturnType<typeof parseCSV> | null>(null);
  const [mapping, setMapping] = useState({
    date: '',
    merchant: '',
    amount: '',
    category: '',
    cardLabel: '',
  });
  const [previewData, setPreviewData] = useState<Omit<Transaction, 'id'>[]>([]);
  const [previewWarnings, setPreviewWarnings] = useState<string[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const result = parseCSV(text);
      setParseResult(result);
      setStep('map');
    };
    reader.readAsText(uploadedFile);
  };

  const handleMapping = () => {
    if (!parseResult || !mapping.date || !mapping.merchant || !mapping.amount) {
      return;
    }

    const warnings: string[] = [];
    const transactions: Omit<Transaction, 'id'>[] = [];

    parseResult.rows.forEach((row, idx) => {
      const date = coerceDate(row[mapping.date]);
      const amount = coerceAmount(row[mapping.amount]);
      const merchant = row[mapping.merchant]?.trim();

      if (!date) {
        warnings.push(`Row ${idx + 2}: Invalid date format`);
        return;
      }
      if (!amount) {
        warnings.push(`Row ${idx + 2}: Invalid amount`);
        return;
      }
      if (!merchant) {
        warnings.push(`Row ${idx + 2}: Missing merchant`);
        return;
      }

      transactions.push({
        date,
        merchant,
        amount,
        currency: 'USD',
        category: mapping.category ? row[mapping.category] || 'Other' : 'Other',
        cardLabel: mapping.cardLabel ? row[mapping.cardLabel] || '' : '',
        notes: '',
        rawDescription: Object.values(row).join(' | '),
      });
    });

    setPreviewData(transactions);
    setPreviewWarnings(warnings);
    setStep('preview');
  };

  const handleImport = async () => {
    try {
      await bulkAdd.mutateAsync(previewData);
      onComplete();
    } catch (error) {
      // Error is already handled by the mutation's onError
      console.error('Import error:', error);
    }
  };

  const resetWizard = () => {
    setStep('upload');
    setFile(null);
    setParseResult(null);
    setMapping({ date: '', merchant: '', amount: '', category: '', cardLabel: '' });
    setPreviewData([]);
    setPreviewWarnings([]);
  };

  if (step === 'upload') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Upload CSV File</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Select a CSV file containing your transaction data
          </p>
        </div>

        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            id="csv-upload"
          />
          <Label htmlFor="csv-upload" className="cursor-pointer">
            <Button type="button" asChild>
              <span>Choose File</span>
            </Button>
          </Label>
          {file && <p className="mt-4 text-sm text-muted-foreground">{file.name}</p>}
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your CSV should include columns for date, merchant, and amount at minimum.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (step === 'map') {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Map CSV Columns</h3>
          <p className="text-sm text-muted-foreground">
            Match your CSV columns to transaction fields
          </p>
        </div>

        {parseResult && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Date Column *</Label>
              <Select value={mapping.date} onValueChange={(value) => setMapping({ ...mapping, date: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  {parseResult.headers.map((header) => (
                    <SelectItem key={header} value={header}>
                      {header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Merchant Column *</Label>
              <Select value={mapping.merchant} onValueChange={(value) => setMapping({ ...mapping, merchant: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  {parseResult.headers.map((header) => (
                    <SelectItem key={header} value={header}>
                      {header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Amount Column *</Label>
              <Select value={mapping.amount} onValueChange={(value) => setMapping({ ...mapping, amount: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  {parseResult.headers.map((header) => (
                    <SelectItem key={header} value={header}>
                      {header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category Column (Optional)</Label>
              <Select value={mapping.category} onValueChange={(value) => setMapping({ ...mapping, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select column or skip" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {parseResult.headers.map((header) => (
                    <SelectItem key={header} value={header}>
                      {header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Card Label Column (Optional)</Label>
              <Select value={mapping.cardLabel} onValueChange={(value) => setMapping({ ...mapping, cardLabel: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select column or skip" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {parseResult.headers.map((header) => (
                    <SelectItem key={header} value={header}>
                      {header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" onClick={resetWizard} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleMapping}
            disabled={!mapping.date || !mapping.merchant || !mapping.amount}
            className="flex-1"
          >
            Preview Import
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'preview') {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Preview & Confirm</h3>
          <p className="text-sm text-muted-foreground">
            Review the transactions before importing
          </p>
        </div>

        {previewWarnings.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-semibold mb-1">Some rows could not be imported:</div>
              <ul className="list-disc list-inside text-sm">
                {previewWarnings.slice(0, 5).map((warning, idx) => (
                  <li key={idx}>{warning}</li>
                ))}
                {previewWarnings.length > 5 && <li>...and {previewWarnings.length - 5} more</li>}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {previewData.length > 0 && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Ready to import {previewData.length} transaction{previewData.length !== 1 ? 's' : ''}
            </AlertDescription>
          </Alert>
        )}

        <div className="border rounded-lg max-h-96 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewData.slice(0, 10).map((transaction, idx) => (
                <TableRow key={idx}>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell>{transaction.merchant}</TableCell>
                  <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                </TableRow>
              ))}
              {previewData.length > 10 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    ...and {previewData.length - 10} more
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setStep('map')} className="flex-1">
            Back
          </Button>
          <Button onClick={handleImport} disabled={bulkAdd.isPending || previewData.length === 0} className="flex-1">
            {bulkAdd.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              `Import ${previewData.length} Transactions`
            )}
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
