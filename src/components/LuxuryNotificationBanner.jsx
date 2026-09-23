import React, { useState, useEffect } from 'react';
import { Bell, Sparkles, X, Volume2, VolumeX, ArrowRight } from 'lucide-react';

export default function LuxuryNotificationBanner({ notification, onClose, onViewArticle }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Auto-dismiss after 12 seconds if not interacted with
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      if (typeof onClose === 'function') onClose();
    }, 12000);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  // Stop speech if banner closes
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!notification) return null;

  const handleToggleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = `${notification.title}. ${notification.body || ''}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const cleanTitle = (notification.title || 'New Tip Published').replace(/^[🔔📝✨🎉]\s*/, '');
  const categoryLabel = notification.category || 'Pulse Update';

  return (
    <div className="fixed top-3 inset-x-3 sm:inset-x-auto sm:right-4 sm:max-w-md z-50 animate-in slide-in-from-top-4 fade-in duration-300">
      {/* Luxury Glow Border Container */}
      <div className="relative rounded-3xl bg-slate-950/95 dark:bg-slate-950/95 border-2 border-amber-500/40 p-4 sm:p-4.5 shadow-2xl shadow-black/80 backdrop-blur-md overflow-hidden ring-1 ring-amber-400/20">
        {/* Subtle background glow effect */}
        <div className="absolute -top-10 -left-10 w-28 h-28 bg-amber-500/15 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative flex items-start gap-3.5">
          {/* Golden Glowing Bell Icon Badge */}
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30 shrink-0">
            <Bell className="w-6 h-6 fill-slate-950/20 animate-pulse stroke-[2.2]" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950"></span>
          </div>

          {/* Details Content */}
          <div className="flex-1 min-w-0 pr-6">
            {/* Pill Badges */}
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-[10px] font-black text-amber-300 uppercase tracking-wider shadow-sm">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                <span>NEW ANNOUNCEMENT</span>
              </span>

              <span className="inline-block px-2 py-0.5 rounded-full bg-sky-950/70 border border-sky-500/40 text-[10px] font-bold text-sky-300">
                {categoryLabel}
              </span>
            </div>

            {/* Title */}
            <h4 className="font-extrabold text-white text-xs sm:text-sm leading-snug line-clamp-2">
              {cleanTitle}
            </h4>

            {/* Body */}
            {notification.body && (
              <p className="text-[11px] text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                {notification.body}
              </p>
            )}

            {/* Action Buttons Row */}
            <div className="flex items-center space-x-2 pt-2.5 mt-1 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  if (typeof onViewArticle === 'function') {
                    onViewArticle(notification.articleId, notification);
                  }
                  if (typeof onClose === 'function') onClose();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-sky-500/25 flex items-center space-x-1.5 transition-transform active:scale-95 cursor-pointer"
              >
                <span>View Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleToggleSpeak}
                title={isSpeaking ? 'Mute' : 'Listen to announcement'}
                className={`p-1.5 rounded-xl border transition-colors ${
                  isSpeaking
                    ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Close X Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-0 right-0 p-1 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
