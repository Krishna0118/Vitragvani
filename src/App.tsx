import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Cpu, FileWarning, LogOut, Plus, 
  ExternalLink, Headphones, Video, BookOpen 
} from 'lucide-react';

// --- Interfaces for TypeScript Safety ---
interface User {
  first_name: string;
  last_name: string;
}

interface ChatData {
  // Mapping columns from your 5 different SQL tables (supporting PascalCase and camelCase)
  FilePath?: string;
  FullName?: string;
  GathaNoBolNo?: string;
  Adhikar?: string;
  Hindi?: string;
  GujFile?: string;
  Rachayita?: string;
  hindi?: string;
  gujarati?: string;
  shastra?: string;
  gatha?: string;
  ShastraName?: string;
  shastra_name?: string;
  file_path?: string;
  hindi_pdf?: string;
}

interface Message {
  role: 'user' | 'bot';
  text: string;
  data?: ChatData;
  res_type?: 'audio' | 'video' | 'book' | 'text';
}

export default function App() {
  const [user, setUser] = useState<User | null>({ first_name: "Krishna", last_name: "" });
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Jai Jinendra! I am your Vitragvani guide. I can help you find Shastras, Pravachans, or explain concepts from the database.' }
  ]);
  const [loading, setLoading] = useState(false);
  const [playgroundUrl, setPlaygroundUrl] = useState<string | null>(null);
  const [playgroundTitle, setPlaygroundTitle] = useState('Knowledge Playground');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Helper to extract the correct link based on resource type (Case-Agnostic)
