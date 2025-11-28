
import React from 'react';
import { WILDCORD_MANIFESTO } from '../constants';
import { ArrowRight, Check } from 'lucide-react';
import { Page } from '../types';

interface HeroProps {
  setPage: (page: Page) => void;
}

const Hero: React.FC<HeroProps> = ({ setPage }) => {
  return (
    <div className="w-full pb-32 md:pt-24 bg-wild-900">
      {/* Hero Header */}
      <div className="relative h-[95vh] w-full overflow-hidden group border-b border-wild-800">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-wild-950/80 via-wild-950/30 to-wild-900 z-10"></div>
        
        <div 
            className="absolute inset-0 bg-cover bg-center scale-105 animate-[pulse-slow_20s_infinite_alternate]"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=2070&auto=format&fit=crop)' }}
        ></div>
        
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6 max-w-6xl mx-auto mt-12 md:mt-0">
          <h1 className="font-display text-7xl md:text-[10rem] font-bold text-wild-light tracking-tighter mb-6 uppercase drop-shadow-2xl leading-[0.8] select-none opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Wild<span className="text-wild-accent">cord</span>
          </h1>
          
          <div className="w-24 h-1 bg-wild-accent mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}></div>

          <p className="text-wild-light/90 text-xl md:text-3xl max-w-4xl mb-12 font-medium font-sans tracking-wide drop-shadow-lg leading-relaxed opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            Earn the freedom. Live the life. <br className="hidden md:block"/> Never roam alone.
          </p>
          
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
            <button 
                onClick={() => setPage(Page.RHYTHM)}
                className="group relative px-16 py-6 bg-wild-accent hover:bg-orange-600 text-wild-light font-bold text-xl uppercase tracking-[0.2em] transition-all flex items-center shadow-[0_0_30px_rgba(235,94,40,0.2)] hover:shadow-[0_0_50px_rgba(235,94,40,0.4)] active:scale-95 rounded-sm clip-path-slant"
            >
                Initiate Mission
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Manifesto Section */}
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-12 space-y-40">
        {WILDCORD_MANIFESTO.map((section, index) => (
          <div key={index} className="relative group">
            
            {/* Background Roman Numeral - Architectural Element */}
            <div className="absolute -top-24 -left-8 md:-left-32 text-[12rem] md:text-[18rem] font-display font-black text-wild-800/30 select-none -z-10 leading-none transition-transform duration-700 group-hover:scale-105 group-hover:text-wild-800/40">
              {section.id}
            </div>

            {/* Section Header */}
            <div className="mb-10 border-l-4 border-wild-accent pl-8 py-2 backdrop-blur-sm">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-wild-light uppercase tracking-tight leading-none drop-shadow-lg">
                {section.title}
                </h2>
            </div>

            {/* Section Content */}
            <div className="space-y-8">
              {section.content.map((paragraph, pIndex) => {
                // Special styling for Section II (The List)
                if (section.id === "II" && pIndex < 4) {
                    return (
                        <div key={pIndex} className="flex items-start gap-5 group/item hover:translate-x-2 transition-transform duration-300">
                             <div className="mt-1 min-w-[24px] text-wild-accent">
                                <Check size={24} strokeWidth={3} />
                             </div>
                             <p className="text-wild-light/90 text-lg md:text-xl font-sans font-medium leading-relaxed">
                                {paragraph.replace(/^•\s*/, '')}
                             </p>
                        </div>
                    )
                }

                return (
                  <p key={pIndex} className="text-wild-muted hover:text-wild-light transition-colors duration-300 text-lg md:text-xl font-sans font-medium leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer Call to Action */}
      <div className="max-w-5xl mx-auto px-6 text-center py-32 mt-12 border-t border-wild-800/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-wild-accent/5 blur-3xl rounded-full -z-10"></div>
        
        <h3 className="text-6xl md:text-9xl font-display uppercase tracking-tighter text-wild-light mb-8 font-bold opacity-90">Wild<span className="text-wild-accent">cord</span></h3>
        <p className="text-wild-muted text-lg md:text-2xl tracking-[0.2em] uppercase font-bold mb-16 font-display">
            Earn the freedom. Live the life.
        </p>
        <button 
            onClick={() => setPage(Page.RHYTHM)}
            className="px-16 py-5 border border-wild-600 text-wild-muted hover:text-wild-light hover:border-wild-accent hover:bg-wild-800/50 transition-all uppercase tracking-widest font-bold text-sm md:text-base backdrop-blur-sm"
        >
            Join The Pack
        </button>
      </div>
    </div>
  );
};

export default Hero;
