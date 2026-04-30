import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, HeartPulse, GraduationCap, CheckCircle2, Sparkles, Send, Bot, User, FileText, Loader2, Link } from 'lucide-react';
import { GeminiService } from '../services/GeminiService';

const INITIAL_MANIFESTOS = [
  {
    id: 1, name: 'Aditi Sharma', party: 'Progressive Civic Party', color: 'bg-orange-500',
    promises: {
      infra: 'Build 5 new metro lines and repair all potholes by 2027.',
      health: 'Setup 50 free Mohalla clinics in Ward 4.',
      edu: 'Free laptops for top 10% students in public schools.'
    }
  },
  {
    id: 2, name: 'Rajesh Patil', party: 'United Dev. Front', color: 'bg-blue-500',
    promises: {
      infra: 'Focus on green energy and solar panels on public buildings.',
      health: 'Increase budget for main District Hospital by 40%.',
      edu: 'Upgrade school sports facilities.'
    }
  },
  {
    id: 3, name: 'Sunita Deshmukh', party: 'Green Future Alliance', color: 'bg-green-500',
    promises: {
      infra: 'Plant 1 million trees and create 10 new public parks.',
      health: 'Subsidized health insurance for low-income families.',
      edu: 'Introduce coding and AI curriculum from 6th grade.'
    }
  }
];

const TOPICS = [
  { id: 'infra', label: 'Infrastructure', icon: Scale },
  { id: 'health', label: 'Healthcare', icon: HeartPulse },
  { id: 'edu', label: 'Education', icon: GraduationCap }
];

