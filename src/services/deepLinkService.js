import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

const STORAGE_DEFERRED_KEY = 'tippulse_deferred_article_id';
const STORAGE_PROCESSED_REFERRER_KEY = 'tippulse_processed_install_referrer';
const PLAY_STORE_PACKAGE_ID = 'com.tippulse.app';

export const deepLinkService = {
  // Generate a Smart Deferred Deep Link for sharing
  generateShareLink(article) {
    if (!article || !article.id) {
      return `https://play.google.com/store/apps/details?id=${PLAY_STORE_PACKAGE_ID}`;
    }

    const articleId = encodeURIComponent(article.id);
    
    // Standard Google Play Store Deferred Install Referrer Link:
    // When a user without the app clicks this link, Google Play passes &referrer to the app on first launch!
    const playStoreDeferredLink = `https://play.google.com/store/apps/details?id=${PLAY_STORE_PACKAGE_ID}&referrer=utm_source%3Dapp_share%26article_id%3D${articleId}`;
    
    return playStoreDeferredLink;
  },

  // Generate Web / Universal Direct Deep Link
  generateUniversalLink(article) {
    if (!article || !article.id) return 'https://tippulse.app';
    return `https://tippulse.app/article/${encodeURIComponent(article.id)}`;
  },

  // Generate full rich share message for WhatsApp, Telegram, Twitter, SMS, etc.
  generateShareMessage(article) {
    if (!article) return '';
    const shareUrl = this.generateShareLink(article);
    return `✨ ${article.title}\n\n${article.summary || ''}\n\n👉 Read full tip on TipPulse: ${shareUrl}`;
  },

  // Parse Article ID from any URL or Referrer string
  extractArticleIdFromUrl(urlOrString) {
    if (!urlOrString || typeof urlOrString !== 'string') return null;

    try {
      // 1. Check custom scheme: tippulse://article/123 or tippulse://open?article=123
      if (urlOrString.startsWith('tippulse://')) {
        const pathPart = urlOrString.replace('tippulse://', '');
        if (pathPart.startsWith('article/')) {
          return decodeURIComponent(pathPart.split('/')[1]?.split('?')[0]);
        }
      }

      // 2. Check Play Store Referrer format: article_id=123 or article_id%3D123
      const decoded = decodeURIComponent(decodeURIComponent(urlOrString));
      const referrerMatch = decoded.match(/article_id[=:]([a-zA-Z0-9_-]+)/i);
      if (referrerMatch && referrerMatch[1]) {
        return referrerMatch[1];
      }

      // 3. Check Web URL path: /article/123
      const pathMatch = urlOrString.match(/\/article\/([a-zA-Z0-9_-]+)/i);
      if (pathMatch && pathMatch[1]) {
        return pathMatch[1];
      }

      // 4. Check Query Parameter: ?article=123 or ?id=123 or ?post=123
      const urlObj = new URL(urlOrString, window.location.origin);
      const articleParam = urlObj.searchParams.get('article') 
        || urlObj.searchParams.get('article_id') 
        || urlObj.searchParams.get('id') 
        || urlObj.searchParams.get('post');
      if (articleParam) {
        return articleParam;
      }

      // 5. Check Hash: #/article/123 or #article_id=123
      if (urlObj.hash) {
        const hashMatch = urlObj.hash.match(/(?:article\/|article_id=)([a-zA-Z0-9_-]+)/i);
        if (hashMatch && hashMatch[1]) {
          return hashMatch[1];
        }
      }
    } catch (e) {
      console.debug('Error parsing deep link URL:', e);
    }

    return null;
  },

  // Initialize Deep Linking listeners and check for Deferred Referrals on initial startup
  async init(onNavigateToArticle) {
    if (typeof onNavigateToArticle !== 'function') return;

    // 1. Check if there's an immediate deep link or deferred article in the current browser URL
    const initialUrl = window.location.href;
    const initialArticleId = this.extractArticleIdFromUrl(initialUrl);

    if (initialArticleId) {
      console.log('Direct deep link detected on startup:', initialArticleId);
      // Clean URL bar to prevent duplicate navigation on page refresh
      try {
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {}
      onNavigateToArticle(initialArticleId);
      return;
    }

    // 2. Check for previously stored deferred article ID
    const storedDeferred = localStorage.getItem(STORAGE_DEFERRED_KEY);
    if (storedDeferred) {
      localStorage.removeItem(STORAGE_DEFERRED_KEY);
      console.log('Deferred deep link resolved from storage:', storedDeferred);
      onNavigateToArticle(storedDeferred);
      return;
    }

    // 3. Listen for runtime App URL Open events (Standard Deep Linking when app is in background or opened via link)
    if (Capacitor.isNativePlatform()) {
      try {
        App.addListener('appUrlOpen', (event) => {
          console.log('App URL Open event received:', event.url);
          const articleId = this.extractArticleIdFromUrl(event.url);
          if (articleId) {
            onNavigateToArticle(articleId);
          }
        });
      } catch (err) {
        console.debug('Error setting up App URL listener:', err);
      }
    }
  },

  // Save deferred article ID to localStorage (used by referral bridge)
  saveDeferredArticleId(articleId) {
    if (!articleId) return;
    try {
      localStorage.setItem(STORAGE_DEFERRED_KEY, articleId);
    } catch (e) {}
  }
};
