import React from 'react';
import { Calendar, Play, Layers, BarChart2, BookOpen } from 'lucide-react';

interface MobileTabBarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  hasActiveSession: boolean;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  currentTab,
  onSelectTab,
  hasActiveSession,
}) => {
  const tabs = [
    { id: 'regimen', label: 'Regimen', icon: Calendar },
    { id: 'active', label: 'Active', icon: Play, highlight: hasActiveSession },
    { id: 'protocols', label: 'Protocols', icon: Layers },
    { id: 'biometrics', label: 'Biometrics', icon: BarChart2 },
    { id: 'codex', label: 'Codex', icon: BookOpen },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#f8f9ff]/95 dark:bg-[#0b1c30]/95 backdrop-blur-md border-t border-[#c6c6cd]/30 dark:border-[#213145] safe-area-pb">
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors focus-visible:outline-none ${
                isActive
                  ? 'text-[#006398] dark:text-[#6ffbbe]'
                  : 'text-[#45464d] dark:text-[#bec6e0] hover:text-[#0b1c30]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {tab.highlight && !isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#006398] dark:bg-[#6ffbbe]" />
                )}
              </div>
              <span className="text-[10px] font-medium tracking-tight mt-1 whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
