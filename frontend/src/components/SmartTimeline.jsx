import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

const steps = [
  { id: 1, title: 'Voter Registration', description: 'Register or update your details on the electoral roll.', date: 'Before Jan 2026', status: 'completed' },
  { id: 2, title: 'Final Voter List Published', description: 'Check your name in the final published lists.', date: 'Jan 2026', status: 'completed' },
  { id: 3, title: 'Candidate Nominations', description: 'Candidates file and withdraw their nominations.', date: 'Feb - Mar 2026', status: 'completed' },
  { id: 4, title: 'Voter Roll Updates', description: 'Supplementary additions for upcoming bye-elections.', date: 'Current Phase (Apr-May)', status: 'active' },
  { id: 5, title: 'Panchayat By-polls', description: 'Cast your vote in the local body bye-elections.', date: 'June 2026', status: 'upcoming' },
];

export default function SmartTimeline() {
  return (
    <section className="py-12 max-w-2xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-8 text-center text-slate-800">Your Election Journey</h2>
      <div className="relative border-l-2 border-slate-200 ml-6 md:ml-8">
        {steps.map((step, index) => (
          <motion.div 
            key={step.id}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`mb-10 ml-6 md:ml-8 relative ${step.status === 'active' ? 'scale-105 origin-left' : ''}`}
          >
            <span className="absolute -left-[41px] md:-left-[49px] flex items-center justify-center w-8 h-8 rounded-full bg-white ring-4 ring-white shadow-sm">
              {step.status === 'completed' && <CheckCircle2 className="w-6 h-6 text-civic-accent" />}
              {step.status === 'active' && <Clock className="w-6 h-6 text-civic-primary animate-pulse" />}
              {step.status === 'upcoming' && <Circle className="w-6 h-6 text-slate-300" />}
            </span>
            <div className={`p-5 rounded-xl shadow-sm border ${step.status === 'active' ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100'}`}>
              <span className={`text-xs font-bold uppercase tracking-wider mb-1 block ${step.status === 'active' ? 'text-civic-primary' : 'text-slate-500'}`}>
                {step.date}
              </span>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{step.title}</h3>
              <p className="text-slate-600 text-sm">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
