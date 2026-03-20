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

  async function signInWithGoogle() {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
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
            onClick={signInWithGoogle}
            disabled={loading}
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white font-bold py-4 px-6 rounded-2xl hover:bg-white/10 transition-colors disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wider text-xs mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google OAuth
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
