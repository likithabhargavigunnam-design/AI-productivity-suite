'use client';

import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';
import { Sparkles, Mail, Lock, ArrowRight, Github } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const supabase = createClient();

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }
    
    setLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        toast.success('Registration successful! Check your email to verify your account.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Login successful! Redirecting to Nexus Core...');
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGitHub() {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <main className="min-h-screen bg-mesh flex items-center justify-center p-4 relative overflow-hidden text-foreground selection:bg-[#00c9ff]/30">
      
      {/* Insane Floating Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#ff0f7b]/20 rounded-full blur-[100px] pointer-events-none animate-float" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#00c9ff]/20 rounded-full blur-[100px] pointer-events-none animate-float-reverse" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay" />

      <div className="relative z-10 w-full max-w-md perspective-1000">
        <div className="glass-panel p-10 rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black/40 backdrop-blur-3xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00c9ff]/20 to-transparent rounded-bl-full pointer-events-none" />
          
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-[1.5rem] bg-gradient-to-br from-[#00c9ff] to-[#92fe9d] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,201,255,0.4)] animate-glow hover:scale-110 transition-transform">
              <Sparkles className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-3xl font-black mb-2 text-white tracking-tight">
              {isSignUp ? 'INITIALIZE PROTOCOL' : 'ACCESS TERMINAL'}
            </h1>
            <p className="text-sm font-medium text-white/50 tracking-wider uppercase">
              {isSignUp ? 'Create your intelligence node' : 'Enter your credentials to continue'}
            </p>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-[#00c9ff] transition-colors" />
              <input
                type="email"
                placeholder="Agent Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 focus:border-[#00c9ff] hover:bg-white/10 rounded-2xl pl-12 pr-4 py-4 text-white outline-none transition-all placeholder:text-white/30 font-medium tracking-wide"
              />
            </div>
            
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-[#00c9ff] transition-colors" />
              <input
                type="password"
                placeholder="Secure Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 focus:border-[#00c9ff] hover:bg-white/10 rounded-2xl pl-12 pr-4 py-4 text-white outline-none transition-all placeholder:text-white/30 font-medium tracking-wide"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-super-glow relative flex items-center justify-center gap-3 bg-white text-black font-black py-4 px-6 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:pointer-events-none mt-2 group uppercase tracking-widest text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <span className="relative z-10">{isSignUp ? 'Create Node' : 'Initialize'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-xs font-bold text-white/30 uppercase tracking-widest">OR BYPASS WITH</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          <button
            onClick={signInWithGitHub}
            disabled={loading}
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white font-bold py-4 px-6 rounded-2xl hover:bg-white/10 transition-colors disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wider text-xs mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>

          <p className="text-center text-sm font-medium text-white/50">
            {isSignUp ? 'Already an agent?' : 'Need security clearance?'}{' '}
            <button 
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[#00c9ff] hover:text-white transition-colors font-bold underline underline-offset-4"
            >
              {isSignUp ? 'Access Terminal' : 'Request Access'}
            </button>
          </p>

          <p className="text-center text-xs font-bold text-white/20 mt-8 uppercase tracking-widest">
            <Link href="/" className="hover:text-white transition-colors">Abort & Return to Core</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
