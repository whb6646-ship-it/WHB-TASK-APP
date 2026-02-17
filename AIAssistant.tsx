
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { Task, Event, Note, Category, Priority, Theme } from '../types';

interface AIAssistantProps {
  categories: Category[];
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'isCompleted'>) => void;
  onAddEvent: (event: Omit<Event, 'id'>) => void;
  onAddNote: (title: string, content: string) => void;
  // Fix: Added theme to AIAssistantProps to resolve TypeScript error in Dashboard.tsx
  theme: Theme;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isSystem?: boolean;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ categories, onClose, onAddTask, onAddEvent, onAddNote, theme }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm your ZenDo AI. I can create tasks, events, or notes for you. Try saying 'Add a high priority task to buy milk' or 'Schedule a meeting for tomorrow at 3pm'." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  // Fix: Use isDark to adapt styles to theme
  const isDark = theme === 'dark';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Define tools for Gemini
  const createTaskTool: FunctionDeclaration = {
    name: "create_task",
    parameters: {
      type: Type.OBJECT,
      description: "Creates a new task in the user's to-do list.",
      properties: {
        title: { type: Type.STRING, description: "The title of the task" },
        description: { type: Type.STRING, description: "Optional detailed description" },
        priority: { type: Type.STRING, description: "Priority: 'low', 'medium', or 'high'", enum: ["low", "medium", "high"] },
        categoryName: { type: Type.STRING, description: "Name of the folder or category (e.g., Work, Personal)" },
        dueDate: { type: Type.STRING, description: "Due date in YYYY-MM-DD format. Today is " + new Date().toISOString().split('T')[0] },
        tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of relevant tags" }
      },
      required: ["title"]
    }
  };

  const createEventTool: FunctionDeclaration = {
    name: "create_event",
    parameters: {
      type: Type.OBJECT,
      description: "Schedules a new event on the calendar.",
      properties: {
        title: { type: Type.STRING, description: "Title of the event" },
        date: { type: Type.STRING, description: "Date in YYYY-MM-DD format" },
        time: { type: Type.STRING, description: "Time in HH:mm format" },
        location: { type: Type.STRING, description: "Physical or digital location" },
        description: { type: Type.STRING, description: "Notes about the event" },
        tags: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["title", "date", "time"]
    }
  };

  const createNoteTool: FunctionDeclaration = {
    name: "create_note",
    parameters: {
      type: Type.OBJECT,
      description: "Quickly saves a note or thought.",
      properties: {
        title: { type: Type.STRING, description: "Short title for the note" },
        content: { type: Type.STRING, description: "The full content of the note" }
      },
      required: ["content"]
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: messages.concat({ role: 'user', content: userMessage }).map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction: "You are ZenDo AI, a professional life organizer. Use the tools provided to create tasks, events, and notes. If you create something, confirm it briefly to the user. Always assume the user wants the most logical category if not specified. Today's date is " + new Date().toDateString(),
          tools: [{ functionDeclarations: [createTaskTool, createEventTool, createNoteTool] }]
        }
      });

      const calls = response.functionCalls;
      let assistantText = response.text || "";

      if (calls) {
        for (const call of calls) {
          if (call.name === "create_task") {
            const args = call.args as any;
            const catId = categories.find(c => c.name.toLowerCase() === (args.categoryName || "").toLowerCase())?.id || categories[0].id;
            onAddTask({
              title: args.title,
              description: args.description || "",
              priority: (args.priority as Priority) || "medium",
              category: catId,
              dueDate: args.dueDate || new Date().toISOString().split('T')[0],
              tags: args.tags || []
            });
            assistantText += `\n✅ Created task: "${args.title}"`;
          } else if (call.name === "create_event") {
            const args = call.args as any;
            onAddEvent({
              title: args.title,
              date: args.date,
              time: args.time,
              location: args.location || "",
              description: args.description || "",
              tags: args.tags || [],
              color: "#8B5CF6"
            });
            assistantText += `\n📅 Scheduled event: "${args.title}" at ${args.time}`;
          } else if (call.name === "create_note") {
            const args = call.args as any;
            onAddNote(args.title || "Quick Note", args.content);
            assistantText += `\n📝 Added note: "${args.title || 'Untitled'}"`;
          }
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: assistantText.trim() }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I ran into a bit of trouble. Could you try that again?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl p-4 animate-in fade-in duration-300 ${isDark ? 'bg-black/80' : 'bg-gray-900/40'}`}>
      <div className={`w-full max-w-md border rounded-[40px] shadow-2xl flex flex-col h-[85vh] overflow-hidden ${isDark ? 'bg-[#0D0D0D] border-[#1C1C1C]' : 'bg-white border-gray-100'}`}>
        {/* Header */}
        <div className={`px-7 py-6 border-b flex justify-between items-center shrink-0 ${isDark ? 'bg-[#141414] border-[#1C1C1C] text-[#F9FAFB]' : 'bg-gray-50 border-gray-100 text-gray-900'}`}>
          <div className="flex items-center space-x-4">
            <div className={`w-11 h-11 border rounded-2xl flex items-center justify-center ${isDark ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/20' : 'bg-indigo-50 border-indigo-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isDark ? 'text-[#8B5CF6]' : 'text-indigo-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight tracking-tight">ZenDo AI</h2>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_currentColor] ${isDark ? 'bg-[#10B981]' : 'bg-green-500'}`}></div>
                <span className={`text-[9px] uppercase font-extrabold tracking-[0.2em] ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`}>Online Assistant</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className={`p-2.5 rounded-2xl transition-colors border border-transparent ${isDark ? 'hover:bg-[#1C1C1C] hover:border-[#1C1C1C] text-[#6B7280]' : 'hover:bg-gray-100 hover:border-gray-200 text-gray-400'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className={`flex-1 overflow-y-auto p-7 space-y-6 no-scrollbar ${isDark ? 'bg-black' : 'bg-white'}`}>
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[90%] px-5 py-3.5 rounded-[24px] text-sm font-medium shadow-sm ${
                m.role === 'user' 
                ? 'bg-[#8B5CF6] text-white rounded-tr-none border border-[#8B5CF6]/20' 
                : (isDark ? 'bg-[#0D0D0D] border-[#1C1C1C] text-[#F9FAFB] rounded-tl-none' : 'bg-gray-50 border-gray-100 text-gray-800 rounded-tl-none')
              }`}>
                {m.content.split('\n').map((line, li) => (
                  <p key={li} className={li > 0 ? `mt-2 pt-2 border-t ${isDark ? 'border-white/5' : 'border-black/5'}` : ""}>{line}</p>
                ))}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className={`border px-6 py-4 rounded-[24px] rounded-tl-none shadow-sm flex space-x-2 items-center ${isDark ? 'bg-[#0D0D0D] border-[#1C1C1C]' : 'bg-gray-50 border-gray-100'}`}>
                <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${isDark ? 'bg-[#8B5CF6]' : 'bg-indigo-600'}`}></div>
                <div className={`w-1.5 h-1.5 rounded-full animate-bounce delay-150 ${isDark ? 'bg-[#8B5CF6]' : 'bg-indigo-600'}`}></div>
                <div className={`w-1.5 h-1.5 rounded-full animate-bounce delay-300 ${isDark ? 'bg-[#8B5CF6]' : 'bg-indigo-600'}`}></div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className={`p-6 border-t shrink-0 ${isDark ? 'bg-[#0D0D0D] border-[#1C1C1C]' : 'bg-gray-50 border-gray-100'}`}>
          <form onSubmit={handleSendMessage} className={`flex items-center space-x-3 border rounded-[28px] p-2 pl-6 focus-within:ring-1 focus-within:ring-[#8B5CF6]/40 transition-all ${isDark ? 'bg-black border-[#1C1C1C]' : 'bg-white border-gray-200'}`}>
            <input 
              type="text" 
              placeholder="Talk to ZenDo..."
              className={`flex-1 bg-transparent border-none outline-none text-sm py-3.5 font-bold ${isDark ? 'text-[#F9FAFB] placeholder:text-[#1C1C1C]' : 'text-gray-900 placeholder:text-gray-300'}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-12 h-12 bg-[#8B5CF6] text-white rounded-full flex items-center justify-center shadow-lg disabled:bg-[#1C1C1C] disabled:text-[#6B7280] transition-all active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
          <div className="flex items-center justify-center space-x-2 mt-4">
              <span className={`text-[8px] uppercase font-extrabold tracking-[0.4em] ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`}>Integrated Intelligence</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
