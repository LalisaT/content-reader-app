import React, { useState, useEffect, useMemo } from 'react';
import initialArticlesData from './data/articles.json';
import { storageService } from './services/storageService';
import { admobService } from './services/admobService';
import { authService } from './services/authService';
import { appConfigService, THEME_PALETTES } from './services/appConfigService';
import { categoryService } from './services/categoryService';
import { firestoreSyncService } from './services/firestoreSyncService';
import { notificationService } from './services/notificationService';
import { deepLinkService } from './services/deepLinkService';
import { SplashScreen } from '@capacitor/splash-screen';

import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import BannerAd from './components/BannerAd';
import InterstitialModal from './components/InterstitialModal';
import RewardedModal from './components/RewardedModal';
import AdminPostModal from './components/AdminPostModal';
import AuthModal from './components/AuthModal';
import AppCustomizerModal from './components/AppCustomizerModal';
import NotificationModal from './components/NotificationModal';

import HomeFeed from './views/HomeFeed';
import ArticleDetail from './views/ArticleDetail';
import ExploreView from './views/ExploreView';
import BookmarksView from './views/BookmarksView';
import SettingsView from './views/SettingsView';
import PolicyView from './views/PolicyView';
import TermsView from './views/TermsView';
import DisclaimerView from './views/DisclaimerView';

