'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Menu } from 'lucide-react';

interface DashboardShellProps {
  children: React.ReactNode;
  userName: string;
  userEmail: string;
  userAvatar?: string;
}

export default function DashboardShell({ children, userName, userEmail, userAvatar }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar userName={userName} userEmail={userEmail} userAvatar={userAvatar} />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10">
            <Sidebar userName={userName} userEmail={userEmail} userAvatar={userAvatar} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <div className="flex items-center p-4 border-b border-white/5 md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white transition-colors mr-3">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-semibold text-sm">AI Suite</span>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
