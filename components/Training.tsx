
import React, { useState, useEffect } from 'react';
import { DogProfile, DailyRhythm, RhythmSegment } from '../types';
import { backend } from '../services/backend'; 
import { Loader2, Flame, Coffee, Moon, Dog, Clock, Trees, LucideIcon } from 'lucide-react';

// --- Internal Components ---

interface RhythmCardProps {
  segment: RhythmSegment | undefined;
  label: string;
  icon: LucideIcon;
  colors: {
    border: string;
    text: string;
    bg: string;
  };
  delay: string;
}

const RhythmCard: React.FC<RhythmCardProps> = ({ segment, label, icon: Icon, colors, delay }) => {
  if (!segment) return null;

  return (
    <div 
      className={`glass-panel border-l-[4px] ${colors.border} p-6 md:p-8 rounded-r-xl relative group hover:bg-wild-800/60 transition-all opacity-0 animate-fade-in-up`}
      style={{ animationDelay: delay }}
    >
       <div className={`absolute top-6 right-6 ${colors.text} opacity-10 group-hover:opacity-100 transition-opacity duration-500`}>
           <Icon size={56} strokeWidth={1} />
       </div>
       <span className={`text-xs font-mono font-bold uppercase tracking-widest ${colors.text} mb-3 block`}>{label}</span>
       <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-4">
          <h4 className="text-3xl font-display font-bold text-wild-light uppercase">{segment.title}</h4>
          <span className="text-[10px] font-mono font-bold text-wild-muted border border-wild-600 px-2 py-1 rounded bg-wild-900/50 inline-block w-max">{segment.duration}</span>
       </div>
       <p className="text-wild-light/80 text-lg leading-relaxed relative z-10 font-sans">{segment.activity}</p>
    </div>
  );
};

// --- Main Component ---

