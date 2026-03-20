'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Youtube, FileText, Image as ImageIcon,
  ChevronRight, Activity, Zap, Shield, Moon, Sun, Brain, Play
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

const features = [
  {
    icon: <Youtube className="w-8 h-8" />,
    title: 'YouTube Intel',
    desc: 'Instantly digest 3-hour podcasts into 5-minute action plans.',
    gradient: 'from-[#ff0844] to-[#ffb199]',
    delay: 0.1
  },
  {
    icon: <FileText className="w-8 h-8" />,
    title: 'Smart Notes',
    desc: 'Your notes write themselves. Full AI integration right in the editor.',
    gradient: 'from-[#4facfe] to-[#00f2fe]',
    delay: 0.2
  },
  {
    icon: <ImageIcon className="w-8 h-8" />,
    title: 'Vision Sense',
    desc: 'Drag, drop, and decode. Extract meaning from diagrams instantly.',
    gradient: 'from-[#43e97b] to-[#38f9d7]',
    delay: 0.3
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: 'Neural Engine',
    desc: 'Context-aware intelligence that adapts to your learning style.',
    gradient: 'from-[#fa709a] to-[#fee140]',
    delay: 0.4
  },
];

export default function CrazyLandingPage() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { scrollYProgress } = useScroll();
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 90]);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col selection:bg-fuchsia-500/30 bg-mesh">
      
      {/* Floating Abstract Shapes */}
      <motion.div 
        style={{ y: y1, rotate: rotate1 }} 
        className="absolute top-[10%] -left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl mix-blend-screen pointer-events-none animate-float" 
      />
      <motion.div 
        style={{ y: y2 }} 
        className="absolute top-[30%] -right-20 w-[30rem] h-[30rem] bg-cyan-500/20 rounded-full blur-3xl mix-blend-screen pointer-events-none animate-float-reverse" 
      />
      <div className="absolute top-[60%] left-[20%] w-[40rem] h-[40rem] bg-rose-500/10 rounded-full blur-3xl mix-blend-screen pointer-events-none animate-float" style={{ animationDelay: '2s' }} />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none opacity-20" />

      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative z-50 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff0f7b] to-[#f89b29] flex items-center justify-center shadow-[0_0_30px_rgba(255,15,123,0.5)] animate-glow">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="font-black text-2xl tracking-tighter hidden sm:block">
            Smart<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00c9ff] to-[#92fe9d]">Summarize</span>
          </span>
        </div>
        
        <div className="flex items-center gap-6 glass px-6 py-2 rounded-full border-white/10 shadow-xl">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-foreground"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" /> : <Moon className="w-5 h-5" />}
          </button>
          <Link href="/login" className="text-sm font-bold hover:text-[#00c9ff] transition-colors hidden sm:block uppercase tracking-widest">
            Login
          </Link>
          <Link href="/login" className="btn-super-glow relative bg-white text-black dark:bg-black dark:text-white px-6 py-2.5 rounded-full font-black text-sm uppercase tracking-wider overflow-hidden group">
            <span className="relative z-10 transition-transform group-hover:scale-110 inline-block">Ignite</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff0f7b] to-[#f89b29] opacity-0 group-hover:opacity-20 transition-opacity" />
          </Link>
        </div>
      </motion.nav>

      <main className="flex-1 flex flex-col items-center justify-center w-full mt-12 sm:mt-24 pb-32">
        {/* Extreme Hero Section */}
        <section className="relative z-10 text-center px-4 max-w-6xl mx-auto w-full perspective-1000">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="flex flex-col items-center"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-white bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-6 py-2 mb-10 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              <Zap className="w-4 h-4 text-yellow-400" />
              Intelligence Limitless
            </motion.div>
            
            <h1 className="text-6xl sm:text-8xl lg:text-[10rem] font-black tracking-tighter mb-8 leading-[0.9] drop-shadow-2xl">
              EVOLVE <br className="hidden sm:block" />
              <span className="gradient-text-crazy mix-blend-hard-light filter drop-shadow-[0_0_30px_rgba(0,201,255,0.6)]">YOUR MIND.</span>
            </h1>
            
            <p className="text-xl sm:text-3xl text-foreground/80 max-w-3xl mx-auto mb-12 font-medium tracking-tight drop-shadow-md">
              The God-tier workspace for visual minds. Summarize YouTube, decode images, and write notes at warp speed.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-2xl relative z-20">
              <Link href="/dashboard" className="w-full relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#ff0f7b] via-[#f89b29] to-[#00c9ff] rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
                <div className="relative flex items-center justify-center gap-3 bg-black text-white dark:bg-white dark:text-black font-black px-10 py-6 rounded-2xl text-xl hover:scale-[1.03] transition-transform backdrop-blur-xl">
                  ENTER WORKSPACE <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              
              <button 
                onClick={() => toast.success("Hyper-drive engaged!", { icon: "🚀" })}
                className="w-full glass-panel flex items-center justify-center gap-3 font-bold px-10 py-6 text-xl hover:bg-white/10 transition-colors group"
              >
                <Play className="w-6 h-6 group-hover:scale-125 transition-transform text-[#00c9ff]" /> Play Demo
              </button>
            </div>
          </motion.div>
        </section>

        {/* Floating 3D Features Grid */}
        <section className="relative z-20 py-32 px-4 w-full max-w-7xl mx-auto mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div 
                key={f.title}
                initial={{ opacity: 0, y: 50, rotateY: -30 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ scale: 1.05, translateY: -10, rotateX: 10 }}
                transition={{ duration: 0.6, delay: f.delay, type: "spring" }}
                className="glass-panel p-8 rounded-3xl group relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${f.gradient} opacity-20 rounded-bl-full blur-2xl group-hover:opacity-50 transition-opacity duration-500`} />
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-6 text-white shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500`}>
                  {f.icon}
                </div>
                <h3 className="font-black text-2xl mb-3 text-foreground tracking-tight">{f.title}</h3>
                <p className="text-base text-muted-foreground font-medium leading-relaxed group-hover:text-foreground transition-colors">{f.desc}</p>
                
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
              </motion.div>
            ))}
          </div>
        </section>

      </main>

      {/* Wild Footer */}
      <footer className="relative z-10 py-12 text-center border-t border-white/10 bg-black/50 backdrop-blur-xl">
        <h2 className="text-4xl font-black mb-4 gradient-text-crazy">SMART SUMMARIZE</h2>
        <p className="text-sm font-bold text-white/50 tracking-widest">© {new Date().getFullYear()} DESIGNED FOR THE FUTURE</p>
      </footer>
    </div>
  );
}
