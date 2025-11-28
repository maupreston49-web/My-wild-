
import React, { useState, useEffect } from 'react';
import { backend } from '../services/backend';
import { CommunityEvent, CommunityPost } from '../types';
import { MapPin, Users, Tent, Megaphone, CheckCircle, Shield } from 'lucide-react';

const Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'INTEL' | 'OPS'>('OPS');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const feed = await backend.community.getFeed();
      setPosts(feed.posts);
      setEvents(feed.events);
      
      const rsvps = await backend.community.getRSVPs();
      setJoinedEvents(rsvps);
    };
    loadData();
  }, []);

  const handleToggleRSVP = async (id: string) => {
    const updated = await backend.community.toggleRSVP(id);
    setJoinedEvents(updated);
  };

  return (
    <div className="max-w-3xl mx-auto pt-8 px-4 md:pt-16 pb-28">
      
      {/* Header */}
      <div className="mb-8 text-center md:text-left">
        <h2 className="font-display text-4xl md:text-5xl text-wild-light mb-3 uppercase tracking-tighter font-bold">Base<span className="text-wild-accent">camp</span></h2>
        <p className="text-wild-muted text-base max-w-md leading-relaxed">
            Official Wildcord channels. Intel drops, gear reviews, and upcoming field operations.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-wild-800 mb-8">
        <button 
            onClick={() => setActiveTab('OPS')}
            className={`flex items-center gap-2 pb-4 px-6 text-sm font-bold uppercase tracking-widest transition-all border-b-4 ${activeTab === 'OPS' ? 'text-wild-accent border-wild-accent' : 'text-wild-muted border-transparent hover:text-wild-light'}`}
        >
            <Tent size={18} /> Operations
        </button>
        <button 
            onClick={() => setActiveTab('INTEL')}
            className={`flex items-center gap-2 pb-4 px-6 text-sm font-bold uppercase tracking-widest transition-all border-b-4 ${activeTab === 'INTEL' ? 'text-wild-accent border-wild-accent' : 'text-wild-muted border-transparent hover:text-wild-light'}`}
        >
            <Megaphone size={18} /> Intel
        </button>
      </div>

      <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
        
        {/* OPERATIONS (EVENTS) */}
        {activeTab === 'OPS' && (
            <div className="space-y-8">
                {events.map(evt => {
                    const isJoined = joinedEvents.includes(evt.id);
                    return (
                        <div key={evt.id} className={`relative border rounded-xl p-6 md:p-8 transition-all ${isJoined ? 'bg-wild-800/50 border-wild-accent shadow-[0_0_20px_rgba(235,94,40,0.15)]' : 'bg-wild-800/30 border-wild-800 hover:border-wild-700'}`}>
                            {isJoined && (
                                <div className="absolute -top-3 -right-3 bg-wild-accent text-wild-light rounded-full p-2 shadow-lg">
                                    <CheckCircle size={20} />
                                </div>
                            )}
                            
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-5">
                                <div>
                                    <h3 className="font-display text-3xl text-wild-light uppercase tracking-wide font-bold leading-none">{evt.title}</h3>
                                    <div className="flex flex-wrap items-center gap-3 text-wild-muted text-xs font-bold uppercase tracking-widest mt-3">
                                        <span className={`px-3 py-1 rounded border ${evt.difficulty === 'Greenhorn' ? 'border-green-800 text-green-500' : 'border-orange-800 text-wild-accent'}`}>
                                            {evt.difficulty} Level
                                        </span>
                                        <span className="flex items-center gap-1 bg-wild-900 px-3 py-1 rounded"><Users size={12}/> {evt.attendees + (isJoined ? 1 : 0)} Going</span>
                                    </div>
                                </div>
                                <div className="text-left md:text-right flex flex-row md:flex-col gap-4 md:gap-0">
                                    <div className="text-wild-light font-bold text-lg">{evt.date}</div>
                                    <div className="text-wild-accent font-bold">{evt.time}</div>
                                </div>
                            </div>

                            <p className="text-wild-muted text-lg leading-relaxed mb-8 border-l-4 border-wild-800 pl-5">
                                {evt.description}
                            </p>

                            <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-wild-800 pt-6">
                                <div className="flex gap-6 w-full md:w-auto">
                                    <div className="flex items-center gap-2 text-wild-muted text-sm uppercase font-medium">
                                        <MapPin size={18} className="text-wild-accent" />
                                        {evt.location}
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => handleToggleRSVP(evt.id)}
                                    className={`w-full md:w-auto px-8 py-3 rounded-lg text-sm font-bold uppercase tracking-widest transition-all active:scale-95 ${isJoined ? 'bg-wild-900 text-wild-muted hover:bg-wild-800 border border-wild-700' : 'bg-wild-accent text-wild-light hover:bg-orange-600 shadow-lg'}`}
                                >
                                    {isJoined ? 'Stand Down' : 'Report In'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}

        {/* INTEL (NEWS) */}
        {activeTab === 'INTEL' && (
            <div className="space-y-10">
                {posts.map(post => (
                    <div key={post.id} className="group bg-wild-800/20 p-6 rounded-xl border border-transparent hover:border-wild-800 transition-all">
                        <div className="flex items-baseline gap-3 mb-3">
                            <span className="text-xs font-bold text-wild-accent uppercase tracking-widest border border-wild-800 bg-wild-900 px-2 py-1 rounded">{post.type}</span>
                            <span className="text-xs text-wild-muted uppercase font-mono">{post.date}</span>
                        </div>
                        <h3 className="font-display text-3xl md:text-4xl text-wild-light uppercase mb-4 group-hover:text-wild-accent transition-colors cursor-pointer leading-tight font-bold">
                            {post.title}
                        </h3>
                        <p className="text-wild-muted text-lg leading-relaxed border-l-4 border-wild-800 pl-5 group-hover:border-wild-accent transition-colors">
                            {post.content}
                        </p>
                        <div className="flex items-center gap-2 mt-6 text-xs font-bold uppercase text-wild-700 bg-wild-light/5 inline-flex px-3 py-1 rounded">
                            <Shield size={12} /> Posted by {post.author}
                        </div>
                    </div>
                ))}
            </div>
        )}

      </div>
    </div>
  );
};

export default Community;