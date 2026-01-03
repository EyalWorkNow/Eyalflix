
import React from 'react';
import { Home, Tv, Film, Search, List } from 'lucide-react';

interface BottomNavProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activePage, onNavigate }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'בית' },
    { id: 'series', icon: Tv, label: 'סדרות' },
    { id: 'search', icon: Search, label: 'חיפוש' }, // Central search for thumb reach
    { id: 'movies', icon: Film, label: 'סרטים' },
    { id: 'list', icon: List, label: 'שלי' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe">
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117] to-transparent h-24 pointer-events-none" />
      <nav className="relative bg-[#161b22]/90 backdrop-blur-xl border-t border-white/10 px-6 pb-4 pt-3 flex justify-between items-center pb-safe-area">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                isActive ? 'text-cyan-400 scale-110' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-cyan-500/20' : ''}`}>
                 <Icon className={`w-6 h-6 ${isActive ? 'fill-cyan-500/20' : ''}`} />
              </div>
              <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