export default function CandidateComparer() {
  const [candidates, setCandidates] = useState(INITIAL_MANIFESTOS);
  const [activeTopic, setActiveTopic] = useState('infra');
  
  const [query, setQuery] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const [partyAUrl, setPartyAUrl] = useState('');
  const [partyBUrl, setPartyBUrl] = useState('');
  const [isDecoding, setIsDecoding] = useState(false);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatLog, isTyping]);

  const handleDecode = async (e) => {
    e.preventDefault();
    if (!partyAUrl || !partyBUrl) return;
    setIsDecoding(true);
    
    try {
      const data = await GeminiService.decodeManifesto(partyAUrl, partyBUrl);
      
      if (data && !data.error) {
         const newCandidates = [
           {
             id: 101, name: data.partyA_name || 'Party A', party: 'Custom AI Analysis', color: 'bg-indigo-500',
             promises: { infra: data.infra?.partyA || '-', health: data.health?.partyA || '-', edu: data.edu?.partyA || '-' }
           },
           {
             id: 102, name: data.partyB_name || 'Party B', party: 'Custom AI Analysis', color: 'bg-emerald-500',
             promises: { infra: data.infra?.partyB || '-', health: data.health?.partyB || '-', edu: data.edu?.partyB || '-' }
           }
         ];
         setCandidates(newCandidates);
      } else {
         alert("AI decoding failed: " + (data.error || "Unknown error"));
      }
    } catch {
       alert("Failed to connect to backend decoding API.");
    } finally {
      setIsDecoding(false);
    }
  };

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setChatLog(prev => [...prev, { sender: 'user', text: query }]);
    setQuery('');
    setIsTyping(true);

    try {
      const data = await GeminiService.askAI(query);
      
      if (data && data.answer) {
        setChatLog(prev => [...prev, { sender: 'ai', text: data.answer }]);
      } else {
        setChatLog(prev => [...prev, { sender: 'ai', text: "Sorry, the AI is currently unavailable." }]);
      }
    } catch {
      setChatLog(prev => [...prev, { sender: 'ai', text: "Failed to connect to the AI service." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <section className="py-20 px-4 max-w-6xl mx-auto relative z-10">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">AI Manifesto Decoder</h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">Compare pre-loaded candidates or paste links to any manifesto to have Gemini 1.5 extract their stances instantly.</p>
      </div>

      <div className="glass-card p-6 md:p-8 mb-12 border-indigo-500/20 shadow-[0_0_30px_rgba(79,70,229,0.1)] relative z-20">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-700 pb-4">
          <FileText className="w-6 h-6 text-indigo-400" />
          <h3 className="text-xl font-bold text-white">Upload Manifestos for AI Analysis</h3>
        </div>
        <form onSubmit={handleDecode} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Party A (Text Summary or URL)</label>
            <div className="relative">
              <Link className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
              <input type="text" required value={partyAUrl} onChange={(e) => setPartyAUrl(e.target.value)} className="w-full bg-slate-800/50 border border-slate-600 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. https://party-a.org/manifesto.pdf" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Party B (Text Summary or URL)</label>
            <div className="relative">
              <Link className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
              <input type="text" required value={partyBUrl} onChange={(e) => setPartyBUrl(e.target.value)} className="w-full bg-slate-800/50 border border-slate-600 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. https://party-b.org/manifesto.pdf" />
            </div>
          </div>
          <div className="md:col-span-2 flex justify-end mt-2 items-center">
            {candidates !== INITIAL_MANIFESTOS && (
               <button type="button" onClick={() => setCandidates(INITIAL_MANIFESTOS)} className="mr-4 px-6 py-3 text-slate-400 hover:text-white transition-colors font-medium">Reset Default</button>
            )}
            <button type="submit" disabled={isDecoding || !partyAUrl || !partyBUrl} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all disabled:opacity-50">
              {isDecoding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {isDecoding ? 'Decoding via Gemini...' : 'Decode & Compare'}
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {TOPICS.map(topic => {
          const Icon = topic.icon;
          const isActive = activeTopic === topic.id;
          return (
            <button
              key={topic.id}
              onClick={() => setActiveTopic(topic.id)}
              aria-pressed={isActive}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500 ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 scale-105' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-white'}`}
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
              {topic.label}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 justify-center">
        <AnimatePresence>
          {candidates.map((candidate, idx) => (
            <motion.div 
              key={candidate.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="glass-card flex flex-col h-full hover:-translate-y-2 transition-transform duration-300 relative overflow-visible bg-slate-800/80"
            >
              <div className={`h-2 ${candidate.color} w-full`}></div>
              <div className="p-6 md:p-8 flex-1 flex flex-col relative z-10">
                <h3 className="text-2xl font-bold text-white mb-1">{candidate.name}</h3>
                <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-6">{candidate.party}</p>
                
                <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700 flex-1 relative overflow-hidden group shadow-inner">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                     {activeTopic === 'infra' && <Scale className="w-32 h-32" aria-hidden="true" />}
                     {activeTopic === 'health' && <HeartPulse className="w-32 h-32" aria-hidden="true" />}
                     {activeTopic === 'edu' && <GraduationCap className="w-32 h-32" aria-hidden="true" />}
                  </div>
                  <div className="flex items-start gap-4 relative z-10">
                    <CheckCircle2 className={`w-7 h-7 flex-shrink-0 mt-0.5 text-indigo-400`} aria-hidden="true" />
                    <p className="text-slate-300 text-lg leading-relaxed font-medium">
                      {candidate.promises[activeTopic]}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="max-w-3xl mx-auto glass-card p-6 border-indigo-500/20 shadow-[0_0_30px_rgba(79,70,229,0.1)]">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-4">
          <Sparkles className="w-6 h-6 text-indigo-400" aria-hidden="true" />
          <h3 className="text-xl font-bold text-white">Ask the AI Assistant</h3>
        </div>
        
        <div className="h-48 overflow-y-auto mb-4 pr-2 space-y-4">
          {chatLog.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <Bot className="w-12 h-12 mb-2 opacity-50" aria-hidden="true" />
              <p>Ask a question like "Who is best for the environment?"</p>
            </div>
          )}
          {chatLog.map((msg, idx) => (
            <div key={idx} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700 text-slate-300'}`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" aria-hidden="true" /> : <Bot className="w-4 h-4" aria-hidden="true" />}
              </div>
              <div className={`p-3 rounded-2xl max-w-[80%] ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-800 border border-slate-700 text-slate-300 rounded-tl-none'}`}>
                <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 rounded-tl-none flex gap-1">
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleAskAI} className="relative">
          <input 
            type="text" 
            placeholder="Ask about the candidates..." 
            aria-label="Ask the AI about the candidates"
            className="w-full bg-slate-800/50 border border-slate-600 rounded-full py-3 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-400 transition-colors"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={!query.trim() || isTyping}
            aria-label="Send message to AI"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <Send className="w-4 h-4 ml-0.5" aria-hidden="true" />
          </button>
        </form>
      </div>
    </section>
  );
}
