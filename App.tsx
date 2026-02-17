
import React, { useState } from 'react';
import { AppSection, Task, Note, Category, Priority, Event, Theme } from './types';
import Dashboard from './components/Dashboard';
import Notes from './components/Notes';
import Calendar from './components/Calendar';
import FocusTimer from './components/FocusTimer';
import Settings from './components/Settings';
import BottomNav from './components/BottomNav';

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Work', color: '#8B5CF6', icon: '💼' },
  { id: 'cat-2', name: 'Personal', color: '#f43f5e', icon: '👤' },
  { id: 'cat-3', name: 'Design', color: '#22D3EE', icon: '🎨' },
  { id: 'cat-4', name: 'Health', color: '#10b981', icon: '🏥' },
  { id: 'cat-5', name: 'Finance', color: '#f59e0b', icon: '💰' },
];

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Review project requirements', isCompleted: false, priority: 'high', category: 'cat-1', dueDate: new Date().toISOString().split('T')[0], tags: ['critical', 'urgent'], description: 'Must check the latest spec from the client.' },
  { id: '2', title: 'Buy groceries', isCompleted: true, priority: 'medium', category: 'cat-2', dueDate: new Date().toISOString().split('T')[0], tags: ['home'], description: 'Milk, Eggs, Bread, and Coffee.' },
  { id: '3', title: 'Design system update', isCompleted: false, priority: 'medium', category: 'cat-3', dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], tags: ['ui', 'ux'], description: 'Sync Figma with latest components.' },
];

const INITIAL_EVENTS: Event[] = [
  { id: 'e1', title: 'Client Meeting', date: new Date().toISOString().split('T')[0], time: '14:00', location: 'Zoom', description: 'Discuss Q3 goals', tags: ['work', 'strategy'], color: '#8B5CF6' },
  { id: 'e2', title: 'Dinner with Sarah', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], time: '19:30', location: 'L’Osteria', description: 'Catch up session', tags: ['social'], color: '#f43f5e' },
];

const INITIAL_NOTES: Note[] = [
  { id: '1', title: 'Idea for new App', content: 'A platform for sustainable living tips and community interaction.', createdAt: Date.now() - 1000000, color: '#8B5CF6', tags: ['ideas', 'green'] },
  { id: '2', title: 'Recipe: Ramen', content: '1. Boil water\n2. Add noodles\n3. Seasoning\n4. Enjoy!', createdAt: Date.now() - 500000, color: '#22D3EE', tags: ['cooking'] },
];

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.DASHBOARD);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [theme, setTheme] = useState<Theme>('dark');

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const addTask = (taskData: Omit<Task, 'id' | 'isCompleted'>) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      isCompleted: false,
      ...taskData
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const addEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      id: Math.random().toString(36).substr(2, 9),
      ...eventData
    };
    setEvents(prev => [newEvent, ...prev]);
  };

  const addCategory = (name: string) => {
    const newCat: Category = {
      id: `cat-${Math.random().toString(36).substr(2, 5)}`,
      name,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      icon: '📁'
    };
    setCategories(prev => [...prev, newCat]);
    return newCat.id;
  };

  const addNote = (noteData: Omit<Note, 'id' | 'createdAt'>) => {
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      ...noteData
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const renderSection = () => {
    switch (activeSection) {
      case AppSection.DASHBOARD:
        return <Dashboard 
          tasks={tasks} 
          events={events}
          categories={categories} 
          toggleTask={toggleTask} 
          addTask={addTask} 
          addEvent={addEvent}
          addNote={(title, content) => addNote({ title, content, color: theme === 'dark' ? '#8B5CF6' : '#6366f1', tags: [] })}
          addCategory={addCategory}
          theme={theme}
        />;
      case AppSection.NOTES:
        return <Notes notes={notes} onAddNote={addNote} theme={theme} />;
      case AppSection.CALENDAR:
        return <Calendar tasks={tasks} events={events} categories={categories} addEvent={addEvent} theme={theme} />;
      case AppSection.FOCUS_TIMER:
        return <FocusTimer theme={theme} />;
      case AppSection.SETTINGS:
        return <Settings theme={theme} setTheme={setTheme} />;
      default:
        return <Dashboard tasks={tasks} events={events} categories={categories} toggleTask={toggleTask} addTask={addTask} addEvent={addEvent} addNote={(title, content) => addNote({ title, content, color: '#8B5CF6', tags: [] })} addCategory={addCategory} theme={theme} />;
    }
  };

  return (
    <div className={`flex flex-col min-h-screen max-w-md mx-auto relative overflow-hidden ring-1 ${theme === 'dark' ? 'bg-black ring-[#1C1C1C]' : 'bg-white ring-gray-100'}`}>
      <header className={`px-6 pt-8 pb-4 sticky top-0 z-30 flex justify-between items-center border-b ${theme === 'dark' ? 'bg-black border-[#1C1C1C]' : 'bg-white border-gray-100'}`}>
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${theme === 'dark' ? 'text-[#F9FAFB]' : 'text-gray-900'}`}>ZenDo</h1>
          <p className={`text-[10px] uppercase tracking-widest font-bold mt-0.5 ${theme === 'dark' ? 'text-[#6B7280]' : 'text-gray-400'}`}>Focus on what matters</p>
        </div>
        <div className={`w-10 h-10 rounded-full overflow-hidden border ${theme === 'dark' ? 'border-[#1C1C1C] ring-2 ring-[#0D0D0D]' : 'border-gray-200 ring-2 ring-gray-50'}`}>
          <img src="https://picsum.photos/seed/user123/100/100" alt="Avatar" className={`w-full h-full object-cover ${theme === 'dark' ? 'grayscale opacity-80' : ''}`} />
        </div>
      </header>

      <main className={`flex-1 overflow-y-auto no-scrollbar pb-24 px-6 pt-6 relative ${theme === 'dark' ? 'bg-black' : 'bg-gray-50/30'}`}>
        {renderSection()}
      </main>

      <BottomNav activeSection={activeSection} onSectionChange={setActiveSection} theme={theme} />
    </div>
  );
};

export default App;
