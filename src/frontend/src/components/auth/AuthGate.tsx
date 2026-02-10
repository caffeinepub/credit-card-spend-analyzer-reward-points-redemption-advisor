import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Outlet } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';

export default function AuthGate({ children }: { children?: React.ReactNode }) {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!identity) {
    return null;
  }

  return <>{children || <Outlet />}</>;
}
