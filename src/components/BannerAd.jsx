import React, { useState } from 'react';
import { ShieldCheck, Info, X } from 'lucide-react';
import { ADMOB_CONFIG } from '../services/admobService';

export default function BannerAd({ position = 'bottom' }) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className={`w-full max-w-md mx-auto px-2 py-1 ${position === 'bottom' ? 'mb-16' : 'my-4'}`}>
      <div className="relative bg-slate-100 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-750 dark:border-slate-700 rounded-xl p-2.5 flex items-center justify-between shadow-sm overflow-hidden">
        {/* Test Ad Unit Indicator Badge */}
        <div className="flex items-center space-x-2.5 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold font-mono">
            Ad
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-1 rounded">
                AdMob Banner
              </span>
              <span className="text-[10px] text-slate-500 font-mono truncate">
                {ADMOB_CONFIG.TEST_IDS.BANNER_ANDROID.slice(0, 18)}...
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">
              Google Mobile Ads: Adaptive 320x50 Standard Test Ad
            </p>
          </div>
        </div>

        {/* Ad Info & Dismiss */}
        <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
          <a
            href="https://google.com"
            target="_blank"
            rel="noreferrer"
            title="Google AdChoices Info"
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => setIsVisible(false)}
            title="Close test banner"
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
