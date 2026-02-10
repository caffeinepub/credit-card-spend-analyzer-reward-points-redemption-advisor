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
        rawDescription: row[mapping.merchant] || '',
      });
    });

    setPreviewData(transactions);
    setPreviewWarnings(warnings);
    setStep('preview');
  };

  const handleImport = async () => {
    await bulkAdd.mutateAsync(previewData);
    onComplete();
  };

  if (step === 'upload') {
    return (
      <div className="space-y-4">
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <Label htmlFor="csv-upload" className="cursor-pointer">
            <div className="text-lg font-semibold mb-2">Upload CSV File</div>
            <div className="text-sm text-muted-foreground mb-4">
              Click to select a CSV file containing your transactions
            </div>
            <Button type="button" variant="outline">
              Choose File
            </Button>
          </Label>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
        {file && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>File uploaded: {file.name}</AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  if (step === 'map' && parseResult) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertDescription>
            Map your CSV columns to the required fields. At minimum, you must map Date, Merchant, and Amount.
          </AlertDescription>
        </Alert>

        {parseResult.warnings.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-semibold mb-1">Parse Warnings:</div>
              <ul className="list-disc list-inside text-sm">
                {parseResult.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Date Column *</Label>
            <Select value={mapping.date} onValueChange={(value) => setMapping({ ...mapping, date: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select date column" />
              </SelectTrigger>
              <SelectContent>
                {parseResult.headers.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Merchant/Description Column *</Label>
            <Select value={mapping.merchant} onValueChange={(value) => setMapping({ ...mapping, merchant: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select merchant column" />
              </SelectTrigger>
              <SelectContent>
                {parseResult.headers.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Amount Column *</Label>
            <Select value={mapping.amount} onValueChange={(value) => setMapping({ ...mapping, amount: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select amount column" />
              </SelectTrigger>
              <SelectContent>
                {parseResult.headers.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Category Column (Optional)</Label>
            <Select
              value={mapping.category}
              onValueChange={(value) => setMapping({ ...mapping, category: value === 'none' ? '' : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category column (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {parseResult.headers.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Card Label Column (Optional)</Label>
            <Select
              value={mapping.cardLabel}
              onValueChange={(value) => setMapping({ ...mapping, cardLabel: value === 'none' ? '' : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select card label column (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {parseResult.headers.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setStep('upload')}>
            Back
          </Button>
          <Button onClick={handleMapping} disabled={!mapping.date || !mapping.merchant || !mapping.amount}>
            Preview Import
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'preview') {
    return (
      <div className="space-y-4">
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Found {previewData.length} valid transaction{previewData.length !== 1 ? 's' : ''} to import.
          </AlertDescription>
        </Alert>

        {previewWarnings.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-semibold mb-1">Validation Warnings ({previewWarnings.length}):</div>
              <ul className="list-disc list-inside text-sm max-h-32 overflow-y-auto">
                {previewWarnings.slice(0, 10).map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
                {previewWarnings.length > 10 && <li>... and {previewWarnings.length - 10} more</li>}
              </ul>
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
                <TableHead>Card</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewData.slice(0, 20).map((t, i) => (
                <TableRow key={i}>
                  <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                  <TableCell>{t.merchant}</TableCell>
                  <TableCell>${t.amount.toFixed(2)}</TableCell>
                  <TableCell>{t.category}</TableCell>
                  <TableCell>{t.cardLabel || '-'}</TableCell>
                </TableRow>
              ))}
              {previewData.length > 20 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    ... and {previewData.length - 20} more
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setStep('map')}>
            Back
          </Button>
          <Button onClick={handleImport} disabled={bulkAdd.isPending || previewData.length === 0}>
            {bulkAdd.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              `Import ${previewData.length} Transaction${previewData.length !== 1 ? 's' : ''}`
            )}
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
