export interface Transaction {
  id: string;
  date: string; // ISO date string
  merchant: string;
  amount: number;
  currency: string;
  category: string;
  cardLabel: string;
  notes: string;
  rawDescription: string;
}

export interface TransactionFilters {
  dateFrom: Date | null;
  dateTo: Date | null;
  merchant: string;
  category: string | null;
  cardLabel: string | null;
}

export const CATEGORIES = [
  'Dining',
  'Travel',
  'Groceries',
  'Gas',
  'Entertainment',
  'Shopping',
  'Bills & Utilities',
  'Healthcare',
  'Transportation',
  'Other',
];

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'BTC', 'ETH', 'ICP'];

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  // Handle crypto currencies differently
  if (['BTC', 'ETH', 'ICP', 'XMR'].includes(currency)) {
    return `${amount.toFixed(8)} ${currency}`;
  }
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'GBP' ? 'GBP' : currency === 'EUR' ? 'EUR' : 'USD',
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export function parseDate(dateStr: string): Date | null {
  // Try ISO format first
  let date = new Date(dateStr);
  if (!isNaN(date.getTime())) return date;

  // Try MM/DD/YYYY
  const mmddyyyy = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (mmddyyyy) {
    date = new Date(parseInt(mmddyyyy[3]), parseInt(mmddyyyy[1]) - 1, parseInt(mmddyyyy[2]));
    if (!isNaN(date.getTime())) return date;
  }

  // Try DD/MM/YYYY
  const ddmmyyyy = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (ddmmyyyy) {
    date = new Date(parseInt(ddmmyyyy[3]), parseInt(ddmmyyyy[2]) - 1, parseInt(ddmmyyyy[1]));
    if (!isNaN(date.getTime())) return date;
  }

  return null;
}
