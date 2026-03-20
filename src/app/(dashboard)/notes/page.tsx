'use client';

import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Folder, FileText, Plus, Search, MoreVertical, 
  Bold, Italic, Strikethrough, Highlighter, 
  List, ListOrdered, Download, Sparkles, Wand2, X
} from 'lucide-react';
import { toast } from 'sonner';

const initialFolders = [
  { id: '1', name: 'Work' },
  { id: '2', name: 'Personal' },
  { id: '3', name: 'Study' },
];

const initialNotes = [
  { id: '101', folderId: '1', title: 'Q3 Product Roadmap', preview: 'Key objectives for the next quarter include...', updatedAt: '2h ago' },
  { id: '102', folderId: '1', title: 'Marketing Sync', preview: 'Discussed the new campaign launch...', updatedAt: 'Yesterday' },
  { id: '103', folderId: '3', title: 'React Hooks Deep Dive', preview: 'useEffect is essentially for side effects...', updatedAt: '5 days ago' },
];

export default function NotesPage() {
  const [activeFolderId, setActiveFolderId] = useState<string | null>('1');
  const [activeNoteId, setActiveNoteId] = useState<string>('101');
  const [searchQuery, setSearchQuery] = useState('');
  const [noteTitle, setNoteTitle] = useState('Q3 Product Roadmap');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({ placeholder: 'Start writing or paste your notes here...' }),
    ],
    content: '<p>Key objectives for the next quarter include doubling our active user base and releasing the new AI Summarizer dashboard.</p><ul><li>Finalize designs by Friday</li><li>Database schema migration block</li><li>Start API development</li></ul>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[200px] text-white/90',
      },
    },
  });

  const handleExport = () => {
    toast.success('Note exported as Markdown successfully!');
  };

  const handleSummarize = async () => {
    const content = editor?.getText();
    if (!content || content.trim().length < 20) {
      toast.error('Please write or paste some notes first.');
      return;
    }
    
    setIsSummarizing(true);
    setSummary(null);

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'summarize', content }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to summarize');

      setSummary(data.summary);
      toast.success('Notes summarized!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Summarization failed.');
    } finally {
      setIsSummarizing(false);
    }
  };

  const filteredNotes = initialNotes.filter(n => 
    (activeFolderId ? n.folderId === activeFolderId : true) && 
    (n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.preview.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-[calc(100vh-2rem)] m-4 overflow-hidden rounded-[2.5rem] glass-panel border border-white/10 shadow-[0_0_50px_rgba(0,242,254,0.1)] relative z-10 bg-black/40 backdrop-blur-3xl">
      
      {/* Sidebar */}
      <div className="w-72 border-r border-white/10 bg-black/20 flex flex-col flex-shrink-0 hidden md:flex">
        <div className="p-4 border-b border-white/10">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Search notes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/5 focus:border-[#00f2fe]/50 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none transition-all text-white placeholder:text-white/30 font-medium"
            />
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-[#00f2fe] uppercase tracking-widest">Directories</span>
            <button className="text-white/50 hover:text-white hover:scale-110 transition-transform"><Plus className="w-4 h-4" /></button>
          </div>
          <div className="space-y-1">
            <button 
              onClick={() => setActiveFolderId(null)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all font-bold ${activeFolderId === null ? 'bg-gradient-to-r from-[#4facfe]/20 to-[#00f2fe]/20 border border-[#00f2fe]/30 text-white' : 'text-white/50 hover:bg-white/10 hover:text-white border border-transparent'}`}
            >
              <FileText className="w-3.5 h-3.5" /> All Entries
            </button>
            {initialFolders.map(f => (
              <button 
                key={f.id}
                onClick={() => setActiveFolderId(f.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all font-bold ${activeFolderId === f.id ? 'bg-gradient-to-r from-[#4facfe]/20 to-[#00f2fe]/20 border border-[#00f2fe]/30 text-white' : 'text-white/50 hover:bg-white/10 hover:text-white border border-transparent'}`}
              >
                <Folder className="w-3.5 h-3.5" /> {f.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredNotes.map(note => (
            <button 
              key={note.id}
              onClick={() => { setActiveNoteId(note.id); setNoteTitle(note.title); setSummary(null); }}
              className={`w-full text-left p-3 rounded-xl transition-all border ${activeNoteId === note.id ? 'bg-white/10 border-white/20' : 'border-transparent hover:bg-white/5'}`}
            >
              <h4 className="font-semibold text-sm truncate text-white">{note.title}</h4>
              <p className="text-xs text-white/40 truncate my-1">{note.preview}</p>
              <span className="text-[10px] text-white/30">{note.updatedAt}</span>
            </button>
          ))}
          {filteredNotes.length === 0 && (
            <p className="text-sm text-white/30 text-center py-8">No notes found.</p>
          )}
        </div>
      </div>

      {/* Editor Main Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Toolbar */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/20 flex-shrink-0">
          <div className="flex items-center gap-1">
            {editor && (
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
                <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1.5 rounded-md transition-colors ${editor.isActive('bold') ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'}`}>
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1.5 rounded-md transition-colors ${editor.isActive('italic') ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'}`}>
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`p-1.5 rounded-md transition-colors ${editor.isActive('strike') ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'}`}>
                  <Strikethrough className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-4 bg-white/10 mx-1" />
                <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={`p-1.5 rounded-md transition-colors ${editor.isActive('highlight') ? 'bg-yellow-500/30 text-yellow-400' : 'text-white/40 hover:text-white'}`}>
                  <Highlighter className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-4 bg-white/10 mx-1" />
                <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1.5 rounded-md transition-colors ${editor.isActive('bulletList') ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'}`}>
                  <List className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-1.5 rounded-md transition-colors ${editor.isActive('orderedList') ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'}`}>
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleSummarize}
              disabled={isSummarizing}
              className="flex items-center gap-2 bg-[#00c9ff]/10 text-[#00c9ff] hover:bg-[#00c9ff]/20 px-3 py-1.5 rounded-lg text-xs font-black transition-colors border border-[#00c9ff]/20 disabled:opacity-50 uppercase tracking-widest"
            >
              {isSummarizing ? <Wand2 className="w-3.5 h-3.5 animate-pulse" /> : <Sparkles className="w-3.5 h-3.5" />}
              {isSummarizing ? 'Processing...' : 'Summarize'}
            </button>
            <button onClick={handleExport} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Editor + Summary */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-4">
            {/* Title */}
            <input 
              type="text" 
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Note Title"
              className="text-2xl font-black bg-transparent border-none outline-none w-full mb-4 text-white placeholder:text-white/20"
            />
            
            {/* Editor */}
            <div className="mb-6">
              <EditorContent editor={editor} />
            </div>

            {/* Summary Result Panel */}
            {summary && (
              <div className="mt-4 p-5 rounded-2xl border border-[#00c9ff]/30 bg-[#00c9ff]/5 relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-[#00c9ff] font-black text-sm uppercase tracking-widest">
                    <Sparkles className="w-4 h-4" />
                    AI Summary
                  </div>
                  <button 
                    onClick={() => setSummary(null)} 
                    className="text-white/30 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none text-white/80 whitespace-pre-wrap leading-relaxed text-sm">
                  {summary}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
