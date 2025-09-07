import { ReactNode } from 'react';
import { MobileBottomNav } from './MobileBottomNav';

interface StudentLayoutProps {
  children: ReactNode;
}

export function StudentLayout({ children }: StudentLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="pb-20 md:pb-0">
        {children}
      </main>
      <MobileBottomNav />
    </div>
  );
}