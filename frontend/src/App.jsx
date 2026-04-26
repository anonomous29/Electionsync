import React from 'react';
import { useTranslation } from 'react-i18next';
import LiveAlerts from './components/LiveAlerts';
import SmartTimeline from './components/SmartTimeline';
import IDChecker from './components/IDChecker';
import VotingSimulator from './components/VotingSimulator';
import BoothLocator from './components/BoothLocator';
import CandidateComparer from './components/CandidateComparer';
import { Flag, ArrowRight, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col mesh-bg relative">
      <LiveAlerts />
      
      <header role="banner" className="bg-white/80 backdrop-blur-lg border-b border-white/40 sticky top-[48px] z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-civic-primary/10 p-2 rounded-lg">
               <Flag className="w-6 h-6 text-civic-primary" aria-hidden="true" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">Vote<span className="text-civic-primary">Wise</span></span>
          </div>
          <div className="flex items-center gap-6">
            <nav role="navigation" aria-label="Main Navigation" className="hidden md:flex gap-8 text-sm font-bold text-slate-600">
              <a href="#timeline" className="hover:text-civic-primary transition-colors">Journey</a>
              <a href="#locator" className="hover:text-civic-primary transition-colors">Locate</a>
              <a href="#comparer" className="hover:text-civic-primary transition-colors">Manifestos</a>
              <a href="#simulator" className="hover:text-civic-primary transition-colors">Simulator</a>
            </nav>
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <Globe className="w-4 h-4 text-slate-500" aria-hidden="true" />
              <select 
                onChange={changeLanguage} 
                defaultValue={i18n.language}
                aria-label="Select Language"
                className="bg-transparent text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="mr">मराठी</option>
                <option value="hi">हिंदी</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <main role="main" className="flex-1 relative">
        <div className="pt-24 pb-32 px-4 text-center relative z-10 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto relative"
          >
            <div className="inline-block bg-blue-100 text-blue-800 font-bold px-4 py-1.5 rounded-full text-sm mb-6 shadow-sm border border-blue-200">
              Your 2026 Maharashtra Election Guide
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tighter leading-tight">
              {t('heroTitlePrefix')}<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{t('heroTitleHighlight')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed mb-10">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <button aria-label="Start your journey" className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-full shadow-xl shadow-slate-900/20 transition-all flex items-center justify-center gap-2 text-lg focus:outline-none focus:ring-4 focus:ring-slate-400">
                 {t('startJourney')} <ArrowRight className="w-5 h-5" aria-hidden="true" />
               </button>
               <button aria-label="Find my booth" className="bg-white hover:bg-slate-50 text-slate-800 font-bold py-4 px-8 rounded-full shadow-lg border border-slate-200 transition-all text-lg focus:outline-none focus:ring-4 focus:ring-slate-300">
                 {t('findBooth')}
               </button>
            </div>
          </motion.div>
        </div>

        <div id="timeline"><SmartTimeline /></div>
        <div id="locator"><BoothLocator /></div>
        <div id="checker"><IDChecker /></div>
        <div id="comparer"><CandidateComparer /></div>
        <div id="simulator"><VotingSimulator /></div>
      </main>

      <footer role="contentinfo" className="bg-slate-900 text-slate-400 py-16 text-center text-sm border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
           <div className="flex items-center gap-2 mb-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
             <Flag className="w-8 h-8 text-white" aria-hidden="true" />
             <span className="text-3xl font-extrabold tracking-tight text-white">VoteWise</span>
           </div>
           <p className="text-slate-500 font-medium">&copy; 2026 VoteWise Civic Tech Initiative. A beautifully crafted mock application.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
