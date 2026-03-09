import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scale, Gavel, FileText, ShieldCheck, MessageSquare, AlertTriangle } from 'lucide-react';

interface CourtroomProps {
  onEarn: (amount: number) => void;
}

interface Case {
  id: number;
  statement: string;
  correctAction: 'objection' | 'evidence' | 'closing';
  timeLeft: number;
  status: 'waiting' | 'won' | 'lost';
}

const CASE_PROMPTS = [
  { statement: "The witness is lying about the time!", action: 'objection' },
  { statement: "We need to show the security footage.", action: 'evidence' },
  { statement: "It's time to convince the jury.", action: 'closing' },
  { statement: "Hearsay! That's not allowed.", action: 'objection' },
  { statement: "The fingerprint report is ready.", action: 'evidence' },
];

export const Courtroom: React.FC<CourtroomProps> = ({ onEarn }) => {
  const [cases, setCases] = useState<Case[]>([]);

  const spawnCase = useCallback(() => {
    const prompt = CASE_PROMPTS[Math.floor(Math.random() * CASE_PROMPTS.length)];
    const newCase: Case = {
      id: Date.now(),
      statement: prompt.statement,
      correctAction: prompt.action as any,
      timeLeft: 4,
      status: 'waiting',
    };
    setCases(prev => [...prev.slice(-4), newCase]);
  }, []);

  useEffect(() => {
    const interval = setInterval(spawnCase, 4000);
    return () => clearInterval(interval);
  }, [spawnCase]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCases(prev => 
        prev.map(c => {
          if (c.status === 'waiting' && c.timeLeft > 0) {
            return { ...c, timeLeft: c.timeLeft - 0.1 };
          }
          if (c.status === 'waiting' && c.timeLeft <= 0) {
            return { ...c, status: 'lost' };
          }
          return c;
        })
      );
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const handleAction = (caseId: number, action: string) => {
    setCases(prev => 
      prev.map(c => {
        if (c.id === caseId && c.status === 'waiting' && c.correctAction === action) {
          onEarn(15);
          return { ...c, status: 'won' };
        }
        return c;
      })
    );
  };

  return (
    <div className="h-full flex flex-col p-6 bg-blue-950/20 border-l border-blue-500/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-1 bg-blue-500/50 animate-pulse-glow" />
      
      <div className="flex items-center justify-between mb-8">
        <Scale className="text-blue-500 animate-pulse" size={32} />
        <div className="text-right">
          <h2 className="text-3xl font-display font-bold text-blue-400 neon-text-justice">MIRABEL, ESQ.</h2>
          <p className="text-xs font-mono text-blue-500/70 uppercase tracking-widest">Justice Hall • Chamber 7</p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pl-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {cases.map(c => (
            <motion.div
              key={c.id}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`p-4 rounded-xl border flex flex-col gap-3 transition-colors ${
                c.status === 'won' ? 'bg-blue-500/20 border-blue-500' :
                c.status === 'lost' ? 'bg-red-500/20 border-red-500' :
                'bg-black/40 border-blue-500/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    c.status === 'won' ? 'bg-blue-500 text-black' : 'bg-blue-900/50 text-blue-400'
                  }`}>
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-mono text-blue-400/60">CASE #{c.id.toString().slice(-4)}</p>
                    <p className="font-display font-medium text-lg leading-tight">{c.statement}</p>
                  </div>
                </div>
                {c.status === 'won' && <span className="text-blue-400 font-mono font-bold">+15 AB</span>}
                {c.status === 'lost' && <AlertTriangle className="text-red-500" />}
              </div>

              {c.status === 'waiting' && (
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => handleAction(c.id, 'objection')}
                    className="flex-1 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500 hover:text-black transition-all border border-blue-500/50 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-tighter"
                  >
                    <Gavel size={14} /> Objection
                  </button>
                  <button 
                    onClick={() => handleAction(c.id, 'evidence')}
                    className="flex-1 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500 hover:text-black transition-all border border-blue-500/50 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-tighter"
                  >
                    <FileText size={14} /> Evidence
                  </button>
                  <button 
                    onClick={() => handleAction(c.id, 'closing')}
                    className="flex-1 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500 hover:text-black transition-all border border-blue-500/50 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-tighter"
                  >
                    <ShieldCheck size={14} /> Closing
                  </button>
                </div>
              )}

              {c.status === 'waiting' && (
                <div className="w-full h-1 bg-blue-900/50 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-blue-500"
                    animate={{ width: `${(c.timeLeft / 4) * 100}%` }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-6 p-4 rounded-xl bg-black/60 border border-blue-500/20 text-right">
        <p className="italic text-blue-400/80 text-sm">"The innocent must be set free."</p>
      </div>
    </div>
  );
};
