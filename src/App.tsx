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



// ... imports stay the same ...

const ResultCard = ({ item }: { item: any }) => {
  const type = item.res_type;
  
  // Mapping titles and gatha numbers which differ across tables
  const title = item.shastra_name || item.shastraname || "Untitled";
  const gatha = item.gatha_no_bol_no || item['Gatha No/Bol No'] || null;
  
  // Videos often store YouTube links in 'hindi' or 'gujarati' columns
  const link = item.hindi || item.gujarati || item.file_path || item.hindi_pdf_path;

  const getIcon = () => {
    switch(type) {
      case 'audio': return <Headphones className="text-blue-600" />;
      case 'book': return <FileText className="text-red-600" />;
      case 'video': return <Youtube className="text-green-600" />;
      default: return <Search className="text-gray-400" />;
    }
  };

  return (
    <div className="bg-white border border-[#e9c46a]/30 p-5 rounded-xl shadow-sm hover:shadow-md transition-all text-left flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <div className="p-2 bg-[#fde59a]/20 rounded-lg">{getIcon()}</div>
        <span className="text-[10px] font-bold uppercase bg-gray-100 px-2 py-1 rounded tracking-wider text-gray-500">
          {type}
        </span>
      </div>
      
      <div className="flex-grow">
        <h3 className="font-serif text-lg text-[#6b4423] font-bold leading-tight mb-2">
          {title}
        </h3>
        <div className="text-sm text-gray-600 space-y-1 mb-4">
          <p><strong>Rachayita:</strong> {item.rachaita || item.rachayita || "Pujya Gurudevshree"}</p>
          {gatha && <p><strong>Gatha/Bol:</strong> {gatha}</p>}
          {item.pravachan_date && <p><strong>Date:</strong> {item.pravachan_date}</p>}
        </div>
      </div>

      {link && (
        <a 
          href={link} 
          target="_blank" 
          rel="noreferrer" 
          className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-bold text-white transition-colors ${
            type === 'video' ? 'bg-green-700 hover:bg-green-800' : 'bg-[#6b4423] hover:bg-black'
          }`}
        >
          {type === 'video' ? 'Watch Video' : type === 'audio' ? 'Listen Audio' : 'Read Book'} 
          <ExternalLink size={14} />
        </a>
      )}
    </div>
  );
};

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ first_name: string; last_name: string } | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#fffdfa]">
      <Routes>
        <Route path="/" element={
          <>
            <Header user={user} onLogout={handleLogout} />
            <main className="max-w-6xl mx-auto py-16 px-4">
              <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="text-4xl font-serif text-[#6b4423] mb-8 font-bold">Smart Librarian Search</h2>
                <div className="relative shadow-2xl rounded-full flex items-center bg-white border-2 border-[#e9c46a] p-1.5 focus-within:border-[#6b4423] transition-all">
                  <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search Shastra (e.g., Behenshree Pravachan)" 
                    className="flex-grow px-8 py-3 outline-none text-lg rounded-full font-serif"
                  />
                  <button onClick={handleSearch} className="bg-[#6b4423] p-3.5 rounded-full text-white hover:bg-black transition-all">
                    {loading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : <Search size={20} />}
                  </button>
                </div>
              </div>

              {/* Grid of Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((item, idx) => <ResultCard key={idx} item={item} />)}
              </div>
            </main>
            <Footer />
          </>
        } />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}
