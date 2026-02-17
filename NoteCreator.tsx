
import React, { useState } from 'react';
import { Note } from '../types';

interface NoteCreatorProps {
  onClose: () => void;
  onSave: (noteData: Omit<Note, 'id' | 'createdAt'>) => void;
}

const NOTE_COLORS = [
  '#8B5CF6', 
  '#22D3EE', 
  '#f43f5e', 
  '#10b981', 
  '#f59e0b', 
  '#F9FAFB'
];

const NoteCreator: React.FC<NoteCreatorProps> = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState(NOTE_COLORS[0]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim().toLowerCase())) {
        setTags([...tags, tagInput.trim().toLowerCase()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;
    onSave({
      title: title.trim() || 'Untitled Note',
      content: content.trim(),
      color,
      tags
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-md transition-all duration-300">
      <div 
        className="w-full max-w-md bg-[#141414] border-t border-[#1C1C1C] rounded-t-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom-full duration-500 max-h-[95vh] overflow-y-auto no-scrollbar"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-bold text-[#F9FAFB]">New Note</h2>
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mt-1">Capture your thoughts</p>
          </div>
          <button onClick={onClose} className="p-2.5 bg-[#1C1C1C] rounded-2xl text-[#6B7280] hover:text-[#F9FAFB] transition-all border border-[#1C1C1C]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="space-y-8 pb-8">
          <div className="space-y-3">
            <label className="text-[9px] font-bold text-[#6B7280] uppercase tracking-[0.3em] ml-1">Title</label>
            <input 
              type="text" 
              placeholder="Note Headline" 
              className="w-full bg-[#0D0D0D] border border-[#1C1C1C] rounded-[24px] px-6 py-5 text-xl font-bold text-[#F9FAFB] focus:ring-1 focus:ring-[#8B5CF6]/40 outline-none transition-all placeholder:text-[#1C1C1C]"
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <label className="text-[9px] font-bold text-[#6B7280] uppercase tracking-[0.3em] ml-1">Content</label>
            <textarea 
              placeholder="What's on your mind?" 
              className="w-full bg-[#0D0D0D] border border-[#1C1C1C] rounded-[24px] px-6 py-5 text-base min-h-[250px] font-medium text-[#A1A1AA] focus:ring-1 focus:ring-[#8B5CF6]/40 outline-none transition-all resize-none placeholder:text-[#1C1C1C]"
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </div>

          {/* Color Picker */}
          <div className="space-y-3">
            <label className="text-[9px] font-bold text-[#6B7280] uppercase tracking-[0.3em] ml-1">Accent Theme</label>
            <div className="flex space-x-3 overflow-x-auto no-scrollbar py-1">
              {NOTE_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-11 h-11 rounded-2xl transition-all border-2 flex-shrink-0 ${color === c ? 'border-[#F9FAFB] scale-105 shadow-lg' : 'border-[#1C1C1C]'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <label className="text-[9px] font-bold text-[#6B7280] uppercase tracking-[0.3em] ml-1">Keywords</label>
            <input 
              type="text" 
              placeholder="Add tag..." 
              className="w-full bg-[#0D0D0D] border border-[#1C1C1C] rounded-2xl px-6 py-4 text-xs font-bold text-[#F9FAFB] outline-none transition-all focus:ring-1 focus:ring-[#8B5CF6]/40 placeholder:text-[#1C1C1C]"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map(tag => (
                <span key={tag} className="flex items-center gap-2 px-4 py-1.5 bg-[#1C1C1C] text-[#A1A1AA] rounded-full text-[9px] font-bold uppercase border border-[#1C1C1C] tracking-widest">
                  #{tag}
                  <button onClick={() => removeTag(tag)} className="text-[#6B7280] hover:text-red-400">×</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={!title.trim() && !content.trim()}
          className={`w-full py-6 rounded-[28px] text-white font-extrabold text-sm uppercase tracking-[0.3em] shadow-2xl transition-all ${
            (title.trim() || content.trim()) ? 'bg-gray-100 text-black active:scale-[0.98]' : 'bg-[#1C1C1C] text-[#6B7280] cursor-not-allowed'
          }`}
        >
          Archive Note
        </button>
      </div>
    </div>
  );
};

export default NoteCreator;
