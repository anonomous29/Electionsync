import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Navigation2, Building2 } from 'lucide-react';

export default function BoothLocator() {
  const [zip, setZip] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!zip) return;
    setLoading(true);
    setTimeout(() => {
      setResult({
        name: "Zilla Parishad High School, Main Wing",
        address: "Ward 4, Shivaji Nagar, Maharashtra",
        distance: "1.2 km away",
        boothNo: "45-A"
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <section className="py-20 px-4 max-w-4xl mx-auto relative z-10">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">Find Your Polling Booth</h2>
        <p className="text-lg text-slate-600">Enter your PIN code or Voter ID to locate where you need to go on Election Day.</p>
      </div>

      <div className="glass-card p-6 md:p-10 max-w-2xl mx-auto relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
        
        <form onSubmit={handleSearch} className="relative flex gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Enter PIN (e.g. 400001)" 
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-civic-primary focus:bg-white transition-all text-lg"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading || !zip}
            className="bg-civic-primary hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center min-w-[140px]"
          >
            {loading ? <span className="animate-pulse">Searching...</span> : "Locate"}
          </button>
        </form>

        <AnimatePresence>
          {result && !loading && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center shadow-inner"
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                <MapPin className="w-8 h-8" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">Booth {result.boothNo}</span>
                  <span className="text-sm font-medium text-blue-600 flex items-center gap-1"><Navigation2 className="w-3 h-3" /> {result.distance}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800">{result.name}</h3>
                <p className="text-slate-600 flex items-center justify-center md:justify-start gap-1 mt-1">
                  <Building2 className="w-4 h-4" /> {result.address}
                </p>
              </div>
              <button className="w-full md:w-auto mt-4 md:mt-0 bg-white border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-600 font-medium py-2.5 px-6 rounded-xl shadow-sm transition-all">
                Get Directions
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
