
import React, { useState } from 'react';
import { Task, Category, Event, Theme } from '../types';
import TaskCreator from './TaskCreator';
import AIAssistant from './AIAssistant';

interface DashboardProps {
  tasks: Task[];
  events: Event[];
  categories: Category[];
  toggleTask: (id: string) => void;
  addTask: (taskData: Omit<Task, 'id' | 'isCompleted'>) => void;
  addEvent: (eventData: Omit<Event, 'id'>) => void;
  addNote: (title: string, content: string) => void;
  addCategory: (name: string) => string;
  theme: Theme;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, events, categories, toggleTask, addTask, addEvent, addNote, addCategory, theme }) => {
  const [showCreator, setShowCreator] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const isDark = theme === 'dark';
  
  const completedCount = tasks.filter(t => t.isCompleted).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const upcomingEvents = [...events].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  }).slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome & Progress Card */}
      <div className={`rounded-[32px] p-6 shadow-2xl border transition-colors ${isDark ? 'bg-[#0D0D0D] border-[#1C1C1C] text-[#F9FAFB]' : 'bg-white border-gray-100 text-gray-900'}`}>
        <h2 className="text-xl font-bold mb-1">Hello, Alex! 👋</h2>
        <p className={`text-sm mb-6 font-medium ${isDark ? 'text-[#A1A1AA]' : 'text-gray-500'}`}>Efficiency is doing things right.</p>
        
        <div className="space-y-3">
          <div className={`flex justify-between text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`}>
            <span>Overall Progress</span>
            <span className={isDark ? 'text-[#22D3EE]' : 'text-indigo-600'}>{progressPercent}%</span>
          </div>
          <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-[#1C1C1C]' : 'bg-gray-100'}`}>
            <div 
              className={`h-full transition-all duration-700 ease-out rounded-full ${isDark ? 'bg-[#22D3EE] shadow-[0_0_8px_rgba(34,211,238,0.4)]' : 'bg-indigo-600'}`} 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* AI Assistant Widget */}
      <div 
        onClick={() => setShowAI(true)}
        className={`p-6 rounded-[32px] text-white shadow-xl cursor-pointer relative overflow-hidden group hover:scale-[1.02] transition-all ${isDark ? 'bg-gradient-to-br from-[#8B5CF6] to-[#6366f1] shadow-[#8B5CF6]/10' : 'bg-indigo-600 shadow-indigo-200'}`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all"></div>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${isDark ? 'bg-white/15 backdrop-blur-md border-white/20' : 'bg-white/20 border-white/30'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold">AI Assistant</h4>
              <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold">Talk to create anything</p>
            </div>
          </div>
          <div className="bg-white/15 px-4 py-2 rounded-xl text-[10px] font-bold backdrop-blur-sm border border-white/10 uppercase tracking-wider">
            Ask ZenDo
          </div>
        </div>
      </div>

      {/* Focus Quick Start Widget */}
      <div className={`p-5 rounded-[32px] flex items-center justify-between transition-colors cursor-pointer border ${isDark ? 'bg-[#0D0D0D] border-[#1C1C1C] hover:bg-[#141414]' : 'bg-white border-gray-100 hover:bg-gray-50 shadow-sm'}`}>
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${isDark ? 'bg-[#141414] border-[#1C1C1C] text-[#22D3EE]' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
          </div>
          <div>
            <h4 className={`text-sm font-bold ${isDark ? 'text-[#F9FAFB]' : 'text-gray-900'}`}>Focus Timer</h4>
            <p className={`text-[10px] font-bold uppercase tracking-tight ${isDark ? 'text-[#A1A1AA]' : 'text-gray-400'}`}>25m Pomodoro ready</p>
          </div>
        </div>
        <button className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${isDark ? 'bg-[#1C1C1C] text-[#22D3EE] border-[#22D3EE]/20 hover:bg-[#22D3EE]/10' : 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100'}`}>
          Start
        </button>
      </div>

      {/* Events Widget */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className={`text-xs font-bold uppercase tracking-[0.2em] ml-2 ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`}>Upcoming Events</h3>
        </div>
        <div className="flex overflow-x-auto no-scrollbar -mx-2 px-2 space-x-4 pb-2">
          {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
            <div key={event.id} className={`flex-shrink-0 w-48 p-4 rounded-3xl transition-all border ${isDark ? 'bg-[#0D0D0D] border-[#1C1C1C] hover:border-[#8B5CF6]/40' : 'bg-white border-gray-100 hover:border-indigo-200 shadow-sm'}`}>
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${isDark ? 'shadow-[0_0_4px_currentColor]' : ''}`} style={{ backgroundColor: event.color, color: event.color }}></div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`}>{event.time}</span>
              </div>
              <h4 className={`text-sm font-bold line-clamp-1 mb-1 ${isDark ? 'text-[#F9FAFB]' : 'text-gray-900'}`}>{event.title}</h4>
              <p className={`text-[10px] line-clamp-1 flex items-center gap-1 font-medium ${isDark ? 'text-[#A1A1AA]' : 'text-gray-500'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {event.location || 'No location'}
              </p>
            </div>
          )) : (
            <div className={`w-full text-center py-6 rounded-3xl border border-dashed ${isDark ? 'bg-[#0D0D0D] border-[#1C1C1C]' : 'bg-white border-gray-200'}`}>
               <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-[#6B7280]' : 'text-gray-300'}`}>No events soon</p>
            </div>
          )}
        </div>
      </div>

      {/* Categories Folders */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className={`text-xs font-bold uppercase tracking-[0.2em] ml-2 ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`}>Folders</h3>
          <button className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${isDark ? 'text-[#8B5CF6] hover:text-[#A78BFA]' : 'text-indigo-600 hover:text-indigo-700'}`} onClick={() => {
            const name = prompt('New Folder Name:');
            if(name) addCategory(name);
          }}>+ New Folder</button>
        </div>
        <div className="flex overflow-x-auto no-scrollbar -mx-2 px-2 space-x-3 pb-2">
          {categories.map(cat => (
            <div key={cat.id} className={`flex-shrink-0 w-24 p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 transition-colors cursor-pointer group border ${isDark ? 'bg-[#0D0D0D] border-[#1C1C1C] hover:bg-[#141414]' : 'bg-white border-gray-100 hover:bg-indigo-50 shadow-sm'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform ${isDark ? 'bg-[#1C1C1C]' : 'bg-gray-50'}`} style={{ color: cat.color }}>
                {cat.icon}
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-tighter text-center line-clamp-1 transition-colors ${isDark ? 'text-[#A1A1AA] group-hover:text-[#F9FAFB]' : 'text-gray-600'}`}>{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Task List Header */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xs font-bold uppercase tracking-[0.2em] ml-2 ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`}>Recent Tasks</h3>
          <button onClick={() => setShowCreator(true)} className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl active:scale-95 transition-all ${isDark ? 'bg-[#8B5CF6] text-white shadow-[#8B5CF6]/30' : 'bg-indigo-600 text-white shadow-indigo-200'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            <span>New Task</span>
          </button>
        </div>
        
        <div className="space-y-3">
          {tasks.map(task => {
            const cat = categories.find(c => c.id === task.category);
            return (
              <div 
                key={task.id} 
                className={`group p-4 rounded-[24px] border transition-all ${isDark ? (task.isCompleted ? 'bg-black border-[#1C1C1C] opacity-40' : 'bg-[#0D0D0D] border-[#1C1C1C] shadow-sm') : (task.isCompleted ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-100 shadow-sm hover:border-indigo-100')}`}
              >
                <div className="flex items-start">
                  <div 
                    onClick={() => toggleTask(task.id)}
                    className={`w-5 h-5 rounded-full border flex items-center justify-center mr-4 mt-1 cursor-pointer transition-colors ${task.isCompleted ? (isDark ? 'bg-[#10B981] border-[#10B981]' : 'bg-green-500 border-green-500') : (isDark ? 'border-[#1C1C1C] bg-[#141414]' : 'border-gray-300 bg-white')}`}
                  >
                    {task.isCompleted && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0" onClick={() => toggleTask(task.id)}>
                    <div className="flex justify-between items-start">
                      <h4 className={`text-sm font-bold truncate ${task.isCompleted ? (isDark ? 'text-[#6B7280] line-through' : 'text-gray-400 line-through') : (isDark ? 'text-[#F9FAFB]' : 'text-gray-900')}`}>
                        {task.title}
                      </h4>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest border ${
                        task.priority === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                        task.priority === 'medium' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                        'bg-green-500/10 text-green-400 border-green-500/20'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    {task.description && (
                      <p className={`text-xs mt-1 line-clamp-1 font-medium ${isDark ? 'text-[#A1A1AA]' : 'text-gray-500'}`}>{task.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {task.tags.map(tag => (
                        <span key={tag} className={`text-[8px] px-2 py-0.5 rounded font-bold uppercase border ${isDark ? 'bg-[#141414] text-[#6B7280] border-[#1C1C1C]' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>#{tag}</span>
                      ))}
                      {cat && (
                        <span className={`text-[8px] px-2 py-0.5 rounded font-bold flex items-center gap-1.5 border ${isDark ? 'text-[#F9FAFB] border-[#1C1C1C] bg-[#141414]' : 'text-gray-700 border-gray-100 bg-white shadow-sm'}`} style={{ borderColor: isDark ? `${cat.color}20` : undefined }}>
                          <span style={{ color: cat.color }}>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showCreator && (
        <TaskCreator 
          categories={categories} 
          onClose={() => setShowCreator(false)} 
          onSave={(data) => {
            addTask(data);
            setShowCreator(false);
          }}
          theme={theme}
        />
      )}

      {showAI && (
        <AIAssistant 
          categories={categories}
          onClose={() => setShowAI(false)}
          onAddTask={addTask}
          onAddEvent={addEvent}
          onAddNote={addNote}
          theme={theme}
        />
      )}
    </div>
  );
};

export default Dashboard;
