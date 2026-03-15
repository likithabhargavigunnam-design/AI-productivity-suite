'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard, FileText, Youtube, Briefcase,
  FileUser, LogOut, Sparkles, X
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
  { href: '/notes', icon: <FileText className="w-5 h-5" />, label: 'Notes' },
  { href: '/youtube-summarizer', icon: <Youtube className="w-5 h-5" />, label: 'YouTube Summariser' },
  { href: '/job-search', icon: <Briefcase className="w-5 h-5" />, label: 'Job Search' },
  { href: '/resume-builder', icon: <FileUser className="w-5 h-5" />, label: 'Resume Builder' },
];

interface SidebarProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onClose?: () => void;
}

export default function Sidebar({ userName, userEmail, userAvatar, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <aside className="w-64 h-full flex flex-col glass border-r border-white/5 bg-gray-950/80">
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight">AI Suite</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors md:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'nav-item-active text-indigo-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={isActive ? 'text-indigo-400' : ''}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User profile */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 mb-3">
          {userAvatar ? (
            <img src={userAvatar} alt={userName} className="w-8 h-8 rounded-full ring-2 ring-indigo-500/30" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold">
              {userName?.charAt(0)?.toUpperCase() ?? 'U'}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{userName ?? 'User'}</p>
            <p className="text-xs text-gray-500 truncate">{userEmail ?? ''}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 text-xs text-gray-500 hover:text-red-400 transition-colors py-2 px-2 rounded-lg hover:bg-red-400/5"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
