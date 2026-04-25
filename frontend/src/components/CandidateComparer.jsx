import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, HeartPulse, GraduationCap, CheckCircle2, Sparkles, Send, Bot, User } from 'lucide-react';

const MANIFESTOS = [
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
  const [activeTopic, setActiveTopic] = useState('infra');
  const [query, setQuery] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatLog, isTyping]);

  const handleAskAI = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setChatLog(prev => [...prev, { sender: 'user', text: query }]);
    setQuery('');
    setIsTyping(true);

    setTimeout(() => {
      setChatLog(prev => [...prev, { 
        sender: 'ai', 
        text: "Based on the manifestos: Aditi Sharma emphasizes physical infrastructure like metro lines. Rajesh Patil focuses on green energy. Sunita Deshmukh prioritizes public parks and tree planting. Choose based on whether you prefer transit, energy, or green spaces!"
      }]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <section className="py-20 px-4 max-w-6xl mx-auto relative z-10">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">Compare Manifestos</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">Vote on issues, not just faces. See where each candidate stands on the topics that matter most to you.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {TOPICS.map(topic => {
          const Icon = topic.icon;
          const isActive = activeTopic === topic.id;
          return (
            <button
              key={topic.id}
              onClick={() => setActiveTopic(topic.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${isActive ? 'bg-slate-800 text-white shadow-lg scale-105' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
            >
              <Icon className="w-5 h-5" />
              {topic.label}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {MANIFESTOS.map((candidate, idx) => (
          <motion.div 
            key={candidate.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="glass-card flex flex-col h-full hover:-translate-y-2 transition-transform duration-300 relative overflow-visible"
          >
            <div className={`h-2 ${candidate.color} w-full`}></div>
            <div className="p-6 md:p-8 flex-1 flex flex-col relative z-10">
              <h3 className="text-2xl font-bold text-slate-800 mb-1">{candidate.name}</h3>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-6">{candidate.party}</p>
              
              <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 flex-1 relative overflow-hidden group shadow-inner">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                   {activeTopic === 'infra' && <Scale className="w-32 h-32" />}
                   {activeTopic === 'health' && <HeartPulse className="w-32 h-32" />}
                   {activeTopic === 'edu' && <GraduationCap className="w-32 h-32" />}
                </div>
                <div className="flex items-start gap-4 relative z-10">
                  <CheckCircle2 className={`w-7 h-7 flex-shrink-0 mt-0.5 ${candidate.id === 1 ? 'text-orange-500' : candidate.id === 2 ? 'text-blue-500' : 'text-green-500'}`} />
                  <p className="text-slate-700 text-lg leading-relaxed font-medium">
                    {candidate.promises[activeTopic]}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Assistant Section */}
      <div className="max-w-3xl mx-auto glass-card p-6 border-indigo-100 shadow-[0_8px_30px_rgba(79,70,229,0.1)]">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-4">
          <Sparkles className="w-6 h-6 text-indigo-500" />
          <h3 className="text-xl font-bold text-slate-800">Ask the AI Assistant</h3>
        </div>
        
        <div className="h-48 overflow-y-auto mb-4 pr-2 space-y-4">
          {chatLog.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Bot className="w-12 h-12 mb-2 opacity-50" />
              <p>Ask a question like "Who is best for the environment?"</p>
            </div>
          )}
          {chatLog.map((msg, idx) => (
            <div key={idx} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'}`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-3 rounded-2xl max-w-[80%] ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-700 rounded-tl-none'}`}>
                <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-100 rounded-tl-none flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleAskAI} className="relative">
          <input 
            type="text" 
            placeholder="Ask about the candidates..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-full py-3 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={!query.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </section>
  );
}
