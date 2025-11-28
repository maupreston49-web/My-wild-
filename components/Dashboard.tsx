
import React, { useState, useEffect } from 'react';
import { Trophy, Timer, Footprints, ClipboardCheck, X, ChevronRight, Loader2, Target } from 'lucide-react';
import { CheckInSession, UserStats } from '../types';
import { backend } from '../services/backend';

const Dashboard: React.FC = () => {
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [milesInput, setMilesInput] = useState('');
  const [sessionsInput, setSessionsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [stats, setStats] = useState<UserStats | null>(null);
  const [history, setHistory] = useState<CheckInSession[]>([]);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
        const s = await backend.performance.getStats();
        setStats(s);
        const h = await backend.performance.getHistory();
        setHistory(h);
    };
    loadData();
  }, []);

  const handleCheckInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;

    setIsSubmitting(true);
    
    const result = await backend.performance.submitCheckIn({
        notes,
        miles: Number(milesInput) || 0,
        sessions: Number(sessionsInput) || 0
    });

    setHistory(result.history);
    setStats(result.stats);
    
    // Reset Form
    setNotes('');
    setMilesInput('');
    setSessionsInput('');
    setIsSubmitting(false);
    setIsCheckInOpen(false);
  };

  if (!stats) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-wild-accent w-8 h-8" /></div>;

  const statCards = [
    { icon: Timer, value: stats.streakDays, label: 'Days Streak', color: 'text-wild-accent' },
    { icon: Footprints, value: stats.totalMiles, label: 'Total Miles', color: 'text-blue-400' },
    { icon: Trophy, value: stats.totalSessions, label: 'Sessions', color: 'text-yellow-400' },
    { icon: Target, value: `${stats.progressPercent.toFixed(0)}%`, label: 'Target', color: 'text-green-400' }
  ];

  return (
    <div className="max-w-6xl mx-auto pt-8 px-4 md:pt-20 pb-32 relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 border-b border-wild-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-wild-accent text-xs font-mono uppercase tracking-widest mb-2">
             <div className="w-2 h-2 bg-wild-accent rounded-full animate-pulse"></div> Live Metrics
          </div>
          <h2 className="font-display text-5xl text-wild-light uppercase tracking-tight">Performance <span className="text-wild-600">Log</span></h2>
        </div>
        <div className="flex gap-4">
            <button 
                onClick={() => setIsCheckInOpen(true)}
                className="flex items-center gap-3 px-8 py-3 rounded bg-wild-accent hover:bg-orange-600 text-wild-light transition-all text-sm font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(235,94,40,0.2)] hover:shadow-[0_0_30px_rgba(235,94,40,0.4)] active:scale-95 group"
            >
                <ClipboardCheck size={18} className="group-hover:-translate-y-0.5 transition-transform"/> Log Data
            </button>
        </div>
      </div>

      {/* HUD Rank Card */}
      <div className="glass-panel rounded-2xl p-8 mb-12 relative overflow-hidden group">
         {/* HUD Grid Background */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
         
         <div className="relative z-10">
             <div className="flex flex-col md:flex-row items-baseline justify-between mb-8">
                 <div>
                     <h3 className="text-xs uppercase tracking-[0.2em] text-wild-muted font-bold mb-2 font-mono">Current Designation</h3>
                     <h2 className="text-5xl md:text-6xl font-display text-wild-light font-bold uppercase tracking-tighter drop-shadow-lg">{stats.rank}</h2>
                 </div>
                 <div className="text-left md:text-right mt-4 md:mt-0">
                     <h3 className="text-xs uppercase tracking-[0.2em] text-wild-muted font-bold mb-2 font-mono">Next Objective</h3>
                     <h2 className="text-3xl font-display text-wild-accent/90 font-bold uppercase tracking-tight">{stats.nextRank}</h2>
                 </div>
             </div>

             {/* HUD Progress Bar */}
             <div className="relative pt-2 pb-6">
                 <div className="flex justify-between text-[10px] font-mono text-wild-600 uppercase mb-2 tracking-widest">
                     <span>0%</span>
                     <span>50%</span>
                     <span>100%</span>
                 </div>
                 <div className="w-full h-4 bg-wild-900/80 rounded-sm overflow-hidden border border-wild-700 relative shadow-inner">
                     {/* Tick marks */}
                     <div className="absolute inset-0 w-full h-full flex justify-between px-2 z-20 opacity-20">
                        {[...Array(10)].map((_, i) => <div key={i} className="w-px h-full bg-wild-light"></div>)}
                     </div>
                     <div 
                        className="h-full bg-gradient-to-r from-wild-accent via-orange-600 to-wild-accent bg-[length:200%_100%] animate-[pulse_3s_infinite] transition-all duration-1000 ease-out relative z-10"
                        style={{ width: `${stats.progressPercent}%` }}
                     >
                        <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white/50 shadow-[0_0_10px_white]"></div>
                     </div>
                 </div>
                 <div className="flex justify-between mt-3 font-mono">
                     <span className="text-wild-light font-bold">{stats.totalMiles} <span className="text-wild-muted text-xs font-normal">MILES LOGGED</span></span>
                     <span className="text-wild-accent font-bold">{stats.milesToNext.toFixed(1)} <span className="text-wild-muted text-xs font-normal">TO PROMOTION</span></span>
                 </div>
             </div>
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
         {statCards.map((card, index) => (
            <div key={index} className="glass-panel p-6 rounded-xl flex flex-col items-center justify-center text-center hover:bg-wild-800/50 transition-colors group">
                <div className={`mb-4 p-3 rounded-full bg-wild-900/50 ${card.color} group-hover:scale-110 transition-transform`}>
                  <card.icon size={24} strokeWidth={1.5} />
                </div>
                <span className="text-4xl font-display font-bold text-wild-light mb-1 tracking-tight">{card.value}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-wild-muted font-mono">{card.label}</span>
            </div>
         ))}
      </div>

      {/* Coach's Log */}
      <div className="glass-panel border border-wild-800 rounded-xl overflow-hidden">
            <div className="bg-wild-900/50 p-6 border-b border-wild-800 flex items-center gap-3">
                <ClipboardCheck className="text-wild-muted" size={20}/> 
                <h3 className="font-display text-xl text-wild-light uppercase tracking-wide">Officer's Log</h3>
            </div>
            
            <div className="p-0 max-h-[500px] overflow-y-auto no-scrollbar">
                {history.length === 0 ? (
                    <div className="text-wild-muted text-sm p-12 text-center opacity-50">
                        Awaiting first field report.
                    </div>
                ) : (
                    history.map((session) => (
                        <div key={session.id} className="border-b border-wild-800/50 p-6 hover:bg-wild-800/30 transition-colors group">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-xs font-bold text-wild-accent uppercase tracking-widest font-mono">{session.date}</span>
                                {session.status === 'reviewed' && (
                                  <div className="flex items-center gap-1 text-[10px] bg-wild-900/80 text-green-400 px-2 py-1 rounded border border-wild-800 uppercase tracking-wider">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Reviewed
                                  </div>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-xs text-wild-muted font-mono opacity-70">
                                {session.statsSnapshot.map((s, i) => (
                                    <span key={i}><span className="text-wild-700 uppercase mr-1">{s.label.split(' ')[0]}:</span> {s.value}</span>
                                ))}
                            </div>

                            <p className="text-wild-light/90 text-sm italic mb-4 pl-4 border-l-2 border-wild-700 group-hover:border-wild-accent transition-colors">"{session.userNotes}"</p>
                            
                            {session.coachFeedback && (
                                <div className="bg-wild-900/60 p-5 rounded-lg border border-wild-800/50 relative">
                                    <span className="text-[10px] text-wild-accent font-bold uppercase tracking-widest block mb-2 font-mono">Direct Feedback // Head Coach</span>
                                    <p className="text-sm text-wild-light leading-relaxed">{session.coachFeedback}</p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>

      {/* Check-In Modal */}
      {isCheckInOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-wild-950/90 backdrop-blur-md animate-fade-in">
            <div className="glass-panel w-full max-w-lg rounded-2xl shadow-2xl border border-wild-700 overflow-hidden relative animate-fade-in-up">
                <button 
                    onClick={() => setIsCheckInOpen(false)}
                    className="absolute top-4 right-4 text-wild-muted hover:text-wild-light transition-colors"
                >
                    <X size={24} />
                </button>
                
                <div className="p-8">
                    <h3 className="font-display text-3xl text-wild-light uppercase mb-2">Log The Work</h3>
                    <p className="text-wild-muted text-sm mb-8 border-l-2 border-wild-accent pl-3">
                        Honesty is the only currency here. Input your numbers for this week.
                    </p>

                    <form onSubmit={handleCheckInSubmit}>
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-wild-muted font-bold mb-2 font-mono">Miles Rucked</label>
                                <input 
                                    type="number" 
                                    value={milesInput}
                                    onChange={(e) => setMilesInput(e.target.value)}
                                    className="w-full bg-wild-950/50 border-b border-wild-700 py-3 text-wild-light focus:outline-none focus:border-wild-accent text-xl font-display font-bold transition-colors"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-wild-muted font-bold mb-2 font-mono">Sessions</label>
                                <input 
                                    type="number" 
                                    value={sessionsInput}
                                    onChange={(e) => setSessionsInput(e.target.value)}
                                    className="w-full bg-wild-950/50 border-b border-wild-700 py-3 text-wild-light focus:outline-none focus:border-wild-accent text-xl font-display font-bold transition-colors"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <label className="block text-[10px] uppercase tracking-widest text-wild-muted font-bold mb-2 font-mono">
                            Field Notes
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full bg-wild-950/50 border border-wild-700 rounded p-4 text-wild-light focus:outline-none focus:border-wild-accent h-32 resize-none mb-8 text-sm"
                            placeholder="E.g., Recalls were sharp. Struggled with loose leash in town..."
                        />
                        
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full bg-wild-accent hover:bg-orange-600 text-wild-light font-bold uppercase py-4 tracking-widest transition-colors rounded flex items-center justify-center gap-2 shadow-lg font-display text-lg"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Submit Log <ChevronRight size={20} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;