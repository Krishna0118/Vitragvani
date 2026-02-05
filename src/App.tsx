import { useState, useEffect, useRef } from 'react';
import { 
  Search, Download, BookOpen, AlertCircle, Book, Users, 
  Sparkles, Mic, MicOff, Headphones, Clock, 
  FileText, HelpCircle, MessageCircle, History, X 
} from 'lucide-react';

// ============================================
// API SERVICE
// ============================================
const api = {
  searchGranth: async (query: string) => {
    try {
      const targetUrl = `http://127.0.0.1:5000/search?q=${encodeURIComponent(query)}`;
      const response = await fetch(targetUrl);
      const rawText = await response.text();
      if (!response.ok) return { status: 'failed', message: `Server Error ${response.status}` };
      return JSON.parse(rawText);
    } catch (error) {
      console.error("⚠️ Connection Error:", error);
      return { status: 'failed', message: "Could not connect to backend" };
    }
  }
};

// ============================================
// UI COMPONENTS
// ============================================

const Header = () => (
  <div className="shadow-md sticky top-0 z-50">
    <div className="bg-white py-2 px-4">
      <div className="max-w-7xl mx-auto flex justify-center md:justify-start items-center">
        <div className="h-24 md:h-28 w-auto py-2">
          <img src="/logo.png" alt="VitragVani" className="h-full w-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
      </div>
    </div>
    <div className="bg-saffron-500 text-white py-3 px-6 shadow-inner border-t border-orange-600">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h2 className="text-lg font-bold font-serif tracking-wide text-white drop-shadow-md">Smart Librarian Search</h2>
      </div>
    </div>
  </div>
);

