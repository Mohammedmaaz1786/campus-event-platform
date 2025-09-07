import { Outlet } from 'react-router-dom';
import { StudentNavbarFixed } from './StudentNavbarFixed';
import { StudentSidebar } from './StudentSidebar';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from 'next-themes';

export function StudentLayoutFixed() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-dashboard-bg">
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <StudentSidebar />
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <StudentNavbarFixed />
            
            {/* Page content */}
            <main className="flex-1 overflow-auto p-6 bg-dashboard-bg">
              <Outlet />
            </main>
          </div>
        </div>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
