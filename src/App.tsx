import { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './login';
import { 
  Search, Mic, MicOff, Headphones, Clock, 
  FileText, History, X, ExternalLink, Facebook, Youtube, Send, Instagram, LogOut
} from 'lucide-react';

const Header = ({ user, onLogout }: { user: { first_name: string; last_name: string } | null, onLogout: () => void }) => {
  const navigate = useNavigate();
  return (
  <header className="w-full font-sans">
    {/* Top Golden Section with Image de88e2.png */}
    <div className="relative bg-gradient-to-r from-[#f8c14d] via-[#fde59a] to-[#ffffff] border-b border-[#d4a017]/30 min-h-[140px] flex items-center">
      <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
        
        {/* Top Utility: Languages and Socials */}
        <div className="flex justify-end items-center gap-4 text-[12px] font-bold text-[#6b4423] mb-2">

          <div className="flex gap-2 items-center">
            <span className="cursor-pointer hover:text-black">ગુજરાતી</span>
            <span className="opacity-40">|</span>
            <span className="cursor-pointer hover:text-black">हिंदी</span>
            <span className="opacity-40">|</span>
            <span className="cursor-pointer hover:text-black border-b border-[#6b4423]">English</span>
          </div>
          <div className="flex gap-1.5 ml-4">
            {[Facebook, Youtube, Send, Instagram].map((Icon, i) => (
              <div key={i} className="border border-[#b48a2a] p-1 rounded hover:bg-[#b48a2a] hover:text-white transition-all cursor-pointer">
                <Icon size={14} />
              </div>
            ))}
          </div>
        </div>

        {/* Branding & Portrait Area */}
        {/* Branding & Portrait Area */}
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col items-start">
            <img src="/logo.png" alt="VitragVani Logo" className="h-16 object-contain" />
            <h1 className="text-4xl font-serif text-[#b48a2a] tracking-tighter mt-[-4px]">Vitragvani</h1>
          </div>

          {/* NEW LARGER WELCOME AREA */}
          <div className="flex-1 flex justify-center">
            {user ? (
              <div className="flex flex-col items-center gap-1">
                <div className="bg-white/50 px-6 py-2 rounded-full border border-[#d4a017]/20 shadow-sm animate-fade-in">
                  <h2 className="text-2xl font-serif text-[#5E1914] italic">
                    Welcome, <span className="font-bold not-italic text-[#F29221]">{user.first_name}</span>
                  </h2>
                </div>
                
                {/* Logout Link */}
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-[#5E1914] hover:text-red-600 transition-colors mt-1"
                >
                  <LogOut size={12} /> Logout Session
                </button>
              </div>
            ) : (
                <button 
                  onClick={() => navigate('/login')} 
                  className="bg-[#5E1914] text-[#F29221] px-8 py-2 rounded-md font-bold text-lg border-2 border-[#F29221] hover:bg-[#F29221] hover:text-white transition-all shadow-lg"
                >
                  JOIN THE LIBRARY
                </button>
            )}
          </div>

          <div className="flex flex-col items-end text-[#6b4423] text-[11px] font-bold uppercase gap-1 pr-32 lg:pr-48">
             <div className="flex items-center gap-2">
                <span className="flex items-center gap-1"><Clock size={12}/> Mumbai</span>
                <span className="opacity-40">|</span>
                <span className="flex items-center gap-1">☀️ 7:08 AM Sunrise</span>
                <span className="opacity-40">|</span>
                <span className="flex items-center gap-1">☀️ 6:28 PM Sunset</span>
             </div>
             <div className="flex items-center gap-2 mt-1 opacity-80">
                <span>📅 Thurs, Feb 5, 2026</span>
                <span className="opacity-40">|</span>
                <span>📅 Vikram Samvat 2082 (Veer Samvat 2552), Mahaa Vad 4</span>
             </div>
          </div>
        </div>
      </div>

      {/* Gurudevshree Portrait (image_de88e2.png) */}
      <div className="absolute right-0 bottom-0 h-full overflow-hidden hidden md:block">
        <img 
          src="/header.png" 
          alt="Gurudevshree Kanjiswami" 
          className="h-full object-contain object-right opacity-90 mix-blend-multiply" 
        />
      </div>
    </div>

    {/* Navigation Bar: Exactly like the reference image */}
    <nav className="bg-gradient-to-b from-[#f2d385] to-[#e9c46a] text-[#6b4423] shadow-md border-y border-[#d4a017]/50">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center items-center font-bold text-[11px] lg:text-[12px] uppercase tracking-wide">
        {[
          'Pujya Gurudevshree', 'Pujya Bahenshree', 'Shastra Bhandar', 
          'Life Sketch', 'Archive', 'Tirth Darshan', 'Bhakti Geet', 'Tithi Calendar'
        ].map((item, idx) => (
          <div key={item} className="flex items-center">
            <button className="px-4 lg:px-6 py-3.5 hover:text-white hover:bg-[#6b4423]/10 transition-colors">
               {item === 'Tithi Calendar' ? <span className="flex items-center gap-1">📅 {item}</span> : item}
            </button>
            {idx !== 7 && <span className="text-[#b48a2a] opacity-30">|</span>}
          </div>
        ))}
        <button className="p-3.5 hover:text-white transition-all"><Search size={16}/></button>
      </div>
    </nav>
  </header>
  );
};

const Footer = () => (
  <footer className="mt-20 border-t border-gray-200 bg-white">
    {/* Links Grid */}
    <div className="max-w-7xl mx-auto px-4 py-12">
       <h3 className="text-[#6b4423] font-bold text-xl mb-8 border-b-2 border-[#e9c46a] inline-block pb-1">Our Other Websites</h3>
       <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {[
            { name: 'Vitragvani App', desc: 'A Repository of pravachans, shastras, and more.' },
            { name: 'Gurukahan Art Museum', desc: 'Showcases spiritual and cultural heritage.' },
            { name: 'Vitrag e-library', desc: 'Collection of e-books, Audios, and Magazines.' },
            { name: 'JEEV Academy', desc: 'Jain English Education and Values platform.' }
          ].map((site) => (
            <div key={site.name} className="group cursor-pointer">
              <h4 className="font-bold text-[#b48a2a] flex items-center gap-1 group-hover:text-[#6b4423]">
                {site.name} <ExternalLink size={12}/>
              </h4>
              <p className="text-[12px] text-gray-500 mt-2 leading-relaxed">{site.desc}</p>
            </div>
          ))}
       </div>
    </div>
    
    {/* Copyright Strip */}
    <div className="bg-[#6b4423] text-[#e9c46a] py-5">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-[11px] font-bold uppercase tracking-wider">
        <p>© Copyright. Shree Kundkund-Kahan Parmarthik Trust. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0 opacity-80">
          <span className="hover:text-white cursor-pointer">Home</span>
          <span>|</span>
          <span className="hover:text-white cursor-pointer">About Us</span>
          <span>|</span>
          <span className="hover:text-white cursor-pointer">Contact Us</span>
          <span>|</span>
          <span className="hover:text-white cursor-pointer">Sitemap</span>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  const navigate = useNavigate();
  // Simulate user state (null = guest, object = logged in)
  const [user, setUser] = useState<{ first_name: string; last_name: string } | null>(null);

  useEffect(() => {
    // Check if a user is logged in when the app starts
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user from local storage", e);
      }
    }
  }, []);

  const handleLogout = () => {
    // 1. Remove user data from browser storage
    localStorage.removeItem('user');
    
    // 2. Clear the app state so the UI updates immediately
    setUser(null);
    
    // 3. Redirect to the home/normal view
    navigate('/');
    
    // 4. Optional: Force a refresh to ensure all components reset
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#fffdfa]">
      <Routes>
        {/* Main Librarian Search Page */}
        <Route path="/" element={
          <>
            <Header user={user} onLogout={handleLogout} />
            <main className="max-w-4xl mx-auto py-24 px-4 text-center">
              <h2 className="text-4xl font-serif text-[#6b4423] mb-8 font-bold tracking-tight">Smart Librarian Search</h2>
              <div className="relative shadow-2xl rounded-full flex items-center bg-white border-2 border-[#e9c46a] p-1.5 focus-within:border-[#6b4423] transition-all">
                <input 
                  type="text" 
                  placeholder="Search Shastra (e.g., Samaysar Gatha 39)" 
                  className="flex-grow px-8 py-3 outline-none text-lg rounded-full font-serif"
                />
                <div className="flex items-center gap-3 pr-3">
                  <Mic size={24} className="text-gray-300 cursor-pointer hover:text-[#b48a2a]" />
                  <button className="bg-[#6b4423] p-3.5 rounded-full text-white hover:bg-black shadow-lg">
                    <Search size={20} />
                  </button>
                </div>
              </div>
            </main>
            <Footer />
          </>
        } />

        {/* Login Page Route */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}
