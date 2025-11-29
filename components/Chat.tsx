
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { backend } from '../services/backend'; 
import { Send, Bot, User, Radio, Wifi, ExternalLink, Search } from 'lucide-react';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load chat history on mount
  useEffect(() => {
    const loadChat = async () => {
      const history = await backend.pack.getHistory();
      setMessages(history);
    };
    loadChat();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const textToSend = input;
    setInput('');
    setLoading(true);

    // Optimistic update done inside backend service, but we need to update state to show it immediately
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);

    // Backend handles calling AI and saving history
    const newHistory = await backend.pack.sendMessage(textToSend);
    
    setMessages(newHistory);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-90px)] flex flex-col pt-8 px-4 md:px-0">
      
      {/* Comms Header */}
      <div className="glass-panel mx-4 md:mx-0 px-6 py-4 mb-6 rounded-xl flex items-center justify-between border border-wild-700 shadow-lg">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-wild-900 rounded-full flex items-center justify-center text-wild-accent border border-wild-800 relative">
                <Radio size={20} />
                <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-wild-900"></span>
            </div>
            <div>
                <h2 className="font-display text-xl text-wild-light tracking-wide uppercase font-bold">The Pack Channel</h2>
                <p className="text-[10px] text-wild-muted uppercase tracking-[0.2em] font-mono">Encrypted // Live</p>
            </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-wild-700">
            <Wifi size={18} />
            <span className="text-xs font-mono">SIGNAL: STRONG</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 mb-4 no-scrollbar px-4 md:px-0">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[95%] md:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 border ${msg.role === 'user' ? 'bg-wild-800 border-wild-700 ml-3 text-wild-muted' : 'bg-wild-accent border-wild-600 mr-3 text-wild-900'}`}>
                {msg.role === 'user' ? <User size={14} /> : <Bot size={16} />}
              </div>

              {/* Message Bubble */}
              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-4 rounded-lg shadow-lg relative text-sm leading-relaxed ${
                      msg.role === 'user' 
                      ? 'bg-wild-700 text-wild-light rounded-tr-none border border-wild-600' 
                      : 'bg-wild-800/80 text-wild-light rounded-tl-none border border-wild-700 backdrop-blur-sm'
                  }`}>
                    {msg.text}
                    
                    {/* Sources (if available) */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-wild-700/50">
                        <div className="flex items-center gap-1 text-[10px] text-wild-muted uppercase tracking-wider mb-2 font-bold">
                           <Search size={10} /> Verified Intel
                        </div>
                        <div className="flex flex-wrap gap-2">
                           {msg.sources.slice(0, 3).map((source, idx) => (
                             <a 
                               key={idx} 
                               href={source.uri} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="flex items-center gap-1 text-xs bg-wild-950/30 hover:bg-wild-700 px-2 py-1 rounded text-wild-400 hover:text-wild-light transition-colors border border-wild-800"
                             >
                               <span className="max-w-[150px] truncate">{source.title}</span>
                               <ExternalLink size={10} />
                             </a>
                           ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Timestamp */}
                  <span className="text-[10px] text-wild-700 font-mono mt-1 uppercase">
                      {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {loading && (
           <div className="flex justify-start">
             <div className="flex flex-row max-w-[70%]">
               <div className="w-8 h-8 rounded bg-wild-accent mr-3 flex items-center justify-center text-wild-900"><Bot size={16}/></div>
               <div className="p-4 rounded-lg bg-wild-800 border border-wild-700 flex items-center rounded-tl-none">
                 <span className="w-1.5 h-1.5 bg-wild-muted rounded-full animate-bounce mr-1"></span>
                 <span className="w-1.5 h-1.5 bg-wild-muted rounded-full animate-bounce mr-1 delay-75"></span>
                 <span className="w-1.5 h-1.5 bg-wild-muted rounded-full animate-bounce delay-150"></span>
               </div>
             </div>
           </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="pb-6 px-4 md:px-0">
        <div className="relative flex items-center group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Transmitting..."
            className="w-full bg-wild-900/80 border border-wild-700 text-wild-light p-4 pr-14 rounded-lg focus:border-wild-accent focus:outline-none shadow-xl font-mono text-sm transition-colors placeholder-wild-700"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="absolute right-2 p-2 text-wild-muted hover:text-wild-accent transition-colors disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
