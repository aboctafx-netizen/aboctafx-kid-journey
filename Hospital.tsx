import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Stethoscope, Syringe, Bandage, Activity, Heart, AlertCircle } from 'lucide-react';

interface HospitalProps {
  onEarn: (amount: number) => void;
}

type PatientNeed = 'checkup' | 'injection' | 'bandage';

interface Patient {
  id: number;
  need: PatientNeed;
  timeLeft: number;
  status: 'waiting' | 'saved' | 'failed';
}

export const Hospital: React.FC<HospitalProps> = ({ onEarn }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [activeTool, setActiveTool] = useState<PatientNeed | null>(null);

  const spawnPatient = useCallback(() => {
    const needs: PatientNeed[] = ['checkup', 'injection', 'bandage'];
    const newPatient: Patient = {
      id: Date.now(),
      need: needs[Math.floor(Math.random() * needs.length)],
      timeLeft: 5,
      status: 'waiting',
    };
    setPatients(prev => [...prev.slice(-4), newPatient]);
  }, []);

  useEffect(() => {
    const interval = setInterval(spawnPatient, 3000);
    return () => clearInterval(interval);
  }, [spawnPatient]);

  useEffect(() => {
    const timer = setInterval(() => {
      setPatients(prev => 
        prev.map(p => {
          if (p.status === 'waiting' && p.timeLeft > 0) {
            return { ...p, timeLeft: p.timeLeft - 0.1 };
          }
          if (p.status === 'waiting' && p.timeLeft <= 0) {
            return { ...p, status: 'failed' };
          }
          return p;
        })
      );
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const handleTreat = (patientId: number, tool: PatientNeed) => {
    setPatients(prev => 
      prev.map(p => {
        if (p.id === patientId && p.status === 'waiting' && p.need === tool) {
          onEarn(10);
          return { ...p, status: 'saved' };
        }
        return p;
      })
    );
  };

  return (
    <div className="h-full flex flex-col p-6 bg-emerald-950/20 border-r border-emerald-500/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/50 animate-pulse-glow" />
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold text-emerald-400 neon-text-medical">DR. ANNABEL</h2>
          <p className="text-xs font-mono text-emerald-500/70 uppercase tracking-widest">Medical Wing • Level 1</p>
        </div>
        <Activity className="text-emerald-500 animate-pulse" size={32} />
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {patients.map(patient => (
            <motion.div
              key={patient.id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                patient.status === 'saved' ? 'bg-emerald-500/20 border-emerald-500' :
                patient.status === 'failed' ? 'bg-red-500/20 border-red-500' :
                'bg-black/40 border-emerald-500/30'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  patient.status === 'saved' ? 'bg-emerald-500 text-black' : 'bg-emerald-900/50 text-emerald-400'
                }`}>
                  <Heart size={24} fill={patient.status === 'saved' ? 'currentColor' : 'none'} />
                </div>
                <div>
                  <p className="font-display font-semibold">Patient #{patient.id.toString().slice(-4)}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-emerald-900/50 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full ${patient.timeLeft < 2 ? 'bg-red-500' : 'bg-emerald-500'}`}
                        animate={{ width: `${(patient.timeLeft / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {patient.status === 'waiting' && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleTreat(patient.id, 'checkup')}
                    className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 hover:text-black transition-all border border-emerald-500/50"
                  >
                    <Stethoscope size={20} />
                  </button>
                  <button 
                    onClick={() => handleTreat(patient.id, 'injection')}
                    className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 hover:text-black transition-all border border-emerald-500/50"
                  >
                    <Syringe size={20} />
                  </button>
                  <button 
                    onClick={() => handleTreat(patient.id, 'bandage')}
                    className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 hover:text-black transition-all border border-emerald-500/50"
                  >
                    <Bandage size={20} />
                  </button>
                </div>
              )}

              {patient.status === 'saved' && <span className="text-emerald-400 font-mono font-bold">+10 AB</span>}
              {patient.status === 'failed' && <AlertCircle className="text-red-500" />}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-6 p-4 rounded-xl bg-black/60 border border-emerald-500/20">
        <p className="italic text-emerald-400/80 text-sm">"Life is the priority here."</p>
      </div>
    </div>
  );
};
