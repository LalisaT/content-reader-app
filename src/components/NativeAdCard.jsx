import React from 'react';
import { Megaphone, ExternalLink, Star, Info } from 'lucide-react';

export default function NativeAdCard({ ad }) {
  const handleAdClick = (e) => {
    e.stopPropagation();
    alert(`[Sponsored Partner Link]\nOpening: "${ad.headline}"\nAdvertiser: ${ad.advertiser}`);
  };

  return (
    <div 
      onClick={handleAdClick}
      className="relative bg-gradient-to-br from-indigo-50/40 via-white to-violet-50/30 dark:from-slate-800/90 dark:via-slate-800 dark:to-indigo-950/20 rounded-2xl p-4 border border-indigo-200/80 dark:border-indigo-900/60 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
    >
      {/* Mandatory AdMob Header Badge */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center space-x-2">
          <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-amber-300/80 dark:border-amber-700/50 flex items-center space-x-1">
            <Megaphone className="w-2.5 h-2.5" />
            <span>Sponsored Ad</span>
          </span>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {ad.advertiser}
          </span>
        </div>

        <div className="flex items-center space-x-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{ad.starRating}</span>
          <span className="text-slate-400 font-normal">({ad.reviewsCount})</span>
        </div>
      </div>

      {/* Ad Body Content */}
      <div className="flex gap-3.5 items-start">
        {/* Ad Icon */}
        <img
          src={ad.iconUrl}
          alt={ad.advertiser}
          className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0 shadow-sm"
        />

        {/* Text Details */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-snug line-clamp-1">
            {ad.headline}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1 leading-relaxed">
            {ad.bodyText}
          </p>
        </div>
      </div>

      {/* Hero Ad Image (Optional for High-Impact Native Formats) */}
      {ad.imageUrl && (
        <div className="mt-3 w-full h-32 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 relative">
          <img
            src={ad.imageUrl}
            alt={ad.headline}
            className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
          />
          <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[9px] px-1.5 py-0.5 rounded font-medium">
            Sponsored Partner
          </div>
        </div>
      )}

      {/* Call to Action Button */}
      <div className="mt-3.5 flex items-center justify-between pt-2 border-t border-indigo-100/60 dark:border-slate-700/60">
        <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center">
          <Info className="w-3 h-3 mr-1" /> Ads by Google
        </span>

        <button
          onClick={handleAdClick}
          className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs px-4 py-1.5 rounded-lg shadow-sm shadow-indigo-600/20 flex items-center space-x-1 transition-all"
        >
          <span>{ad.callToAction}</span>
          <ExternalLink className="w-3 h-3 ml-0.5" />
        </button>
      </div>
    </div>
  );
}
