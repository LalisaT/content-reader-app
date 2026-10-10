import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

const STORAGE_DEFERRED_KEY = 'tippulse_deferred_article_id';
const STORAGE_DEFERRED_CAREER_KEY = 'tippulse_deferred_career_id';
const PLAY_STORE_PACKAGE_ID = 'com.tippulse.app';
const WEB_DOMAIN = 'https://tippulse.web.app';

export const deepLinkService = {
  // Generate a Smart Universal Deep Link for sharing an Article / Tip
  // When clicked:
  // - If TipPulse is installed: opens TipPulse directly to this tip!
  // - If TipPulse is NOT installed: forwards to Google Play Store with deferred referral data!
  generateShareLink(article) {
    if (!article || !article.id) {
      return `${WEB_DOMAIN}/tip`;
    }
    const articleId = encodeURIComponent(article.id);
    return `${WEB_DOMAIN}/tip?id=${articleId}`;
  },

  // Generate a Smart Universal Deep Link for sharing a Career / Job Vacancy
  // Works identically to /tip?id=...
  generateCareerShareLink(job) {
    if (!job) {
      return `${WEB_DOMAIN}/careers`;
    }
    const slug = (
      job.slug ||
      (job.title
        ? job.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        : job.id) ||
      'vacancy'
    ).trim();
    return `${WEB_DOMAIN}/careers/${encodeURIComponent(slug)}`;
  },

  // Generate Web / Universal Direct Deep Link
  generateUniversalLink(article) {
    if (!article || !article.id) return `${WEB_DOMAIN}/tip`;
    return `${WEB_DOMAIN}/tip?id=${encodeURIComponent(article.id)}`;
  },

  // Generate full rich share message for WhatsApp, Telegram, Twitter, SMS, etc.
  generateShareMessage(article) {
    if (!article) return '';
    const shareUrl = this.generateShareLink(article);
    return `✨ ${article.title}\n\n${article.summary || ''}\n\n👉 Read full tip on TipPulse: ${shareUrl}`;
  },

  // Parse Career Slug / Job ID from any URL or Referrer string
  extractCareerIdFromUrl(urlOrString) {
    if (!urlOrString || typeof urlOrString !== 'string') return null;

    try {
      // 1. Check custom scheme: tippulse://careers/slug or tippulse://jobs/slug
      if (urlOrString.startsWith('tippulse://')) {
        const pathPart = urlOrString.replace('tippulse://', '');
        if (pathPart.startsWith('careers/') || pathPart.startsWith('jobs/')) {
          const slug = pathPart.split('/')[1]?.split('?')[0]?.split('#')[0];
          if (slug) return decodeURIComponent(slug).trim();
        }
      }

      // 2. Check Play Store Referrer format: career_id=slug or job=slug
      const decoded = decodeURIComponent(decodeURIComponent(urlOrString));
      const referrerMatch = decoded.match(/(?:career_id|job_id)[=:]([a-zA-Z0-9_-]+)/i);
      if (referrerMatch && referrerMatch[1]) {
        return referrerMatch[1].trim();
      }

      // 3. Check Web URL path: /careers/slug or /jobs/slug
      const pathMatch = urlOrString.match(/\/(?:careers|jobs)\/([a-zA-Z0-9_-]+)/i);
      if (pathMatch && pathMatch[1]) {
        return decodeURIComponent(pathMatch[1]).trim();
      }

      // 4. Check Query Parameter: ?job=slug or ?career=slug or ?slug=slug (or ?id=slug on /careers)
      const urlObj = new URL(urlOrString, window.location.origin);
      const isCareerPath = /\/(?:careers|jobs)/i.test(urlObj.pathname);
      const careerParam =
        urlObj.searchParams.get('job') ||
        urlObj.searchParams.get('career') ||
        urlObj.searchParams.get('career_id') ||
        urlObj.searchParams.get('slug') ||
        (isCareerPath ? urlObj.searchParams.get('id') : null);
      if (careerParam) {
        return decodeURIComponent(careerParam).trim();
      }

      // 5. Check Hash: #/careers/slug or #careers/slug
      if (urlObj.hash) {
        const hashMatch = urlObj.hash.match(/(?:careers\/|jobs\/|career_id=|job=)([a-zA-Z0-9_-]+)/i);
        if (hashMatch && hashMatch[1]) {
          return decodeURIComponent(hashMatch[1]).trim();
        }
      }
    } catch (e) {
      console.debug('Error parsing career deep link URL:', e);
    }

    return null;
  },

  // Parse Article ID from any URL or Referrer string
  extractArticleIdFromUrl(urlOrString) {
    if (!urlOrString || typeof urlOrString !== 'string') return null;

    // Do not treat career links as article links
    if (this.extractCareerIdFromUrl(urlOrString)) return null;

    try {
      // 1. Check custom scheme: tippulse://article/123 or tippulse://open?article=123
      if (urlOrString.startsWith('tippulse://')) {
        const pathPart = urlOrString.replace('tippulse://', '');
        if (pathPart.startsWith('article/') || pathPart.startsWith('tip/')) {
          return decodeURIComponent(pathPart.split('/')[1]?.split('?')[0]);
        }
      }

      // 2. Check Play Store Referrer format: article_id=123 or article_id%3D123
      const decoded = decodeURIComponent(decodeURIComponent(urlOrString));
      const referrerMatch = decoded.match(/article_id[=:]([a-zA-Z0-9_-]+)/i);
      if (referrerMatch && referrerMatch[1]) {
        return referrerMatch[1];
      }

      // 3. Check Web URL path: /article/123 or /tip/123
      const pathMatch = urlOrString.match(/\/(?:article|tip)\/([a-zA-Z0-9_-]+)/i);
      if (pathMatch && pathMatch[1]) {
        return pathMatch[1];
      }

      // 4. Check Query Parameter: ?article=123 or ?id=123 or ?post=123
      const urlObj = new URL(urlOrString, window.location.origin);
      const isCareerPath = /\/(?:careers|jobs)/i.test(urlObj.pathname);
      if (!isCareerPath) {
        const articleParam =
          urlObj.searchParams.get('article') ||
          urlObj.searchParams.get('article_id') ||
          urlObj.searchParams.get('id') ||
          urlObj.searchParams.get('post');
        if (articleParam) {
          return articleParam;
        }
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

  // Helper to route any incoming URL to either career or article handler
  handleIncomingUrl(url, onNavigateToArticle, onNavigateToCareer) {
    if (!url) return false;

    const careerId = this.extractCareerIdFromUrl(url);
    if (careerId && typeof onNavigateToCareer === 'function') {
      console.log('Career deep link resolved:', careerId);
      onNavigateToCareer(careerId);
      return true;
    }

    if (
      (url.includes('/careers') || url.includes('/jobs') || url.startsWith('tippulse://careers')) &&
      typeof onNavigateToCareer === 'function'
    ) {
      onNavigateToCareer('');
      return true;
    }

    const articleId = this.extractArticleIdFromUrl(url);
    if (articleId && typeof onNavigateToArticle === 'function') {
      console.log('Article deep link resolved:', articleId);
      onNavigateToArticle(articleId);
      return true;
    }

    return false;
  },

  // Initialize Deep Linking listeners and check for Deferred Referrals on initial startup
  async init(onNavigateToArticle, onNavigateToCareer) {
    // 1. Check if there's an immediate deep link in the current browser URL
    const initialUrl = window.location.href;
    if (this.handleIncomingUrl(initialUrl, onNavigateToArticle, onNavigateToCareer)) {
      try {
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {}
    }

    // 2. Check for previously stored deferred IDs
    try {
      const storedDeferredCareer = localStorage.getItem(STORAGE_DEFERRED_CAREER_KEY);
      if (storedDeferredCareer && typeof onNavigateToCareer === 'function') {
        localStorage.removeItem(STORAGE_DEFERRED_CAREER_KEY);
        onNavigateToCareer(storedDeferredCareer);
      }

      const storedDeferredArticle = localStorage.getItem(STORAGE_DEFERRED_KEY);
      if (storedDeferredArticle && typeof onNavigateToArticle === 'function') {
        localStorage.removeItem(STORAGE_DEFERRED_KEY);
        onNavigateToArticle(storedDeferredArticle);
      }
    } catch (e) {}

    // 3. Native Capacitor Android/iOS Deep Linking (Cold Launch + Background Resume)
    if (Capacitor.isNativePlatform()) {
      try {
        // Check cold-start launch URL (when app was closed and opened via intent:// or https:// link)
        const launchUrlData = await App.getLaunchUrl();
        if (launchUrlData && launchUrlData.url) {
          console.log('Native cold launch URL detected:', launchUrlData.url);
          this.handleIncomingUrl(launchUrlData.url, onNavigateToArticle, onNavigateToCareer);
        }

        // Listen for runtime App URL Open events (when app is in background and opened via link)
        App.addListener('appUrlOpen', (event) => {
          console.log('App URL Open event received:', event.url);
          this.handleIncomingUrl(event.url, onNavigateToArticle, onNavigateToCareer);
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
  },

  // Save deferred career ID to localStorage
  saveDeferredCareerId(careerId) {
    if (!careerId) return;
    try {
      localStorage.setItem(STORAGE_DEFERRED_CAREER_KEY, careerId);
    } catch (e) {}
  }
};
