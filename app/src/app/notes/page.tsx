'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Save, FileText, Search, X, Edit3 } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  updated_at: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selected, setSelected] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchQ, setSearchQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchNotes(); }, []);

  async function fetchNotes() {
    setLoading(true);
    const res = await fetch('/api/notes');
    const data = await res.json();
    setNotes(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  function selectNote(note: Note) {
    setSelected(note);
    setTitle(note.title);
    setContent(note.content);
  }

  function newNote() {
    setSelected(null);
    setTitle('');
    setContent('');
    setTimeout(() => titleRef.current?.focus(), 50);
  }

  async function saveNote() {
    if (!title.trim()) return;
    setSaving(true);
    setStatus('');
    try {
      if (selected) {
        const res = await fetch('/api/notes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selected.id, title, content }),
        });
        const updated = await res.json();
        setNotes(prev => prev.map(n => n.id === updated.id ? updated : n));
        setSelected(updated);
        setStatus('Saved ✓');
      } else {
        const res = await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content }),
        });
        const created = await res.json();
        setNotes(prev => [created, ...prev]);
        setSelected(created);
        setStatus('Created ✓');
      }
    } catch {
      setStatus('Error saving');
    }
    setSaving(false);
    setTimeout(() => setStatus(''), 3000);
  }

  async function deleteNote(id: string) {
    await fetch('/api/notes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setNotes(prev => prev.filter(n => n.id !== id));
    if (selected?.id === id) newNote();
  }

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(searchQ.toLowerCase()) ||
    n.content?.toLowerCase().includes(searchQ.toLowerCase())
  );

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="h-full flex gap-0 -m-6">
      {/* Notes List */}
      <div className="w-72 flex-shrink-0 border-r border-white/5 bg-gray-950/50 flex flex-col h-full">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" /> Notes
            </h1>
            <button onClick={newNote} className="w-7 h-7 rounded-lg bg-indigo-500 hover:bg-indigo-600 flex items-center justify-center transition-colors">
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <input
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Search notes..."
              className="input-dark pl-8 text-sm py-1.5"
            />
            {searchQ && (
              <button onClick={() => setSearchQ('')} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                <X className="w-3 h-3 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-2">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-gray-500 text-sm">Loading...</div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-gray-600 text-sm">
              {notes.length === 0 ? 'No notes yet. Create one!' : 'No results.'}
            </div>
          ) : (
            filteredNotes.map(note => (
              <div
                key={note.id}
                onClick={() => selectNote(note)}
                className={`group relative w-full text-left p-3 rounded-lg mb-1 cursor-pointer transition-all ${
                  selected?.id === note.id
                    ? 'bg-indigo-500/15 border border-indigo-500/30'
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <p className="font-medium text-sm text-white truncate pr-6">{note.title}</p>
                <p className="text-xs text-gray-500 truncate mt-0.5">{note.content?.substring(0, 60) || 'No content'}</p>
                <p className="text-xs text-gray-600 mt-1">{formatDate(note.updated_at)}</p>
                <button
                  onClick={e => { e.stopPropagation(); deleteNote(note.id); }}
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 p-1 rounded text-gray-500 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">{selected ? 'Editing note' : 'New note'}</span>
          </div>
          <div className="flex items-center gap-3">
            {status && <span className="text-xs text-green-400">{status}</span>}
            <button
              onClick={saveNote}
              disabled={saving || !title.trim()}
              className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
        <div className="flex-1 flex flex-col p-6 overflow-auto">
          <input
            ref={titleRef}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Note title..."
            className="bg-transparent text-2xl font-bold text-white placeholder-gray-700 outline-none border-none mb-4"
            onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
          />
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Start writing your note here..."
            className="flex-1 bg-transparent text-gray-300 placeholder-gray-700 outline-none border-none resize-none text-base leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
