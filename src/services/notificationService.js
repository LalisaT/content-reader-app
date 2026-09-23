import { LocalNotifications } from '@capacitor/local-notifications';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { firestoreSyncService } from './firestoreSyncService';

const STORAGE_KEY = 'tippulse_notifications_history';
const LAST_SYNCED_TIMESTAMP_KEY = 'tippulse_last_synced_notif_ts';
const SEEN_NOTIFICATIONS_KEY = 'tippulse_seen_notification_ids';
const SEEN_ARTICLES_KEY = 'tippulse_seen_article_ids';
const NOTIFICATION_SOUND_ENABLED_KEY = 'tippulse_notification_sound_enabled';

// Global Shared AudioContext with Auto-Unlock for Mobile & WebView
let sharedAudioCtx = null;

function getOrCreateAudioContext() {
  try {
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtxClass) return null;
    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioCtxClass();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch (e) {
    return null;
  }
}

// Global user gesture unlocker for mobile devices / WebViews
export function initAudioUnlock() {
  if (typeof window === 'undefined') return;
  const unlock = () => {
    const ctx = getOrCreateAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('touchstart', unlock);
    window.removeEventListener('click', unlock);
  };
  window.addEventListener('pointerdown', unlock, { once: true, passive: true });
  window.addEventListener('touchstart', unlock, { once: true, passive: true });
  window.addEventListener('click', unlock, { once: true, passive: true });
}

// Play an instant crisp, loud, pleasant 3-tone chime sound (C5 -> E5 -> C6)
export function playNotificationChime() {
  try {
    const ctx = getOrCreateAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    
    // 3-tone crystal-clear ascending chime
    const notes = [
      { freq: 659.25, time: 0, dur: 0.18, gain: 0.4 },     // E5
      { freq: 880.00, time: 0.08, dur: 0.22, gain: 0.45 },  // A5
      { freq: 1318.51, time: 0.16, dur: 0.45, gain: 0.5 }   // E6 (Harmonic ring)
    ];

    notes.forEach(n => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.freq, now + n.time);
      gain.gain.setValueAtTime(n.gain, now + n.time);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + n.time);
      osc.stop(now + n.time + n.dur);
    });
  } catch (err) {
    console.debug('Audio chime playback omitted:', err);
  }
}

