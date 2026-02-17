
import React, { useState } from 'react';
import { Task, Category, Priority, Theme } from '../types';

interface TaskCreatorProps {
  categories: Category[];
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'isCompleted'>) => void;
  // Fix: Added theme to TaskCreatorProps to resolve TypeScript error in Dashboard.tsx
  theme: Theme;
}

const TaskCreator: React.FC<TaskCreatorProps> = ({ categories, onClose, onSave, theme }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState(categories[0]?.id || '');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  // Fix: Use isDark to adapt styles to theme
  const isDark = theme === 'dark';

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
    if (!title.trim()) return;
    onSave({
      title,
      description,
      priority,
      category,
      dueDate,
      tags
    });
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-end justify-center backdrop-blur-md transition-all duration-300 ${isDark ? 'bg-black/80' : 'bg-gray-900/40'}`}>
      <div 
        className={`w-full max-w-md border-t rounded-t-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom-full duration-500 max-h-[95vh] overflow-y-auto no-scrollbar ${isDark ? 'bg-[#141414] border-[#1C1C1C]' : 'bg-white border-gray-100'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-[#F9FAFB]' : 'text-gray-900'}`}>New Task</h2>
            <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`}>Add details to your list</p>
          </div>
          <button onClick={onClose} className={`p-2.5 rounded-2xl transition-all border ${isDark ? 'bg-[#1C1C1C] text-[#6B7280] hover:text-[#F9FAFB] border-[#1C1C1C]' : 'bg-gray-50 text-gray-400 hover:text-gray-600 border-gray-100'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="space-y-8 pb-8">
          {/* Title input */}
          <div className="space-y-3">
            <label className={`text-[9px] font-bold uppercase tracking-[0.3em] ml-1 ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`}>Task Name</label>
            <input 
              type="text" 
              placeholder="What's the goal?" 
              className={`w-full border rounded-[24px] px-6 py-5 text-lg font-bold focus:ring-1 focus:ring-[#8B5CF6]/40 outline-none transition-all ${isDark ? 'bg-[#0D0D0D] border-[#1C1C1C] text-[#F9FAFB] placeholder:text-[#1C1C1C]' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-300'}`}
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className={`text-[9px] font-bold uppercase tracking-[0.3em] ml-1 ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`}>Notes</label>
            <textarea 
              placeholder="Additional details..." 
              className={`w-full border rounded-[24px] px-6 py-5 text-sm min-h-[120px] font-medium focus:ring-1 focus:ring-[#8B5CF6]/40 outline-none transition-all resize-none ${isDark ? 'bg-[#0D0D0D] border-[#1C1C1C] text-[#A1A1AA] placeholder:text-[#1C1C1C]' : 'bg-gray-50 border-gray-200 text-gray-600 placeholder:text-gray-300'}`}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {/* Priority Selection */}
          <div className="space-y-3">
            <label className={`text-[9px] font-bold uppercase tracking-[0.3em] ml-1 ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`}>Priority Level</label>
            <div className="grid grid-cols-3 gap-3">
              {(['low', 'medium', 'high'] as Priority[]).map(p => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                    priority === p 
                    ? (p === 'high' ? 'bg-red-500/10 border-red-500 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.1)]' : p === 'medium' ? 'bg-orange-500/10 border-orange-500 text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.1)]' : 'bg-green-500/10 border-green-500 text-green-400 shadow-[0_0_12px_rgba(16,185,129,0.1)]')
                    : (isDark ? 'bg-[#0D0D0D] border-[#1C1C1C] text-[#6B7280] hover:border-[#6B7280]/20' : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200')
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Category/Folder Selection */}
          <div className="space-y-3">
            <label className={`text-[9px] font-bold uppercase tracking-[0.3em] ml-1 ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`}>Folder</label>
            <div className="flex overflow-x-auto no-scrollbar space-x-3 pb-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex-shrink-0 flex items-center space-x-3 px-5 py-3.5 rounded-2xl transition-all border ${
                    category === cat.id ? (isDark ? 'bg-[#1C1C1C] border-[#8B5CF6]/40 text-[#F9FAFB]' : 'bg-indigo-50 border-indigo-200 text-indigo-700') : (isDark ? 'bg-[#0D0D0D] border-[#1C1C1C] text-[#6B7280]' : 'bg-gray-50 border-gray-100 text-gray-400')
                  }`}
                >
                  <span style={{ color: category === cat.id ? cat.color : (isDark ? '#6B7280' : '#9CA3AF') }}>{cat.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Due Date & Tags Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className={`text-[9px] font-bold uppercase tracking-[0.3em] ml-1 ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`}>Due Date</label>
              <input 
                type="date" 
                className={`w-full border rounded-2xl px-5 py-4 text-xs font-bold outline-none transition-all focus:ring-1 focus:ring-[#8B5CF6]/40 ${isDark ? 'bg-[#0D0D0D] border-[#1C1C1C] text-[#F9FAFB]' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className={`text-[9px] font-bold uppercase tracking-[0.3em] ml-1 ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`}>Tags</label>
              <input 
                type="text" 
                placeholder="#urgent" 
                className={`w-full border rounded-2xl px-5 py-4 text-xs font-bold outline-none transition-all focus:ring-1 focus:ring-[#8B5CF6]/40 ${isDark ? 'bg-[#0D0D0D] border-[#1C1C1C] text-[#F9FAFB] placeholder:text-[#1C1C1C]' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-300'}`}
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
              />
            </div>
          </div>

          {/* Tag Cloud */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span key={tag} className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-bold uppercase border tracking-widest ${isDark ? 'bg-[#1C1C1C] text-[#A1A1AA] border-[#1C1C1C]' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                  #{tag}
                  <button onClick={() => removeTag(tag)} className="text-[#6B7280] hover:text-red-400">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Button */}
        <button 
          onClick={handleSave}
          disabled={!title.trim()}
          className={`w-full py-6 rounded-[28px] text-white font-extrabold text-sm uppercase tracking-[0.3em] shadow-2xl transition-all ${
            title.trim() ? 'bg-[#8B5CF6] active:scale-[0.98] shadow-[#8B5CF6]/20' : (isDark ? 'bg-[#1C1C1C] text-[#6B7280] cursor-not-allowed' : 'bg-gray-100 text-gray-300 cursor-not-allowed')
          }`}
        >
          Confirm Task
        </button>
      </div>
    </div>
  );
};

export default TaskCreator;
