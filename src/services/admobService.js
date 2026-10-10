// Google AdMob Native Integration Service for TipPulse
// Implements Official @capacitor-community/admob SDK with Live Production Ad Units
import { Capacitor } from '@capacitor/core';
import {
  AdMob,
  BannerAdSize,
  BannerAdPosition,
  BannerAdPluginEvents,
  InterstitialAdPluginEvents,
  RewardAdPluginEvents,
} from '@capacitor-community/admob';

export const ADMOB_CONFIG = {
  APP_ID: 'ca-app-pub-9121868006610716~6779939377',
  PUBLISHER_ID: 'pub-9121868006610716',
  // Official Live Production Google AdMob Ad Units
  UNITS: {
    BANNER_ANDROID: 'ca-app-pub-9121868006610716/1856941872',
    INTERSTITIAL_ANDROID: 'ca-app-pub-9121868006610716/2926868005',
    REWARDED_ANDROID: 'ca-app-pub-9121868006610716/6726125177',
  },
  // Backwards compatibility alias
  TEST_IDS: {
    BANNER_ANDROID: 'ca-app-pub-9121868006610716/1856941872',
    INTERSTITIAL_ANDROID: 'ca-app-pub-9121868006610716/2926868005',
    REWARDED_ANDROID: 'ca-app-pub-9121868006610716/6726125177',
  },
  isTesting: false,
  isTestMode: false,
  // Show interstitial every 2 article/job reads with 20s cooldown
  INTERSTITIAL_FREQUENCY_ARTICLES: 2,
  INTERSTITIAL_FREQUENCY_PAGES: 2,
  INTERSTITIAL_COOLDOWN_MS: 20 * 1000,
};

// Curated high-CTR sponsored partner cards for smooth in-writing placements & web fallbacks
export const SAMPLE_NATIVE_ADS = [
  {
    id: 'ad-partner-1',
    headline: 'Master Daily Focus with Smart Habit Architecture',
    advertiser: 'Pulse Productivity Hub',
    bodyText: 'Supercharge your daily output with science-backed micro-routines and mindful task flows.',
    callToAction: 'Explore Insights',
    starRating: 4.9,
    reviewsCount: '18.4k',
    iconUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=120&q=80',
    targetUrl: 'https://tippulse.web.app',
  },
  {
    id: 'ad-partner-2',
    headline: 'Clean Energy & Cognitive Hydration Formula',
    advertiser: 'NutriPeak Health Lab',
    bodyText: 'Zero-sugar brain boost and clean sustained physical stamina engineered for thinkers.',
    callToAction: 'Learn More',
    starRating: 4.8,
    reviewsCount: '9.2k',
    iconUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=120&q=80',
    targetUrl: 'https://tippulse.web.app',
  },
  {
    id: 'ad-partner-3',
    headline: 'Automated Portfolio & Wealth Compounding Engine',
    advertiser: 'SmartVest AI',
    bodyText: 'Institutional-grade diversification and automated balancing in an intuitive mobile suite.',
    callToAction: 'Get Started',
    starRating: 4.9,
    reviewsCount: '27k',
    iconUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=120&q=80',
    targetUrl: 'https://tippulse.web.app',
  }
];

class AdMobManager {
  constructor() {
    this.isInitialized = false;
    this.isBannerActive = false;
    this.isBannerLoading = false;
    this.isInterstitialLoaded = false;
    this.isRewardedLoaded = false;
    this.articleReadCount = 0;
    this.lastInterstitialTime = 0;
    this.nativeAdIndex = 0;
    this.currentBannerMargin = 56;
  }

  // 1. Initialize Google Mobile Ads SDK on native platform
  async initialize() {
    if (!Capacitor.isNativePlatform()) {
      this.isInitialized = true;
      return;
    }

    if (this.isInitialized) return;

    try {
      await AdMob.initialize({
        requestTrackingAuthorization: true,
        initializeForTesting: ADMOB_CONFIG.isTesting,
      });

      this.isInitialized = true;
      console.log('AdMob: Native SDK initialized successfully for com.tippulse.app.');

      this.setupEventListeners();

      // Background preloads for smooth, instantaneous playback
      setTimeout(() => {
        this.preloadInterstitial();
        this.preloadRewarded();
        this.showBanner(56);
      }, 300);

      // 24/7 Non-Stop Continuous Banner Keep-Alive Heartbeat (Every 12s)
      setInterval(() => {
        this.ensureBannerAlive();
      }, 12000);
    } catch (err) {
      console.warn('AdMob initialization error:', err);
    }
  }

