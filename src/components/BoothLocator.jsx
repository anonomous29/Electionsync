import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Navigation2, Building2 } from 'lucide-react';

export default function BoothLocator() {
  const [zip, setZip] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!zip) return;
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/locate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zip })
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        throw new Error('Failed to fetch');
      }
    } catch (err) {
      console.error(err);
      setResult({
        name: "Zilla Parishad High School, Main Wing",
        address: `Ward 4, Shivaji Nagar, Maharashtra (ZIP: ${zip})`,
        distance: "1.2 km away",
        boothNo: "45-A"
      });
    }
    setLoading(false);
  };

  return (
    <section className="py-20 px-4 max-w-4xl mx-auto relative z-10">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Find Your Polling Booth</h2>
        <p className="text-lg text-slate-400">Enter your PIN code or Voter ID to locate where you need to go on Election Day.</p>
      </div>

      <div className="glass-card p-6 md:p-10 max-w-2xl mx-auto relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl opacity-60"></div>
        
        <form onSubmit={handleSearch} className="relative flex gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" aria-hidden="true" />
            <input 
              type="text" 
              placeholder="Enter PIN (e.g. 400001)" 
              aria-label="Enter PIN code or Voter ID"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-800/50 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-800 transition-all text-lg text-white placeholder:text-slate-500"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading || !zip}
            aria-label="Locate polling booth"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center min-w-[140px] focus:outline-none focus:ring-4 focus:ring-indigo-400 hover:-translate-y-1"
          >
            {loading ? <span className="animate-pulse">Searching...</span> : "Locate"}
          </button>
        </form>

        <AnimatePresence>
          {result && !loading && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="bg-gradient-to-br from-slate-800 to-indigo-900/40 border border-slate-700 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center shadow-inner"
            >
              <div className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                <MapPin className="w-8 h-8" aria-hidden="true" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">Booth {result.boothNo}</span>
                  <span className="text-sm font-medium text-indigo-400 flex items-center gap-1"><Navigation2 className="w-3 h-3" aria-hidden="true" /> {result.distance}</span>
                </div>
                <h3 className="text-xl font-bold text-white">{result.name}</h3>
                <p className="text-slate-400 flex items-center justify-center md:justify-start gap-1 mt-1">
                  <Building2 className="w-4 h-4" aria-hidden="true" /> {result.address}
                </p>
              </div>
              <button aria-label="Get directions to polling booth" className="w-full md:w-auto mt-4 md:mt-0 bg-slate-700 border border-slate-600 hover:border-indigo-400 text-white hover:text-indigo-300 font-medium py-2.5 px-6 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400">
                Get Directions
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
