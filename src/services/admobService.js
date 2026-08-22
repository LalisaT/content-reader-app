// Google AdMob Integration Service for TipPulse
// Policy Compliant Ad Configuration & Simulation Manager

export const ADMOB_CONFIG = {
  // Official Google AdMob Test Ad Unit IDs (for development & validation)
  TEST_IDS: {
    BANNER_ANDROID: 'ca-app-pub-3940256099942544/6300978111',
    INTERSTITIAL_ANDROID: 'ca-app-pub-3940256099942544/1033173712',
    REWARDED_ANDROID: 'ca-app-pub-3940256099942544/5224354917',
    NATIVE_ADVANCED_ANDROID: 'ca-app-pub-3940256099942544/2247696110',
  },
  // Set to true in development, false when publishing to Google Play / App Store with live IDs
  isTestMode: true,
  // Frequency cap: Show interstitial at most once every 3 article views or 90 seconds
  INTERSTITIAL_FREQUENCY_PAGES: 3,
  INTERSTITIAL_COOLDOWN_MS: 60 * 1000,
};

// Curated mock sponsored native ads that match AdMob native templates
export const SAMPLE_NATIVE_ADS = [
  {
    id: 'ad-native-1',
    headline: 'Master Cloud Engineering with AWS Certified Tracks',
    advertiser: 'CloudAcademy Pro',
    bodyText: 'Accelerate your career with hands-on cloud labs and real-world architectures. 30% off today.',
    callToAction: 'Learn More',
    starRating: 4.8,
    reviewsCount: '14.2k',
    iconUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=120&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    targetUrl: 'https://example.com/sponsor-cloud',
  },
  {
    id: 'ad-native-2',
    headline: 'Supercharge Your Morning: Clean Plant Protein & Electrolytes',
    advertiser: 'NutriPeak Health',
    bodyText: 'Zero sugar, 100% organic hydration and focus fuel recommended by top athletes.',
    callToAction: 'Claim Free Sample',
    starRating: 4.9,
    reviewsCount: '8.7k',
    iconUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=120&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    targetUrl: 'https://example.com/sponsor-nutrition',
  },
  {
    id: 'ad-native-3',
    headline: 'Automate Your Investments with AI-Driven Index Portfolios',
    advertiser: 'WealthSmart Robo',
    bodyText: 'Start with as little as $10. SIPC insured with automated tax-loss harvesting.',
    callToAction: 'Open Account',
    starRating: 4.7,
    reviewsCount: '23k',
    iconUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=120&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
    targetUrl: 'https://example.com/sponsor-finance',
  }
];

class AdMobManager {
  constructor() {
    this.articleViewCount = 0;
    this.lastInterstitialTime = 0;
    this.nativeAdIndex = 0;
  }

  // Record article view and check if interstitial is eligible
  recordArticleView() {
    this.articleViewCount += 1;
    const now = Date.now();
    const isCountEligible = this.articleViewCount % ADMOB_CONFIG.INTERSTITIAL_FREQUENCY_PAGES === 0;
    const isTimeEligible = now - this.lastInterstitialTime > ADMOB_CONFIG.INTERSTITIAL_COOLDOWN_MS;

    if (isCountEligible && isTimeEligible) {
      return true;
    }
    return false;
  }

  markInterstitialShown() {
    this.lastInterstitialTime = Date.now();
  }

  getNextNativeAd() {
    const ad = SAMPLE_NATIVE_ADS[this.nativeAdIndex % SAMPLE_NATIVE_ADS.length];
    this.nativeAdIndex += 1;
    return ad;
  }
}

export const admobService = new AdMobManager();
