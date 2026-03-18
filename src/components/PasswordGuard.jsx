import React, { useState } from 'react';
import { motion } from 'framer-motion';

function PasswordGuard({ children }) {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(() => localStorage.getItem('three_body_authorized') === 'true');
  const [error, setError] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault();

    if (password === '0228') {
      setIsAuthorized(true);
      localStorage.setItem('three_body_authorized', 'true');
      setError(false);
      return;
    }

    setError(true);
    setTimeout(() => setError(false), 500);
  };

  if (isAuthorized) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#FDFCF9] font-inter">
      <div className="pointer-events-none absolute inset-0 select-none opacity-[0.03]">
        <div className="absolute inset-0 bg-grid-slate-900/[0.1]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] space-y-12 px-6 text-center"
      >
        <div className="space-y-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E5E0D5] bg-[#F4F1EA]"
          >
            <svg className="h-8 w-8 text-[#B29A62]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </motion.div>

          <div className="space-y-2">
            <h1 className="text-3xl italic tracking-tight text-[#B29A62]">Access Restricted</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B29A62]/60">THE THREE BODIES</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <motion.div animate={error ? { x: [-10, 10, -10, 10, 0] } : {}} className="relative">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter Password"
              className="h-14 w-full rounded-xl border border-[#D1D1D1] bg-white px-4 text-center text-lg tracking-[0.5em] placeholder:tracking-normal placeholder:text-gray-400 focus:border-[#B29A62] focus:outline-none transition-colors"
            />
          </motion.div>

          <button
            type="submit"
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#111] font-bold tracking-[0.2em] text-white transition-all active:scale-[0.98] hover:bg-black"
          >
            ENTER GATEWAY
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>

        <div className="space-y-8 pt-4">
          <div className="flex items-center justify-center gap-1 text-[11px] text-[#A1A1A1]">
            Contact: <span className="italic text-[#B29A62]">roadsea@naver.com</span>
          </div>

          <div className="mx-auto max-w-[220px] text-[9px] font-bold uppercase leading-relaxed tracking-[0.2em] text-[#A1A1A1]/40">
            Dedicated to the contemplative reading of the three bodies text
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default PasswordGuard;