const getMediaLink = (data: ChatData) => {
  return (
    data.FilePath ||     // behenshree & gurudevshree
    data.Hindi ||        // shastra
    data.GujFile ||      // shastra
    data.hindi ||        // vidropravachans
    data.gujarati        // vidropravachans
  );
};

  const updatePlayground = (data: ChatData, type?: string) => {
    const link = getMediaLink(data);
    if (!link) return;

    let finalUrl = link;
    // Handle YouTube formatting
    if (link.includes('youtube.com/watch')) {
      finalUrl = link.replace('watch?v=', 'embed/') + "?autoplay=1";
    } else if (link.includes('youtu.be/')) {
      finalUrl = link.replace('youtu.be/', 'youtube.com/embed/') + "?autoplay=1";
    }

    setPlaygroundUrl(finalUrl);
    setPlaygroundTitle(
      type === 'book' ? 'Shastra Viewer' : 
      type === 'video' ? 'Video Pravachan' : 
      type === 'audio' ? 'Audio Player' : 'Media Viewer'
    );
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    const userMsg: Message = { role: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setQuery('');

    try {
      const res = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });
      const result = await res.json();

      const botMsg: Message = {
        role: 'bot',
        text: result.response,
        data: result.data,
        res_type: result.res_type
      };

      setMessages(prev => [...prev, botMsg]);

      // Automatically update Playground if a valid data link exists
      if (result.data) {
        updatePlayground(result.data, result.res_type);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Connection error. Please ensure the Flask server is running." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#fcfbf5] overflow-hidden font-sans text-gray-900">
      
      {/* --- Header --- */}
      <header className="h-20 bg-gradient-to-r from-[#f8c14d] to-[#fff] border-b flex items-center px-6 justify-between flex-shrink-0 shadow-sm z-20">
        <div className="flex flex-col">
          <h1 className="text-2xl font-serif text-[#b48a2a] font-bold tracking-tighter">Vitragvani</h1>
          <span className="text-[10px] uppercase font-bold text-[#6b4423] tracking-widest">Smart Librarian</span>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-[#6b4423]">Jai Jinendra, {user.first_name}</span>
            <button onClick={() => setUser(null)} className="text-red-700 flex items-center gap-1 text-xs font-bold hover:underline">
              <LogOut size={14}/> Logout
            </button>
          </div>
        )}
      </header>

      {/* --- Main Body --- */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* 1. Sidebar: History */}
        <aside className="w-64 bg-white border-r flex flex-col hidden lg:flex flex-shrink-0">
          <div className="p-4 border-b flex justify-between items-center font-bold text-[#6b4423]">
            <span>Recent Chats</span>
            <Plus size={18} className="cursor-pointer hover:text-red-600 transition-colors" onClick={() => setMessages([])}/>
          </div>
          <div className="flex-1 p-4 text-xs text-gray-400 italic">Chat session history...</div>
        </aside>

        {/* 2. Center: Chat Section */}
        <section className="flex-1 flex flex-col bg-[#f8f9fa] border-r relative min-w-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                <div className={`max-w-[85%] flex flex-col gap-2 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  
                  {/* Chat Bubble */}
                  <div className={`p-4 rounded-2xl text-sm shadow-sm leading-relaxed ${
                    m.role === 'user' 
                    ? 'bg-[#9e0606] text-white rounded-tr-none shadow-md' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                  }`}>
                    {m.text}
                  </div>

                  {/* Result Card: Logic to display database record */}
                  {m.data && (
                    <div className="w-full bg-white border border-[#d1a334]/30 rounded-xl p-4 shadow-md mt-1">
                      <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-[#fcfbf5] rounded-lg">
                          {m.res_type === 'audio' && <Headphones size={18} className="text-blue-600" />}
                          {m.res_type === 'video' && <Video size={18} className="text-red-600" />}
                          {m.res_type === 'book' && <BookOpen size={18} className="text-green-600" />}
                        </div>
                        <span className="text-[10px] font-bold uppercase py-1 px-2 bg-gray-100 rounded text-gray-500">
                          {m.res_type} Found
                        </span>
                      </div>
                      
                      <h4 className="font-serif font-bold text-[#6b4423] mb-1 leading-tight text-base">
                        {m.data.ShastraName || m.data.shastra_name || m.data.shastra || "Resource Details"}
                      </h4>
                      
                      <p className="text-[11px] text-gray-500 mb-3 italic">
                        {m.data.FullName || m.data.Rachayita || "Source: Vitragvani Library"}
                      </p>

                      <div className="bg-gray-50 p-2 rounded text-[11px] mb-4 flex justify-between items-center">
                        <div>
                          <span className="text-gray-400 uppercase text-[9px] block font-bold">Gatha / Bol</span>
                          <span className="font-bold">{m.data.GathaNoBolNo || m.data.gatha || 'N/A'}</span>
                        </div>
                        {m.data.Adhikar && (
                          <div className="text-right">
                            <span className="text-gray-400 uppercase text-[9px] block font-bold">Adhikar</span>
                            <span className="font-bold">{m.data.Adhikar}</span>
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={() => m.data && updatePlayground(m.data, m.res_type)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#9e0606] text-white rounded-lg text-xs font-bold hover:bg-black transition-all shadow-sm active:scale-95"
                      >
                        <ExternalLink size={14} /> Open in Playground
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center text-gray-400 text-xs italic animate-pulse">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                </div>
                Librarian is searching the archives...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-30">
            <div className="max-w-4xl mx-auto flex gap-2 items-center bg-gray-50 border rounded-full px-4 py-1 focus-within:border-[#d1a334] focus-within:bg-white transition-all shadow-inner">
              <input 
                className="flex-1 bg-transparent py-3 outline-none text-sm text-gray-700" 
                placeholder="Ask Jai Jinendra, explain Samaysar, or find a Gatha..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                onClick={handleSearch} 
                disabled={loading}
                className="bg-[#9e0606] text-white p-2.5 rounded-full hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-md"
              >
                <Send size={18} fill="currentColor"/>
              </button>
            </div>
          </div>
        </section>

        {/* 3. Right: Playground */}
        <section className="flex-1 bg-[#1a1a1a] flex flex-col hidden md:flex">
          <div className="h-12 bg-white border-b px-4 flex items-center justify-between shadow-sm z-10 flex-shrink-0">
            <div className="flex items-center text-xs font-bold uppercase tracking-widest text-[#5E1914]">
              <Cpu size={16} className="mr-2 text-[#d1a334]"/> {playgroundTitle}
            </div>
            <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
            </div>
          </div>
          <div className="flex-1 relative">
            {playgroundUrl ? (
              <iframe 
                src={playgroundUrl} 
                className="w-full h-full border-none bg-white" 
                title="Media Viewer" 
                allow="autoplay; fullscreen"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-white/30 text-center p-12">
                <div className="p-6 rounded-full bg-white/5 mb-6 border border-white/10 shadow-inner">
                  <FileWarning size={48} strokeWidth={1.5} />
                </div>
                <h4 className="font-serif text-xl text-white/60 mb-2 font-bold tracking-tight uppercase">Media Playground</h4>
                <p className="text-sm max-w-xs leading-relaxed italic opacity-80">
                  Search for content in the chat to view the original PDF, Video, or Audio here.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}