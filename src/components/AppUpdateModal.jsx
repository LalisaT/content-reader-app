import React, { useEffect } from 'react';
import { Rocket, Sparkles, ArrowRight, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function AppUpdateModal({ updateInfo, onUpdate, onSkip }) {
  if (!updateInfo) return null;

  const {
    isForceUpdate,
    currentVersionName,
    latestVersionName,
    releaseNotes,
  } = updateInfo;

  // Handle Android hardware back button
  useEffect(() => {
    const handleHardwareBack = (e) => {
      e.preventDefault();
      if (!isForceUpdate && typeof onSkip === 'function') {
        onSkip();
      }
    };
    window.addEventListener('tippulse_hardware_back', handleHardwareBack);
    return () => window.removeEventListener('tippulse_hardware_back', handleHardwareBack);
  }, [isForceUpdate, onSkip]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Background click dismiss only if optional update */}
      {!isForceUpdate && (
        <div className="absolute inset-0" onClick={onSkip} />
      )}

      {/* Main Luxury Modal Card */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl space-y-5 text-center animate-in zoom-in-95 duration-200 z-10 overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Dismiss Button (Optional updates only) */}
        {!isForceUpdate && (
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="Skip for now"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header Icon Badge */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-500 p-0.5 shadow-lg shadow-indigo-500/30">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-amber-400">
              <Rocket className="w-8 h-8 animate-pulse text-indigo-400" />
            </div>
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-black shadow-xs">
            <Sparkles className="w-3 h-3" />
          </div>
        </div>

        {/* Title & Badge */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] font-bold tracking-wider uppercase">
            <span>{isForceUpdate ? 'Critical Update Required' : 'Update Available'}</span>
          </div>

          <h2 className="text-xl font-black text-white tracking-tight">
            A New TipPulse is Here!
          </h2>

          {/* Version Transition Pill */}
          <div className="flex items-center justify-center space-x-2 text-xs font-mono font-semibold pt-1">
            <span className="text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">
              {currentVersionName || 'Current'}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-700/60 font-bold">
              {latestVersionName || 'Newest'}
            </span>
          </div>
        </div>

        {/* Release Notes Card */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5 text-left space-y-1.5">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
            ✨ What's New:
          </span>
          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line max-h-32 overflow-y-auto">
            {releaseNotes || 'Enhanced link sharing directly into tips, real-time notification alerts, and performance improvements.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          {/* Primary: Google Play Update */}
          <button
            onClick={onUpdate}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/40 flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M3.6 1.7L13.8 12 3.6 22.3C3.2 21.9 3 21.3 3 20.6V3.4C3 2.7 3.2 2.1 3.6 1.7Z" fill="#2196F3"/>
              <path d="M17.2 8.6L13.8 12L3.6 1.7C4 1.3 4.7 1.2 5.3 1.5L17.2 8.6Z" fill="#4CAF50"/>
              <path d="M17.2 15.4L5.3 22.5C4.7 22.8 4 22.7 3.6 22.3L13.8 12L17.2 15.4Z" fill="#F44336"/>
              <path d="M21.4 11L17.2 8.6L13.8 12L17.2 15.4L21.4 13C22.2 12.5 22.2 11.5 21.4 11Z" fill="#FFC107"/>
            </svg>
            <span>Update on Google Play</span>
          </button>

          {/* Secondary: Skip / Remind Me Later */}
          {!isForceUpdate ? (
            <button
              onClick={onSkip}
              className="w-full py-2.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
            >
              Later / Skip for now
            </button>
          ) : (
            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-amber-400 font-medium pt-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Please update to keep enjoying TipPulse</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
