import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { TransactionFilters } from '@/types/transactions';
import { CATEGORIES } from '@/types/transactions';

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
}

export default function TransactionFilters({ filters, onChange }: TransactionFiltersProps) {
  const handleReset = () => {
    onChange({
      dateFrom: null,
      dateTo: null,
      merchant: '',
      category: null,
      cardLabel: null,
    });
  };

  const hasActiveFilters =
    filters.dateFrom || filters.dateTo || filters.merchant || filters.category || filters.cardLabel;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateFrom">From Date</Label>
          <Input
            id="dateFrom"
            type="date"
            value={filters.dateFrom?.toISOString().split('T')[0] || ''}
            onChange={(e) =>
              onChange({
                ...filters,
                dateFrom: e.target.value ? new Date(e.target.value) : null,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateTo">To Date</Label>
          <Input
            id="dateTo"
            type="date"
            value={filters.dateTo?.toISOString().split('T')[0] || ''}
            onChange={(e) =>
              onChange({
                ...filters,
                dateTo: e.target.value ? new Date(e.target.value) : null,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="merchant">Merchant</Label>
          <Input
            id="merchant"
            placeholder="Search merchant..."
            value={filters.merchant}
            onChange={(e) => onChange({ ...filters, merchant: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={filters.category || 'all'}
            onValueChange={(value) => onChange({ ...filters, category: value === 'all' ? null : value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
