import React from 'react';
import { Bookmark, Sparkles, ArrowRight, Trash2 } from 'lucide-react';
import ArticleCard from '../components/ArticleCard';

export default function BookmarksView({
  articles,
  bookmarks,
  onToggleBookmark,
  onOpenArticle,
  onExploreClick,
}) {
  const savedArticles = articles.filter((a) => bookmarks.includes(a.id));

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-24 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Saved Reads
          </h2>
          <p className="text-xs text-slate-500">
            Available offline on this device
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-200 dark:border-indigo-800">
          {savedArticles.length} Saved
        </span>
      </div>

      {savedArticles.length > 0 ? (
        <div className="space-y-3.5">
          {savedArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              isBookmarked={true}
              onToggleBookmark={onToggleBookmark}
              onOpenArticle={onOpenArticle}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center mx-auto mb-4 text-indigo-600 dark:text-indigo-400">
            <Bookmark className="w-8 h-8" />
          </div>

          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No saved articles yet
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
            Tap the bookmark icon on any guide or daily tip to save it here for offline reading.
          </p>

          <button
            onClick={onExploreClick}
            className="mt-6 inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 transition-all"
          >
            <span>Explore Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
