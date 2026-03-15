'use client';

import { useState } from 'react';
import { Youtube, Sparkles, AlertCircle, Copy, Check, Link } from 'lucide-react';

export default function YoutubeSummarizerPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ summary: string; videoId: string } | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  async function summarize() {
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/summarize-youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to summarize');
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
    setLoading(false);
  }

  async function copyToClipboard() {
    if (!result) return;
    await navigator.clipboard.writeText(result.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Render markdown-ish output
  function renderSummary(text: string) {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h3 key={i} className="text-lg font-bold text-white mt-5 mb-2 first:mt-0">{line.replace('## ', '')}</h3>;
      if (line.startsWith('• ') || line.startsWith('- ')) return <li key={i} className="text-gray-300 ml-4 mb-1">{line.substring(2)}</li>;
      if (line.trim() === '') return <div key={i} className="mb-2" />;
      return <p key={i} className="text-gray-300">{line}</p>;
    });
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
            <Youtube className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">YouTube Summariser</h1>
            <p className="text-sm text-gray-400">Paste a YouTube URL to get an AI-powered summary</p>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="glass p-6 mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">YouTube Video URL</label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && summarize()}
              placeholder="https://www.youtube.com/watch?v=..."
              className="input-dark pl-9"
            />
          </div>
          <button
            onClick={summarize}
            disabled={loading || !url.trim()}
            className="btn-glow flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50 transition-all whitespace-nowrap"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {loading ? 'Summarising...' : 'Summarise'}
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-2">Works with any YouTube video that has captions/subtitles available.</p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="glass p-8 text-center">
          <div className="w-10 h-10 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Fetching transcript and generating summary...</p>
          <p className="text-gray-600 text-xs mt-1">This may take 10-20 seconds</p>
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="glass p-6 animate-fade-in">
          {/* YouTube embed */}
          <div className="rounded-xl overflow-hidden mb-6 aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${result.videoId}`}
              className="w-full h-full"
              allowFullScreen
              title="YouTube video"
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              AI Summary
            </h2>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="space-y-1 prose-dark">
            {renderSummary(result.summary)}
          </div>
        </div>
      )}
    </div>
  );
}
