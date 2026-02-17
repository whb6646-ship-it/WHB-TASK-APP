
import React, { useState } from 'react';
import { Task, Category, Event, Theme } from '../types';
import EventCreator from './EventCreator';

interface CalendarProps {
  tasks: Task[];
  events: Event[];
  categories: Category[];
  addEvent: (eventData: Omit<Event, 'id'>) => void;
  // Fix: Added theme to CalendarProps to resolve TypeScript error in App.tsx
  theme: Theme;
}

const Calendar: React.FC<CalendarProps> = ({ tasks, events, categories, addEvent, theme }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventCreator, setShowEventCreator] = useState(false);
  // Fix: Use isDark to adapt styles to theme
  const isDark = theme === 'dark';

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1));

  const days = [];
  const totalDays = daysInMonth(year, month);
  const startDay = startDayOfMonth(year, month);

  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const isSelected = (day: number) => {
    return day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();
  };

  const dateToStr = (d: number | null) => {
    if (!d) return '';
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  };

  const getTasksForDay = (day: number | null) => {
    const ds = dateToStr(day);
    if (!ds) return [];
    return tasks.filter(t => t.dueDate === ds);
  };

  const getEventsForDay = (day: number | null) => {
    const ds = dateToStr(day);
    if (!ds) return [];
    return events.filter(e => e.date === ds);
  };

  const selectedDayTasks = getTasksForDay(selectedDate.getDate());
  const selectedDayEvents = getEventsForDay(selectedDate.getDate());

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex items-center justify-between mb-2">
        <h2 className={`text-xl font-bold ${isDark ? 'text-[#F9FAFB]' : 'text-gray-900'}`}>Calendar</h2>
        <div className="flex space-x-2 items-center">
            <button 
                onClick={() => setShowEventCreator(true)}
                className="bg-[#8B5CF6] text-white p-2.5 rounded-xl shadow-lg shadow-[#8B5CF6]/10 active:scale-95 transition-all"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </button>
            <div className={`flex border rounded-xl p-1 ${isDark ? 'bg-[#0D0D0D] border-[#1C1C1C]' : 'bg-white border-gray-200'}`}>
            <button onClick={handlePrevMonth} className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-[#141414]' : 'hover:bg-gray-50'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isDark ? 'text-[#A1A1AA]' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={handleNextMonth} className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-[#141414]' : 'hover:bg-gray-50'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isDark ? 'text-[#A1A1AA]' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            </div>
        </div>
      </div>

      <div className={`rounded-[32px] border p-6 shadow-2xl ${isDark ? 'bg-[#0D0D0D] border-[#1C1C1C]' : 'bg-white border-gray-100'}`}>
        <div className="flex flex-col mb-6">
          <span className="text-3xl font-extrabold text-[#8B5CF6] tracking-tight">{monthNames[month]}</span>
          <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`}>{year}</span>
        </div>

        <div className="grid grid-cols-7 gap-y-4 text-center">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
            <div key={d} className={`text-[9px] font-bold uppercase tracking-widest ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`}>{d}</div>
          ))}
          {days.map((day, idx) => {
             const dayTasks = getTasksForDay(day);
             const dayEvents = getEventsForDay(day);
             return (
                <div 
                    key={idx} 
                    className="flex flex-col items-center justify-center relative min-h-[44px]"
                    onClick={() => day && setSelectedDate(new Date(year, month, day))}
                >
                    {day && (
                        <>
                        <button 
                            className={`w-9 h-9 rounded-xl text-xs font-bold transition-all relative z-10 border
                            ${isSelected(day) ? 'bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-lg shadow-[#8B5CF6]/20 scale-105' : 
                                isToday(day) ? 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20' : (isDark ? 'text-[#A1A1AA] border-transparent hover:border-[#1C1C1C]' : 'text-gray-500 border-transparent hover:border-gray-100')}`}
                        >
                            {day}
                        </button>
                        <div className="flex gap-1 absolute bottom-1">
                            {dayTasks.length > 0 && !isSelected(day) && (
                                <div className={`w-1 h-1 rounded-full ${isDark ? 'bg-[#22D3EE] shadow-[0_0_4px_#22D3EE]' : 'bg-cyan-500'}`} />
                            )}
                            {dayEvents.length > 0 && !isSelected(day) && (
                                <div className={`w-1 h-1 rounded-full ${isDark ? 'bg-[#8B5CF6] shadow-[0_0_4px_#8B5CF6]' : 'bg-indigo-500'}`} />
                            )}
                        </div>
                        </>
                    )}
                </div>
             );
          })}
        </div>
      </div>

      {/* Selected Day Agenda */}
      <div className={`border rounded-[32px] p-6 space-y-5 ${isDark ? 'bg-[#0D0D0D] border-[#1C1C1C]' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-[#F9FAFB]' : 'text-gray-900'}`}>
            Agenda: {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]}
          </h3>
          <div className="flex gap-2">
            {selectedDayEvents.length > 0 && <span className="text-[8px] bg-[#8B5CF6]/10 text-[#8B5CF6] px-2 py-0.5 rounded font-bold border border-[#8B5CF6]/20 uppercase">{selectedDayEvents.length} Events</span>}
            {selectedDayTasks.length > 0 && <span className="text-[8px] bg-[#22D3EE]/10 text-[#22D3EE] px-2 py-0.5 rounded font-bold border border-[#22D3EE]/20 uppercase">{selectedDayTasks.length} Tasks</span>}
          </div>
        </div>

        <div className="space-y-4">
          {/* Events Section */}
          {selectedDayEvents.length > 0 && (
            <div className="space-y-3">
              <p className={`text-[9px] font-bold uppercase tracking-widest px-1 ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`}>Scheduled Events</p>
              {selectedDayEvents.map(event => (
                <div key={event.id} className={`p-4 rounded-2xl border border-l-4 shadow-sm ${isDark ? 'bg-black border-[#1C1C1C]' : 'bg-gray-50 border-gray-100'}`} style={{ borderLeftColor: event.color }}>
                  <div className="flex justify-between items-start">
                    <h4 className={`text-sm font-bold ${isDark ? 'text-[#F9FAFB]' : 'text-gray-900'}`}>{event.title}</h4>
                    <span className={`text-[9px] font-bold uppercase ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`}>{event.time}</span>
                  </div>
                  {event.location && (
                    <p className={`text-[10px] mt-1.5 flex items-center gap-1.5 font-medium ${isDark ? 'text-[#A1A1AA]' : 'text-gray-500'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {event.location}
                    </p>
                  )}
                  <div className="flex gap-1.5 mt-3">
                    {event.tags.map(tag => (
                      <span key={tag} className={`text-[8px] px-2 py-0.5 rounded font-bold border ${isDark ? 'bg-[#141414] text-[#6B7280] border-[#1C1C1C]' : 'bg-white text-gray-400 border-gray-100'}`}>#{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tasks Section */}
          {selectedDayTasks.length > 0 && (
            <div className="space-y-3">
              <p className={`text-[9px] font-bold uppercase tracking-widest px-1 ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`}>Daily Tasks</p>
              {selectedDayTasks.map(task => {
                const cat = categories.find(c => c.id === task.category);
                return (
                    <div key={task.id} className={`p-4 rounded-2xl border shadow-sm ${isDark ? 'bg-black border-[#1C1C1C]' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm font-bold ${task.isCompleted ? (isDark ? 'text-[#6B7280] line-through' : 'text-gray-400 line-through') : (isDark ? 'text-[#F9FAFB]' : 'text-gray-900')}`}>
                        {task.title}
                        </h4>
                        {cat && (
                        <span className="text-[9px] font-bold uppercase flex items-center gap-1.5" style={{ color: cat.color }}>
                            <span>{cat.icon}</span>
                            <span>{cat.name}</span>
                        </span>
                        )}
                    </div>
                    <div className="flex gap-1.5 mt-2.5">
                        {task.tags.map(tag => (
                        <span key={tag} className={`text-[8px] px-1.5 py-0.5 rounded font-bold border ${isDark ? 'bg-[#141414] text-[#6B7280] border-[#1C1C1C]' : 'bg-white text-gray-400 border-gray-100'}`}>#{tag}</span>
                        ))}
                    </div>
                    </div>
                );
              })}
            </div>
          )}

          {selectedDayTasks.length === 0 && selectedDayEvents.length === 0 && (
            <div className={`text-center py-12 rounded-3xl border border-dashed ${isDark ? 'bg-black border-[#1C1C1C]' : 'bg-gray-50 border-gray-200'}`}>
              <p className={`text-[10px] font-bold uppercase tracking-[0.2em] italic ${isDark ? 'text-[#6B7280]' : 'text-gray-300'}`}>Agenda is clear</p>
            </div>
          )}
        </div>
      </div>

      {showEventCreator && (
        <EventCreator 
            initialDate={dateToStr(selectedDate.getDate())}
            onClose={() => setShowEventCreator(false)}
            onSave={(data) => {
                addEvent(data);
                setShowEventCreator(false);
            }}
        />
      )}
    </div>
  );
};

export default Calendar;
