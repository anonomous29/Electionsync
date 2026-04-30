import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, FileText, Trophy, Star, CheckCircle2 } from 'lucide-react';

const BADGES = [
  { id: 'id_verified', title: 'Identity Verified', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/20', border: 'border-emerald-500/50' },
  { id: 'booth_located', title: 'Booth Located', icon: MapPin, color: 'text-blue-400', bg: 'bg-blue-400/20', border: 'border-blue-500/50' },
  { id: 'policy_wonk', title: 'Policy Wonk', icon: FileText, color: 'text-purple-400', bg: 'bg-purple-400/20', border: 'border-purple-500/50' },
  { id: 'election_ready', title: 'Election Ready', icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-400/20', border: 'border-amber-500/50' }
];

export default function DemocracyBadges() {
  const [unlocked, setUnlocked] = useState(['id_verified']); // Start with one unlocked for demo

  const toggleBadge = (id) => {
    if (unlocked.includes(id)) {
      setUnlocked(unlocked.filter(b => b !== id));
    } else {
      setUnlocked([...unlocked, id]);
    }
  };

  const progress = (unlocked.length / BADGES.length) * 100;

  return (
    <section className="py-12 px-4 max-w-4xl mx-auto relative z-10">
      <div className="glass-card p-6 md:p-10 relative overflow-hidden border-indigo-500/20 shadow-[0_0_40px_rgba(79,70,229,0.1)]">
        {/* Progress Bar Background */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-800">
          <motion.div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 mb-8 mt-2">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0 border border-indigo-500/30 shadow-inner">
            <Star className="w-8 h-8 text-indigo-400" aria-hidden="true" />
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Your Civic Journey</h2>
            <p className="text-slate-400">Complete tasks to earn badges. <span className="text-indigo-400 text-sm font-semibold">(Click a badge to simulate unlocking it!)</span></p>
          </div>
          <div className="text-center md:text-right">
            <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
              {unlocked.length}/{BADGES.length}
            </span>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Badges Earned</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {BADGES.map((badge, idx) => {
            const isUnlocked = unlocked.includes(badge.id);
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => toggleBadge(badge.id)}
                className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col items-center text-center gap-3
                  ${isUnlocked ? `${badge.bg} ${badge.border} hover:shadow-lg hover:-translate-y-1` : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800'}
                `}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500
                  ${isUnlocked ? badge.color : 'bg-slate-700 text-slate-500 grayscale'}
                `}>
                  <Icon className="w-7 h-7" aria-hidden="true" />
                </div>
                <span className={`font-bold text-sm ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                  {badge.title}
                </span>
                
                {isUnlocked && (
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-lg shadow-indigo-500/50"
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
