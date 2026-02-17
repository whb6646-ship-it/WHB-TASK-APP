
import React from 'react';
import { Theme } from '../types';

interface SettingsProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const Settings: React.FC<SettingsProps> = ({ theme, setTheme }) => {
  const isDark = theme === 'dark';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <h2 className={`text-xl font-bold ${isDark ? 'text-[#F9FAFB]' : 'text-gray-900'}`}>Settings</h2>

      {/* User Profile Section */}
      <div className={`flex items-center space-x-5 p-6 rounded-3xl shadow-xl border ${isDark ? 'bg-[#0D0D0D] border-[#1C1C1C]' : 'bg-white border-gray-100'}`}>
        <div className="relative">
            <img 
            src="https://picsum.photos/seed/user123/150/150" 
            alt="Profile" 
            className={`w-16 h-16 rounded-2xl object-cover border-2 shadow-lg transition-all ${isDark ? 'border-[#1C1C1C] grayscale' : 'border-gray-100'}`}
            />
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 bg-[#10B981] border-4 rounded-full ${isDark ? 'border-[#0D0D0D]' : 'border-white'}`}></div>
        </div>
        <div>
          <h3 className={`font-bold text-lg ${isDark ? 'text-[#F9FAFB]' : 'text-gray-900'}`}>Alex Thompson</h3>
          <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`}>Premium Member</p>
          <button className={`text-[10px] font-extrabold uppercase tracking-wider mt-2 transition-colors ${isDark ? 'text-[#8B5CF6] hover:text-[#A78BFA]' : 'text-indigo-600 hover:text-indigo-700'}`}>Manage Account</button>
        </div>
      </div>

      {/* Settings Options */}
      <div className="space-y-1">
        <h3 className={`text-[10px] font-bold uppercase tracking-[0.3em] px-4 mb-3 ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`}>Preferences</h3>
        <div className={`rounded-3xl overflow-hidden shadow-xl border ${isDark ? 'bg-[#0D0D0D] border-[#1C1C1C]' : 'bg-white border-gray-100'}`}>
            <SettingToggle 
              title="AMOLED Mode" 
              description="Darker blacks for OLED screens" 
              checked={isDark} 
              onToggle={() => setTheme(isDark ? 'light' : 'dark')}
              isDark={isDark}
            />
            <div className={`h-px mx-4 ${isDark ? 'bg-[#1C1C1C]' : 'bg-gray-100'}`}></div>
            <SettingToggle title="Smart Notifications" description="AI analyzed priority alerts" checked={true} isDark={isDark} />
            <div className={`h-px mx-4 ${isDark ? 'bg-[#1C1C1C]' : 'bg-gray-100'}`}></div>
            <SettingToggle title="Biometric Security" description="FaceID access" checked={true} isDark={isDark} />
        </div>
      </div>

      <div className="space-y-1">
        <h3 className={`text-[10px] font-bold uppercase tracking-[0.3em] px-4 mb-3 ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`}>Data & Sync</h3>
        <div className={`rounded-3xl overflow-hidden shadow-xl border ${isDark ? 'bg-[#0D0D0D] border-[#1C1C1C]' : 'bg-white border-gray-100'}`}>
            <SettingLink title="Cloud Backup" icon="☁️" isDark={isDark} />
            <div className={`h-px mx-4 ${isDark ? 'bg-[#1C1C1C]' : 'bg-gray-100'}`}></div>
            <SettingLink title="Export JSON" icon="📦" isDark={isDark} />
        </div>
      </div>

      <button className={`w-full py-5 font-extrabold text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-colors shadow-sm border ${isDark ? 'text-red-400 bg-red-500/5 border-red-500/10 hover:bg-red-500/10' : 'text-red-500 bg-red-50 border-red-100 hover:bg-red-100'}`}>
        Log Out Session
      </button>

      <div className="text-center pt-4">
          <p className={`text-[9px] font-extrabold uppercase tracking-[0.4em] ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`}>ZenDo v1.0.4-PRO</p>
          <p className={`text-[8px] font-bold mt-1 ${isDark ? 'text-[#1C1C1C]' : 'text-gray-200'}`}>MADE WITH {isDark ? 'DARKNESS' : 'LIGHT'}</p>
      </div>
    </div>
  );
};

const SettingToggle: React.FC<{ title: string, description: string, checked: boolean, onToggle?: () => void, isDark: boolean }> = ({ title, description, checked, onToggle, isDark }) => (
  <div 
    onClick={onToggle}
    className={`flex items-center justify-between p-5 transition-colors cursor-pointer group ${isDark ? 'hover:bg-[#141414]' : 'hover:bg-gray-50'}`}
  >
    <div>
      <h4 className={`text-sm font-bold transition-colors ${isDark ? 'text-[#F9FAFB]' : 'text-gray-900'}`}>{title}</h4>
      <p className={`text-[10px] font-medium ${isDark ? 'text-[#6B7280]' : 'text-gray-400'}`}>{description}</p>
    </div>
    <div className={`w-10 h-5 rounded-full relative transition-all duration-300 ${checked ? (isDark ? 'bg-[#8B5CF6]' : 'bg-indigo-600') : (isDark ? 'bg-[#1C1C1C]' : 'bg-gray-200')}`}>
      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 shadow-sm ${checked ? 'right-1' : 'left-1'}`} />
    </div>
  </div>
);

const SettingLink: React.FC<{ title: string, icon: string, isDark: boolean }> = ({ title, icon, isDark }) => (
  <div className={`flex items-center justify-between p-5 transition-colors cursor-pointer group ${isDark ? 'hover:bg-[#141414]' : 'hover:bg-gray-50'}`}>
    <div className="flex items-center space-x-4">
      <div className={`w-8 h-8 rounded-xl border flex items-center justify-center text-xs font-bold shadow-sm ${isDark ? 'bg-[#141414] border-[#1C1C1C] text-[#A1A1AA]' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
        {icon}
      </div>
      <h4 className={`text-sm font-bold ${isDark ? 'text-[#F9FAFB]' : 'text-gray-900'}`}>{title}</h4>
    </div>
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 group-hover:translate-x-1 transition-all ${isDark ? 'text-[#6B7280]' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
    </svg>
  </div>
);

export default Settings;
