import React, { useState, useEffect, useMemo, useRef, Suspense, lazy } from 'react';
import initialArticlesData from './data/articles.json';
import { storageService } from './services/storageService';
import { admobService } from './services/admobService';
import { appConfigService, THEME_PALETTES } from './services/appConfigService';
import { categoryService } from './services/categoryService';
import { firestoreSyncService } from './services/firestoreSyncService';
import { notificationService } from './services/notificationService';
import { deepLinkService } from './services/deepLinkService';
import { SplashScreen } from '@capacitor/splash-screen';
import { Network } from '@capacitor/network';
import { App as CapacitorApp } from '@capacitor/app';

import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import BannerAd from './components/BannerAd';
import HomeFeed from './views/HomeFeed';

// High-Performance Code-Splitting: Lazy load secondary views & modals off initial boot thread
const ArticleDetail = lazy(() => import('./views/ArticleDetail'));
const ExploreView = lazy(() => import('./views/ExploreView'));
const BookmarksView = lazy(() => import('./views/BookmarksView'));
const SettingsView = lazy(() => import('./views/SettingsView'));
const PolicyView = lazy(() => import('./views/PolicyView'));
const TermsView = lazy(() => import('./views/TermsView'));
const DisclaimerView = lazy(() => import('./views/DisclaimerView'));

const InterstitialModal = lazy(() => import('./components/InterstitialModal'));
const RewardedModal = lazy(() => import('./components/RewardedModal'));
const NotificationModal = lazy(() => import('./components/NotificationModal'));

