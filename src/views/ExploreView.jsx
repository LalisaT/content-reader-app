import React, { useState } from 'react';
import {
  Search,
  Compass,
  Zap,
  Cpu,
  Heart,
  DollarSign,
  Brain,
  Flame,
  Rocket,
  Globe,
  BookOpen,
  Award,
  Smile,
  Sun,
  Target,
  Coffee,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import ArticleCard from '../components/ArticleCard';

const ICON_MAP = {
  Sparkles, Zap, Cpu, Heart, DollarSign, Brain, Flame, Rocket, Compass, Globe, BookOpen, Award, Smile, Sun, Target, Coffee
};

const TRENDING_TAGS = [
  '#2MinuteRule', '#FeynmanTechnique', '#PromptEngineering', '#NSDR', '#Budget503020', '#DeepWork', '#Stoicism'
];

export default function ExploreView({
  articles,
  bookmarks,
  categories = [],
  onToggleBookmark,
  onOpenArticle,
  onSelectCategory,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = articles.filter((a) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return false;
    return (
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.author.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-24 animate-in fade-in duration-200">
      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tips, tech guides, habits..."
          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            Clear
          </button>
        )}
      </div>

      {/* Search Results Mode */}
      {searchQuery.trim() !== '' ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
              Results for "{searchQuery}"
            </h3>
            <span className="text-xs text-slate-400">{searchResults.length} found</span>
          </div>

          <div className="space-y-3">
            {searchResults.length > 0 ? (
              searchResults.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  isBookmarked={bookmarks.includes(article.id)}
                  onToggleBookmark={onToggleBookmark}
                  onOpenArticle={onOpenArticle}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <Compass className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h4 className="font-bold text-slate-700 dark:text-slate-300">No matching articles</h4>
                <p className="text-xs text-slate-500 mt-1">Try searching for "productivity", "AI", or "budget".</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Explore Home Mode */
        <div className="space-y-6">
          {/* Trending Tags */}
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Trending Topics</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {TRENDING_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag.replace('#', ''))}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Categories Grid (Dynamically rendered) */}
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-3">
              Browse by Pillar ({categories.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((cat) => {
                const IconComp = ICON_MAP[cat.icon] || Sparkles;
                const count = articles.filter((a) => a.category === cat.label).length;
                return (
                  <div
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.label)}
                    className={`bg-gradient-to-r ${cat.gradient || 'from-indigo-600 to-violet-600'} p-4 rounded-2xl text-white shadow-sm hover:shadow-md cursor-pointer group transition-all duration-200`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <ArrowUpRight className="w-4 h-4 opacity-75 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                    <h4 className="font-bold text-base mt-3">{cat.label}</h4>
                    <p className="text-xs text-white/80 mt-0.5">{count} {count === 1 ? 'article' : 'articles'}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
