import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';

export const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile top navbar */}
      <header className="sm:hidden sticky top-0 z-30 bg-card border-b border-border">
        <div className="h-14 px-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Open menu"
            title="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <img
              src="/Selten-icon.png"
              alt="Selten WorkFlow"
              className="w-8 h-8 object-contain"
            />
            <span className="font-bold text-foreground">Selten WorkFlow</span>
          </div>

          <div className="w-10" />
        </div>
      </header>

      {/* Backdrop for mobile sidebar */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 sm:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
        onNavigate={() => setMobileSidebarOpen(false)}
      />
      <main
        className={`transition-all duration-300 min-h-screen ${
          sidebarCollapsed ? 'ml-0 sm:ml-16' : 'ml-0 sm:ml-64'
        }`}
      >
        <div className="p-3 sm:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