const Training: React.FC = () => {
  const [profile, setProfile] = useState<DogProfile>({
    name: '',
    age: '',
    breed: '',
    energy: 'Moderate',
    environment: 'Suburbs',
    timeAvailable: '30-60 mins'
  });
  const [rhythm, setRhythm] = useState<DailyRhythm | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const savedProfile = await backend.user.getProfile();
      if (savedProfile) setProfile(savedProfile);

      const savedRhythm = await backend.rhythm.get();
      if (savedRhythm) setRhythm(savedRhythm);
    };
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.name) return;
    
    setLoading(true);
    const generatedRhythm = await backend.rhythm.generate(profile);
    setRhythm(generatedRhythm);
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full min-h-screen pt-8 pb-32 md:pt-32 px-4 md:px-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Input Section */}
        <div className="lg:col-span-5">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-wild-light mb-4 uppercase tracking-tight">Build Your <span className="text-wild-accent">Rhythm</span></h2>
          <p className="text-wild-muted mb-10 text-lg leading-relaxed">Life is busy. Your dog is unique. Input your reality, and we'll build a protocol that fits.</p>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Dog Details */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2 text-wild-accent uppercase text-xs font-bold tracking-widest font-mono mb-2">
                    <Dog size={16} /> <span>Target Profile</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input type="text" name="name" value={profile.name} onChange={handleChange} placeholder="Name" className="w-full bg-wild-800/50 border-b-2 border-wild-700 p-4 text-lg focus:border-wild-accent focus:outline-none text-wild-light placeholder-wild-600 transition-colors rounded-t-lg" />
                    </div>
                    <div className="relative">
                      <input type="text" name="age" value={profile.age} onChange={handleChange} placeholder="Age" className="w-full bg-wild-800/50 border-b-2 border-wild-700 p-4 text-lg focus:border-wild-accent focus:outline-none text-wild-light placeholder-wild-600 transition-colors rounded-t-lg" />
                    </div>
                </div>
                <input type="text" name="breed" value={profile.breed} onChange={handleChange} placeholder="Breed / Mix" className="w-full bg-wild-800/50 border-b-2 border-wild-700 p-4 text-lg focus:border-wild-accent focus:outline-none text-wild-light placeholder-wild-600 transition-colors rounded-t-lg" />
                
                <div className="relative">
                    <select name="energy" value={profile.energy} onChange={handleChange} className="w-full bg-wild-800/50 border-b-2 border-wild-700 p-4 text-lg focus:border-wild-accent focus:outline-none text-wild-light appearance-none rounded-t-lg cursor-pointer">
                        <option value="Low">Low Energy (Chill)</option>
                        <option value="Moderate">Moderate (Standard)</option>
                        <option value="High">High Drive (Needs a job)</option>
                        <option value="Infinite">Infinite (Maligator/BC)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-wild-muted">▼</div>
                </div>
            </div>

            {/* Life Details */}
            <div className="space-y-4 pt-4 border-t border-wild-800/50">
                <div className="flex items-center space-x-2 text-wild-accent uppercase text-xs font-bold tracking-widest font-mono mb-2">
                    <Clock size={16} /> <span>Operational Context</span>
                </div>
                
                <div className="relative">
                  <select name="timeAvailable" value={profile.timeAvailable} onChange={handleChange} className="w-full bg-wild-800/50 border-b-2 border-wild-700 p-4 text-lg focus:border-wild-accent focus:outline-none text-wild-light appearance-none rounded-t-lg cursor-pointer">
                      <option value="15 mins">Jam Packed (15 mins)</option>
                      <option value="30-60 mins">Standard (30-60 mins)</option>
                      <option value="Unlimited">Weekend Warrior (Unlimited)</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-wild-muted">▼</div>
                </div>
                
                <div className="relative">
                  <select name="environment" value={profile.environment} onChange={handleChange} className="w-full bg-wild-800/50 border-b-2 border-wild-700 p-4 text-lg focus:border-wild-accent focus:outline-none text-wild-light appearance-none rounded-t-lg cursor-pointer">
                      <option value="City">City / Apartment</option>
                      <option value="Suburbs">Suburbs / Yard</option>
                      <option value="Rural/Wild">Rural / Deep Woods</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-wild-muted">▼</div>
                </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-8 bg-wild-accent hover:bg-orange-600 text-wild-light font-bold uppercase py-5 text-lg tracking-widest transition-all flex justify-center items-center rounded shadow-[0_0_20px_rgba(235,94,40,0.3)] hover:shadow-[0_0_30px_rgba(235,94,40,0.5)] active:scale-95 font-display"
            >
              {loading ? <Loader2 className="animate-spin w-6 h-6" /> : 'Generate Protocol'}
            </button>
          </form>
        </div>

        {/* Output Section */}
        <div className="lg:col-span-7 relative">
          {!rhythm && !loading && (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-wild-700 border-2 border-dashed border-wild-800/50 rounded-2xl bg-wild-800/10 p-12 text-center">
              <Trees size={100} strokeWidth={1} className="mb-6 opacity-30" />
              <p className="uppercase tracking-widest text-xl font-bold text-wild-600 font-display">No Protocol Active</p>
              <p className="text-base text-wild-600/70 mt-2">Input target data to initialize generation.</p>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-wild-800 rounded-full"></div>
                <div className="w-24 h-24 border-4 border-wild-accent rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
              </div>
              <p className="mt-8 font-display text-2xl uppercase tracking-widest text-wild-light animate-pulse">Analyzing parameters...</p>
            </div>
          )}

          {rhythm && !loading && (
            <div className="space-y-10">
              
              <div className="text-center lg:text-left mb-12 animate-fade-in">
                <span className="text-wild-accent font-mono text-xs uppercase tracking-widest mb-2 block">Protocol Generated</span>
                <h3 className="text-4xl md:text-6xl font-display text-wild-light uppercase leading-[0.9] tracking-tight mb-4">{rhythm.theme}</h3>
                <p className="text-wild-muted font-serif italic text-xl border-l-2 border-wild-accent pl-4">"{rhythm.motto}"</p>
              </div>

              <div className="space-y-6">
                <RhythmCard 
                  segment={rhythm.ritual} 
                  label="0600 // The Ritual" 
                  icon={Coffee}
                  colors={{ border: 'border-yellow-600/80', text: 'text-yellow-600', bg: 'bg-yellow-900/10' }}
                  delay="0.1s"
                />

                <RhythmCard 
                  segment={rhythm.work} 
                  label="1200 // The Work" 
                  icon={Flame}
                  colors={{ border: 'border-wild-accent', text: 'text-wild-accent', bg: 'bg-wild-accent/10' }}
                  delay="0.3s"
                />

                <RhythmCard 
                  segment={rhythm.peace} 
                  label="2000 // The Peace" 
                  icon={Moon}
                  colors={{ border: 'border-blue-500/80', text: 'text-blue-500', bg: 'bg-blue-900/10' }}
                  delay="0.5s"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Training;
