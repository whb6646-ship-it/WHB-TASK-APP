
import React, { useState } from 'react';
import { Event } from '../types';

interface EventCreatorProps {
  initialDate?: string;
  onClose: () => void;
  onSave: (eventData: Omit<Event, 'id'>) => void;
}

const COLORS = ['#8B5CF6', '#22D3EE', '#f43f5e', '#10b981', '#f59e0b', '#3b82f6'];

const EventCreator: React.FC<EventCreatorProps> = ({ initialDate, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('12:00');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(COLORS[0]);
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
    if (!title.trim()) return;
    onSave({
      title,
      date,
      time,
      location,
      description,
      tags,
      color
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
            <h2 className="text-2xl font-bold text-[#F9FAFB]">New Event</h2>
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mt-1">Schedule an agenda item</p>
          </div>
          <button onClick={onClose} className="p-2.5 bg-[#1C1C1C] rounded-2xl text-[#6B7280] hover:text-[#F9FAFB] transition-all border border-[#1C1C1C]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="space-y-8 pb-8">
          <div className="space-y-3">
            <label className="text-[9px] font-bold text-[#6B7280] uppercase tracking-[0.3em] ml-1">Event Title</label>
            <input 
              type="text" 
              placeholder="Client lunch, Meeting, etc." 
              className="w-full bg-[#0D0D0D] border border-[#1C1C1C] rounded-[24px] px-6 py-5 text-lg font-bold text-[#F9FAFB] focus:ring-1 focus:ring-[#8B5CF6]/40 outline-none transition-all placeholder:text-[#1C1C1C]"
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-[9px] font-bold text-[#6B7280] uppercase tracking-[0.3em] ml-1">Date</label>
              <input 
                type="date" 
                className="w-full bg-[#0D0D0D] border border-[#1C1C1C] rounded-2xl px-5 py-4 text-xs font-bold text-[#F9FAFB] outline-none transition-all focus:ring-1 focus:ring-[#8B5CF6]/40"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[9px] font-bold text-[#6B7280] uppercase tracking-[0.3em] ml-1">Time</label>
              <input 
                type="time" 
                className="w-full bg-[#0D0D0D] border border-[#1C1C1C] rounded-2xl px-5 py-4 text-xs font-bold text-[#F9FAFB] outline-none transition-all focus:ring-1 focus:ring-[#8B5CF6]/40"
                value={time}
                onChange={e => setTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[9px] font-bold text-[#6B7280] uppercase tracking-[0.3em] ml-1">Location</label>
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-5 top-1/2 -translate-y-1/2 text-[#6B7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
              <input 
                type="text" 
                placeholder="Zoom, Office, or Home" 
                className="w-full bg-[#0D0D0D] border border-[#1C1C1C] rounded-[24px] pl-12 pr-6 py-5 text-sm font-medium text-[#F9FAFB] focus:ring-1 focus:ring-[#8B5CF6]/40 outline-none transition-all placeholder:text-[#1C1C1C]"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[9px] font-bold text-[#6B7280] uppercase tracking-[0.3em] ml-1">Calendar Color</label>
            <div className="flex space-x-3 overflow-x-auto no-scrollbar py-1">
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded-2xl transition-all border-2 flex-shrink-0 ${color === c ? 'border-[#F9FAFB] scale-105 shadow-lg' : 'border-[#1C1C1C]'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[9px] font-bold text-[#6B7280] uppercase tracking-[0.3em] ml-1">Agenda Details</label>
            <textarea 
              placeholder="Short description..." 
              className="w-full bg-[#0D0D0D] border border-[#1C1C1C] rounded-[24px] px-6 py-5 text-sm min-h-[100px] font-medium text-[#A1A1AA] focus:ring-1 focus:ring-[#8B5CF6]/40 outline-none transition-all resize-none placeholder:text-[#1C1C1C]"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[9px] font-bold text-[#6B7280] uppercase tracking-[0.3em] ml-1">Tags</label>
            <input 
              type="text" 
              placeholder="#meeting" 
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
          disabled={!title.trim()}
          className={`w-full py-6 rounded-[28px] text-white font-extrabold text-sm uppercase tracking-[0.3em] shadow-2xl transition-all ${
            title.trim() ? 'bg-[#8B5CF6] active:scale-[0.98] shadow-[#8B5CF6]/20' : 'bg-[#1C1C1C] text-[#6B7280] cursor-not-allowed'
          }`}
        >
          Confirm Event
        </button>
      </div>
    </div>
  );
};

export default EventCreator;
