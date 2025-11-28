
import React from 'react';
import { Page } from '../types';
import { Mountain, PawPrint, Crosshair, Radio, Tent } from 'lucide-react';

interface NavigationProps {
  activePage: Page;
  setPage: (page: Page) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activePage, setPage }) => {
  const navItems = [
    { id: Page.HOME, label: 'Manifesto', icon: <Mountain size={22} strokeWidth={2} /> },
    { id: Page.RHYTHM, label: 'My Rhythm', icon: <PawPrint size={22} strokeWidth={2} /> },
    { id: Page.DASHBOARD, label: 'Progress', icon: <Crosshair size={22} strokeWidth={2} /> }, 
    { id: Page.COMMUNITY, label: 'Basecamp', icon: <Tent size={22} strokeWidth={2} /> },
    { id: Page.PACK, label: 'The Pack', icon: <Radio size={22} strokeWidth={2} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 md:top-4 md:bottom-auto md:w-auto md:left-1/2 md:-translate-x-1/2">
      {/* Mobile Background (Solid) vs Desktop (Floating Glass) */}
      <div className="w-full md:w-auto md:glass-panel md:rounded-full md:px-6 md:py-2 bg-wild-950/95 md:bg-transparent border-t border-wild-800 md:border border-wild-700 shadow-2xl backdrop-blur-lg">
        
        <div className="flex justify-between items-center h-auto py-1 md:py-0 md:gap-2">
          
          {/* Mobile Only: Logo Segment? No, keeping it clean. */}
          
          <div className="flex w-full justify-between md:justify-center gap-1">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  className={`relative flex flex-col md:flex-row items-center justify-center p-3 md:px-5 md:py-3 rounded-full transition-all duration-300 group ${
                    isActive 
                      ? 'text-wild-light' 
                      : 'text-wild-muted hover:text-wild-light'
                  }`}
                >
                  {/* Active Glow Background */}
                  {isActive && (
                    <div className="absolute inset-0 bg-wild-accent/10 md:bg-wild-accent/20 rounded-xl md:rounded-full blur-sm" />
                  )}

                  <span className={`relative z-10 mb-1 md:mb-0 md:mr-2 transition-transform duration-300 ${isActive ? 'scale-110 text-wild-accent' : 'group-hover:scale-105'}`}>
                    {item.icon}
                  </span>
                  
                  <span className={`relative z-10 text-[10px] md:text-xs font-display font-bold tracking-widest uppercase ${isActive ? 'text-wild-light' : ''}`}>
                    {item.label}
                  </span>

                  {/* Active Indicator Dot */}
                  {isActive && (
                    <span className="absolute -bottom-1 md:bottom-1 w-1 h-1 bg-wild-accent rounded-full shadow-[0_0_8px_#eb5e28]"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