export const notificationService = {
  // Initialize Android / iOS Notification Channels and Listeners
  async init(onNotificationClick, onNewAlert = null) {
    initAudioUnlock();
    if (Capacitor.isNativePlatform()) {
      try {
        // Create high-importance Android Notification Channel with sound & vibration
        await LocalNotifications.createChannel({
          id: 'tippulse_alerts_v3',
          name: 'TipPulse Alerts & New Tips',
          description: 'Instant notification with sound whenever a new tip or article is published',
          importance: 5, // High importance (heads-up pop on screen)
          visibility: 1,
          sound: 'default',
          vibration: true,
          lights: true,
          lightColor: '#0284c7'
        });

        // Request standard in-app notifications permission (POST_NOTIFICATIONS)
        const status = await LocalNotifications.checkPermissions();
        if (status.display !== 'granted') {
          await LocalNotifications.requestPermissions();
        }

        // Play sound when a notification arrives / is received by device
        LocalNotifications.addListener('localNotificationReceived', () => {
          playNotificationChime();
        });

        // Add action listener when user taps on the notification in the phone status bar
        LocalNotifications.addListener('localNotificationActionPerformed', (notificationAction) => {
          const extra = notificationAction.notification.extra;
          if (extra && extra.articleId && typeof onNotificationClick === 'function') {
            onNotificationClick(extra.articleId, extra.article);
          }
        });

        // -------------------------------------------------------------
        // PushNotifications (FCM - Firebase Cloud Messaging)
        // Enables notifications when app is COMPLETELY CLOSED / KILLED
        // -------------------------------------------------------------
        try {
          let pushPerm = await PushNotifications.checkPermissions();
          if (pushPerm.receive !== 'granted') {
            pushPerm = await PushNotifications.requestPermissions();
          }
          if (pushPerm.receive === 'granted') {
            await PushNotifications.register();
          }

          // Register FCM device token in Firestore
          PushNotifications.addListener('registration', (token) => {
            console.log('FCM Device Token registered successfully:', token.value);
            firestoreSyncService.registerDeviceToken(token.value);
          });

          PushNotifications.addListener('registrationError', (err) => {
            console.debug('FCM Registration error (needs google-services.json):', err);
          });

          // When a push notification arrives while app is open
          PushNotifications.addListener('pushNotificationReceived', (notification) => {
            playNotificationChime();
            const data = notification.data || {};
            if (typeof onNewAlert === 'function') {
              onNewAlert({
                id: notification.id || `fcm_${Date.now()}`,
                title: notification.title || '🔔 New Announcement',
                body: notification.body || '',
                category: data.category || 'Tip',
                articleId: data.articleId || null,
                imageUrl: data.imageUrl || null
              });
            }
          });

          // When user taps on a push notification (wakes up the closed app)
          PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
            const data = notification.notification?.data || {};
            if (data.articleId && typeof onNotificationClick === 'function') {
              onNotificationClick(data.articleId);
            }
          });
        } catch (pushInitErr) {
          console.debug('PushNotifications setup notice:', pushInitErr);
        }
      } catch (err) {
        console.warn('Capacitor LocalNotifications init error:', err);
      }
    } else {
      // Request Web Notification permission if in desktop / web browser
      if ('Notification' in window && Notification.permission === 'default') {
        try {
          Notification.requestPermission().catch(() => {});
        } catch (e) {}
      }
    }
  },

  // Helper to check & request phone status bar permissions
  async requestPhonePermissions() {
    if (Capacitor.isNativePlatform()) {
      try {
        const res = await LocalNotifications.requestPermissions();
        return res.display === 'granted';
      } catch (e) {
        console.warn('Request notification permissions failed:', e);
        return false;
      }
    }
    return true;
  },

  // Trigger native heads-up notification in Android status bar + audio chime
  async triggerSystemNotification({ id, title, body, articleId, article, imageUrl }) {
    // 1. Audio chime
    playNotificationChime();

    // 2. Native Android / iOS Heads-up notification
    if (Capacitor.isNativePlatform()) {
      try {
        // Ensure permission is granted
        try {
          const permStatus = await LocalNotifications.checkPermissions();
          if (permStatus.display !== 'granted') {
            await LocalNotifications.requestPermissions();
          }
        } catch (pErr) {}

        const notifId = Math.floor(Math.abs(Number(id) || Date.now()) % 2147483647);
        // Note: Omit 'schedule' so Android triggers it IMMEDIATELY without AlarmManager restrictions
        await LocalNotifications.schedule({
          notifications: [
            {
              id: notifId,
              title: title,
              body: body,
              channelId: 'tippulse_alerts_v3',
              sound: 'default',
              smallIcon: 'ic_stat_notification',
              iconColor: '#0284c7',
              isExactNotification: false,
              isExactMandatory: false,
              extra: {
                articleId: articleId,
                article: article || null,
                imageUrl: imageUrl || null
              }
            }
          ]
        });
      } catch (err) {
        console.warn('Native notification trigger error:', err);
      }
    } else {
      // Web notification fallback for desktop / browser
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          const webNotif = new Notification(title, {
            body: body,
            icon: imageUrl || '/app-icon.png',
            badge: '/app-icon.png',
            tag: `tippulse-alert-${articleId || Date.now()}`,
            data: { articleId, article }
          });
          webNotif.onclick = () => {
            window.focus();
            if (typeof window.__tippulse_on_notification_click === 'function') {
              window.__tippulse_on_notification_click(articleId, article);
            }
          };
        } catch (e) {
          console.debug('Web notification error:', e);
        }
      }
    }
  },

  // Sync Cloud Notifications from Firestore to local device
  // Fires native heads-up alerts, audio chime, and luxury banner whenever admin publishes a notification
  syncCloudNotifications(cloudNotifs = [], onNewAlert = null) {
    if (!Array.isArray(cloudNotifs) || cloudNotifs.length === 0) return this.getNotifications();

    const rawSeen = localStorage.getItem(SEEN_NOTIFICATIONS_KEY);
    const isFirstRun = rawSeen === null;
    let seenSet;
    try {
      seenSet = new Set(rawSeen ? JSON.parse(rawSeen) : []);
    } catch (e) {
      seenSet = new Set();
    }

    // Get existing local notifications history
    const existingList = this.getNotifications();
    const readStatusMap = new Map();
    existingList.forEach((n) => {
      if (n.id) readStatusMap.set(String(n.id), Boolean(n.read));
    });

    const newAlerts = [];

    if (isFirstRun) {
      // First boot: Register older notifications so device isn't spammed with all historic ones.
      // But if there's a recent notification (created in the last 6 hours), alert the latest one
      // so testing immediately after publishing is instant!
      const sorted = [...cloudNotifs].sort((a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0));
      sorted.forEach((cn, idx) => {
        const idStr = String(cn.id);
        seenSet.add(idStr);
        if (idx === 0 && cn.createdAt && (Date.now() - Number(cn.createdAt) < 6 * 60 * 60 * 1000)) {
          newAlerts.push(cn);
        }
      });
    } else {
      // Live updates: Detect incoming notifications not yet alerted on this device
      cloudNotifs.forEach((cn) => {
        const idStr = String(cn.id);
        if (!seenSet.has(idStr)) {
          seenSet.add(idStr);
          newAlerts.push(cn);
        }
      });
    }

    // Persist seen set to avoid re-alerting
    try {
      localStorage.setItem(SEEN_NOTIFICATIONS_KEY, JSON.stringify(Array.from(seenSet)));
    } catch (e) {}

    // Sort new alerts oldest to newest so they appear in sequence
    newAlerts.sort((a, b) => (Number(a.createdAt) || 0) - (Number(b.createdAt) || 0));

    // Fire notifications for newly arrived items
    newAlerts.forEach((notif) => {
      this.triggerSystemNotification({
        id: notif.id,
        title: notif.title || '🔔 New Tip Alert',
        body: notif.body || 'Tap to open the latest tip now!',
        articleId: notif.articleId,
        imageUrl: notif.imageUrl
      });

      if (typeof onNewAlert === 'function') {
        onNewAlert(notif);
      }
    });

    // Merge cloud notifications into local Notification Center history
    const mergedList = cloudNotifs.map((cn) => {
      const idStr = String(cn.id);
      const isAlreadyRead = readStatusMap.has(idStr) ? readStatusMap.get(idStr) : false;
      return {
        id: idStr,
        articleId: cn.articleId,
        title: cn.title,
        body: cn.body,
        category: cn.category || 'Tip',
        imageUrl: cn.imageUrl || null,
        timestamp: cn.createdAt ? new Date(cn.createdAt).toISOString() : new Date().toISOString(),
        read: isAlreadyRead
      };
    });

    // Keep latest 50 notifications
    const trimmed = mergedList.slice(0, 50);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      window.dispatchEvent(new CustomEvent('tippulse_notification_updated', { detail: trimmed }));
    } catch (e) {}

    return trimmed;
  },

  // Sync Cloud Articles to automatically alert when Admin publishes or updates an article
  syncCloudArticles(articles = [], onNewAlert = null) {
    if (!Array.isArray(articles) || articles.length === 0) return;

    const rawSeen = localStorage.getItem(SEEN_ARTICLES_KEY);
    const isFirstRun = rawSeen === null;
    let seenSet;
    try {
      seenSet = new Set(rawSeen ? JSON.parse(rawSeen) : []);
    } catch (e) {
      seenSet = new Set();
    }

    if (isFirstRun) {
      // First boot: mark existing articles as seen so we don't alert all existing ones
      articles.forEach((a) => {
        if (a.id) seenSet.add(String(a.id));
      });
      try {
        localStorage.setItem(SEEN_ARTICLES_KEY, JSON.stringify(Array.from(seenSet)));
      } catch (e) {}
      return;
    }

    // Detect newly added articles
    const newArticles = [];
    articles.forEach((art) => {
      const idStr = String(art.id);
      if (!seenSet.has(idStr)) {
        seenSet.add(idStr);
        newArticles.push(art);
      }
    });

    if (newArticles.length === 0) return;

    // Persist seen article IDs
    try {
      localStorage.setItem(SEEN_ARTICLES_KEY, JSON.stringify(Array.from(seenSet)));
    } catch (e) {}

    // Check already alerted notifications to prevent double alerts if admin also posted to notifications collection
    let seenNotifSet = new Set();
    try {
      const rawNotifSeen = localStorage.getItem(SEEN_NOTIFICATIONS_KEY);
      if (rawNotifSeen) seenNotifSet = new Set(JSON.parse(rawNotifSeen));
    } catch (e) {}

    newArticles.forEach((article) => {
      const notifId = `art_notif_${article.id}`;
      if (seenNotifSet.has(notifId)) return;
      seenNotifSet.add(notifId);

      const alertItem = {
        id: notifId,
        articleId: article.id,
        title: `✨ New Tip: ${article.title}`,
        body: article.summary || (article.content ? article.content.substring(0, 95) + '...' : 'A new tip has just been published. Tap to read now!'),
        category: article.category || 'Tip',
        imageUrl: article.image || null,
        timestamp: new Date().toISOString(),
        read: false,
        article: article
      };

      // 1. Android Status Bar + Audio Chime
      this.triggerSystemNotification(alertItem);

      // 2. In-App Luxury Banner
      if (typeof onNewAlert === 'function') {
        onNewAlert(alertItem);
      }

      // 3. Add to In-App Notification Center history
      const currentList = this.getNotifications();
      const updatedList = [alertItem, ...currentList.filter((n) => n.id !== notifId)].slice(0, 50);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
        localStorage.setItem(SEEN_NOTIFICATIONS_KEY, JSON.stringify(Array.from(seenNotifSet)));
        window.dispatchEvent(new CustomEvent('tippulse_notification_updated', { detail: updatedList }));
      } catch (e) {}
    });
  },

  // Post / Publish Instant Notification across device status bar & in-app (Local Dispatch)
  async notifyNewArticle(article, customTitle = null) {
    if (!article) return null;

    const notifId = Math.floor(Date.now() % 2147483647);
    const title = customTitle || `🔔 New Tip: ${article.title}`;
    const body = article.summary || (article.content ? article.content.substring(0, 90) + '...' : 'Tap to read this new tip now!');
    const category = article.category || 'Tip';

    // Trigger heads-up notification and audio chime
    await this.triggerSystemNotification({
      id: notifId,
      title,
      body,
      articleId: article.id,
      article,
      imageUrl: article.image || article.imageUrl || null
    });

    // Save to in-app Notification Center history
    const newEntry = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      articleId: article.id,
      title: title,
      body: body,
      category: category,
      imageUrl: article.image || article.imageUrl || null,
      timestamp: new Date().toISOString(),
      read: false
    };

    const currentList = this.getNotifications();
    const updatedList = [newEntry, ...currentList.filter(item => item.articleId !== article.id).slice(0, 49)];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      window.dispatchEvent(new CustomEvent('tippulse_notification_updated', { detail: updatedList }));
    } catch (e) {}

    return newEntry;
  },

  // Get list of all in-app notifications
  getNotifications() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  },

  // Get count of unread notifications
  getUnreadCount() {
    const list = this.getNotifications();
    return list.filter(item => !item.read).length;
  },

  // Mark a single notification as read
  markAsRead(id) {
    const list = this.getNotifications();
    const updated = list.map(item => item.id === id ? { ...item, read: true } : item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('tippulse_notification_updated', { detail: updated }));
    return updated;
  },

  // Mark all notifications as read
  markAllAsRead() {
    const list = this.getNotifications();
    const updated = list.map(item => ({ ...item, read: true }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('tippulse_notification_updated', { detail: updated }));
    return updated;
  },

  // Delete/Clear all notifications
  clearAll() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent('tippulse_notification_updated', { detail: [] }));
    return [];
  }
};
