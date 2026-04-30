import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Loader2 } from 'lucide-react';

export default function SmartTimeline() {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/timeline`)
      .then(res => res.json())
      .then(data => {
        setSteps(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching timeline', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex justify-center py-12" aria-live="polite"><Loader2 className="w-8 h-8 animate-spin text-civic-primary" aria-label="Loading timeline" /></div>;
  }

  return (
    <section className="py-12 max-w-2xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-8 text-center text-white">Your Election Journey</h2>
      <div className="relative border-l-2 border-slate-700 ml-6 md:ml-8">
        {steps.map((step, index) => (
          <motion.div 
            key={step.id}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`mb-10 ml-6 md:ml-8 relative ${step.status === 'active' ? 'scale-105 origin-left' : ''}`}
          >
            <span className="absolute -left-[41px] md:-left-[49px] flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 ring-4 ring-slate-900 shadow-sm">
              {step.status === 'completed' && <CheckCircle2 className="w-6 h-6 text-civic-accent" aria-hidden="true" />}
              {step.status === 'active' && <Clock className="w-6 h-6 text-indigo-400 animate-pulse" aria-hidden="true" />}
              {step.status === 'upcoming' && <Circle className="w-6 h-6 text-slate-600" aria-hidden="true" />}
            </span>
            <div className={`p-5 rounded-xl shadow-sm border transition-all hover:-translate-y-1 ${step.status === 'active' ? 'bg-indigo-900/40 border-indigo-700/50 shadow-indigo-500/10' : 'bg-slate-800 border-slate-700'}`}>
              <span className={`text-xs font-bold uppercase tracking-wider mb-1 block ${step.status === 'active' ? 'text-indigo-400' : 'text-slate-500'}`}>
                {step.date}
              </span>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-slate-400 text-sm">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
