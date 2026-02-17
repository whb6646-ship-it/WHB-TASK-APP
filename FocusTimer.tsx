
import React, { useState, useEffect, useRef } from 'react';
import { Theme } from '../types';

const PRESETS = [
  { label: 'Focus', minutes: 25, color: '#8B5CF6' },
  { label: 'Short Break', minutes: 5, color: '#10B981' },
  { label: 'Long Break', minutes: 15, color: '#22D3EE' },
];

// Fix: Added FocusTimerProps to resolve TypeScript error in App.tsx
interface FocusTimerProps {
  theme: Theme;
}

const FocusTimer: React.FC<FocusTimerProps> = ({ theme }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [totalTime, setTotalTime] = useState(25 * 60);
  const [customMinutes, setCustomMinutes] = useState('25');
  const timerRef = useRef<number | null>(null);
  // Fix: Use isDark to adapt styles to theme
  const isDark = theme === 'dark';

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("ZenDo - Session Complete!", {
          body: "Great job focusing! Take a moment to breathe.",
          icon: "https://picsum.photos/seed/zendo/100/100"
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification("ZenDo - Session Complete!");
          }
        });
      }
    }
    
    alert("Session Complete! Focus on your well-being.");
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(totalTime);
  };

  const selectPreset = (minutes: number) => {
    setIsActive(false);
    setTotalTime(minutes * 60);
    setTimeLeft(minutes * 60);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseInt(customMinutes);
    if (mins > 0 && mins < 1000) {
      selectPreset(mins);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex items-center justify-between">
        <h2 className={`text-xl font-bold ${isDark ? 'text-[#F9FAFB]' : 'text-gray-900'}`}>Focus Timer</h2>
        <div className={`px-4 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest border transition-colors ${isActive ? 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/40 shadow-[0_0_8px_rgba(139,92,246,0.2)]' : (isDark ? 'bg-[#0D0D0D] text-[#6B7280] border-[#1C1C1C]' : 'bg-gray-50 text-gray-400 border-gray-100')}`}>
          {isActive ? 'Session Active' : 'System Ready'}
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="relative flex items-center justify-center py-10">
        <div className={`absolute w-64 h-64 rounded-full blur-3xl opacity-50 ${isDark ? 'bg-[#8B5CF6]/5' : 'bg-indigo-500/5'}`}></div>
        <svg className="w-64 h-64 -rotate-90 transform relative z-10">
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke={isDark ? '#1C1C1C' : '#F3F4F6'}
            strokeWidth="6"
            fill="transparent"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={754}
            strokeDashoffset={754 - (754 * progress) / 100}
            strokeLinecap="round"
            className={`${isDark ? 'text-[#22D3EE] shadow-[0_0_12px_#22D3EE]' : 'text-indigo-600'} transition-all duration-500`}
          />
        </svg>
        <div className="absolute flex flex-col items-center z-20">
          <span className={`text-6xl font-extrabold tracking-tighter ${isDark ? 'text-[#F9FAFB]' : 'text-gray-900'}`}>
            {formatTime(timeLeft)}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-[0.3em] mt-3 ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`}>
            Remaining
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-6">
        <button 
          onClick={resetTimer}
          className={`p-5 border rounded-3xl transition-all active:scale-90 ${isDark ? 'bg-[#0D0D0D] border-[#1C1C1C] text-[#6B7280] hover:text-[#F9FAFB] hover:border-[#6B7280]/40' : 'bg-white border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 shadow-sm'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <button 
          onClick={toggleTimer}
          className={`px-12 py-5 rounded-[32px] font-bold text-lg shadow-2xl transition-all active:scale-95 border-2 ${
            isActive 
            ? (isDark ? 'bg-[#0D0D0D] border-[#8B5CF6] text-[#8B5CF6] shadow-[#8B5CF6]/10' : 'bg-white border-indigo-600 text-indigo-600 shadow-indigo-100') 
            : (isDark ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white shadow-[#8B5CF6]/20' : 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-200')
          }`}
        >
          {isActive ? 'Pause Session' : 'Start Focus'}
        </button>
      </div>

      {/* Presets */}
      <div className="space-y-4 pt-4">
        <h3 className={`text-[10px] font-bold uppercase tracking-[0.2em] ml-2 ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`}>Quick Sessions</h3>
        <div className="grid grid-cols-3 gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => selectPreset(preset.minutes)}
              className={`p-5 rounded-[24px] border transition-all text-center space-y-1.5 ${
                totalTime === preset.minutes * 60 
                ? (isDark ? 'bg-[#141414] border-[#8B5CF6]/60 text-[#8B5CF6] shadow-lg' : 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm')
                : (isDark ? 'bg-[#0D0D0D] border-[#1C1C1C] text-[#A1A1AA] hover:border-[#1C1C1C] hover:bg-[#141414]' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200 hover:bg-gray-50')
              }`}
            >
              <div className={`text-base font-bold ${isDark ? 'text-[#F9FAFB]' : 'text-gray-800'}`}>{preset.minutes}m</div>
              <div className={`text-[8px] font-bold uppercase tracking-widest ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`}>{preset.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Timer */}
      <div className="space-y-4">
        <h3 className={`text-[10px] font-bold uppercase tracking-[0.2em] ml-2 ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`}>Custom Duration</h3>
        <form onSubmit={handleCustomSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <input 
              type="number" 
              placeholder="Minutes" 
              className={`w-full border rounded-2xl pl-5 pr-14 py-4 text-sm font-bold focus:ring-1 focus:ring-[#8B5CF6]/40 outline-none transition-all placeholder:text-[#6B7280] ${isDark ? 'bg-[#0D0D0D] border-[#1C1C1C] text-[#F9FAFB]' : 'bg-white border-gray-200 text-gray-900'}`}
              value={customMinutes}
              onChange={(e) => setCustomMinutes(e.target.value)}
            />
            <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-bold tracking-widest ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`}>MINS</span>
          </div>
          <button 
            type="submit"
            className={`border px-7 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-all ${isDark ? 'bg-[#141414] border-[#1C1C1C] text-[#22D3EE] hover:bg-[#1C1C1C]' : 'bg-white border-gray-200 text-indigo-600 hover:bg-gray-50'}`}
          >
            Apply
          </button>
        </form>
      </div>

      {/* Notification Note */}
      <div className={`p-5 border rounded-2xl flex items-start space-x-4 ${isDark ? 'bg-[#0D0D0D] border-[#1C1C1C]' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className={`mt-0.5 ${isDark ? 'text-[#8B5CF6]' : 'text-indigo-600'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className={`text-[10px] leading-relaxed font-bold uppercase tracking-tight ${isDark ? 'text-[#A1A1AA]' : 'text-gray-400'}`}>
          System alerts will sound when your focus session ends. Keep ZenDo open for the best experience.
        </p>
      </div>
    </div>
  );
};

export default FocusTimer;
