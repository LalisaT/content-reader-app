import React from 'react';
import {
  BookOpen,
  Search,
  Bookmark,
  Settings,
  Sparkles,
  PlusCircle,
  Palette,
  Flame,
  Rocket,
  Compass,
  Diamond,
  Crown,
  Globe,
  Zap,
  Heart,
  Award,
  Sun,
  Moon,
  Coffee,
  User
} from 'lucide-react';

const LOGO_ICON_MAP = {
  BookOpen, Sparkles, Flame, Rocket, Compass, Diamond, Crown, Globe, Zap, Heart, Award
};

export default function Navbar({
  activeTab,
  onTabChange,
  bookmarkCount,
  onOpenDailyTip,
  onOpenAdminPost,
  onOpenCustomizer,
  currentUser,
  onOpenAuth,
  appConfig,
  currentTheme = 'light',
  onToggleTheme,
}) {
  const isAdmin = currentUser && currentUser.role === 'admin';
  const LogoIconComp = LOGO_ICON_MAP[appConfig?.logoIcon] || BookOpen;

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Dynamic Logo & App Name */}
        <div 
          onClick={() => onTabChange('feed')}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform overflow-hidden p-0.5">
            <img
              src={appConfig?.logoImageUrl || "/app-icon.png"}
              alt="App Logo"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
              {appConfig?.appName || 'TipPulse'}
            </span>
            {appConfig?.appIconBadge && (
              <span className="text-[10px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {appConfig.appIconBadge}
              </span>
            )}
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-1 sm:space-x-1.5">
          {/* Quick 1-Click Night / Dark / Sepia / Light Mode Toggle */}
          <button
            onClick={onToggleTheme}
            title={`Switch Theme (Current: ${currentTheme.toUpperCase()})`}
            className="p-1.5 rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 transition-all active:scale-95"
          >
            {currentTheme === 'dark' ? (
              <Moon className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />
            ) : currentTheme === 'sepia' ? (
              <Coffee className="w-4 h-4 text-amber-700 fill-amber-700/20" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500 fill-amber-500/20" />
            )}
          </button>

          {/* Admin App Customizer Button */}
          {isAdmin && (
            <button
              onClick={onOpenCustomizer}
              title="Customize App Logo, Categories & Palette"
              className="p-1.5 rounded-full text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800 transition-colors"
            >
              <Palette className="w-4 h-4" />
            </button>
          )}

          {/* Admin / Post Creation Button (Admin Only) */}
          {isAdmin && (
            <button
              onClick={onOpenAdminPost}
              title="Create New Article"
              className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-bold rounded-full shadow-sm transition-all hover:scale-102 bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/30"
            >
              <PlusCircle className="w-3.5 h-3.5 text-slate-950" />
              <span className="hidden sm:inline">Write</span>
            </button>
          )}

          {/* Daily Quick Tip Sparkle */}
          <button
            onClick={onOpenDailyTip}
            title="Daily Quick Tip"
            className="flex items-center space-x-1 px-2 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 rounded-full border border-amber-200/60 dark:border-amber-800/40 hover:bg-amber-100 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden md:inline">Tip</span>
          </button>

          {/* Search Trigger */}
          <button
            onClick={() => onTabChange('explore')}
            title="Search & Explore"
            className={`p-2 rounded-full transition-colors ${
              activeTab === 'explore' 
                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400' 
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Bookmarks Counter */}
          <button
            onClick={() => onTabChange('bookmarks')}
            title="Saved Reads"
            className="p-2 rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 relative transition-colors"
          >
            <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
            {bookmarkCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                {bookmarkCount}
              </span>
            )}
          </button>

          {/* User Account Profile */}
          {currentUser ? (
            <div className="flex items-center pl-1">
              <button
                onClick={() => onTabChange('settings')}
                title={`Logged in as ${currentUser.name} (${currentUser.role})`}
                className="flex items-center space-x-1.5 p-0.5 rounded-full hover:ring-2 hover:ring-indigo-500/50 transition-all"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth(false)}
              title="Sign In / User Account"
              className="p-2 rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
