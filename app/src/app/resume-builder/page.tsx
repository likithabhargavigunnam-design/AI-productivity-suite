'use client';

import { useState } from 'react';
import { FileUser, Sparkles, AlertCircle, Copy, Check, Download, Loader2 } from 'lucide-react';

const fields = [
  { key: 'name', label: 'Full Name *', placeholder: 'John Doe', required: true, type: 'input' },
  { key: 'email', label: 'Email Address *', placeholder: 'john@example.com', required: true, type: 'input' },
  { key: 'phone', label: 'Phone Number', placeholder: '+1 (555) 000-0000', required: false, type: 'input' },
  { key: 'location', label: 'Location', placeholder: 'San Francisco, CA', required: false, type: 'input' },
  { key: 'summary', label: 'Professional Summary', placeholder: 'Brief intro about yourself and your goals...', required: false, type: 'textarea', rows: 3 },
  { key: 'experience', label: 'Work Experience', placeholder: 'Company - Role - Duration\n• Responsibility 1\n• Responsibility 2\n\nCompany 2 - Role - Duration\n• Achievement...', required: false, type: 'textarea', rows: 5 },
  { key: 'education', label: 'Education', placeholder: 'University of X - BS Computer Science - 2020\nGPA: 3.8/4.0', required: false, type: 'textarea', rows: 3 },
  { key: 'skills', label: 'Skills', placeholder: 'Python, TypeScript, React, SQL, AWS, Docker...', required: false, type: 'input' },
  { key: 'projects', label: 'Projects', placeholder: 'Project Name - Brief description, technologies used...', required: false, type: 'textarea', rows: 4 },
];

type FormData = { [key: string]: string };

export default function ResumeBuilderPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', phone: '', location: '', summary: '',
    experience: '', education: '', skills: '', projects: '',
  });
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  function update(key: string, value: string) {
    setFormData(prev => ({ ...prev, [key]: value }));
  }

  async function generateResume() {
    if (!formData.name || !formData.email) return;
    setLoading(true);
    setError('');
    setResume('');

    try {
      const res = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to generate resume');
      setResume(data.resume);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
    setLoading(false);
  }

  async function copyResume() {
    await navigator.clipboard.writeText(resume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadResume() {
    const blob = new Blob([resume], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.name.replace(/\s+/g, '_')}_resume.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function renderResume(text: string) {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-black text-white mt-0 mb-1">{line.replace('# ', '')}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-base font-bold text-indigo-400 uppercase tracking-wider mt-5 mb-2 border-b border-indigo-500/20 pb-1">{line.replace('## ', '')}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-sm font-bold text-white mt-3 mb-1">{line.replace('### ', '')}</h3>;
      if (line.startsWith('• ') || line.startsWith('- ')) return <li key={i} className="text-gray-300 text-sm ml-4 mb-0.5">{line.substring(2)}</li>;
      if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-semibold text-white text-sm">{line.replace(/\*\*/g, '')}</p>;
      if (line.trim() === '') return <div key={i} className="mb-2" />;
      return <p key={i} className="text-gray-300 text-sm leading-relaxed">{line.replace(/\*\*(.*?)\*\*/g, '$1')}</p>;
    });
  }

  const isFormValid = formData.name.trim() && formData.email.trim();

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <FileUser className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">AI Resume Builder</h1>
            <p className="text-sm text-gray-400">Fill in your details and get a professional AI-generated resume</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="glass p-6 space-y-4">
          <h2 className="font-semibold text-white text-sm uppercase tracking-wider">Your Details</h2>
          {fields.map(field => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea
                  value={formData[field.key]}
                  onChange={e => update(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={field.rows ?? 3}
                  className="input-dark resize-none text-sm"
                />
              ) : (
                <input
                  value={formData[field.key]}
                  onChange={e => update(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="input-dark text-sm"
                />
              )}
            </div>
          ))}

          {error && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          <button
            onClick={generateResume}
            disabled={loading || !isFormValid}
            className="w-full btn-glow flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3 rounded-xl disabled:opacity-50 transition-all"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {loading ? 'Generating Resume...' : 'Generate Resume with AI'}
          </button>
        </div>

        {/* Preview */}
        <div className="glass p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white text-sm uppercase tracking-wider">Resume Preview</h2>
            {resume && (
              <div className="flex items-center gap-2">
                <button
                  onClick={copyResume}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={downloadResume}
                  className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            )}
          </div>

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4" />
              <p className="text-gray-400 text-sm">AI is crafting your resume...</p>
            </div>
          )}

          {!resume && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <FileUser className="w-16 h-16 text-gray-800 mb-4" />
              <p className="text-gray-600 text-sm">Your AI-generated resume will appear here</p>
              <p className="text-gray-700 text-xs mt-1">Fill in the form and click Generate</p>
            </div>
          )}

          {resume && !loading && (
            <div className="flex-1 overflow-auto bg-gray-950/50 rounded-xl p-5 border border-white/5">
              <div className="space-y-0.5">
                {renderResume(resume)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