const ResultCard = ({ result }: any) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { type, data } = result;

  // --- DATA MAPPING: Connecting New DB Columns to your Original UI Keys ---
  const displayTitle = data.shastra_name || data.ShastraName || data.shastraname || data.Shastra || data.full_name || data.title || "Untitled";
  const displayGatha = data.gatha_no_bol_no || data.gatha || data.Gatha || data.gatha_no;
  const displayAuthor = data.rachayita || data.rachaita || data.author || "Gurudevshree Kanjiswami";
  const displayPdf = data.file_path || data.guj_video_pdf || data.hindi_pdf || data.pdf_url || data.File;
  const displayAudio = data.file_path || data.audio_url || (type === 'pravachan' ? data.File : null);
  const displayVideo = data.videl_subtitle || data.Gujarati || data.Hindi;

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 animate-slide-up">
      <div className="bg-white rounded-lg shadow-md border-l-8 border-saffron-500 overflow-hidden flex flex-col">
        
        <div className="flex flex-col md:flex-row">
          {/* Left Visual Indicator */}
          <div className="bg-orange-50 p-4 md:w-32 flex flex-col justify-center items-center border-r border-orange-100">
            <div className={`p-3 rounded-full bg-white shadow-sm ${isPlaying ? 'animate-pulse text-orange-600' : 'text-orange-400'}`}>
               {type === 'video' ? <Sparkles size={32} /> : type === 'book' ? <Book size={32} /> : <Headphones size={32} />}
            </div>
            <span className="text-[10px] font-bold text-orange-800 uppercase tracking-widest mt-2">{type}</span>
          </div>

          {/* Content Details */}
          <div className="p-5 flex-1">
            <div className="flex justify-between items-start mb-2 gap-2">
              <h3 className="text-xl font-bold text-maroon-900 font-serif leading-tight">
                {displayTitle}
              </h3>
              {displayGatha && (
                <div className="bg-saffron-500 text-white px-3 py-1 rounded shadow-sm text-xs font-bold whitespace-nowrap">
                  Gatha: {displayGatha}
                </div>
              )}
            </div>

            {/* Metadata Row */}
            <div className="flex flex-wrap gap-2 mb-4">
              {data.month && (
                <div className="flex items-center gap-1 text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  <Clock size={12} /> {data.month} {data.tithi && `(${data.tithi})`}
                </div>
              )}
              {displayAuthor && (
                <div className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-100 uppercase">
                  <Users size={12} /> {displayAuthor}
                </div>
              )}
              {(data.adhikar || data.Subject) && (
                <div className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded">
                  {data.adhikar || data.Subject}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {displayPdf && (
                <a href={displayPdf} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-bold text-maroon-700 hover:text-maroon-900 underline">
                  <FileText size={14} /> View Shastra PDF
                </a>
              )}
              {displayVideo && (
                <a href={displayVideo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 underline">
                  <Sparkles size={14} /> Watch Video
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Audio Player Footer */}
        {displayAudio && type === 'pravachan' && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            {isPlaying ? (
              <div className="animate-fade-in">
                <audio controls className="w-full h-10" autoPlay>
                  <source src={displayAudio} type="audio/mpeg" />
                </audio>
                <div className="flex justify-end mt-2">
                  <button onClick={() => setIsPlaying(false)} className="text-[10px] text-red-500 font-bold uppercase hover:underline">Close Player</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setIsPlaying(true)} className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-10 rounded-md shadow-md flex items-center gap-3 transition-all active:scale-95 w-full md:w-fit justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="font-bold text-lg uppercase tracking-tighter">Listen Now</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const NoResultsCard = ({ category }: { category: string }) => (
  <div className="max-w-2xl mx-auto mt-12 text-center p-8 bg-white rounded-lg shadow-lg border-t-4 border-orange-400 animate-fade-in">
    <div className="bg-maroon-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><Clock className="w-8 h-8 text-maroon-700" /></div>
    <h3 className="text-2xl font-bold text-maroon-900 mb-2 font-serif">Result Not Found</h3>
    <p className="text-gray-700">We are currently updating our database for <span className="font-bold text-maroon-700">{category}</span>.</p>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
    <div className="w-12 h-12 border-4 border-cream-200 border-t-maroon-600 rounded-full animate-spin mb-4"></div>
    <p className="text-maroon-800 font-serif text-lg">Searching Library...</p>
  </div>
);

const SearchBar = ({ onSearch, loading, recentSearches, onClearHistory, onRemoveItem }: any) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice search not supported.");
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setQuery(transcript);
      onSearch(transcript);
    };
    recognition.start();
  };

  return (
    <div className="py-10 px-4 text-center">
      <div ref={containerRef} className="relative z-10 max-w-2xl mx-auto">
        <h2 className="text-3xl font-serif text-maroon-900 mb-2 font-bold">Search the Divine Knowledge</h2>
        <div className="h-6 mb-4">
          <p className="text-sm font-bold text-saffron-600 animate-pulse">
            {isListening ? "Listening..." : "Search for Shastra, Gatha, or Month"}
          </p>
        </div>

        <div className="relative shadow-md rounded-lg flex items-center bg-white border border-gray-300 focus-within:ring-2 focus-within:ring-saffron-500 overflow-visible">
          <input 
            type="text" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => recentSearches.length > 0 && setShowHistory(true)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch(query)}
            placeholder='Search Shastra (e.g., Samaysar Gatha 39)' 
            className="flex-grow px-6 py-4 text-lg text-gray-800 font-serif outline-none bg-transparent" 
          />

          <div className="flex items-center pr-2 gap-2">
            <button onClick={startListening} className={`p-3 rounded-full ${isListening ? 'bg-red-600 text-white animate-pulse' : 'text-gray-400 hover:text-maroon-700'}`}>
              {isListening ? <MicOff size={22} /> : <Mic size={22} />}
            </button>
            <button onClick={() => onSearch(query)} className="bg-maroon-800 hover:bg-maroon-900 text-white p-3 rounded-md transition-colors"><Search size={22} /></button>
          </div>

          {showHistory && (
            <div className="absolute top-full left-0 w-full bg-white shadow-2xl rounded-b-lg border border-gray-200 z-50 mt-1 overflow-hidden animate-slide-up text-left">
              <div className="bg-gray-50 px-4 py-2 flex justify-between items-center border-b">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><History size={12}/> Recent Searches</span>
                <button onClick={onClearHistory} className="text-[10px] text-red-500 hover:underline font-bold">Clear All</button>
              </div>
              {recentSearches.map((item: string, idx: number) => (
                <div key={idx} className="flex items-center justify-between hover:bg-gray-50 border-b border-gray-50 last:border-0">
                  <button onClick={() => { setQuery(item); onSearch(item); setShowHistory(false); }} className="flex-1 text-left px-6 py-3 text-sm text-maroon-900 font-medium">{item}</button>
                  <button onClick={() => onRemoveItem(item)} className="p-3 text-gray-300 hover:text-red-500"><X size={14}/></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState(false);
  const [aiReasoning, setAiReasoning] = useState<any | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('vitragvani_history');
    return saved ? JSON.parse(saved) : [];
  });

  const handleSearch = async (query: string) => {
    if (!query) return;
    setLoading(true);
    setError(false);
    setResults([]);
    setAiReasoning(null);

    try {
      const res = await api.searchGranth(query);
      if (res.status === 'success') {
        setResults(res.results);
        setAiReasoning(res.ai_logic);
        const updatedHistory = [query, ...recentSearches.filter(q => q !== query)].slice(0, 5);
        setRecentSearches(updatedHistory);
        localStorage.setItem('vitragvani_history', JSON.stringify(updatedHistory));
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 font-serif flex flex-col">
      <Header />
      <main className="flex-grow">
        <SearchBar 
          onSearch={handleSearch} 
          loading={loading} 
          recentSearches={recentSearches} 
          onClearHistory={() => setRecentSearches([])}
          onRemoveItem={(item: any) => setRecentSearches(recentSearches.filter(q => q !== item))}
        />
        <div className="px-4 pb-20 pt-2">
          {aiReasoning && (
            <div className="max-w-3xl mx-auto mb-8 p-4 bg-white rounded border-l-4 border-saffron-500 shadow-sm flex items-center gap-3 animate-fade-in">
              <Sparkles className="w-5 h-5 text-saffron-500 flex-shrink-0" />
              <p className="text-sm italic text-gray-600">AI Librarian searching for: <strong>{aiReasoning.title}</strong></p>
            </div>
          )}
          {loading && <LoadingSpinner />}
          {results.map((item, index) => (<ResultCard key={index} result={item} />))}
          {!loading && results.length === 0 && aiReasoning && (<NoResultsCard category={aiReasoning.category} />)}
          {error && (
            <div className="max-w-xl mx-auto mt-12 text-center p-8 bg-white rounded-lg shadow-lg border-t-4 border-red-500">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Connection Error</h3>
              <p className="text-gray-600">Please make sure the Backend Server is running.</p>
            </div>
          )}
        </div>
      </main>
      <footer className="bg-maroon-900 text-white py-8 text-center border-t-4 border-saffron-500">
        <p className="text-sm">© 2026 VitragVani Smart Librarian</p>
      </footer>
    </div>
  );
};

export default App;