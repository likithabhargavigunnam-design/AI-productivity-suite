'use client';

import { motion } from 'framer-motion';
import { Sparkles, Youtube, FileText, Image as ImageIcon, ArrowRight, Activity, Zap, Cpu } from 'lucide-react';
import Link from 'next/link';

const quickLinks = [
  { name: 'Video Matrix', desc: 'Decode YouTube APIs', href: '/youtube', icon: <Youtube className="w-8 h-8 text-white" />, gradient: 'from-[#ff0844] to-[#ffb199]', glow: 'shadow-[0_0_30px_rgba(255,8,68,0.4)]' },
  { name: 'Neural Notes', desc: 'Sync your thoughts', href: '/notes', icon: <FileText className="w-8 h-8 text-white" />, gradient: 'from-[#4facfe] to-[#00f2fe]', glow: 'shadow-[0_0_30px_rgba(0,242,254,0.4)]' },
  { name: 'Vision Engine', desc: 'Extract visual data', href: '/image', icon: <ImageIcon className="w-8 h-8 text-white" />, gradient: 'from-[#43e97b] to-[#38f9d7]', glow: 'shadow-[0_0_30px_rgba(67,233,123,0.4)]' },
];

export default function CrazyDashboardOverview() {
  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      <header className="mb-16 mt-8 relative rounded-[3rem] glass-panel p-10 overflow-hidden group border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent z-0 group-hover:scale-105 transition-transform duration-1000" />
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#00c9ff]/20 blur-[80px] rounded-full animate-pulse-slow" />
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black uppercase tracking-widest text-[#00c9ff] mb-6"
          >
            <Cpu className="w-4 h-4" /> System Online
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl font-black tracking-tighter mb-4 text-white drop-shadow-xl"
          >
            NEXUS <span className="gradient-text-crazy">CORE</span>
          </motion.h1>
          <p className="text-xl text-white/70 font-medium max-w-xl leading-relaxed">
            Welcome back to the grid. All analytical engines are standing by for your commands.
          </p>
        </div>
      </header>

      {/* Extreme Quick Actions */}
      <section className="mb-16">
        <h2 className="text-2xl font-black mb-8 flex items-center gap-3 uppercase tracking-widest text-white/50">
          <Zap className="w-6 h-6 text-yellow-400 animate-pulse" /> Launch Protocols
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickLinks.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.15, type: 'spring' }}
            >
              <Link 
                href={item.href} 
                className="relative block p-1 rounded-[2rem] overflow-hidden group cursor-pointer hover:-translate-y-2 transition-transform duration-500"
              >
                {/* Animated border ring */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-x-[2] blur-xl" />
                
                <div className="glass-panel relative flex flex-col p-8 rounded-[1.8rem] border border-white/10 h-full backdrop-blur-2xl bg-black/40">
                  <div className={`w-16 h-16 rounded-[1.2rem] flex items-center justify-center bg-gradient-to-br ${item.gradient} ${item.glow} mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                    {item.icon}
                  </div>
                  <h3 className="font-black text-2xl mb-2 text-white">{item.name}</h3>
                  <p className="text-sm font-medium text-white/60 mb-8">{item.desc}</p>
                  
                  <div className="mt-auto flex items-center justify-between text-[#00c9ff] font-bold uppercase tracking-wider text-xs">
                    Initialize
                    <ArrowRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Cyberpunk Activity Stream */}
      <section>
        <h2 className="text-2xl font-black mb-8 flex items-center gap-3 uppercase tracking-widest text-white/50">
          <Activity className="w-6 h-6 text-emerald-400" /> Global Data Stream
        </h2>
        <div className="glass-panel rounded-[2rem] p-6 border-white/10 relative overflow-hidden bg-black/40">
          {/* Scanning line effect */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00c9ff] to-transparent opacity-50 blur-[2px] animate-[float_3s_ease-in-out_infinite]" />
          
          <div className="space-y-4 relative z-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-5 border border-white/5 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl font-medium group">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-white/10 rounded-xl relative overflow-hidden flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#00c9ff] to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                  </div>
                  <div>
                    <div className="h-4 w-40 bg-white/20 rounded-full mb-3 overflow-hidden relative">
                      <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00c9ff] to-[#92fe9d] w-1/2 -translate-x-full animate-[shine_2s_infinite]" />
                    </div>
                    <div className="h-3 w-24 bg-white/10 rounded-full" />
                  </div>
                </div>
                <div className="h-4 w-20 bg-white/10 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
