import React, { useState } from 'react';
import CategoryChips from '../components/CategoryChips';
import ArticleCard from '../components/ArticleCard';
import NativeAdCard from '../components/NativeAdCard';
import { SAMPLE_NATIVE_ADS } from '../services/admobService';
import { Sparkles, TrendingUp, Compass, ArrowRight } from 'lucide-react';

export default function HomeFeed({
  articles,
  bookmarks,
  categories = [],
  onToggleBookmark,
  onOpenArticle,
  onExploreCategory,
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter articles based on active category
  const filteredArticles = selectedCategory === 'All'
    ? articles
    : articles.filter((a) => a.category === selectedCategory);

  const featuredArticle = articles[0];

  // Interleave native ads into the stream every 3 items
  const renderFeedWithAds = () => {
    const elements = [];
    let adIndex = 0;

    filteredArticles.forEach((article, index) => {
      // Don't duplicate the featured article if category is 'All'
      if (selectedCategory === 'All' && index === 0) return;

      elements.push(
        <ArticleCard
          key={article.id}
          article={article}
          isBookmarked={bookmarks.includes(article.id)}
          onToggleBookmark={onToggleBookmark}
          onOpenArticle={onOpenArticle}
        />
      );

      // Insert Native Sponsored Card after every 3 items
      if ((index + 1) % 3 === 0) {
        const ad = SAMPLE_NATIVE_ADS[adIndex % SAMPLE_NATIVE_ADS.length];
        adIndex++;
        elements.push(<NativeAdCard key={`ad-${index}`} ad={ad} />);
      }
    });

    return elements;
  };

  return (
    <div className="max-w-2xl mx-auto pb-24 animate-in fade-in duration-200">
      {/* Category Chips Bar with dynamic categories */}
      <CategoryChips
        categories={categories}
        activeCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

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
                src={featuredArticle.image}
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

      {/* Article & Native Ad Stream */}
      <div className="px-4 space-y-3.5">
        {renderFeedWithAds()}

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
