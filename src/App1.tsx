import { useState } from 'react';
import { Search, Download, BookOpen, AlertCircle, Database, Book, Users, Sparkles, Mic, MicOff, PlayCircle, Headphones } from 'lucide-react';

// ============================================
// API SERVICE
// ============================================
const api = {
  searchGranth: async (query: string) => {
    try {
      // const targetUrl = `/api/search?q=${encodeURIComponent(query)}`;
      const targetUrl = `http://127.0.0.1:5000/search?q=${encodeURIComponent(query)}`; // Localhost
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
// COMPONENTS
// ============================================

const Header = () => (
  <div className="shadow-md sticky top-0 z-50">
    {/* TOP STRIP: White Background with Large Logo */}
    <div className="bg-white py-2 px-4">
      <div className="max-w-7xl mx-auto flex justify-center md:justify-start items-center">
        {/* LOGO: Large and Clear */}
        <div className="h-24 md:h-28 w-auto py-2">
          <img
            src="/logo.png"
            alt="VitragVani"
            className="h-full w-auto object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement!.innerText = 'VitragVani Logo';
            }}
          />
        </div>
      </div>
    </div>

    {/* NAVIGATION STRIP: The "Saffron" Orange Bar */}
    <div className="bg-saffron-500 text-white py-3 px-6 shadow-inner border-t border-orange-600">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h2 className="text-lg font-bold font-serif tracking-wide text-white drop-shadow-md">
          Smart Librarian Search
        </h2>
        <span className="text-xs uppercase tracking-widest text-orange-100 font-semibold hidden md:block">
          Jain Shastra Repository
        </span>
      </div>
    </div>
  </div>
);

const PravachanCard = ({ data }: any) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 animate-slide-up">
      <div className="bg-white rounded-lg shadow-md border-l-8 border-saffron-500 overflow-hidden flex flex-col md:flex-row">

        {/* Icon Section */}
        <div className="bg-saffron-100 p-6 flex flex-col justify-center items-center md:w-40 border-r border-saffron-200">
          <div className={`bg-white p-3 rounded-full shadow-sm mb-2 ${isPlaying ? 'animate-pulse' : ''}`}>
            <Headphones className="text-saffron-600 w-8 h-8" />
          </div>
          <span className="text-xs font-bold text-saffron-700 uppercase tracking-widest">Audio</span>
        </div>

        {/* Content Section */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-maroon-900 font-serif leading-tight">
                {data.shastra_name || data.title}
              </h3>
              <span className="bg-maroon-100 text-maroon-800 text-xs px-2 py-1 rounded font-bold">
                {data.language}
              </span>
            </div>

            <div className="mt-2 text-gray-600 text-sm space-y-1">
              <p><strong>Gatha:</strong> {data.gatha_no}</p>
              <p><strong>Date:</strong> {data.date_of_pravachan}</p>
              <p><strong>Duration:</strong> {data.duration}</p>
            </div>
          </div>

          {/* PLAYER LOGIC: If playing, show Audio Player. If not, show Button. */}
          <div className="mt-6">
            {isPlaying ? (
              <div className="animate-fade-in bg-saffron-50 p-3 rounded-lg border border-saffron-200">
                <audio controls className="w-full h-10" autoPlay>
                  <source src={data.audio_url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-saffron-700 font-bold animate-pulse">Playing Now...</span>
                  <button
                    onClick={() => setIsPlaying(false)}
                    className="text-xs text-red-500 hover:text-red-700 underline"
                  >
                    Close Player
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="flex-1 bg-saffron-500 hover:bg-saffron-600 text-white py-2 px-4 rounded-md shadow flex items-center justify-center gap-2 transition-all"
                >
                  <PlayCircle size={20} fill="white" className="text-saffron-500" />
                  <span className="font-bold">Play Pravachan</span>
                </button>

                {data.pdf_url && (
                  <a
                    href={data.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-maroon-700 hover:text-maroon-900 font-medium text-sm underline underline-offset-4"
                  >
                    View PDF
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultCard = ({ result }: any) => {
  const { type, data } = result;

  // --- LAYOUT 1: SPEEDY NOTE ---
  if (type === 'speedy_note' || type === 'note') {
    return (
      <div className="w-full max-w-7xl mx-auto mb-12 animate-slide-up">
        {/* Main Header Card */}
        <div className="bg-white rounded-lg shadow-lg border-l-8 border-saffron-500 p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-4xl font-serif font-bold text-maroon-900">{data.code}</h2>
            <p className="text-gray-500 text-sm tracking-widest uppercase font-bold mt-1">
              {data.book_ref} • Gatha {data.gatha_no}
            </p>
          </div>
          <div className="mt-2 md:mt-0 bg-saffron-100 text-saffron-500 px-4 py-1 rounded-full text-xs font-bold tracking-wider border border-saffron-500">
            SPEEDY NOTE
          </div>
        </div>

        {/* 4 Separate Blocks (Grid Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* 1. Gatha */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-maroon-600 flex flex-col h-96">
            <div className="bg-cream-100 p-4 border-b border-gray-100 text-center">
              <h3 className="text-maroon-800 font-bold text-lg">गाथा</h3>
            </div>
            <div className="p-6 overflow-y-auto flex-grow scrollbar-thin">
              <p className="text-lg font-bold text-red-700 font-serif leading-relaxed whitespace-pre-line text-center">
                {data.gatha || "---"}
              </p>
            </div>
          </div>
          {/* 2. Harigeet */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-maroon-600 flex flex-col h-96">
            <div className="bg-cream-100 p-4 border-b border-gray-100 text-center">
              <h3 className="text-maroon-800 font-bold text-lg">हरिगीत</h3>
            </div>
            <div className="p-6 overflow-y-auto flex-grow scrollbar-thin">
              <p className="text-lg text-green-700 font-serif leading-relaxed whitespace-pre-line text-center italic">
                {data.harigeet || "---"}
              </p>
            </div>
          </div>
          {/* 3. Gatharth */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-maroon-600 flex flex-col h-96">
            <div className="bg-cream-100 p-4 border-b border-gray-100 text-center">
              <h3 className="text-maroon-800 font-bold text-lg">गाथार्थ</h3>
            </div>
            <div className="p-6 overflow-y-auto flex-grow scrollbar-thin">
              <p className="text-lg text-gray-800 leading-relaxed text-justify">
                {data.gatha_arth || "---"}
              </p>
            </div>
          </div>
          {/* 4. Bhavarth */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-maroon-600 flex flex-col h-96">
            <div className="bg-cream-100 p-4 border-b border-gray-100 text-center">
              <h3 className="text-maroon-800 font-bold text-lg">भावार्थ</h3>
            </div>
            <div className="p-6 overflow-y-auto flex-grow scrollbar-thin">
              <p className="text-lg text-gray-800 leading-relaxed text-justify font-medium">
                {data.Bhav_arth || "---"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }


  // --- 2. AUDIO PRAVACHAN LAYOUT (CHANGE THIS PART) ---
  if (type === 'pravachan') {
    // 🔴 OLD CODE WAS HERE (Delete the big div block)
    // 🟢 NEW CODE (Use the component created above):
    return <PravachanCard data={data} />;
  }

  // --- LAYOUT 3: DEFAULT BOOK / GRANTH ---
  return (
    <div className="w-full max-w-3xl mx-auto mb-8 animate-slide-up">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden border-l-8 border-maroon-600 flex flex-col md:flex-row">
        {/* Book Icon */}
        <div className="bg-cream-100 p-8 flex flex-col justify-center items-center md:w-48 border-r border-gray-100">
          <Book className="text-maroon-700 w-16 h-16 mb-4" />
          <span className="text-xs font-bold text-maroon-800 uppercase tracking-wider">Granth</span>
        </div>

        {/* Content */}
        <div className="p-8 flex-1">
          <h2 className="text-3xl font-serif font-bold text-maroon-900 mb-2">{data.title}</h2>
          <p className="text-saffron-500 font-medium mb-4 italic flex items-center gap-2">
            <Users size={16} /> {data.author}
          </p>
          <p className="text-gray-700 leading-relaxed mb-6 font-serif">{data.description}</p>

          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            <div className="flex gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><BookOpen size={16} /> {data.pages} Pages</span>
            </div>

            <div className="flex gap-3">
              <a
                href={data.pdf_url}
                target="_blank"
                rel="noreferrer"
                className="bg-maroon-600 hover:bg-maroon-700 text-white px-4 py-2 rounded shadow-md transition-all flex items-center gap-2 font-medium"
              >
                <BookOpen size={18} /> Read
              </a>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  const link = document.createElement('a');
                  link.href = `${data.pdf_url}?download=true`;
                  link.setAttribute('download', data.title);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="bg-white border-2 border-maroon-600 text-maroon-600 hover:bg-maroon-50 px-4 py-2 rounded shadow-md transition-all flex items-center gap-2 font-medium"
              >
                <Download size={18} /> Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
    <div className="w-12 h-12 border-4 border-cream-200 border-t-maroon-600 rounded-full animate-spin mb-4"></div>
    <p className="text-maroon-800 font-serif text-lg">Searching Library...</p>
  </div>
);

const SearchBar = ({ onSearch, loading }: any) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  // --- VOICE SEARCH LOGIC ---
  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        onSearch(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert("Voice search is not supported in this browser. Please use Chrome or Edge.");
    }
  };

  return (
    <div className="py-10 px-4 text-center">
      <div className="relative z-10 max-w-2xl mx-auto">
        <h2 className="text-3xl font-serif text-maroon-900 mb-2 font-bold">
          Search the Divine Knowledge
        </h2>
        <p className="text-gray-600 mb-8 font-medium">
          Enter a Topic, Book Name, or Gatha Code
        </p>

        <div className="relative shadow-md rounded-lg flex items-center bg-white border border-gray-300 focus-within:ring-2 focus-within:ring-saffron-500 overflow-hidden">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Type or Speak... (e.g., "Samaysar")'
            className="flex-grow px-6 py-4 text-lg text-gray-800 font-serif outline-none bg-transparent placeholder-gray-400"
            onKeyPress={(e) => e.key === 'Enter' && onSearch(query)}
          />
          <div className="flex items-center pr-2 gap-2">
            <button
              onClick={startListening}
              className={`p-3 rounded-full transition-all duration-300 ${isListening
                ? 'bg-red-600 text-white animate-pulse shadow-red-300 shadow-lg'
                : 'text-gray-400 hover:text-maroon-700 hover:bg-gray-100'
                }`}
              title="Voice Search"
            >
              {isListening ? <MicOff size={22} /> : <Mic size={22} />}
            </button>
            <button
              onClick={() => onSearch(query)}
              disabled={loading || !query}
              className="bg-maroon-800 hover:bg-maroon-900 text-white p-3 rounded-md transition-colors"
            >
              <Search size={22} />
            </button>
          </div>
        </div>

        {isListening && (
          <p className="text-red-600 text-sm mt-2 font-bold animate-pulse">
            Listening... Speak now
          </p>
        )}
      </div>
    </div>
  );
};

// ============================================
// MAIN APP
// ============================================
const App = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState(false);
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    if (!query) return;
    setLoading(true);
    setResults([]);
    setError(false);
    setAiReasoning(null);

    try {
      const res = await api.searchGranth(query);
      if (res.status === 'success') {
        setResults(res.results);
        if (res.ai_logic) setAiReasoning(res.ai_logic);
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
        <SearchBar onSearch={handleSearch} loading={loading} />
        <div className="px-4 pb-20 pt-2">

          {aiReasoning && (
            <div className="max-w-4xl mx-auto mb-8 p-4 bg-white rounded-lg border-l-4 border-saffron-500 shadow-sm flex items-start gap-3 animate-fade-in">
              <Sparkles className="w-5 h-5 text-saffron-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  AI Librarian
                </p>
                <p className="text-maroon-900 font-medium italic">"{aiReasoning}"</p>
              </div>
            </div>
          )}

          {loading && <LoadingSpinner />}

          {results.map((item, index) => (
            <ResultCard key={index} result={item} />
          ))}

          {error && (
            <div className="max-w-xl mx-auto mt-12 text-center p-8 bg-white rounded-lg shadow-lg border-t-4 border-red-500 animate-fade-in">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Not Found</h3>
              <p className="text-gray-600">
                We couldn't find anything matching that. Try a different author or book name.
              </p>
            </div>
          )}

          {!loading && results.length === 0 && !error && (
            <div className="max-w-4xl mx-auto mt-8 text-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Search by Author", desc: "e.g. 'Kundkund'", icon: <Users className="text-maroon-600" /> },
                  { title: "Search by Book", desc: "e.g. 'Samaysar'", icon: <Database className="text-saffron-500" /> },
                  { title: "Speedy Notes", desc: "e.g. 'SS1'", icon: <Book className="text-maroon-800" /> },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded shadow-sm hover:shadow-md transition-shadow border-t-2 border-cream-200">
                    <div className="flex justify-center mb-4">{item.icon}</div>
                    <h3 className="font-bold text-maroon-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>
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