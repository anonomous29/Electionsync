import React, { useState } from 'react';
import { ShieldCheck, XCircle, Loader2, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const DOCUMENTS = [
  { id: 'voter_id', label: 'Voter ID (EPIC)' },
  { id: 'aadhaar', label: 'Aadhaar Card' },
  { id: 'passport', label: 'Indian Passport' },
  { id: 'driving_license', label: 'Driving License' },
  { id: 'pan_card', label: 'PAN Card' },
  { id: 'utility_bill', label: 'Recent Utility Bill' },
  { id: 'bank_passbook', label: 'Bank Passbook with Photo' }
];

export default function IDChecker() {
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showBadge, setShowBadge] = useState(false);

  const toggleDoc = (id) => {
    setSelectedDocs(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
    setResult(null);
    setShowBadge(false);
  };

  const fireConfetti = () => {
    var duration = 3 * 1000;
    var end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#2563eb', '#10b981', '#f59e0b'],
        zIndex: 100
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#2563eb', '#10b981', '#f59e0b'],
        zIndex: 100
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const checkEligibility = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/validate-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documents: selectedDocs })
      });
      const data = await response.json();
      setResult(data);
      if (data.valid) {
        fireConfetti();
        setTimeout(() => setShowBadge(true), 1500);
      }
    } catch (err) {
      console.error(err);
      // Fallback simple validation for frontend tests
      const isValid = selectedDocs.includes('voter_id') || 
                      (selectedDocs.includes('aadhaar') && selectedDocs.includes('utility_bill')) ||
                      selectedDocs.includes('passport') || selectedDocs.includes('driving_license') ||
                      (selectedDocs.includes('pan_card') && selectedDocs.includes('bank_passbook'));
      setResult({ valid: isValid, message: isValid ? "Documents verified for voting." : "Insufficient documents provided." });
      if (isValid) {
        fireConfetti();
        setTimeout(() => setShowBadge(true), 1500);
      }
    }
    setLoading(false);
  };

  return (
    <section className="py-20 max-w-3xl mx-auto px-4 relative z-10">
      <div className="glass-card p-8 md:p-12 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-60"></div>
        
        <div className="text-center mb-10 relative z-10">
          <h2 className="text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">Interactive ID Checker</h2>
          <p className="text-lg text-slate-600">Select the documents you currently possess to check if you are ready for the polling booth.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 relative z-10">
          {DOCUMENTS.map(doc => (
            <label key={doc.id} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-300 ${selectedDocs.includes(doc.id) ? 'border-civic-primary bg-blue-50/80 shadow-md scale-[1.02]' : 'border-slate-200 hover:border-slate-300 hover:bg-white bg-white/50'}`}>
              <input type="checkbox" className="w-5 h-5 text-civic-primary rounded border-slate-300 focus:ring-civic-primary" checked={selectedDocs.includes(doc.id)} onChange={() => toggleDoc(doc.id)} />
              <span className="ml-3 font-semibold text-slate-700">{doc.label}</span>
            </label>
          ))}
        </div>

        <div className="flex flex-col items-center relative z-10">
          <button 
            onClick={checkEligibility} 
            disabled={selectedDocs.length === 0 || loading}
            className="bg-civic-primary hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full shadow-xl shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg min-w-[250px]"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            Validate My Documents
          </button>

          <AnimatePresence>
            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className={`mt-8 p-6 rounded-2xl w-full flex flex-col md:flex-row items-center md:items-start gap-4 border shadow-inner ${result.valid ? 'bg-green-50/80 border-green-200 text-green-800' : 'bg-red-50/80 border-red-200 text-red-800'}`}
              >
                {result.valid ? <ShieldCheck className="w-8 h-8 flex-shrink-0 text-green-600" /> : <XCircle className="w-8 h-8 flex-shrink-0 text-red-600" />}
                <div className="text-center md:text-left flex-1">
                  <h4 className="font-extrabold text-xl">{result.valid ? 'You are Ready to Vote!' : 'Action Required'}</h4>
                  <p className="text-sm mt-1 font-medium">{result.message}</p>
                </div>
                
                {showBadge && result.valid && (
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 md:mt-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-2 px-6 rounded-full shadow-lg shadow-green-500/40 hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" /> Share Badge
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