  // Setup listeners for automatic re-loads and lifecycle events
  setupEventListeners() {
    if (!Capacitor.isNativePlatform()) return;

    try {
      // Banner events
      AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
        this.isBannerActive = true;
        this.isBannerLoading = false;
        if (this.bannerRetryTimeout) {
          clearTimeout(this.bannerRetryTimeout);
          this.bannerRetryTimeout = null;
        }
        console.log('AdMob: Adaptive Banner loaded & active 24/7.');
      });

      AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (err) => {
        console.warn('AdMob: Banner failed to load, retrying in 8s:', err);
        this.isBannerActive = false;
        this.isBannerLoading = false;
        if (this.bannerRetryTimeout) clearTimeout(this.bannerRetryTimeout);
        this.bannerRetryTimeout = setTimeout(() => {
          this.showBanner(this.currentBannerMargin);
        }, 8000);
      });

      // Window focus, network reconnect, and foreground recovery to keep banner running 24/7
      if (typeof window !== 'undefined') {
        window.addEventListener('focus', () => {
          this.ensureBannerAlive();
        });
        window.addEventListener('online', () => {
          this.ensureBannerAlive();
        });
        document.addEventListener('visibilitychange', () => {
          if (!document.hidden) {
            this.ensureBannerAlive();
          }
        });
      }

      // Interstitial events
      AdMob.addListener(InterstitialAdPluginEvents.Loaded, () => {
        this.isInterstitialLoaded = true;
        console.log('AdMob: Interstitial prepared in background.');
      });

      AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
        this.isInterstitialLoaded = false;
        this.lastInterstitialTime = Date.now();
        // Silently preload next interstitial after 2 seconds
        setTimeout(() => this.preloadInterstitial(), 2000);
      });

      AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, (err) => {
        this.isInterstitialLoaded = false;
        console.warn('AdMob: Interstitial failed to load:', err);
      });

      // Rewarded events
      AdMob.addListener(RewardAdPluginEvents.Loaded, () => {
        this.isRewardedLoaded = true;
        console.log('AdMob: Rewarded Video prepared in background.');
      });

      AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
        this.isRewardedLoaded = false;
        setTimeout(() => this.preloadRewarded(), 2000);
      });

      AdMob.addListener(RewardAdPluginEvents.FailedToLoad, (err) => {
        this.isRewardedLoaded = false;
        console.warn('AdMob: Rewarded ad failed to load:', err);
      });
    } catch (e) {
      console.warn('AdMob listener setup warning:', e);
    }
  }

  // 2. Banner Ad Management (24/7 Non-Removable Real AdMob Banner)
  async ensureBannerAlive() {
    if (!Capacitor.isNativePlatform()) return;
    if (!this.isInitialized) {
      await this.initialize();
      return;
    }
    if (this.isBannerActive) {
      try {
        await AdMob.resumeBanner();
      } catch (e) {}
      return;
    }
    if (!this.isBannerLoading) {
      await this.showBanner(this.currentBannerMargin);
    }
  }

  async showBanner(margin = 56) {
    if (!Capacitor.isNativePlatform()) return;
    const prevMargin = this.currentBannerMargin;
    this.currentBannerMargin = margin;

    if (this.isBannerActive && prevMargin === margin) {
      try {
        await AdMob.resumeBanner();
      } catch (e) {}
      return;
    }

    try {
      this.isBannerLoading = true;
      await AdMob.showBanner({
        adId: ADMOB_CONFIG.UNITS.BANNER_ANDROID,
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin,
        isTesting: ADMOB_CONFIG.isTesting,
      });
      this.isBannerActive = true;
      this.isBannerLoading = false;
    } catch (err) {
      this.isBannerLoading = false;
      console.warn('AdMob showBanner warning:', err);
      try {
        await AdMob.resumeBanner();
        this.isBannerActive = true;
      } catch (resumeErr) {}
    }
  }

  // Never hide or remove the 24/7 banner; keep it active at all times
  async hideBanner() {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await this.ensureBannerAlive();
    } catch (e) {}
  }

  async resumeBanner() {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await this.ensureBannerAlive();
    } catch (e) {}
  }

  // Dock banner to bottom (margin: 0) in full-screen Article/Job readers, or above BottomNav (margin: 56) on main tabs
  async setBannerReadingMode(isReading = false) {
    if (!Capacitor.isNativePlatform()) return;
    const targetMargin = isReading ? 0 : 56;
    await this.showBanner(targetMargin);
  }

  // 3. Interstitial Ad Management (Preload + Natural Break Trigger)
  async preloadInterstitial() {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await AdMob.prepareInterstitial({
        adId: ADMOB_CONFIG.UNITS.INTERSTITIAL_ANDROID,
        isTesting: ADMOB_CONFIG.isTesting,
      });
      this.isInterstitialLoaded = true;
    } catch (err) {
      this.isInterstitialLoaded = false;
      console.warn('AdMob preloadInterstitial error:', err);
    }
  }

  // Frequency-capped natural break trigger (e.g., exiting article back to feed)
  async showInterstitialIfEligible(onWebFallback) {
    this.articleReadCount += 1;
    const now = Date.now();
    const countMatch = this.articleReadCount % ADMOB_CONFIG.INTERSTITIAL_FREQUENCY_ARTICLES === 0;
    const cooldownPassed = (now - this.lastInterstitialTime) > ADMOB_CONFIG.INTERSTITIAL_COOLDOWN_MS;

    if (!countMatch || !cooldownPassed) {
      return false;
    }

    this.lastInterstitialTime = now;

    if (Capacitor.isNativePlatform()) {
      try {
        if (this.isInterstitialLoaded) {
          await AdMob.showInterstitial();
          return true;
        } else {
          // Quick on-demand preload attempt
          await this.preloadInterstitial();
          if (this.isInterstitialLoaded) {
            await AdMob.showInterstitial();
            return true;
          }
        }
      } catch (err) {
        console.warn('AdMob showInterstitial error:', err);
      }
      return false;
    }

    // Web fallback simulation
    if (typeof onWebFallback === 'function') {
      onWebFallback();
    }
    return true;
  }

  // Legacy helper methods for backwards compatibility
  recordArticleView() {
    this.articleReadCount += 1;
    const now = Date.now();
    const isCountEligible = this.articleReadCount % ADMOB_CONFIG.INTERSTITIAL_FREQUENCY_ARTICLES === 0;
    const isTimeEligible = now - this.lastInterstitialTime > ADMOB_CONFIG.INTERSTITIAL_COOLDOWN_MS;
    return isCountEligible && isTimeEligible;
  }

  markInterstitialShown() {
    this.lastInterstitialTime = Date.now();
  }

  // 4. Rewarded Video Ad Management (Unlocking Premium Articles)
  async preloadRewarded() {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await AdMob.prepareRewardVideoAd({
        adId: ADMOB_CONFIG.UNITS.REWARDED_ANDROID,
        isTesting: ADMOB_CONFIG.isTesting,
      });
      this.isRewardedLoaded = true;
    } catch (err) {
      this.isRewardedLoaded = false;
      console.warn('AdMob preloadRewarded error:', err);
    }
  }

  async showRewardedAd() {
    if (Capacitor.isNativePlatform()) {
      try {
        if (!this.isRewardedLoaded) {
          await this.preloadRewarded();
        }
        const rewardItem = await AdMob.showRewardVideoAd();
        // Immediately preload the next rewarded ad
        setTimeout(() => this.preloadRewarded(), 2000);
        return { success: true, rewardItem };
      } catch (err) {
        console.warn('AdMob showRewardedAd error:', err);
        return { success: false, error: err };
      }
    }

    // Web simulation
    return { success: true, simulated: true };
  }

  getNextNativeAd() {
    const ad = SAMPLE_NATIVE_ADS[this.nativeAdIndex % SAMPLE_NATIVE_ADS.length];
    this.nativeAdIndex += 1;
    return ad;
  }
}

export const admobService = new AdMobManager();
