
import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Settings, Smile, Zap, Brain, Coffee, Ghost, User as UserIcon, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
    activePage: string;
    onNavigate: (page: string) => void;
    onSurpriseMe?: () => void;
    currentMood?: string | null;
    onMoodChange?: (mood: string | null) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, onNavigate, onSurpriseMe, currentMood, onMoodChange }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Smart Hide Logic
      if (currentScrollY > 50) {
          if (currentScrollY > lastScrollY) {
              setIsVisible(false); // Scrolling DOWN -> Hide
          } else {
              setIsVisible(true); // Scrolling UP -> Show
          }
      } else {
          setIsVisible(true); // At top -> Show
      }

      setIsScrolled(currentScrollY > 10);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  const navLinks = [
    { label: 'בית', id: 'home' },
    { label: 'סדרות', id: 'series' },
    { label: 'סרטים', id: 'movies' },
    { label: 'חדש ופופולרי', id: 'new' },
    { label: 'הרשימה שלי', id: 'list' },
  ];

  return (
    <header
        className={`fixed z-50 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) transform ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-[200%] opacity-0'
        } ${
          isScrolled 
            ? 'top-2 md:top-6 left-2 md:left-12 right-2 md:right-12 rounded-2xl bg-[#161b22]/95 backdrop-blur-2xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)]' 
            : 'top-0 left-0 right-0 bg-transparent'
        }`}
    >
        <div className={`px-4 md:px-8 flex items-center justify-between transition-all duration-500 relative ${isScrolled ? 'h-16' : 'h-16 md:h-24'}`}>
          
          {/* Left Side (RTL: Right Side) - Logo */}
          <div className="flex items-center shrink-0">
              <button onClick={() => user && onNavigate('home')} className={`flex items-center select-none group focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-full ${!user ? 'cursor-default' : 'cursor-pointer'}`}>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-600 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-shadow">
                    <Smile className="w-6 h-6 text-black" />
                  </div>
                  <span className="text-xl font-black text-white ml-2 block tracking-tight">EyalAtiaTV<span className="text-cyan-400">.</span></span>
              </button>
          </div>

          {/* Center - Navigation Links */}
          {user && (
              <nav className={`hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center gap-1 p-1 rounded-full transition-all duration-500 ${isScrolled ? '' : 'bg-white/5 border border-white/5 backdrop-blur-sm'}`}>
                  {navLinks.map(link => (
                      <button
                        key={link.id}
                        onClick={() => onNavigate(link.id)}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-300 ${
                            activePage === link.id 
                            ? 'bg-white/10 text-white shadow-sm' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                          {link.label}
                      </button>
                  ))}
              </nav>
          )}
          
          {/* Right Side (RTL: Left Side) - Actions */}
          <div className="flex items-center gap-3 md:gap-5 text-white shrink-0">
            {user && (
                <>
                  <button 
                    onClick={() => onNavigate('search')}
                    className={`hidden md:block hover:text-cyan-400 focus:text-cyan-400 transition p-2 rounded-full hover:bg-white/5 ${activePage === 'search' ? 'text-cyan-400' : ''}`}
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                  <button className="hover:text-cyan-400 transition p-2 rounded-full hover:bg-white/5 hidden md:block">
                    <Bell className="w-5 h-5 md:w-6 md:h-6" />
                  </button>

                   <button 
                      className="flex items-center gap-2 cursor-pointer hover:bg-white/10 p-1.5 pr-1.5 md:pr-3 rounded-full transition border border-transparent hover:border-white/10"
                      onClick={() => onNavigate('settings')}
                   >
                       <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                           <UserIcon className="w-4 h-4 text-white" />
                       </div>
                   </button>
                </>
            )}

            {!user && activePage !== 'login' && (
                <button 
                    onClick={() => onNavigate('login')}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-sm transition-all"
                >
                    <LogIn className="w-4 h-4" />
                    התחברות
                </button>
            )}
          </div>
        </div>
      </header>
  );
};