import { Sparkles, X, BookOpen, Loader2, WifiOff, LogOut } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [activeArticle, setActiveArticle] = useState(null);
  const [bookmarks, setBookmarks] = useState(storageService.getBookmarks());
  const [unlockedGuides, setUnlockedGuides] = useState(storageService.getUnlockedPremium());
  const [readerTheme, setReaderTheme] = useState(storageService.getThemeMode());
  const [fontSize, setFontSize] = useState(storageService.getFontSize());
  const [selectedCategory, setSelectedCategory] = useState('All');

  // App Branding & Theme
  const [appConfig, setAppConfig] = useState(appConfigService.getConfig());

  // Dynamic Categories
  const [categories, setCategories] = useState(categoryService.getCategories());

  // Cloud Real-Time Articles & Custom Articles (Offline-First Persistent)
  const [customArticles, setCustomArticles] = useState(storageService.getCustomArticles());
  const [cloudArticles, setCloudArticles] = useState(() => storageService.getCachedArticles());
  const [isOnline, setIsOnline] = useState(navigator.onLine ?? true);

  // Modals State
  const [isInterstitialOpen, setIsInterstitialOpen] = useState(false);
  const [rewardedModalData, setRewardedModalData] = useState({ isOpen: false, article: null });
  const [isDailyTipOpen, setIsDailyTipOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [exitToast, setExitToast] = useState(null);
  const exitTapCountRef = useRef(0);
  const exitTapTimerRef = useRef(null);
  const [notifications, setNotifications] = useState(() => notificationService.getNotifications());

  // Real-time Cloud Synchronization & Network Connectivity Listeners
  useEffect(() => {
    // 1. Reveal app ultra-fast the instant React mounts
    SplashScreen.hide({ fadeOutDuration: 40 }).catch(() => {});

    // 2. Native Capacitor Android Network Connectivity Sync (detects mobile data/wifi toggle)
    Network.getStatus().then((status) => {
      setIsOnline(status.connected);
    }).catch(() => {
      setIsOnline(navigator.onLine ?? true);
    });

    const netListenerPromise = Network.addListener('networkStatusChange', (status) => {
      setIsOnline(status.connected);
    });

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 3. Move Heavy / Network SDKs to Deferred Background Execution (Non-blocking cold boot)
    let unsubArticles = () => {};
    let unsubNotifications = () => {};
    let unsubConfig = () => {};
    let unsubCategories = () => {};

    const timer = setTimeout(() => {
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

      // Deferred Deep Link Resolver
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

      // Background Firestore Subscriptions for Cloud Notifications (Multi-device Sync)
      unsubNotifications = firestoreSyncService.subscribeNotifications((cloudNotifs) => {
        if (cloudNotifs && cloudNotifs.length > 0) {
          const synced = notificationService.syncCloudNotifications(cloudNotifs);
          setNotifications(synced);
        }
      });

      // Background Firestore Subscriptions
      unsubArticles = firestoreSyncService.subscribeArticles((articles) => {
        if (articles && articles.length > 0) {
          setCloudArticles(articles);
          storageService.setCachedArticles(articles);
        }
      });

      unsubConfig = firestoreSyncService.subscribeAppConfig((config) => {
        if (config && config.appName) {
          setAppConfig((prev) => ({ ...prev, ...config }));
        }
      });

      unsubCategories = firestoreSyncService.subscribeCategories((cats) => {
        if (cats && cats.length > 0) {
          setCategories(cats);
        }
      });
    }, 100);

    const handleNotifUpdate = (e) => {
      if (e.detail) {
        setNotifications(e.detail);
      } else {
        setNotifications(notificationService.getNotifications());
      }
    };
    window.addEventListener('tippulse_notification_updated', handleNotifUpdate);

    return () => {
      clearTimeout(timer);
      netListenerPromise.then((handle) => handle.remove()).catch(() => {});
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('tippulse_notification_updated', handleNotifUpdate);
      unsubNotifications();
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
    try {
      window.history.pushState({ view: 'article', id: article.id }, '');
    } catch {}
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

  // Keep navigation references synchronized for Android hardware back button
  const appNavStateRef = useRef({
    activeArticle,
    activeTab,
    isNotificationOpen,
    isInterstitialOpen,
    isRewardedOpen: rewardedModalData.isOpen,
    isDailyTipOpen,
    isExitModalOpen,
  });

  useEffect(() => {
    appNavStateRef.current = {
      activeArticle,
      activeTab,
      isNotificationOpen,
      isInterstitialOpen,
      isRewardedOpen: rewardedModalData.isOpen,
      isDailyTipOpen,
      isExitModalOpen,
    };
  }, [activeArticle, activeTab, isNotificationOpen, isInterstitialOpen, rewardedModalData.isOpen, isDailyTipOpen, isExitModalOpen]);

  // Handle Android Native Navigation & Hardware Back Button (< key)
  useEffect(() => {
    let backListenerHandle = null;

    const registerBackHandler = async () => {
      try {
        const handle = await CapacitorApp.addListener('backButton', () => {
          // 1. Dispatch custom event for child modals (like ShareModal in ArticleDetail)
          const backEvent = new CustomEvent('tippulse_hardware_back', { cancelable: true });
          const isCancelled = !window.dispatchEvent(backEvent);
          if (isCancelled) {
            // Child modal handled and consumed the back action
            return;
          }

          const state = appNavStateRef.current;

          // 2. If exit confirmation modal is open, close it on back press
          if (state.isExitModalOpen) {
            setIsExitModalOpen(false);
            exitTapCountRef.current = 0;
            return;
          }

          // 3. Close any open top-level modals
          if (state.isNotificationOpen) {
            setIsNotificationOpen(false);
            return;
          }
          if (state.isInterstitialOpen) {
            setIsInterstitialOpen(false);
            return;
          }
          if (state.isRewardedOpen) {
            setRewardedModalData({ isOpen: false, article: null });
            return;
          }
          if (state.isDailyTipOpen) {
            setIsDailyTipOpen(false);
            return;
          }

          // 4. If reading an article, navigate back to Home Feed!
          if (state.activeArticle) {
            handleBackFromArticle();
            return;
          }

          // 5. If in another tab (Explore, Bookmarks, Settings), navigate back to Home Feed
          if (state.activeTab !== 'feed') {
            setActiveTab('feed');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }

          // 6. If on Home Feed with no modals: require 3 taps to show exit confirmation dialog
          if (exitTapTimerRef.current) {
            clearTimeout(exitTapTimerRef.current);
          }
          exitTapCountRef.current += 1;

          if (exitTapCountRef.current === 1) {
            setExitToast('Tap back 2 more times to exit');
            exitTapTimerRef.current = setTimeout(() => {
              exitTapCountRef.current = 0;
              setExitToast(null);
            }, 3500);
          } else if (exitTapCountRef.current === 2) {
            setExitToast('Tap back 1 more time to exit');
            exitTapTimerRef.current = setTimeout(() => {
              exitTapCountRef.current = 0;
              setExitToast(null);
            }, 3500);
          } else if (exitTapCountRef.current >= 3) {
            exitTapCountRef.current = 0;
            setExitToast(null);
            setIsExitModalOpen(true);
          }
        });
        backListenerHandle = handle;
      } catch (err) {
        console.warn('Capacitor backButton listener not available on this platform:', err);
      }
    };

    registerBackHandler();

    // Browser popstate listener for web/gestures
    const handlePopState = () => {
      if (appNavStateRef.current.activeArticle) {
        handleBackFromArticle();
      }
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      if (backListenerHandle) {
        backListenerHandle.remove();
      }
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Trigger Rewarded Ad for locked premium articles (Requires active internet connection)
  const handleUnlockPremium = (article) => {
    if (!isOnline) {
      alert('⚠️ Internet Connection Required\n\nPlease connect to Mobile Data or Wi-Fi to load and watch the sponsor video to unlock this article.');
      return;
    }
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
        <Suspense fallback={null}>
          <ArticleDetail
            article={activeArticle}
            isBookmarked={bookmarks.includes(activeArticle.id)}
            onToggleBookmark={handleToggleBookmark}
            onBack={handleBackFromArticle}
            onUnlockPremium={handleUnlockPremium}
            isUnlocked={unlockedGuides.includes(activeArticle.id)}
            isOnline={isOnline}
            readerTheme={readerTheme}
            onChangeReaderTheme={handleChangeTheme}
            fontSize={fontSize}
            onChangeFontSize={handleChangeFontSize}
          />
        </Suspense>
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

            <Suspense fallback={null}>
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
            </Suspense>
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

      {/* Suspense Container for Lazy-loaded Modals */}
      <Suspense fallback={null}>
        {/* AdMob Interstitial Ad Modal */}
        {isInterstitialOpen && (
          <InterstitialModal
            isOpen={isInterstitialOpen}
            onClose={() => setIsInterstitialOpen(false)}
          />
        )}

        {/* AdMob Rewarded Video Ad Modal */}
        {rewardedModalData.isOpen && (
          <RewardedModal
            isOpen={rewardedModalData.isOpen}
            articleTitle={rewardedModalData.article?.title || ''}
            isOnline={isOnline}
            onClose={() => setRewardedModalData({ isOpen: false, article: null })}
            onRewardEarned={handleRewardEarned}
          />
        )}

        {/* Notification Center Modal */}
        {isNotificationOpen && (
          <NotificationModal
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
            notifications={notifications}
            onSelectArticle={(articleId, notificationItem) => {
              setIsNotificationOpen(false);
              let target = allArticles.find((a) => String(a.id) === String(articleId));
              if (!target) {
                target = allArticles.find((a) => a.id === 'welcome-to-tippulse');
              }
              if (!target && notificationItem) {
                target = {
                  id: articleId || 'welcome-to-tippulse',
                  title: notificationItem.title || 'Welcome to TipPulse! ✨',
                  category: notificationItem.category || 'Pulse Update',
                  image: notificationItem.imageUrl || '/app-icon.png',
                  author: 'TipPulse Team',
                  date: 'Today',
                  summary: notificationItem.body || 'Welcome to TipPulse notifications!',
                  content: '### Welcome to TipPulse! 🎉\n\nInvite your friends and family to explore daily curated tips and guides together!'
                };
              }
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
          />
        )}
      </Suspense>

      {/* Floating Exit Hint Toast */}
      {exitToast && (
        <div className="fixed bottom-20 inset-x-0 mx-auto w-fit z-50 px-4 py-2 rounded-full bg-slate-900/90 dark:bg-slate-800/95 text-white border border-slate-700 shadow-xl flex items-center space-x-2 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 pointer-events-none">
          <span>{exitToast}</span>
        </div>
      )}

      {/* Exit Confirmation Dialog (Triggered on 3rd tap on Home Feed) */}
      {isExitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-xs rounded-3xl p-6 shadow-2xl space-y-4 text-center animate-in zoom-in-95 duration-150"
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400">
              <LogOut className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Close {appConfig?.appName || 'TipPulse'}?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Do you want to close the app?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsExitModalOpen(false);
                  exitTapCountRef.current = 0;
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              >
                No, Stay
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsExitModalOpen(false);
                  CapacitorApp.exitApp();
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-md shadow-rose-600/30 transition-all cursor-pointer"
              >
                Yes, Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