import { Sparkles, X, BookOpen, Loader2, WifiOff } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [activeArticle, setActiveArticle] = useState(null);
  const [bookmarks, setBookmarks] = useState(storageService.getBookmarks());
  const [unlockedGuides, setUnlockedGuides] = useState(storageService.getUnlockedPremium());
  const [readerTheme, setReaderTheme] = useState(storageService.getThemeMode());
  const [fontSize, setFontSize] = useState(storageService.getFontSize());
  const [selectedCategory, setSelectedCategory] = useState('All');

  // App Branding & Theme Customization
  const [appConfig, setAppConfig] = useState(appConfigService.getConfig());
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Dynamic Categories
  const [categories, setCategories] = useState(categoryService.getCategories());

  // User & Admin Authentication
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [authModalState, setAuthModalState] = useState({ isOpen: false, requiredAdmin: false });

  // Custom Admin Articles & Cloud Real-Time Articles (Offline-First Persistent)
  const [customArticles, setCustomArticles] = useState(storageService.getCustomArticles());
  const [cloudArticles, setCloudArticles] = useState(() => storageService.getCachedArticles());
  const [isOnline, setIsOnline] = useState(navigator.onLine ?? true);
  const [editingArticle, setEditingArticle] = useState(null);

  // Modals State
  const [isAdminPostOpen, setIsAdminPostOpen] = useState(false);
  const [isInterstitialOpen, setIsInterstitialOpen] = useState(false);
  const [rewardedModalData, setRewardedModalData] = useState({ isOpen: false, article: null });
  const [isDailyTipOpen, setIsDailyTipOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => notificationService.getNotifications());

  // Real-time Cloud Synchronization & Network Connectivity Listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Notification Service Init & Deep Linking Handler
    const handleNotificationClick = (articleId, articleData) => {
      if (articleData) {
        setActiveArticle(articleData);
        setActiveTab('feed');
      } else if (articleId) {
        const cached = storageService.getCachedArticles() || [];
        const custom = storageService.getCustomArticles() || [];
        const target = [...cached, ...custom, ...initialArticlesData].find(
          (a) => String(a.id) === String(articleId)
        );
        if (target) {
          setActiveArticle(target);
          setActiveTab('feed');
        }
      }
    };

    notificationService.init(handleNotificationClick);
    window.__tippulse_on_notification_click = handleNotificationClick;

    // Deferred & Standard Deep Link Resolver (Preserves post navigation after Play Store install)
    deepLinkService.init((articleId) => {
      if (!articleId) return;
      const cached = storageService.getCachedArticles() || [];
      const custom = storageService.getCustomArticles() || [];
      const target = [...cached, ...custom, ...initialArticlesData].find(
        (a) => String(a.id) === String(articleId)
      );
      if (target) {
        setActiveArticle(target);
        setActiveTab('feed');
      }
    });

    const handleNotifUpdate = (e) => {
      if (e.detail) {
        setNotifications(e.detail);
      } else {
        setNotifications(notificationService.getNotifications());
      }
    };
    window.addEventListener('tippulse_notification_updated', handleNotifUpdate);

    // 1. Listen for real-time articles
    const unsubArticles = firestoreSyncService.subscribeArticles((articles) => {
      if (articles && articles.length > 0) {
        setCloudArticles(articles);
        storageService.setCachedArticles(articles);
      }
    });

    // 2. Listen for real-time branding changes
    const unsubConfig = firestoreSyncService.subscribeAppConfig((config) => {
      if (config && config.appName) {
        setAppConfig((prev) => ({ ...prev, ...config }));
      }
    });

    // 3. Listen for real-time categories
    const unsubCategories = firestoreSyncService.subscribeCategories((cats) => {
      if (cats && cats.length > 0) {
        setCategories(cats);
      }
    });

    // Reveal app smoothly as soon as React feed mounts (Single-Screen Experience)
    requestAnimationFrame(() => {
      SplashScreen.hide({ fadeOutDuration: 250 }).catch(() => {});
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('tippulse_notification_updated', handleNotifUpdate);
      unsubArticles();
      unsubConfig();
      unsubCategories();
    };
  }, []);

  // Combined articles (Real-time Cloud Articles + Offline Local Cache + Curated Fallback)
  const allArticles = useMemo(() => {
    const deletedIds = storageService.getDeletedArticleIds();
    let list = [];
    if (cloudArticles && cloudArticles.length > 0) {
      list = cloudArticles;
    } else {
      const cached = storageService.getCachedArticles();
      if (cached && cached.length > 0) {
        list = cached;
      } else if (customArticles && customArticles.length > 0) {
        list = [...customArticles, ...initialArticlesData];
      } else {
        list = initialArticlesData;
      }
    }
    return list.filter((a) => !deletedIds.includes(String(a.id)));
  }, [cloudArticles, customArticles]);

  const isAdmin = currentUser && currentUser.role === 'admin';

  // Sync dark theme class on document element
  useEffect(() => {
    if (readerTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('theme-sepia');
    } else if (readerTheme === 'sepia') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('theme-sepia');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.remove('theme-sepia');
    }
  }, [readerTheme]);

  // Sync Dynamic Global Accent Color Palette
  useEffect(() => {
    const palette = appConfig?.accentPalette || 'indigo';
    const root = document.documentElement;
    const allPalettes = ['palette-indigo', 'palette-emerald', 'palette-violet', 'palette-rose', 'palette-amber', 'palette-cyan', 'palette-blue', 'palette-slate'];
    allPalettes.forEach((p) => root.classList.remove(p));
    root.classList.add(`palette-${palette}`);
  }, [appConfig?.accentPalette]);

  // Cycle Theme: Light -> Dark -> Sepia -> Light
  const handleCycleTheme = () => {
    const modes = ['light', 'dark', 'sepia'];
    const nextIndex = (modes.indexOf(readerTheme) + 1) % modes.length;
    const nextTheme = modes[nextIndex];
    setReaderTheme(nextTheme);
    storageService.setThemeMode(nextTheme);
  };

  // Handle Category Management
  const handleAddCategory = async (label, icon) => {
    const updated = categoryService.addCategory(label, icon);
    if (updated) {
      setCategories(updated);
      await firestoreSyncService.saveCategories(updated);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm(`Delete the category "${id}"?`)) {
      const updated = categoryService.deleteCategory(id);
      setCategories(updated);
      await firestoreSyncService.saveCategories(updated);
    }
  };

  const handleResetCategories = async () => {
    const resetList = categoryService.resetCategories();
    setCategories(resetList);
    await firestoreSyncService.saveCategories(resetList);
  };

  // Handle App Branding / Theme Save
  const handleSaveAppConfig = async (newConfig) => {
    const updated = appConfigService.saveConfig(newConfig);
    setAppConfig(updated);
    await firestoreSyncService.saveAppConfig(newConfig);
  };

  const handleResetAppConfig = async () => {
    const defaultConf = appConfigService.resetConfig();
    setAppConfig(defaultConf);
    await firestoreSyncService.saveAppConfig(defaultConf);
  };

  // Handle Admin Post action trigger (Strict Admin Check)
  const handleTriggerAdminPost = () => {
    if (isAdmin) {
      setEditingArticle(null);
      setIsAdminPostOpen(true);
    } else {
      setAuthModalState({ isOpen: true, requiredAdmin: true });
    }
  };

  // Open Edit Modal for a specific article
  const handleEditArticle = (article) => {
    if (isAdmin) {
      setEditingArticle(article);
      setIsAdminPostOpen(true);
    } else {
      setAuthModalState({ isOpen: true, requiredAdmin: true });
    }
  };

  // Auth Callbacks
  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    if (authModalState.requiredAdmin && user.role === 'admin') {
      setEditingArticle(null);
      setIsAdminPostOpen(true);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAdminPostOpen(false);
  };

  // Save/Update article from Admin Studio (Instant Local + Cloud Firestore Sync)
  const handleSaveCustomArticle = async (articleData) => {
    if (!isAdmin) {
      alert('Unauthorized: Only Administrators can save articles.');
      return;
    }
    // Optimistic local update
    const updated = storageService.saveCustomArticle(articleData);
    setCustomArticles(updated);
    
    // Cloud Firestore save for all users
    try {
      await firestoreSyncService.saveArticle(articleData);
    } catch (err) {
      console.warn('Article saved locally, cloud sync pending:', err);
    }

    // Trigger instant notification with sound to mobile devices / in-app notification center
    if (articleData.notifyUsers !== false) {
      try {
        await notificationService.notifyNewArticle(articleData);
      } catch (err) {
        console.debug('Notification trigger error:', err);
      }
    }

    // If currently viewing this article, update it live in the reader
    if (activeArticle && activeArticle.id === articleData.id) {
      setActiveArticle(articleData);
    }
  };

  // Delete custom or any article as Admin (Instant Local + Cloud Firestore Sync)
  const handleDeleteCustomArticle = async (id) => {
    if (!isAdmin) {
      alert('Unauthorized: Only Administrators can delete articles.');
      return;
    }
    if (window.confirm('Are you sure you want to permanently delete this article?')) {
      const updated = storageService.deleteCustomArticle(id);
      setCustomArticles(updated);
      setCloudArticles((prev) => (prev || []).filter((a) => String(a.id) !== String(id)));
      try {
        await firestoreSyncService.deleteArticle(id);
      } catch (err) {
        console.warn('Article deleted locally, cloud sync pending:', err);
      }
      if (activeArticle && String(activeArticle.id) === String(id)) {
        setActiveArticle(null);
      }
    }
  };

  // Handle Bookmarking
  const handleToggleBookmark = (id) => {
    const updated = storageService.toggleBookmark(id);
    setBookmarks(updated);
  };

  // Open Article Detail View
  const handleOpenArticle = (article) => {
    storageService.addToHistory(article.id);
    setActiveArticle(article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Exit Article Detail View & Check for Natural Break Interstitial Ad
  const handleBackFromArticle = () => {
    setActiveArticle(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Check frequency cap for Interstitial
    if (admobService.recordArticleView()) {
      admobService.markInterstitialShown();
      setIsInterstitialOpen(true);
    }
  };

  // Trigger Rewarded Ad for locked premium articles
  const handleUnlockPremium = (article) => {
    setRewardedModalData({ isOpen: true, article });
  };

  const handleRewardEarned = () => {
    if (rewardedModalData.article) {
      const updated = storageService.unlockPremiumArticle(rewardedModalData.article.id);
      setUnlockedGuides(updated);
    }
  };

  const handleChangeTheme = (theme) => {
    setReaderTheme(theme);
    storageService.setThemeMode(theme);
  };

  const handleChangeFontSize = (size) => {
    setFontSize(size);
    storageService.setFontSize(size);
  };

  const handleSelectCategoryFromExplore = (categoryLabel) => {
    setSelectedCategory(categoryLabel || 'All');
    setActiveTab('feed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fontClass = appConfig.fontFamily === 'serif' ? 'font-serif' : 'font-sans';

  return (
    <div className={`min-h-screen ${
      readerTheme === 'dark'
        ? 'dark bg-slate-900 text-slate-100'
        : readerTheme === 'sepia'
          ? 'theme-sepia bg-[#fbf0d9] text-[#433422]'
          : 'bg-slate-50 text-slate-900'
    } transition-colors ${fontClass}`}>
      {/* If reading an article, display reader view */}
      {activeArticle ? (
        <ArticleDetail
          article={activeArticle}
          isBookmarked={bookmarks.includes(activeArticle.id)}
          onToggleBookmark={handleToggleBookmark}
          onBack={handleBackFromArticle}
          onUnlockPremium={handleUnlockPremium}
          isUnlocked={unlockedGuides.includes(activeArticle.id)}
          readerTheme={readerTheme}
          onChangeReaderTheme={handleChangeTheme}
          fontSize={fontSize}
          onChangeFontSize={handleChangeFontSize}
          isAdmin={isAdmin}
          onEditCurrentArticle={handleEditArticle}
          onDeleteCurrentArticle={handleDeleteCustomArticle}
        />
      ) : (
        /* Otherwise display Main App Navigation & Views */
        <div className="flex flex-col min-h-screen">
          {/* Top Navbar with 1-click Night Mode toggle */}
          <Navbar
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            bookmarkCount={bookmarks.length}
            onOpenDailyTip={() => setIsDailyTipOpen(true)}
            onOpenAdminPost={handleTriggerAdminPost}
            onOpenCustomizer={() => setIsCustomizerOpen(true)}
            currentUser={currentUser}
            onOpenAuth={(requiredAdmin) => setAuthModalState({ isOpen: true, requiredAdmin })}
            onLogout={handleLogout}
            appConfig={appConfig}
            currentTheme={readerTheme}
            onToggleTheme={handleCycleTheme}
            unreadNotificationCount={notifications.filter((n) => !n.read).length}
            onOpenNotifications={() => setIsNotificationOpen(true)}
          />

          {/* Offline Mode Banner (Shows when mobile data / wifi is off) */}
          {!isOnline && (
            <div className="bg-amber-500/15 dark:bg-amber-950/40 border-b border-amber-300/40 dark:border-amber-800/40 px-4 py-2 text-center text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-center justify-center space-x-1.5 animate-in fade-in">
              <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Offline Reading Mode: All your written & saved articles are ready offline.</span>
            </div>
          )}

          {/* View Container */}
          <main className="flex-1">
            {activeTab === 'feed' && (
              <HomeFeed
                articles={allArticles}
                bookmarks={bookmarks}
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onToggleBookmark={handleToggleBookmark}
                onOpenArticle={handleOpenArticle}
                onExploreCategory={handleSelectCategoryFromExplore}
              />
            )}

            {activeTab === 'explore' && (
              <ExploreView
                articles={allArticles}
                bookmarks={bookmarks}
                categories={categories}
                onToggleBookmark={handleToggleBookmark}
                onOpenArticle={handleOpenArticle}
                onSelectCategory={handleSelectCategoryFromExplore}
              />
            )}

            {activeTab === 'bookmarks' && (
              <BookmarksView
                articles={allArticles}
                bookmarks={bookmarks}
                onToggleBookmark={handleToggleBookmark}
                onOpenArticle={handleOpenArticle}
                onExploreClick={() => setActiveTab('feed')}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                readerTheme={readerTheme}
                onChangeReaderTheme={handleChangeTheme}
                fontSize={fontSize}
                onChangeFontSize={handleChangeFontSize}
                onOpenPolicy={() => setActiveTab('policy')}
                onOpenTerms={() => setActiveTab('terms')}
                onOpenDisclaimer={() => setActiveTab('disclaimer')}
                onOpenAdminPost={handleTriggerAdminPost}
                onOpenCustomizer={() => setIsCustomizerOpen(true)}
                onEditArticle={handleEditArticle}
                customArticles={customArticles}
                onDeleteCustomArticle={handleDeleteCustomArticle}
                currentUser={currentUser}
                onOpenAuth={(requiredAdmin) => setAuthModalState({ isOpen: true, requiredAdmin })}
                onLogout={handleLogout}
                appConfig={appConfig}
              />
            )}

            {activeTab === 'policy' && (
              <PolicyView onBack={() => setActiveTab('settings')} />
            )}

            {activeTab === 'terms' && (
              <TermsView onBack={() => setActiveTab('settings')} />
            )}

            {activeTab === 'disclaimer' && (
              <DisclaimerView onBack={() => setActiveTab('settings')} />
            )}
          </main>

          {/* Anchored Bottom AdMob Banner */}
          <BannerAd position="bottom" />

          {/* Bottom Navigation */}
          <BottomNav
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            bookmarkCount={bookmarks.length}
          />
        </div>
      )}

      {/* App Logo, Category & Theme Customizer Modal */}
      {isAdmin && (
        <AppCustomizerModal
          isOpen={isCustomizerOpen}
          onClose={() => setIsCustomizerOpen(false)}
          config={appConfig}
          onSaveConfig={handleSaveAppConfig}
          onResetConfig={handleResetAppConfig}
          categories={categories}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          onResetCategories={handleResetCategories}
        />
      )}

      {/* User & Admin Auth Modal */}
      <AuthModal
        isOpen={authModalState.isOpen}
        requiredAdmin={authModalState.requiredAdmin}
        onClose={() => setAuthModalState({ isOpen: false, requiredAdmin: false })}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Admin / Creator Post Modal */}
      <AdminPostModal
        isOpen={Boolean(isAdmin && isAdminPostOpen)}
        editingArticle={editingArticle}
        categories={categories}
        onClose={() => {
          setIsAdminPostOpen(false);
          setEditingArticle(null);
        }}
        onSaveArticle={handleSaveCustomArticle}
      />

      {/* AdMob Interstitial Ad Modal */}
      <InterstitialModal
        isOpen={isInterstitialOpen}
        onClose={() => setIsInterstitialOpen(false)}
      />

      {/* AdMob Rewarded Video Ad Modal */}
      <RewardedModal
        isOpen={rewardedModalData.isOpen}
        articleTitle={rewardedModalData.article?.title || ''}
        onClose={() => setRewardedModalData({ isOpen: false, article: null })}
        onRewardEarned={handleRewardEarned}
      />

      {/* Daily Quick Tip Popup Dialog */}
      {isDailyTipOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center relative">
            <button
              onClick={() => setIsDailyTipOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center mx-auto mb-3 text-amber-500">
              <Sparkles className="w-7 h-7" />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full border border-amber-200/50">
              Daily Pulse Nugget
            </span>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
              {appConfig.dailyTipTitle || 'Daily Insight'}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              {appConfig.dailyTipContent || 'Start small and build momentum one step at a time.'}
            </p>

            <button
              onClick={() => setIsDailyTipOpen(false)}
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2.5 rounded-xl shadow-md shadow-indigo-600/20 transition-all"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Notification Center Modal */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onSelectArticle={(articleId) => {
          setIsNotificationOpen(false);
          const target = allArticles.find((a) => String(a.id) === String(articleId));
          if (target) {
            setActiveArticle(target);
            setActiveTab('feed');
          }
        }}
        onMarkAllRead={() => {
          const updated = notificationService.markAllAsRead();
          setNotifications(updated);
        }}
        onClearAll={() => {
          const updated = notificationService.clearAll();
          setNotifications(updated);
        }}
        currentUser={currentUser}
        onOpenAuth={(requiredAdmin) => setAuthModalState({ isOpen: true, requiredAdmin })}
      />
    </div>
  );
}
