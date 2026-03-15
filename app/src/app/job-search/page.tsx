'use client';

import { useState } from 'react';
import { Briefcase, Search, Sparkles, AlertCircle, ExternalLink, MapPin, Building2, Loader2 } from 'lucide-react';

interface Job {
  title: string;
  company: string;
  location: string;
  url: string;
  summary: string;
}

export default function JobSearchPage() {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  async function searchJobs() {
    if (!keyword.trim()) return;
    setLoading(true);
    setError('');
    setJobs([]);
    setSearched(true);

    try {
      const res = await fetch('/api/search-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to search jobs');
      setJobs(data.jobs ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
    setLoading(false);
  }

  const suggestions = ['Python Developer', 'Frontend Engineer', 'Data Scientist', 'Product Manager', 'DevOps Engineer'];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">AI Job Search</h1>
            <p className="text-sm text-gray-400">Search job listings with AI-powered summaries via Firecrawl</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="glass p-6 mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">Job Title / Keywords</label>
        <div className="flex gap-3 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && searchJobs()}
              placeholder="e.g. Python Developer, UX Designer..."
              className="input-dark pl-9"
            />
          </div>
          <button
            onClick={searchJobs}
            disabled={loading || !keyword.trim()}
            className="btn-glow flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50 transition-all whitespace-nowrap"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {loading ? 'Searching...' : 'Search Jobs'}
          </button>
        </div>
        {/* Quick suggestions */}
        <div className="flex flex-wrap gap-2">
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => { setKeyword(s); }}
              className="text-xs px-3 py-1 rounded-full bg-white/5 hover:bg-cyan-500/10 hover:text-cyan-400 text-gray-400 transition-colors border border-white/5"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="glass p-10 text-center">
          <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Crawling job sites and generating AI summaries...</p>
          <p className="text-gray-600 text-xs mt-1">Powered by Firecrawl + AI. This takes ~20-30 seconds.</p>
        </div>
      )}

      {/* Results */}
      {!loading && jobs.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-4">Found <span className="text-white font-semibold">{jobs.length}</span> jobs for &quot;{keyword}&quot;</p>
          <div className="space-y-4">
            {jobs.map((job, i) => (
              <div key={i} className="glass card-hover p-5 border border-white/5 animate-fade-in">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-lg leading-tight mb-1">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                        {job.company}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        {job.location}
                      </span>
                    </div>
                  </div>
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 flex items-center gap-1.5 text-xs font-medium bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 px-3 py-1.5 rounded-lg transition-colors border border-cyan-500/20"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Apply
                  </a>
                </div>
                <div className="border-t border-white/5 pt-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">AI Summary</span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{job.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && searched && jobs.length === 0 && !error && (
        <div className="glass p-12 text-center">
          <Briefcase className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-400 mb-2">No results found</h3>
          <p className="text-gray-600 text-sm">Try a different keyword or be more specific.</p>
        </div>
      )}
    </div>
  );
}
