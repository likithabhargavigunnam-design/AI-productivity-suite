import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { FileText, Youtube, Briefcase, FileUser, ArrowRight } from 'lucide-react';

const tools = [
  {
    href: '/notes',
    icon: <FileText className="w-7 h-7" />,
    title: 'Notes',
    desc: 'Create and manage your personal notes',
    color: 'from-indigo-500 to-purple-600',
    bg: 'bg-indigo-500/10 border-indigo-500/20',
  },
  {
    href: '/youtube-summarizer',
    icon: <Youtube className="w-7 h-7" />,
    title: 'YouTube Summariser',
    desc: 'Get AI-powered video summaries instantly',
    color: 'from-red-500 to-pink-600',
    bg: 'bg-red-500/10 border-red-500/20',
  },
  {
    href: '/job-search',
    icon: <Briefcase className="w-7 h-7" />,
    title: 'Job Search',
    desc: 'Find jobs with AI-powered search & summaries',
    color: 'from-cyan-500 to-blue-600',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
  },
  {
    href: '/resume-builder',
    icon: <FileUser className="w-7 h-7" />,
    title: 'Resume Builder',
    desc: 'Generate professional resumes with AI',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userName = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'there';

  // Fetch note count
  const { count: noteCount } = await supabase
    .from('notes')
    .select('*', { count: 'exact', head: true });

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm text-indigo-400 font-medium mb-1">{greeting},</p>
        <h1 className="text-3xl font-black text-white mb-2">{userName} 👋</h1>
        <p className="text-gray-400 text-sm">Here&apos;s your productivity dashboard. Choose a tool to get started.</p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Notes Saved', value: noteCount ?? 0 },
          { label: 'Tools Available', value: 4 },
          { label: 'AI Models', value: '1' },
          { label: 'Storage', value: 'Unlimited' },
        ].map((s) => (
          <div key={s.label} className="glass p-4 text-center">
            <div className="text-2xl font-black text-white">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tool cards */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Your Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href} className={`group glass card-hover border ${tool.bg} p-6 flex items-center gap-5`}>
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform`}>
              {tool.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white mb-1">{tool.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{tool.desc}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
