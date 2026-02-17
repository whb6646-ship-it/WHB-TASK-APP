
import React from 'react';
import { AppSection, Theme } from '../types';

interface BottomNavProps {
  activeSection: AppSection;
  onSectionChange: (section: AppSection) => void;
  theme: Theme;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeSection, onSectionChange, theme }) => {
  const isDark = theme === 'dark';

  return (
    <nav className={`absolute bottom-0 left-0 right-0 backdrop-blur-2xl border-t px-3 py-5 flex justify-between items-center z-20 rounded-t-[32px] transition-colors ${isDark ? 'bg-[#0D0D0D]/90 border-[#1C1C1C] shadow-[0_-8px_30px_rgba(0,0,0,0.5)]' : 'bg-white/90 border-gray-100 shadow-[0_-8px_30px_rgba(0,0,0,0.03)]'}`}>
      <NavItem 
        label="Tasks" 
        isActive={activeSection === AppSection.DASHBOARD} 
        onClick={() => onSectionChange(AppSection.DASHBOARD)}
        isDark={isDark}
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        )}
      />
      <NavItem 
        label="Notes" 
        isActive={activeSection === AppSection.NOTES} 
        onClick={() => onSectionChange(AppSection.NOTES)}
        isDark={isDark}
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        )}
      />
      <NavItem 
        label="Event" 
        isActive={activeSection === AppSection.CALENDAR} 
        onClick={() => onSectionChange(AppSection.CALENDAR)}
        isDark={isDark}
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
      />
      <NavItem 
        label="Focus" 
        isActive={activeSection === AppSection.FOCUS_TIMER} 
        onClick={() => onSectionChange(AppSection.FOCUS_TIMER)}
        isDark={isDark}
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      />
      <NavItem 
        label="Set" 
        isActive={activeSection === AppSection.SETTINGS} 
        onClick={() => onSectionChange(AppSection.SETTINGS)}
        isDark={isDark}
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
        )}
      />
    </nav>
  );
};

const NavItem: React.FC<{ label: string, isActive: boolean, onClick: () => void, icon: React.ReactNode, isDark: boolean }> = ({ label, isActive, onClick, icon, isDark }) => {
  const activeColor = isDark ? 'text-[#8B5CF6]' : 'text-indigo-600';
  const inactiveColor = isDark ? 'text-[#6B7280]' : 'text-gray-400';

  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center space-y-1.5 px-3 py-1 transition-all duration-300 ${isActive ? activeColor : inactiveColor}`}
    >
      <div className={`transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(139,92,246,0.2)]' : 'scale-100'}`}>
        {icon}
      </div>
      <span className={`text-[8px] font-extrabold uppercase tracking-widest transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
        {label}
      </span>
      {isActive && <div className={`w-1 h-1 rounded-full mt-0.5 shadow-[0_0_4px_currentColor] ${isDark ? 'bg-[#8B5CF6]' : 'bg-indigo-600'}`} />}
    </button>
  );
};

export default BottomNav;
