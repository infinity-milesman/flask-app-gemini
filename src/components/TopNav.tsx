import React from 'react';
import { Moon, Sun, Plus, SlidersHorizontal, Activity } from 'lucide-react';

interface TopNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenQuickLog: () => void;
  onOpenSettings: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  hasActiveSession: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenQuickLog,
  onOpenSettings,
  darkMode,
  onToggleDarkMode,
  hasActiveSession,
}) => {
  const navItems = [
    { id: 'regimen', label: 'Regimen' },
    { id: 'active', label: 'Active Session', highlight: hasActiveSession },
    { id: 'protocols', label: 'Protocols' },
    { id: 'biometrics', label: 'Biometrics' },
    { id: 'codex', label: 'Movement Codex' },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-[#f8f9ff]/90 dark:bg-[#0b1c30]/90 backdrop-blur-md border-b border-[#c6c6cd]/30 dark:border-[#213145] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single element brand wordmark */}
        <button
          onClick={() => onSelectTab('regimen')}
          className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006398] rounded-md transition-opacity hover:opacity-90 shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-[#000000] dark:bg-[#6ffbbe] flex items-center justify-center text-white dark:text-[#0b1c30] shadow-sm">
            <Activity className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-bold text-lg tracking-tight text-[#0b1c30] dark:text-[#eaf1ff] whitespace-nowrap">
            KINETIC CLARITY
          </span>
        </button>

        {/* Zone 2: 4–5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006398] rounded ${
                  isActive
                    ? 'text-[#0b1c30] dark:text-[#ffffff] font-semibold'
                    : 'text-[#45464d] dark:text-[#bec6e0] hover:text-[#0b1c30] dark:hover:text-[#ffffff]'
                }`}
              >
                {item.label}
                {item.highlight && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006398] dark:bg-[#6ffbbe]" />
                )}
                {isActive && (
                  <span className="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-[#006398] dark:bg-[#6ffbbe]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action + Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onToggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#45464d] dark:text-[#bec6e0] hover:bg-[#eff4ff] dark:hover:bg-[#131b2e] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006398]"
            aria-label="Toggle visual theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenSettings}
            title="Athlete Rig Settings"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#45464d] dark:text-[#bec6e0] hover:bg-[#eff4ff] dark:hover:bg-[#131b2e] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006398]"
            aria-label="Athlete Profile and Settings"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenQuickLog}
            className="h-9 px-3.5 sm:px-4 rounded-lg bg-[#000000] dark:bg-[#ffffff] text-[#ffffff] dark:text-[#0b1c30] text-xs font-semibold tracking-wide flex items-center gap-1.5 hover:bg-[#131b2e] dark:hover:bg-[#dce9ff] transition-all shadow-sm active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006398] whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Log Session</span>
          </button>
        </div>
      </div>
    </header>
  );
};
