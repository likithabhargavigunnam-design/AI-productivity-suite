'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Youtube, 
  FileText, 
  Image as ImageIcon, 
  Settings, 
  LogOut, 
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { name: 'Nexus Core', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: 'Video Matrix', href: '/youtube', icon: <Youtube className="w-5 h-5" /> },
  { name: 'Neural Notes', href: '/notes', icon: <FileText className="w-5 h-5" /> },
  { name: 'Vision Engine', href: '/image', icon: <ImageIcon className="w-5 h-5" /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-mesh">
      {/* Mobile Menu Toggle */}
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-3 btn-super-glow rounded-full text-white bg-black/50 backdrop-blur-md border border-white/10"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Floating Holographic Sidebar */}
      <aside className={`
        fixed md:static inset-y-4 left-4 z-40 w-64 glass-panel transition-transform transform
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-[120%] md:translate-x-0"}
        flex flex-col m-0 md:m-4 rounded-[2rem] shadow-[0_0_40px_rgba(0,255,255,0.1)] overflow-hidden
      `}>
        <div className="p-6 flex items-center gap-4 relative z-10 border-b border-white/5">
          <div className="w-10 h-10 rounded-[1rem] bg-gradient-to-br from-[#00c9ff] to-[#92fe9d] flex items-center justify-center animate-glow shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 dark:from-white dark:to-white/50">
            Smart<br className="hidden md:block"/>Summarize
          </span>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-3 relative z-10 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  relative flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-black transition-all group overflow-hidden
                  ${isActive 
                    ? 'text-white shadow-[0_0_20px_rgba(0,201,255,0.3)]' 
                    : 'text-muted-foreground hover:text-white'}
                `}
              >
                {/* Active intense background */}
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active" 
                    className="absolute inset-0 bg-gradient-to-r from-[#00c9ff]/20 to-[#92fe9d]/20 border border-[rgba(0,201,255,0.3)] rounded-2xl z-0 backdrop-blur-md" 
                  />
                )}
                
                {/* Hover subtle background */}
                {!isActive && (
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity z-0 rounded-2xl" />
                )}

                <div className="relative z-10 flex items-center gap-4">
                  <div className={`transition-transform duration-300 ${isActive ? 'scale-110 text-[#00c9ff]' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </div>
                  <span className="tracking-wide uppercase">{item.name}</span>
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-3 relative z-10 bg-black/10">
          <button className="flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold text-muted-foreground hover:text-white hover:bg-white/10 w-full transition-all uppercase tracking-wide group">
            <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
            Core Settings
          </button>
          
          <button 
            onClick={async () => {
              const { createClient } = await import('@/lib/supabase/client');
              const supabase = createClient();
              await supabase.auth.signOut();
              window.location.href = '/login';
            }}
            className="flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold text-rose-500 hover:text-white hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 w-full transition-all uppercase tracking-wide group shadow-sm"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Disconnect
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto relative perspective-1000 z-0 pl-1 md:pl-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,201,255,0.05),transparent_70%)] pointer-events-none" />
        <div className="p-4 md:p-8 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
