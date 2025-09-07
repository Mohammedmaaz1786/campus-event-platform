import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminNavbar } from './AdminNavbar';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';

export function AdminLayout() {
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  const handleGlobalSearch = (query: string) => {
    setGlobalSearchTerm(query);
    // This could be used to filter content across admin pages
    console.log('Global search:', query);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-dashboard-bg">
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <AdminSidebar />
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <AdminNavbar onGlobalSearch={handleGlobalSearch} />
            
            
            <main className="flex-1 overflow-y-auto p-6">
              <Outlet />
            </main>
          </div>
        </div>
        
        <Toaster />
      </div>
    </ThemeProvider>
  );
}