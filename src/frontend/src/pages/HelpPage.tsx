import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, FileSpreadsheet, Calculator, TrendingUp, Gift } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Help & Guide</h1>
        <p className="text-muted-foreground mt-1">Learn how to use SpendWise effectively</p>
      </div>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Important Disclaimer</AlertTitle>
        <AlertDescription>
          This tool provides educational guidance based on your entered data. It is <strong>not financial advice</strong>.
          Reward program terms, values, and availability can change at any time. Always verify current terms and
          conditions with your card issuer before making redemption decisions. Past performance and calculated values
          do not guarantee future results.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            How SpendWise Works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">1. Track Your Spending</h3>
            <p className="text-muted-foreground">
              Start by adding your credit card transactions. You can either import them from a CSV file or enter them
              manually. Each transaction should include the date, merchant, amount, and optionally a category and card
              label.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">2. Analyze Patterns</h3>
            <p className="text-muted-foreground">
              View your spending analytics on the Dashboard. See monthly totals, category breakdowns, top merchants,
              and trends over time. Use the date range picker to focus on specific periods.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">3. Manage Reward Programs</h3>
            <p className="text-muted-foreground">
              Add your reward programs with current point balances. For each program, define redemption options
              including points required, cash value, and any fees or restrictions.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">4. Get Recommendations</h3>
            <p className="text-muted-foreground">
              Review redemption recommendations ranked by cents-per-point (CPP) value. The app will flag low-value
              options and explain why certain redemptions offer better value.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            CSV Import Guide
          </CardTitle>
          <CardDescription>How to prepare and import your transaction data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Required Columns</h3>
            <p className="text-muted-foreground mb-2">Your CSV file must include at minimum:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>
                <strong>Date</strong> - Transaction date (formats: YYYY-MM-DD, MM/DD/YYYY, DD/MM/YYYY)
              </li>
              <li>
                <strong>Merchant/Description</strong> - Name of the merchant or transaction description
              </li>
              <li>
                <strong>Amount</strong> - Transaction amount (positive numbers, e.g., 45.99)
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Optional Columns</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Category - Spending category (e.g., Dining, Travel, Groceries)</li>
              <li>Card Label - Which card was used (e.g., Chase Sapphire, Amex Gold)</li>
              <li>Notes - Additional notes about the transaction</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Import Process</h3>
            <ol className="list-decimal list-inside text-muted-foreground space-y-1 ml-4">
              <li>Click "Import CSV" on the Transactions page</li>
              <li>Upload your CSV file</li>
              <li>Map your CSV columns to the required fields</li>
              <li>Preview the parsed transactions and check for any warnings</li>
              <li>Confirm to save all transactions to your account</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Understanding CPP (Cents Per Point)
          </CardTitle>
          <CardDescription>How redemption value is calculated</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">The Formula</h3>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm">
              CPP = (Cash Value - Fees) ÷ Points Required × 100
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Example Calculation</h3>
            <p className="text-muted-foreground mb-2">
              If a redemption option requires 25,000 points for a $300 statement credit with a $5 processing fee:
            </p>
            <div className="bg-muted p-4 rounded-lg space-y-1 text-sm">
              <p>Cash Value: $300</p>
              <p>Fees: $5</p>
              <p>Net Value: $300 - $5 = $295</p>
              <p>Points Required: 25,000</p>
              <p className="font-semibold pt-2">CPP = ($295 ÷ 25,000) × 100 = 1.18 cents per point</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">What's a Good CPP?</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>
                <strong>Below 1.0 CPP</strong> - Generally poor value, often better to use cash back
              </li>
              <li>
                <strong>1.0 - 1.5 CPP</strong> - Decent value, typical for statement credits
              </li>
              <li>
                <strong>1.5 - 2.0 CPP</strong> - Good value, often achievable with travel portals
              </li>
              <li>
                <strong>Above 2.0 CPP</strong> - Excellent value, premium redemptions or transfer partners
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Earning Rate Assumptions
          </CardTitle>
          <CardDescription>Estimating points earned from spending</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            In the Rewards section, you can define earning rate assumptions by category. For example, if your card
            earns 3x points on dining and 1x on everything else, you can set those rates to estimate how many points
            you've earned from your tracked spending.
          </p>
          <div>
            <h3 className="font-semibold mb-2">How to Use</h3>
            <ol className="list-decimal list-inside text-muted-foreground space-y-1 ml-4">
              <li>Go to Rewards → Earning Rates tab</li>
              <li>Set the points-per-dollar multiplier for each category</li>
              <li>Optionally set card-specific overrides</li>
              <li>View estimated points earned on the Dashboard</li>
            </ol>
          </div>
          <Alert>
            <AlertDescription>
              These are <strong>estimates only</strong> based on your assumptions. Actual points earned may vary based
              on merchant category codes, bonus categories, caps, and other card-specific rules.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
