import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { useGetCallerUserProfile } from '@/hooks/useCurrentUserProfile';
import LoginButton from '@/components/auth/LoginButton';
import { LayoutDashboard, CreditCard, Gift, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AppShell() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { data: userProfile } = useGetCallerUserProfile();
  const currentPath = routerState.location.pathname;

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/transactions', label: 'Transactions', icon: CreditCard },
    { path: '/rewards', label: 'Rewards', icon: Gift },
    { path: '/help', label: 'Help', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/cc-spend-logo.dim_512x512.png"
                alt="Logo"
                className="h-10 w-10 rounded-lg"
              />
              <div>
                <h1 className="text-lg font-semibold leading-none">SpendWise</h1>
                <p className="text-xs text-muted-foreground">Reward Points Advisor</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => navigate({ to: item.path })}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {userProfile && (
              <div className="hidden sm:block text-sm text-muted-foreground">
                Hello, <span className="font-medium text-foreground">{userProfile.name}</span>
              </div>
            )}
            <LoginButton />
          </div>
        </div>
      </header>

      <main className="container py-8">
        <Outlet />
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
