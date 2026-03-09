import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Coins, Zap, Trophy, Info } from 'lucide-react';
import { Hospital } from './components/Hospital';
import { Courtroom } from './components/Courtroom';

export default function App() {
  const [abOctafx, setAbOctafx] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  const handleEarn = (amount: number) => {
    setAbOctafx(prev => prev + amount);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#050505] font-sans text-white overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-black/40 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Zap className="text-white" size={24} fill="currentColor" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-xl tracking-tight">AbOctafx <span className="text-emerald-400">Kid</span> Journey</h1>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">Medicine & Justice Simulation</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <Coins className="text-yellow-400" size={20} />
            <motion.span 
              key={abOctafx}
              initial={{ scale: 1.2, color: '#fbbf24' }}
              animate={{ scale: 1, color: '#fff' }}
              className="font-mono font-bold text-lg"
            >
              {abOctafx.toLocaleString()} <span className="text-xs text-white/40 ml-1">AB</span>
            </motion.span>
          </div>
          
          <button 
            onClick={() => setShowIntro(true)}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors"
          >
            <Info size={18} />
          </button>
        </div>
      </header>

      {/* Main Split Screen Area */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="flex-1 h-full">
          <Hospital onEarn={handleEarn} />
        </div>
        <div className="flex-1 h-full">
          <Courtroom onEarn={handleEarn} />
        </div>
      </main>

      {/* Intro Modal */}
      {showIntro && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="max-w-2xl w-full bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-3xl flex items-center justify-center rotate-3">
                <Trophy className="text-white" size={40} />
              </div>
            </div>
            
            <h2 className="text-4xl font-display font-extrabold text-center mb-4">Master the Journey</h2>
            <p className="text-white/60 text-center mb-8 leading-relaxed">
              Welcome to the split-screen world of Medicine and Justice. Balance your duties as Dr. Annabel and Mirabel, Esq. to earn <span className="text-white font-bold">AbOctafx</span> and become a master of both worlds.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <h3 className="font-display font-bold text-emerald-400 mb-2">Hospital Wing</h3>
                <p className="text-xs text-white/50">Stabilize patients by using the correct tools before time runs out. "Life is the priority here."</p>
              </div>
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                <h3 className="font-display font-bold text-blue-400 mb-2">Justice Hall</h3>
                <p className="text-xs text-white/50">Win trials by reacting to witness statements with objections and evidence. "The innocent must be set free."</p>
              </div>
            </div>

            <button 
              onClick={() => setShowIntro(false)}
              className="w-full py-4 rounded-2xl bg-white text-black font-display font-bold text-lg hover:bg-white/90 transition-all active:scale-[0.98]"
            >
              START JOURNEY
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Global HUD elements */}
      <footer className="h-10 border-t border-white/5 bg-black/60 flex items-center justify-center px-8 z-20">
        <div className="flex gap-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Hospital Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Courtroom Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
