import React from 'react';
import { Clock, Bookmark, Lock, ArrowUpRight, Zap, Cpu, Heart, DollarSign, Brain } from 'lucide-react';

const ICON_MAP = {
  Zap,
  Cpu,
  Heart,
  DollarSign,
  Brain,
};

export default function ArticleCard({ article, isBookmarked, onToggleBookmark, onOpenArticle }) {
  const IconComponent = ICON_MAP[article.categoryIcon] || Zap;

  return (
    <div 
      onClick={() => onOpenArticle(article)}
      className="group relative bg-white dark:bg-slate-850 dark:bg-slate-800 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/70 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700/80 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      {/* Top Media & Category */}
      <div className="flex gap-4">
        {/* Thumbnail Image */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-700">
          <img
            src={article.image || article.imageUrl}
            alt={article.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {article.isPremium && (
            <div className="absolute top-1.5 left-1.5 bg-amber-500 text-slate-950 font-extrabold text-[9px] px-1.5 py-0.5 rounded shadow-sm flex items-center space-x-0.5">
              <Lock className="w-2.5 h-2.5" />
              <span>PRO</span>
            </div>
          )}
          {(article.needsData || article.requiresOnline) && (
            <div className="absolute top-1.5 right-1.5 bg-blue-600 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded shadow-sm">
              <span>ONLINE</span>
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center space-x-2 text-xs mb-1.5">
              <span className="inline-flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                <IconComponent className="w-3 h-3" />
                <span>{article.category}</span>
              </span>
              <span className="text-slate-400 dark:text-slate-500">•</span>
              <span className="text-slate-500 dark:text-slate-400 flex items-center text-[11px]">
                <Clock className="w-3 h-3 mr-1" />
                {article.readTime}
              </span>
            </div>

            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {article.title}
            </h3>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
            {article.summary}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 text-xs text-slate-400">
        <span className="text-slate-500 dark:text-slate-400 text-[11px]">
          By <strong className="font-medium text-slate-700 dark:text-slate-300">{article.author}</strong>
        </span>

        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(article.id);
            }}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
            className={`p-1.5 rounded-full transition-colors ${
              isBookmarked
                ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-indigo-600 text-indigo-600' : ''}`} />
          </button>

          <span className="text-indigo-600 dark:text-indigo-400 font-semibold inline-flex items-center text-xs group-hover:translate-x-0.5 transition-transform">
            Read <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
