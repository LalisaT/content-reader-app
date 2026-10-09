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
  CACHED_ARTICLES: 'tippulse_cached_all_articles',
  DELETED_ARTICLES: 'tippulse_deleted_articles',
  VOTED_POLLS: 'tippulse_voted_polls',
  CACHED_JOBS: 'tippulse_cached_jobs',
  SAVED_JOBS: 'tippulse_saved_jobs',
  APPLIED_JOBS: 'tippulse_applied_jobs',
};

export const storageService = {
  // Deleted articles blacklist (allows admin to delete ANY post including seeded/default)
  getDeletedArticleIds: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DELETED_ARTICLES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addDeletedArticleId: (id) => {
    const list = storageService.getDeletedArticleIds();
    const strId = String(id);
    if (!list.includes(strId)) {
      const updated = [...list, strId];
      localStorage.setItem(STORAGE_KEYS.DELETED_ARTICLES, JSON.stringify(updated));
      return updated;
    }
    return list;
  },

  // Offline Full Articles Cache (Never lost when internet data is off)
  getCachedArticles: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CACHED_ARTICLES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setCachedArticles: (articles) => {
    try {
      if (articles && articles.length > 0) {
        localStorage.setItem(STORAGE_KEYS.CACHED_ARTICLES, JSON.stringify(articles));
      }
    } catch (e) {
      console.warn('Could not update offline articles cache:', e);
    }
  },

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

    // Also update full offline cached articles
    const cached = storageService.getCachedArticles();
    const cIndex = cached.findIndex((a) => a.id === article.id);
    let updatedCached;
    if (cIndex >= 0) {
      updatedCached = [...cached];
      updatedCached[cIndex] = article;
    } else {
      updatedCached = [article, ...cached];
    }
    storageService.setCachedArticles(updatedCached);

    return updated;
  },

  deleteCustomArticle: (id) => {
    const strId = String(id);
    storageService.addDeletedArticleId(strId);

    const list = storageService.getCustomArticles();
    const updated = list.filter((a) => String(a.id) !== strId);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_ARTICLES, JSON.stringify(updated));

    // Also remove from full offline cache
    const cached = storageService.getCachedArticles();
    const updatedCached = cached.filter((a) => String(a.id) !== strId);
    localStorage.setItem(STORAGE_KEYS.CACHED_ARTICLES, JSON.stringify(updatedCached));

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

  // Community Poll Votes
  getVotedPolls: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VOTED_POLLS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  saveVotedPoll: (pollId, optionId) => {
    try {
      const existing = storageService.getVotedPolls();
      const updated = { ...existing, [String(pollId)]: String(optionId) };
      localStorage.setItem(STORAGE_KEYS.VOTED_POLLS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('Could not save voted poll:', e);
      return {};
    }
  },

  hasUserVoted: (pollId) => {
    const voted = storageService.getVotedPolls();
    return Boolean(voted[String(pollId)]);
  },

  getUserVotedOption: (pollId) => {
    const voted = storageService.getVotedPolls();
    return voted[String(pollId)] || null;
  },

  // -------------------------------------------------------------
  // Job Vacancies Offline Cache, Bookmarks, and Applications
  // -------------------------------------------------------------
  getCachedJobs: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CACHED_JOBS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setCachedJobs: (jobs) => {
    try {
      if (Array.isArray(jobs) && jobs.length > 0) {
        localStorage.setItem(STORAGE_KEYS.CACHED_JOBS, JSON.stringify(jobs));
      }
    } catch (e) {
      console.warn('Could not cache jobs locally:', e);
    }
  },

  getSavedJobIds: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleSaveJob: (jobId) => {
    try {
      const saved = storageService.getSavedJobIds();
      const strId = String(jobId);
      const isAlready = saved.includes(strId);
      const updated = isAlready ? saved.filter((id) => id !== strId) : [...saved, strId];
      localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('Could not toggle saved job:', e);
      return [];
    }
  },

  isJobSaved: (jobId) => {
    const saved = storageService.getSavedJobIds();
    return saved.includes(String(jobId));
  },

  getAppliedJobIds: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPLIED_JOBS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  recordJobApplication: (jobId, metadata = {}) => {
    try {
      const applied = storageService.getAppliedJobIds();
      const updated = {
        ...applied,
        [String(jobId)]: {
          appliedAt: Date.now(),
          ...metadata
        }
      };
      localStorage.setItem(STORAGE_KEYS.APPLIED_JOBS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('Could not record job application:', e);
      return {};
    }
  },

  hasAppliedToJob: (jobId) => {
    const applied = storageService.getAppliedJobIds();
    return Boolean(applied[String(jobId)]);
  },
};
