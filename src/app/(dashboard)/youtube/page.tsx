'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, Sparkles, Check, Copy, Link as LinkIcon, AlertCircle, Clock, FileText, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function YouTubeSummarizerPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ summary: string; videoId: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/summarize-youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate summary.');
      
      setResult(data);
      toast.success('Summary generated successfully!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'An error occurred while summarizing.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.summary);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  // Render markdown-ish text beautifully
  const renderSummary = (text: string) => {
    let currentKey = 0;
    return text.split('\n').map((line, i) => {
      const key = currentKey++;
      if (line.startsWith('## ')) {
        return (
          <h3 key={key} className="text-xl font-bold mt-8 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-indigo-500 rounded-full inline-block"></span>
            {line.replace('## ', '')}
          </h3>
        );
      }
      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <li key={key} className="ml-6 mb-2 text-muted-foreground flex items-start gap-2 relative">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50 absolute -left-5 top-2.5"></span>
            <span className="leading-relaxed">{line.substring(2)}</span>
          </li>
        );
      }
      if (line.trim() === '') return <div key={key} className="h-4" />;
      return <p key={key} className="text-muted-foreground leading-relaxed mb-4">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 mb-6 shadow-premium">
            <Youtube className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            YouTube <span className="gradient-text">Summarizer</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Extract insights, key takeaways, and detailed outlines from any YouTube video instantly. Save hours of watching time.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-2 sm:p-4 rounded-[2rem] flex flex-col sm:flex-row gap-3 shadow-[0_0_50px_rgba(255,8,68,0.2)] max-w-3xl mx-auto mb-16 relative z-20 border-white/10 bg-black/40 backdrop-blur-3xl"
        >
          <div className="relative flex-1 flex items-center">
            <LinkIcon className="absolute left-6 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSummarize()}
              placeholder="Inject YouTube Feed URL..."
              className="w-full bg-transparent border-none focus:ring-0 pl-14 pr-4 py-4 sm:py-2 text-white outline-none placeholder:text-white/30 font-medium tracking-wide"
            />
          </div>
          <button
            onClick={handleSummarize}
            disabled={loading || !url.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-[#ff0844] to-[#ffb199] text-white font-black px-10 py-4 sm:py-3 rounded-[1.5rem] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none shadow-[0_0_20px_rgba(255,8,68,0.5)] group uppercase tracking-widest text-sm"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            )}
            {loading ? 'Processing...' : 'Execute'}
          </button>
        </motion.div>

        {/* Results Area */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass p-8 rounded-3xl"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-full h-8 bg-muted rounded-lg animate-pulse" />
                <div className="w-24 h-8 bg-muted rounded-lg animate-pulse flex-shrink-0" />
              </div>
              
              <div className="aspect-video w-full bg-muted rounded-2xl animate-pulse mb-8" />
              
              <div className="space-y-4">
                <div className="w-1/3 h-6 bg-muted rounded-md animate-pulse" />
                <div className="w-full h-4 bg-muted rounded-md animate-pulse" />
                <div className="w-full h-4 bg-muted rounded-md animate-pulse" />
                <div className="w-5/6 h-4 bg-muted rounded-md animate-pulse" />
              </div>
            </motion.div>
          )}

          {result && !loading && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-6 sm:p-10 rounded-3xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[1fr,2fr] gap-8">
                {/* Left side: Video info & Quick actions */}
                <div className="space-y-6">
                  <div className="rounded-2xl overflow-hidden aspect-video shadow-md border border-border">
                    <iframe
                      src={`https://www.youtube.com/embed/${result.videoId}`}
                      className="w-full h-full"
                      allowFullScreen
                      title="YouTube video"
                    />
                  </div>
                  
                  <div className="glass p-5 rounded-2xl bg-muted/20">
                    <h4 className="font-semibold flex items-center gap-2 mb-4">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      Quick Actions
                    </h4>
                    <button
                      onClick={copyToClipboard}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors text-sm font-medium border border-transparent hover:border-border"
                    >
                      <span className="flex items-center gap-2">
                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                        {copied ? 'Copied Full Content' : 'Copy to Clipboard'}
                      </span>
                    </button>
                    <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors text-sm font-medium border border-transparent hover:border-border mt-2">
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        Save to Custom Notes
                      </span>
                    </button>
                  </div>
                </div>

                {/* Right side: Summary Content */}
                <div className="pl-0 lg:pl-6 border-t lg:border-t-0 lg:border-l border-border pt-6 lg:pt-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-full">
                      <Sparkles className="w-3 h-3" />
                      AI Summarized
                    </span>
                  </div>
                  
                  <div className="prose-dark mt-4">
                    {renderSummary(result.summary)}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
