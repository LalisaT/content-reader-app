// Storage Service for TipPulse Reader App
// Client Preferences & User Interactions Only (Zero Offline Caching of Remote Feeds/Posts)
// All articles, vacancies, and cloud data flow directly from live remote endpoints in real time.

const STORAGE_KEYS = {
  BOOKMARKS: 'tippulse_bookmarks',
  READ_HISTORY: 'tippulse_read_history',
  THEME_MODE: 'tippulse_theme_mode',
  FONT_SIZE: 'tippulse_font_size',
  UNLOCKED_PREMIUM: 'tippulse_unlocked_premium',
  AD_CONSENT: 'tippulse_ad_consent',
  VOTED_POLLS: 'tippulse_voted_polls',
  SAVED_JOBS: 'tippulse_saved_jobs',
  APPLIED_JOBS: 'tippulse_applied_jobs',
};

// Purge any legacy stale offline post caches to ensure 100% fresh remote queries
try {
  localStorage.removeItem('tippulse_cached_all_articles');
  localStorage.removeItem('tippulse_custom_articles');
  localStorage.removeItem('tippulse_cached_jobs');
  localStorage.removeItem('tippulse_deleted_articles');
} catch (e) {
  // Ignore in environments without window.localStorage
}

export const storageService = {
  // Legacy stubs - All articles & jobs are strictly remote-only
  getDeletedArticleIds: () => [],
  addDeletedArticleId: () => [],
  getCachedArticles: () => [],
  setCachedArticles: () => {},
  getCustomArticles: () => [],
  saveCustomArticle: () => [],
  deleteCustomArticle: () => [],
  getCachedJobs: () => [],
  setCachedJobs: () => {},

  // User Bookmarks (Personal Saved Reads)
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

  // Premium Article Access State
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

  // User UI Preferences
  getThemeMode: () => {
    try {
      return localStorage.getItem(STORAGE_KEYS.THEME_MODE) || 'light';
    } catch {
      return 'light';
    }
  },

  setThemeMode: (mode) => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
    } catch (e) {}
  },

  getFontSize: () => {
    try {
      return localStorage.getItem(STORAGE_KEYS.FONT_SIZE) || 'base';
    } catch {
      return 'base';
    }
  },

  setFontSize: (size) => {
    try {
      localStorage.setItem(STORAGE_KEYS.FONT_SIZE, size);
    } catch (e) {}
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
    try {
      localStorage.setItem(STORAGE_KEYS.AD_CONSENT, JSON.stringify(consent));
    } catch (e) {}
  },

  // Read History
  addToHistory: (id) => {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.READ_HISTORY) || '[]');
      const filtered = existing.filter((item) => item !== id);
      const updated = [id, ...filtered].slice(0, 50);
      localStorage.setItem(STORAGE_KEYS.READ_HISTORY, JSON.stringify(updated));
    } catch (e) {}
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

  // User Saved Job Vacancies (Candidate Personal Bookmarks)
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
      return [];
    }
  },

  isJobSaved: (jobId) => {
    const saved = storageService.getSavedJobIds();
    return saved.includes(String(jobId));
  },

  // In-App Job Applications Record
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
      return {};
    }
  },

  hasAppliedToJob: (jobId) => {
    const applied = storageService.getAppliedJobIds();
    return Boolean(applied[String(jobId)]);
  },
};
