import React, { useEffect, useState } from 'react';
import { AlertCircle, Calendar, Megaphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LiveAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/deadlines`)
      .then(res => res.json())
      .then(data => {
        setAlerts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching alerts', err);
        // Fallback data if backend is not running
        setAlerts([
          { id: 1, date: "May 4, 2026", title: "Bye-Election Vote Counting (Rahuri & Baramati)", type: "warning" },
          { id: 2, date: "May 15, 2026", title: "Voter Roll Update Deadline", type: "info" },
          { id: 3, date: "June 1, 2026", title: "Panchayat By-polls Registration", type: "action" }
        ]);
        setLoading(false);
      });
  }, []);

  if (loading || alerts.length === 0) return null;

  return (
    <div className="bg-civic-dark text-white py-3 px-4 shadow-md sticky top-0 z-50" aria-label="Live Election Alerts">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-bold text-civic-accent">
          <Megaphone className="w-5 h-5 animate-pulse" aria-hidden="true" />
          <span>LIVE ALERTS:</span>
        </div>
        <div className="flex-1 w-full overflow-hidden relative h-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={alerts[0].id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 text-sm font-medium absolute w-full"
              role="alert"
              aria-live="polite"
            >
              <Calendar className="w-4 h-4 text-white" aria-hidden="true" />
              <span className="text-white font-bold bg-civic-accent/20 px-2 py-0.5 rounded">{alerts[0].date}:</span>
              <span className="truncate text-white">{alerts[0].title}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
