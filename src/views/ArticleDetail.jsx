import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Type,
  Sun,
  Moon,
  Coffee,
  CheckCircle2,
  Clock,
  Calendar,
  User,
  Sparkles,
  Lock,
  Play,
  Volume2,
  ThumbsUp,
  Edit3,
  Trash2,
  Wifi,
  WifiOff,
  RotateCcw
} from 'lucide-react';
import AudioPlayer from '../components/AudioPlayer';
import BannerAd from '../components/BannerAd';
import RichMarkdownRenderer from '../components/RichMarkdownRenderer';
import { storageService } from '../services/storageService';

export default function ArticleDetail({
  article,
  isBookmarked,
  onToggleBookmark,
  onBack,
  onUnlockPremium,
  isUnlocked,
  readerTheme,
  onChangeReaderTheme,
  fontSize,
  onChangeFontSize,
  isAdmin = false,
  onEditCurrentArticle,
  onDeleteCurrentArticle,
}) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showAudio, setShowAudio] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Track online / offline connectivity state
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Track reading scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: window.location.href,
        });
      } catch {
        // Share cancelled
      }
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  // Font size classes
  const fontSizes = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-relaxed',
    xl: 'text-xl leading-loose',
  };

  const cycleFontSize = () => {
    const sizes = ['sm', 'base', 'lg', 'xl'];
    const next = sizes[(sizes.indexOf(fontSize) + 1) % sizes.length];
    onChangeFontSize(next);
  };

  const requiresData = Boolean(article?.needsData || article?.requiresOnline);
  const isDataBlocked = requiresData && !isOnline;
  const isLocked = article?.isPremium && !isUnlocked;

  return (
    <div className={`min-h-screen pb-24 transition-colors ${
      readerTheme === 'sepia' 
        ? 'theme-sepia' 
        : readerTheme === 'dark' 
          ? 'theme-dark' 
          : 'bg-white text-slate-900'
    }`}>
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full bg-indigo-600 dark:bg-indigo-400 transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Reader Navigation & Customization Toolbar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 h-14 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xs font-semibold hidden xs:inline">Back</span>
        </button>

        {/* Reader Customization Controls */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Admin Edit / Delete Actions */}
          {isAdmin && (
            <div className="flex items-center space-x-1 bg-amber-50 dark:bg-amber-950/60 p-0.5 rounded-lg border border-amber-200 dark:border-amber-800 mr-1">
              <button
                onClick={() => onEditCurrentArticle(article)}
                title="Edit this post as Admin"
                className="p-1.5 rounded-md text-amber-900 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors flex items-center space-x-1 text-xs font-bold"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Edit</span>
              </button>
              <button
                onClick={() => onDeleteCurrentArticle(article.id)}
                title="Delete this article permanently as Admin"
                className="p-1.5 rounded-md text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-colors flex items-center space-x-1 text-xs font-bold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          )}

          {/* Font Size Toggle */}
          <button
            onClick={cycleFontSize}
            title="Adjust text size"
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-bold font-mono transition-colors flex items-center space-x-0.5"
          >
            <Type className="w-4 h-4" />
            <span className="uppercase text-[10px]">{fontSize}</span>
          </button>

          {/* Theme Selector (Light, Sepia, Dark) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onChangeReaderTheme('light')}
              title="Light theme"
              className={`p-1.5 rounded-md transition-colors ${
                readerTheme === 'light' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onChangeReaderTheme('sepia')}
              title="Sepia warm theme"
              className={`p-1.5 rounded-md transition-colors ${
                readerTheme === 'sepia' ? 'bg-[#f4e5c8] shadow-xs text-[#433422]' : 'text-slate-500'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onChangeReaderTheme('dark')}
              title="Dark night theme"
              className={`p-1.5 rounded-md transition-colors ${
                readerTheme === 'dark' ? 'bg-slate-700 shadow-xs text-indigo-400' : 'text-slate-500'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Audio Narrator Toggle */}
          <button
            onClick={() => setShowAudio(!showAudio)}
            title="Listen to article narration"
            className={`p-2 rounded-lg transition-colors ${
              showAudio 
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Bookmark Button */}
          <button
            onClick={() => onToggleBookmark(article.id)}
            title={isBookmarked ? 'Saved' : 'Save'}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-indigo-600 text-indigo-600' : ''}`} />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            title="Share"
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Reading Container */}
      <article className="max-w-xl mx-auto px-4 pt-4 sm:pt-6">
        {/* Category & Read Time Meta */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
          <span className="uppercase tracking-wider px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/70 rounded-md border border-indigo-200/60 dark:border-indigo-800/40">
            {article.category}
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500 dark:text-slate-400 flex items-center font-normal">
            <Clock className="w-3.5 h-3.5 mr-1" />
            {article.readTime}
          </span>
        </div>

        {/* Article Headline */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug mb-3">
          {article.title}
        </h1>

        {/* Author & Publish Date Bar */}
        <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 py-3 border-y border-slate-100 dark:border-slate-800 mb-5">
          <div className="flex items-center space-x-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>{article.author}</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{article.date}</span>
          </div>
        </div>

        {/* Audio Player Bar (if opened) */}
        {showAudio && (
          <AudioPlayer
            title={article.title}
            textToRead={`${article.summary}. ${article.content}`}
          />
        )}

        {/* Cover Photo */}
        <div className="rounded-2xl overflow-hidden mb-6 shadow-sm border border-slate-200/80 dark:border-slate-800">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-56 sm:h-72 object-cover"
          />
        </div>

        {/* Key Takeaways Box */}
        {article.keyTakeaways && article.keyTakeaways.length > 0 && (
          <div className="reader-card bg-indigo-50/70 dark:bg-slate-800/80 border border-indigo-200/70 dark:border-indigo-900/60 rounded-2xl p-4 sm:p-5 mb-6 shadow-xs">
            <div className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider mb-2.5">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Key Actionable Takeaways</span>
            </div>
            <ul className="space-y-2">
              {article.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Data Requirement or Rewarded Ad Lock Overlay */}
        {isDataBlocked ? (
          <div className="my-8 p-6 rounded-3xl bg-blue-50 dark:bg-blue-950/40 border-2 border-blue-400/80 dark:border-blue-600/80 text-center shadow-lg animate-in fade-in">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
              <WifiOff className="w-7 h-7" />
            </div>

            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-blue-600 text-white mb-2 inline-block">
              Internet Data Required
            </span>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              Mobile Data / Wi-Fi Needed to Read All Writing
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
              This article was published with online requirement. Please turn on your Mobile Data or connect to Wi-Fi to load and read the full writing.
            </p>

            <button
              onClick={() => {
                if (navigator.onLine) {
                  setIsOnline(true);
                } else {
                  alert('Device is still offline. Please turn on Mobile Data or Wi-Fi to view all writing.');
                }
              }}
              className="mt-5 inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-transform active:scale-98 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Check Connection & Open Writing</span>
            </button>
          </div>
        ) : isLocked ? (
          <div className="my-8 p-6 rounded-3xl bg-gradient-to-b from-amber-500/10 via-slate-900/5 to-amber-500/10 dark:from-amber-950/40 dark:to-slate-900 border border-amber-300 dark:border-amber-700/60 text-center shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto mb-3 shadow-md">
              <Lock className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Exclusive Full Content
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto mt-2 leading-relaxed">
              The complete writing is free to unlock by watching a short 5-second sponsor video.
            </p>

            <button
              onClick={() => onUnlockPremium(article)}
              className="mt-5 inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm px-6 py-3 rounded-xl shadow-lg shadow-amber-500/30 transition-transform active:scale-98 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Watch Short Video to Unlock (5s)</span>
            </button>
          </div>
        ) : (
          /* Unlocked / Free Article Body with Rich Markdown & Lists Renderer */
          <div className="reader-text">
            <RichMarkdownRenderer
              content={article.content}
              className={`font-serif ${fontSizes[fontSize] || fontSizes.base}`}
            />
          </div>
        )}

        {/* Inline Article Banner Ad (AdMob Placement) */}
        <div className="my-8">
          <BannerAd position="inline" />
        </div>

        {/* Reader Feedback & Claps */}
        <div className="flex items-center justify-between py-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isLiked
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
            <span>{isLiked ? 'Helpful (1)' : 'Found this helpful?'}</span>
          </button>

          <button
            onClick={onBack}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            ← Back to Feed
          </button>
        </div>
      </article>
    </div>
  );
}
