import React, { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Sparkles, ExternalLink, Info, X, ShieldCheck } from 'lucide-react';
import { ADMOB_CONFIG, SAMPLE_NATIVE_ADS } from '../services/admobService';

export default function BannerAd({ position = 'bottom', className = '' }) {
  const [isVisible, setIsVisible] = useState(true);
  const [activeAdIndex, setActiveAdIndex] = useState(0);

  // On Native Android, the bottom adaptive banner is rendered natively by Google Mobile Ads SDK overlay
  if (Capacitor.isNativePlatform() && position === 'bottom') {
    return null;
  }

  if (!isVisible) return null;

  const currentSponsor = SAMPLE_NATIVE_ADS[activeAdIndex % SAMPLE_NATIVE_ADS.length] || SAMPLE_NATIVE_ADS[0];

  // Inline Editorial Sponsored Card (Inside Articles & Writings)
  if (position === 'inline') {
    return (
      <aside 
        aria-label="Sponsored Recommendation"
        className={`w-full max-w-xl mx-auto my-6 rounded-2xl bg-gradient-to-br from-slate-50 via-slate-100/80 to-indigo-50/30 dark:from-slate-850 dark:via-slate-800/90 dark:to-indigo-950/20 border border-slate-200/90 dark:border-slate-700/80 p-4 sm:p-5 shadow-xs transition-all overflow-hidden ${className}`}
      >
        {/* Ad Header */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center space-x-1.5">
            <span className="bg-indigo-600 text-white font-extrabold text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded shadow-xs">
              Ad
            </span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Sponsored Recommendation
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              {currentSponsor.advertiser}
            </span>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors ml-1"
              title="Hide sponsored recommendation"
              aria-label="Hide sponsored recommendation"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex items-start space-x-3.5">
          {currentSponsor.iconUrl && (
            <img
              src={currentSponsor.iconUrl}
              alt=""
              className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs"
              loading="lazy"
            />
          )}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
              {currentSponsor.headline}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
              {currentSponsor.bodyText}
            </p>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="mt-3.5 pt-2.5 border-t border-slate-200/60 dark:border-slate-750/60 flex items-center justify-between">
          <div className="flex items-center space-x-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
            <span>★ {currentSponsor.starRating}</span>
            <span className="text-slate-400">({currentSponsor.reviewsCount})</span>
          </div>

          <a
            href={currentSponsor.targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-transform active:scale-95 no-underline"
          >
            <span>{currentSponsor.callToAction}</span>
            <ExternalLink className="w-3 h-3 stroke-[2.5]" />
          </a>
        </div>
      </aside>
    );
  }

  // Fallback Web Bottom Banner (for non-native browser testing)
  return (
    <div 
      className={`w-full max-w-md mx-auto px-2 py-1 mb-20 ${className}`}
      style={{ marginBottom: 'calc(4.5rem + var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px)))' }}
    >
      <div className="relative bg-slate-100 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 flex items-center justify-between shadow-xs overflow-hidden">
        <div className="flex items-center space-x-2.5 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold font-mono">
            Ad
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded">
              Google AdMob Partner
            </span>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">
              Support TipPulse • Recommended Insights
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1 ml-2 shrink-0">
          <button
            onClick={() => setIsVisible(false)}
            title="Dismiss"
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
