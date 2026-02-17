
import React, { useState } from 'react';
import { Note, Theme } from '../types';
import NoteCreator from './NoteCreator';

interface NotesProps {
  notes: Note[];
  onAddNote: (noteData: Omit<Note, 'id' | 'createdAt'>) => void;
  // Fix: Added theme to NotesProps to resolve TypeScript error in App.tsx
  theme: Theme;
}

const Notes: React.FC<NotesProps> = ({ notes, onAddNote, theme }) => {
  const [showCreator, setShowCreator] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  // Fix: Use isDark to adapt styles to theme
  const isDark = theme === 'dark';

  const allTags = Array.from(new Set(notes.flatMap(n => n.tags)));

  const filteredNotes = notes.filter(n => {
    const matchesSearch = 
      n.title.toLowerCase().includes(search.toLowerCase()) || 
      n.content.toLowerCase().includes(search.toLowerCase()) ||
      n.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    
    const matchesTag = activeTag ? n.tags.includes(activeTag) : true;
    
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-[#F9FAFB]' : 'text-gray-900'}`}>Notes</h2>
          <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`}>{notes.length} thoughts captured</p>
        </div>
        <button 
          onClick={() => setShowCreator(true)}
          className="bg-[#8B5CF6] text-white p-3 rounded-2xl shadow-xl shadow-[#8B5CF6]/10 active:scale-95 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-4 top-[1.1rem] text-[#6B7280] group-focus-within:text-[#22D3EE] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input 
          type="text" 
          placeholder="Search notes..." 
          className={`w-full border rounded-[20px] pl-11 pr-5 py-3.5 text-sm focus:ring-1 focus:ring-[#8B5CF6]/40 outline-none shadow-sm transition-all font-medium placeholder:text-[#6B7280] ${isDark ? 'bg-[#0D0D0D] border-[#1C1C1C] text-[#F9FAFB]' : 'bg-white border-gray-200 text-gray-900'}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tag Filter Chips */}
      {allTags.length > 0 && (
        <div className="flex overflow-x-auto no-scrollbar space-x-2 py-1">
          <button
            onClick={() => setActiveTag(null)}
            className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all border ${!activeTag ? 'bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-lg shadow-[#8B5CF6]/10' : (isDark ? 'bg-[#0D0D0D] text-[#6B7280] border-[#1C1C1C]' : 'bg-white text-gray-500 border-gray-100')}`}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${activeTag === tag ? 'bg-[#8B5CF6] text-white border-[#8B5CF6]' : (isDark ? 'bg-[#0D0D0D] text-[#6B7280] border-[#1C1C1C] hover:border-[#6B7280]/30' : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50')}`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Masonry-like Grid of Notes */}
      <div className="columns-2 gap-4 space-y-4">
        {filteredNotes.map(note => (
          <div 
            key={note.id} 
            className={`break-inside-avoid p-5 rounded-[28px] border transition-all cursor-pointer overflow-hidden flex flex-col group relative ${isDark ? 'border-[#1C1C1C] bg-[#0D0D0D] hover:border-[#8B5CF6]/40' : 'border-gray-100 bg-white hover:border-indigo-200 shadow-sm'}`}
          >
            <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: note.color, opacity: 0.6 }}></div>
            <div className="flex justify-between items-start mb-2">
              <h4 className={`font-bold text-sm leading-tight line-clamp-2 ${isDark ? 'text-[#F9FAFB]' : 'text-gray-900'}`}>{note.title}</h4>
            </div>
            
            <p className={`text-xs leading-relaxed whitespace-pre-wrap line-clamp-6 font-medium ${isDark ? 'text-[#A1A1AA]' : 'text-gray-600'}`}>{note.content}</p>
            
            <div className="flex flex-wrap gap-1 mt-3">
                {note.tags.map(tag => (
                    <span key={tag} className={`text-[7px] font-bold uppercase px-1.5 py-0.5 rounded border ${isDark ? 'bg-[#141414] text-[#6B7280] border-[#1C1C1C]' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>#{tag}</span>
                ))}
            </div>

            <div className={`mt-4 pt-3 border-t flex justify-between items-center text-[8px] font-bold uppercase tracking-widest ${isDark ? 'border-[#1C1C1C] text-[#6B7280]' : 'border-gray-50 text-gray-400'}`}>
              <span>{new Date(note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
              <div className="flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{new Date(note.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className={`flex flex-col items-center justify-center py-20 rounded-[40px] border border-dashed ${isDark ? 'bg-[#0D0D0D] border-[#1C1C1C]' : 'bg-gray-50 border-gray-200'}`}>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border ${isDark ? 'bg-[#141414] text-[#6B7280] border-[#1C1C1C]' : 'bg-white text-gray-300 border-gray-200'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <p className={`text-sm font-bold ${isDark ? 'text-[#A1A1AA]' : 'text-gray-500'}`}>No notes found</p>
          <p className={`text-[9px] uppercase tracking-widest mt-1 font-bold ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`}>Refine your search</p>
        </div>
      )}

      {showCreator && (
        <NoteCreator 
          onClose={() => setShowCreator(false)} 
          onSave={(data) => {
            onAddNote(data);
            setShowCreator(false);
          }}
        />
      )}
    </div>
  );
};

export default Notes;
