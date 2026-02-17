
export enum AppSection {
  DASHBOARD = 'DASHBOARD',
  NOTES = 'NOTES',
  CALENDAR = 'CALENDAR',
  FOCUS_TIMER = 'FOCUS_TIMER',
  SETTINGS = 'SETTINGS'
}

export type Priority = 'low' | 'medium' | 'high';
export type Theme = 'dark' | 'light';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  priority: Priority;
  category: string; // Refers to Category.id
  dueDate?: string; // Format: YYYY-MM-DD
  tags: string[];
  description?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string; // Format: YYYY-MM-DD
  time: string; // Format: HH:mm
  location?: string;
  description?: string;
  tags: string[];
  color: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  color: string;
  tags: string[];
}

export interface AppState {
  tasks: Task[];
  events: Event[];
  notes: Note[];
  categories: Category[];
  currentSection: AppSection;
  theme: Theme;
  user: {
    name: string;
    avatar: string;
  };
}
