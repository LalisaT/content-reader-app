import React, { useState, useEffect } from 'react';
import { X, ExternalLink, ShieldCheck, PlayCircle } from 'lucide-react';
import { ADMOB_CONFIG } from '../services/admobService';

export default function InterstitialModal({ isOpen, onClose }) {
  const [countdown, setCountdown] = useState(4);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(4);
      setCanSkip(false);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col">
        {/* Top Bar Header */}
        <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-1.5 py-0.5 rounded">
              Sponsored
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Featured Recommendation
            </span>
          </div>

          <div>
            {canSkip ? (
              <button
                onClick={onClose}
                className="bg-slate-800 hover:bg-slate-700 text-white p-1 rounded-full flex items-center space-x-1 px-2.5 text-xs font-semibold transition-colors"
              >
                <span>Close</span>
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-xs font-semibold text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-full">
                Skip in {countdown}s
              </span>
            )}
          </div>
        </div>

        {/* Ad Creative Image */}
        <div className="relative h-60 bg-gradient-to-tr from-indigo-900 to-purple-900 flex items-center justify-center overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80"
            alt="Ad creative"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
            <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold">Featured Sponsor</span>
            <h3 className="text-lg font-bold mt-1 leading-tight">Next-Gen Workspace & AI Analytics</h3>
          </div>
        </div>

        {/* Ad Body Content */}
        <div className="p-5 flex flex-col justify-between">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Automate team workflows, streamline daily analytics, and boost execution speed with the intelligent cloud platform.
          </p>

          <div className="mt-5 flex items-center space-x-3">
            <button
              onClick={() => {
                alert('Opening sponsor destination website...');
                onClose();
              }}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all"
            >
              <span>Explore Solution</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
