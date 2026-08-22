// Storage Service for TipPulse Reader App
// Manages bookmarks, read history, user preferences, offline data, and custom admin posts

const STORAGE_KEYS = {
  BOOKMARKS: 'tippulse_bookmarks',
  READ_HISTORY: 'tippulse_read_history',
  THEME_MODE: 'tippulse_theme_mode',
  FONT_SIZE: 'tippulse_font_size',
  UNLOCKED_PREMIUM: 'tippulse_unlocked_premium',
  AD_CONSENT: 'tippulse_ad_consent',
  CUSTOM_ARTICLES: 'tippulse_custom_articles',
};

export const storageService = {
  // Custom User/Admin Articles
  getCustomArticles: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_ARTICLES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCustomArticle: (article) => {
    const list = storageService.getCustomArticles();
    const existingIndex = list.findIndex((a) => a.id === article.id);
    let updated;
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = article;
    } else {
      updated = [article, ...list];
    }
    localStorage.setItem(STORAGE_KEYS.CUSTOM_ARTICLES, JSON.stringify(updated));
    return updated;
  },

  deleteCustomArticle: (id) => {
    const list = storageService.getCustomArticles();
    const updated = list.filter((a) => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_ARTICLES, JSON.stringify(updated));
    return updated;
  },

  // Bookmarks
  getBookmarks: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  isBookmarked: (id) => {
    const list = storageService.getBookmarks();
    return list.includes(id);
  },

  toggleBookmark: (id) => {
    const list = storageService.getBookmarks();
    let updated;
    if (list.includes(id)) {
      updated = list.filter((item) => item !== id);
    } else {
      updated = [...list, id];
    }
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
    return updated;
  },

  // Premium Unlocks (via Rewarded Ads)
  getUnlockedPremium: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.UNLOCKED_PREMIUM);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  isUnlocked: (id) => {
    const list = storageService.getUnlockedPremium();
    return list.includes(id);
  },

  unlockPremiumArticle: (id) => {
    const list = storageService.getUnlockedPremium();
    if (!list.includes(id)) {
      const updated = [...list, id];
      localStorage.setItem(STORAGE_KEYS.UNLOCKED_PREMIUM, JSON.stringify(updated));
      return updated;
    }
    return list;
  },

  // Reader Settings
  getThemeMode: () => {
    return localStorage.getItem(STORAGE_KEYS.THEME_MODE) || 'light';
  },

  setThemeMode: (mode) => {
    localStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
  },

  getFontSize: () => {
    return localStorage.getItem(STORAGE_KEYS.FONT_SIZE) || 'base';
  },

  setFontSize: (size) => {
    localStorage.setItem(STORAGE_KEYS.FONT_SIZE, size);
  },

  // Ad Consent
  getAdConsent: () => {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.AD_CONSENT);
      return val !== null ? JSON.parse(val) : { personalized: true, gdprAccepted: true };
    } catch {
      return { personalized: true, gdprAccepted: true };
    }
  },

  setAdConsent: (consent) => {
    localStorage.setItem(STORAGE_KEYS.AD_CONSENT, JSON.stringify(consent));
  },

  // Read History
  addToHistory: (id) => {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.READ_HISTORY) || '[]');
      const filtered = existing.filter((item) => item !== id);
      const updated = [id, ...filtered].slice(0, 50);
      localStorage.setItem(STORAGE_KEYS.READ_HISTORY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  },

  getHistory: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.READ_HISTORY) || '[]');
    } catch {
      return [];
    }
  },
};
