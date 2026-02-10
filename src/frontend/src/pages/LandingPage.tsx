import LoginButton from '@/components/auth/LoginButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Gift, PieChart, FileSpreadsheet } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: FileSpreadsheet,
      title: 'Track Spending',
      description: 'Import or manually enter credit card transactions to analyze your spending patterns.',
    },
    {
      icon: PieChart,
      title: 'Analyze Patterns',
      description: 'View spending by category, merchant, and time period with interactive charts.',
    },
    {
      icon: Gift,
      title: 'Manage Rewards',
      description: 'Track reward point balances and redemption options across multiple programs.',
    },
    {
      icon: TrendingUp,
      title: 'Optimize Value',
      description: 'Get recommendations on the best way to redeem points for maximum value.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="container py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/cc-spend-logo.dim_512x512.png"
              alt="SpendWise Logo"
              className="h-12 w-12 rounded-lg"
            />
            <div>
              <h1 className="text-xl font-bold">SpendWise</h1>
              <p className="text-sm text-muted-foreground">Reward Points Advisor</p>
            </div>
          </div>
          <LoginButton />
        </div>
      </header>

      <main className="container py-16">
        <div className="mx-auto max-w-4xl space-y-16">
          <section className="text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Maximize Your Credit Card Rewards
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Analyze your spending, track reward points, and discover the optimal way to redeem them for maximum
              value.
            </p>
            <div className="pt-4">
              <LoginButton />
            </div>
          </section>

          <section className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          <section className="bg-muted/50 rounded-lg p-8 space-y-4">
            <h3 className="text-2xl font-semibold">How It Works</h3>
            <ol className="space-y-3 list-decimal list-inside text-muted-foreground">
              <li>Sign in securely with Internet Identity</li>
              <li>Import your credit card transactions via CSV or enter them manually</li>
              <li>Add your reward program details and redemption options</li>
              <li>Get personalized recommendations on the best redemption strategies</li>
            </ol>
          </section>

          <section className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2 text-amber-900 dark:text-amber-100">Important Disclaimer</h3>
            <p className="text-sm text-amber-800 dark:text-amber-200">
              This tool provides educational guidance based on your entered data. It is not financial advice. Reward
              program terms, values, and availability can change. Always verify current terms with your card issuer
              before making redemption decisions.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t py-6 mt-16">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SpendWise. All rights reserved.</p>
          <p>
            Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
