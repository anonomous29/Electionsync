import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CANDIDATES = [
  { id: 1, name: 'Aditi Sharma', party: 'Progressive Civic Party', symbol: '🌻' },
  { id: 2, name: 'Rajesh Patil', party: 'United Dev. Front', symbol: '⚖️' },
  { id: 3, name: 'Sunita Deshmukh', party: 'Green Future Alliance', symbol: '🌳' },
  { id: 4, name: 'NOTA', party: 'None of the Above', symbol: '❌' }
];

export default function VotingSimulator() {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showVVPAT, setShowVVPAT] = useState(false);

  const handleVote = (id) => {
    if (hasVoted) return;
    setSelectedCandidate(id);
    setTimeout(() => {
      setHasVoted(true);
      setTimeout(() => setShowVVPAT(true), 500);
    }, 1000); 
  };

  const reset = () => {
    setHasVoted(false);
    setSelectedCandidate(null);
    setShowVVPAT(false);
  };

  const votedCandidateData = CANDIDATES.find(c => c.id === selectedCandidate);

  return (
    <section className="py-20 px-4 max-w-5xl mx-auto mb-20 relative z-10 flex flex-col md:flex-row gap-10 items-center justify-center">
      <div className="flex-1 w-full max-w-md">
        <div className="text-center md:text-left mb-8">
          <h2 className="text-4xl font-extrabold text-slate-800 mb-2 tracking-tight">EVM Simulator</h2>
          <p className="text-lg text-slate-600">Familiarize yourself with the voting machine. Your vote is secret.</p>
        </div>

        <div className="bg-slate-100 p-6 rounded-3xl border-[8px] border-slate-300 shadow-2xl relative overflow-hidden">
          <AnimatePresence>
            {hasVoted && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                  <span className="text-4xl">✅</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Vote Recorded</h3>
                <p className="text-slate-500 mt-2 font-medium">BEEEEEP!</p>
                <button onClick={reset} className="mt-8 bg-slate-800 text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-slate-700 transition-all">Simulate Again</button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3 relative z-10">
            {CANDIDATES.map((candidate) => (
              <div key={candidate.id} className="flex items-center bg-white rounded-xl border border-slate-200 p-3 shadow-sm hover:border-blue-300 transition-colors">
                <div className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded text-xl mr-4 border border-slate-200 shadow-inner">
                  {candidate.symbol}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 text-lg leading-tight">{candidate.name}</h4>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">{candidate.party}</p>
                </div>
                <div className="ml-4 flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${selectedCandidate === candidate.id ? 'bg-red-500 border-red-600 shadow-[0_0_12px_rgba(239,68,68,0.9)]' : 'bg-slate-200 border-slate-300'}`}></div>
                  <button 
                    onClick={() => handleVote(candidate.id)}
                    disabled={hasVoted || selectedCandidate !== null}
                    aria-label={`Vote for ${candidate.name}`}
                    className="w-14 h-10 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded shadow-md active:translate-y-1 active:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* VVPAT Machine Section */}
      <div className="w-full md:w-64 flex flex-col items-center">
        <h3 className="text-xl font-bold text-slate-800 mb-4 opacity-0 md:opacity-100">VVPAT Simulator</h3>
        <div className="w-48 h-64 bg-slate-800 rounded-t-xl border-4 border-slate-900 relative shadow-2xl overflow-hidden flex flex-col">
           {/* Glass window */}
           <div className="flex-1 m-4 bg-black/50 border-2 border-slate-700 rounded relative overflow-hidden">
             <AnimatePresence>
                {showVVPAT && votedCandidateData && (
                  <motion.div 
                    initial={{ y: -150 }}
                    animate={{ y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute top-2 left-2 right-2 bg-white/95 p-3 shadow-inner border border-slate-300 flex flex-col items-center"
                  >
                    <span className="text-4xl mb-2">{votedCandidateData.symbol}</span>
                    <span className="text-sm font-extrabold text-black text-center leading-tight">{votedCandidateData.name}</span>
                    <span className="text-[10px] text-slate-600 text-center uppercase mt-1 font-bold">{votedCandidateData.party}</span>
                  </motion.div>
                )}
             </AnimatePresence>
           </div>
           <div className="h-12 bg-slate-900 flex items-center justify-center">
              <span className="text-slate-500 text-xs tracking-widest font-bold">PRINTER</span>
           </div>
        </div>
        <div className="w-56 h-12 bg-slate-700 rounded-b-2xl border-t border-slate-600 shadow-xl"></div>
      </div>
    </section>
  );
}
