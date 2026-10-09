import React, { useState } from 'react';
import CategoryChips from '../components/CategoryChips';
import ArticleCard from '../components/ArticleCard';
import CommunityPollCard from '../components/CommunityPollCard';
import { Sparkles, TrendingUp, Compass, ArrowRight, Music, Headphones, ShieldCheck, Briefcase } from 'lucide-react';

export default function HomeFeed({
  articles,
  bookmarks,
  categories = [],
  selectedCategory = 'All',
  onSelectCategory,
  onToggleBookmark,
  onOpenArticle,
  onExploreCategory,
  polls = [],
  onVotePoll,
  onNavigateToJobs,
}) {
  const [localCategory, setLocalCategory] = useState('All');
  const currentCategory = onSelectCategory ? selectedCategory : localCategory;
  const handleCategoryChange = onSelectCategory || setLocalCategory;

  const activePoll = polls.find((p) => p.isActive !== false);

  // Filter articles based on active category
  const filteredArticles = currentCategory === 'All'
    ? articles
    : articles.filter((a) => {
        if (!a.category) return false;
        return a.category.toLowerCase().trim() === currentCategory.toLowerCase().trim();
      });

  const featuredArticle = articles[0];

  return (
    <div className="max-w-2xl mx-auto pb-safe-nav animate-in fade-in duration-200">
      {/* Category Chips Bar with dynamic categories */}
      <CategoryChips
        categories={categories}
        activeCategory={currentCategory}
        onSelectCategory={handleCategoryChange}
      />

      {/* Special Dedicated Music Category Welcome Banner */}
      {currentCategory === 'Music' && (
        <div className="px-4 mb-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-pink-950/60 via-purple-950/40 to-slate-900 border border-pink-800/60 text-white shadow-lg shadow-pink-900/10">
            <div className="flex items-center space-x-3 mb-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-pink-500/30 shrink-0">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-pink-300 bg-pink-950/90 px-2 py-0.5 rounded-full border border-pink-700/60">
                  Official YouTube Music Hub
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                  Relaxing Tracks & Focus Soundscapes
                </h3>
              </div>
            </div>
            <p className="text-xs text-pink-100/80 leading-relaxed mb-3">
              Stream legal YouTube music tracks curated for deep study and relaxation. Background playback is disabled on screen off and downloading is strictly prohibited per YouTube terms.
            </p>
            <div className="flex items-center space-x-2 text-[10px] text-pink-300 font-semibold bg-black/20 p-2 rounded-xl">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>100% Legal YouTube Embed • AdMob banners hidden during video playback</span>
            </div>
          </div>
        </div>
      )}

      {/* Community Poll Vote Card (if an active poll exists) */}
      {activePoll && (
        <div className="px-4 mb-4">
          <CommunityPollCard poll={activePoll} onVoted={onVotePoll} />
        </div>
      )}

      {/* Featured Hero Story (shown on 'All' tab) */}
      {selectedCategory === 'All' && featuredArticle && (
        <div className="px-4 mb-4">
          <div
            onClick={() => onOpenArticle(featuredArticle)}
            className="group relative rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-slate-700/80 cursor-pointer bg-slate-900 text-white transition-all hover:shadow-xl"
          >
            {/* Background Image with Dark Overlay */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden">
              <img
                src={featuredArticle.image || featuredArticle.imageUrl}
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            </div>

            {/* Hero Card Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-indigo-600 text-white font-bold text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center space-x-1 shadow-sm">
                  <Sparkles className="w-3 h-3" />
                  <span>Featured of the Day</span>
                </span>
                <span className="text-xs text-slate-300">
                  {featuredArticle.readTime}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold leading-tight group-hover:text-indigo-300 transition-colors">
                {featuredArticle.title}
              </h2>

              <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                {featuredArticle.summary}
              </p>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10">
                <span>By {featuredArticle.author}</span>
                <span className="text-white font-semibold flex items-center group-hover:translate-x-1 transition-transform">
                  Read Full Tip <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Luxury VIP Career Vacancies Spotlight */}
      {selectedCategory === 'All' && onNavigateToJobs && (
        <div className="px-4 mb-4">
          <div
            onClick={onNavigateToJobs}
            className="group relative rounded-3xl p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-amber-500/30 text-white shadow-xl cursor-pointer hover:border-amber-400/50 transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/15 rounded-full blur-2xl pointer-events-none animate-job-opacity-glow"></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3.5 min-w-0">
                <div className="relative w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0 shadow-md">
                  <div className="absolute inset-0 rounded-2xl border border-amber-400/30 animate-job-ring-opacity"></div>
                  <Briefcase className="w-5 h-5 text-amber-400 animate-job-opacity-pulse" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center space-x-1 mb-0.5">
                    <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400/20" />
                    <span>Executive Careers & Scholarships</span>
                  </span>
                  <h4 className="text-sm font-black text-white truncate group-hover:text-amber-200 transition-colors">
                    Executive Vacancies & Scholarship Opportunities
                  </h4>
                  <p className="text-[11px] text-slate-300 truncate">
                    Browse verified executive roles & fully funded scholarships
                  </p>
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs font-bold shrink-0 flex items-center space-x-1 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all ml-2">
                <span>View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feed Stream Header */}
      <div className="px-4 flex items-center justify-between my-2">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
            {selectedCategory === 'All' ? 'Latest Reads & Practical Tips' : `${selectedCategory} Articles`}
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          {filteredArticles.length} stories
        </span>
      </div>

      {/* Clean Article Stream (No intrusive ads on home feed) */}
      <div className="px-4 space-y-3.5">
        {filteredArticles.map((article, index) => {
          if (selectedCategory === 'All' && index === 0) return null;
          return (
            <ArticleCard
              key={article.id}
              article={article}
              isBookmarked={bookmarks.includes(article.id)}
              onToggleBookmark={onToggleBookmark}
              onOpenArticle={onOpenArticle}
            />
          );
        })}

        {filteredArticles.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
            <Compass className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h4 className="font-bold text-slate-700 dark:text-slate-300">No articles in this category yet</h4>
            <p className="text-xs text-slate-500 mt-1">Check back soon or publish a new tip as Admin.</p>
          </div>
        )}
      </div>
    </div>
  );
}
