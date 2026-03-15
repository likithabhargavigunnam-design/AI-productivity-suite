'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Sparkles, FileText, Youtube, Briefcase, FileUser,
  ChevronRight, Star, Zap, Shield
} from 'lucide-react';

const features = [
  {
    icon: <FileText className="w-6 h-6" />,
    title: 'Notes Saver',
    desc: 'Create, edit, and organize your notes with real-time sync across all devices.',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    icon: <Youtube className="w-6 h-6" />,
    title: 'YouTube Summariser',
    desc: 'Paste any YouTube URL and get AI-generated summaries with key bullet points.',
    color: 'from-red-500 to-pink-500',
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: 'AI Job Search',
    desc: 'Search thousands of job listings with AI-powered descriptions and summaries.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: <FileUser className="w-6 h-6" />,
    title: 'AI Resume Maker',
    desc: 'Generate professional resumes in seconds using advanced AI. Download as PDF.',
    color: 'from-emerald-500 to-teal-500',
  },
];

const stats = [
  { label: 'Tools Integrated', value: '4+' },
  { label: 'AI Powered', value: '100%' },
  { label: 'Secure & Private', value: 'Always' },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main className="min-h-screen hero-gradient relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">AI Suite</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">
            Sign In
          </Link>
          <Link href="/login" className="btn-glow text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-lg transition-all hover:opacity-90">
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center pt-20 pb-24 px-4">
        <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="w-3 h-3" />
            AI-Powered Productivity
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
            Your All-in-One
            <br />
            <span className="gradient-text">AI Productivity Suite</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Notes, YouTube summaries, job searches, and AI-generated resumes — all in one powerful dashboard.
            Sign in with Google and boost your productivity today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="btn-glow inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-8 py-4 rounded-xl text-base hover:opacity-90 transition-all">
              Start for Free <ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="#features" className="inline-flex items-center gap-2 text-gray-400 font-medium px-8 py-4 rounded-xl text-base hover:text-white transition-colors border border-white/10 hover:border-white/20">
              Explore Features
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-16">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-black gradient-text">{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Everything You Need</h2>
          <p className="text-gray-400">Four powerful AI tools, one seamless dashboard.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="glass card-hover p-6 group animate-fade-in">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits row */}
      <section className="relative z-10 py-12 px-4 max-w-4xl mx-auto">
        <div className="glass p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Zap className="w-5 h-5 text-yellow-400" />, title: 'Lightning Fast', desc: 'AI responses in seconds, not minutes.' },
            { icon: <Shield className="w-5 h-5 text-green-400" />, title: 'Your Data is Safe', desc: 'Google OAuth + Row Level Security. Your data belongs to you.' },
            { icon: <Star className="w-5 h-5 text-purple-400" />, title: 'Always Improving', desc: 'Powered by the latest AI models via OpenRouter.' },
          ].map((b) => (
            <div key={b.title} className="flex items-start gap-4">
              <div className="mt-0.5">{b.icon}</div>
              <div>
                <div className="font-semibold mb-1">{b.title}</div>
                <div className="text-sm text-gray-400">{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 text-center py-24 px-4">
        <h2 className="text-3xl md:text-5xl font-black mb-6">Ready to be more productive?</h2>
        <Link href="/login" className="btn-glow inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-10 py-5 rounded-xl text-lg hover:opacity-90 transition-all">
          Sign in with Google <ChevronRight className="w-5 h-5" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 text-center py-6 text-sm text-gray-600">
        © {new Date().getFullYear()} AI Productivity Suite. Built with ❤️ using Next.js &amp; Supabase.
      </footer>
    </main>
  );
}
