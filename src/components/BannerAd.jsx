import React, { useState, useEffect } from 'react';
import { ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { SAMPLE_NATIVE_ADS, admobService } from '../services/admobService';

export default function BannerAd({ position = 'bottom', hasBottomNav = true, className = '' }) {
  const [activeAdIndex, setActiveAdIndex] = useState(0);

  // 24/7 Auto-Rotation & Native AdMob Keep-Alive
  useEffect(() => {
    admobService.resumeBanner();
    const timer = setInterval(() => {
      setActiveAdIndex((prev) => (prev + 1) % SAMPLE_NATIVE_ADS.length);
      admobService.resumeBanner();
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const currentSponsor = SAMPLE_NATIVE_ADS[activeAdIndex % SAMPLE_NATIVE_ADS.length] || SAMPLE_NATIVE_ADS[0];

  // Inline Editorial Sponsored Card (Inside Articles, Feed & Career Views - 24/7 Non-Removable)
  if (position === 'inline') {
    return (
      <aside
        aria-label="Sponsored Recommendation"
        className={`w-full max-w-xl mx-auto my-6 rounded-2xl bg-gradient-to-br from-slate-50 via-slate-100/80 to-indigo-50/30 dark:from-slate-850 dark:via-slate-800/90 dark:to-indigo-950/20 border border-slate-200/90 dark:border-slate-700/80 p-4 sm:p-5 shadow-xs transition-all overflow-hidden ${className}`}
      >
        {/* Ad Header (No Close Button - Permanent 24/7 Placement) */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center space-x-1.5 min-w-0">
            <span className="bg-indigo-600 text-white font-extrabold text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded shadow-xs shrink-0">
              Ad
            </span>
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 truncate">
              Sponsored Recommendation
            </span>
            <span className="inline-flex items-center space-x-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/50 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>24/7</span>
            </span>
          </div>

          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold truncate">
            {currentSponsor.advertiser}
          </span>
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
            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug break-words">
              {currentSponsor.headline}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1 break-words">
              {currentSponsor.bodyText}
            </p>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="mt-3.5 pt-2.5 border-t border-slate-200/60 dark:border-slate-750/60 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
            <span>★ {currentSponsor.starRating}</span>
            <span className="text-slate-400">({currentSponsor.reviewsCount})</span>
          </div>

          <a
            href={currentSponsor.targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-transform active:scale-95 no-underline shrink-0"
          >
            <span>{currentSponsor.callToAction}</span>
            <ExternalLink className="w-3 h-3 stroke-[2.5]" />
          </a>
        </div>
      </aside>
    );
  }

  // Docked 24/7 Bottom Banner Bar (Always active, non-removable, pinned above BottomNav or at bottom of Reader)
  const isDockedAboveNav = position === 'bottom' && hasBottomNav;

  return (
    <div
      role="region"
      aria-label="24/7 Active Sponsor Banner"
      className={`fixed left-0 right-0 z-30 pointer-events-auto px-2 sm:px-3 transition-all ${className}`}
      style={{
        bottom: isDockedAboveNav
          ? 'calc(3.5rem + var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px)))'
          : 'var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px))',
      }}
    >
      <div className="max-w-xl mx-auto">
        <a
          href={currentSponsor.targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-700/90 rounded-2xl px-3 py-2 flex items-center justify-between gap-2.5 shadow-lg shadow-slate-950/10 dark:shadow-black/40 no-underline group transition-all hover:border-indigo-500/50"
        >
          <div className="flex items-center space-x-2.5 flex-1 min-w-0">
            {currentSponsor.iconUrl ? (
              <img
                src={currentSponsor.iconUrl}
                alt=""
                className="w-9 h-9 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-black font-mono">
                Ad
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5">
                <span className="bg-indigo-600 text-white font-extrabold text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0">
                  Ad
                </span>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 truncate">
                  {currentSponsor.advertiser}
                </span>
                <span className="inline-flex items-center space-x-1 text-[8px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-1.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/50 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>LIVE</span>
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">
                {currentSponsor.headline}
              </p>
            </div>
          </div>

          <div className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-indigo-600 group-hover:bg-indigo-500 text-white text-[11px] font-extrabold shadow-xs shrink-0 transition-colors">
            <span>{currentSponsor.callToAction || 'Open'}</span>
            <ExternalLink className="w-3 h-3 stroke-[2.5]" />
          </div>
        </a>
      </div>
    </div>
  );
}

