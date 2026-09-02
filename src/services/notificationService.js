import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

const STORAGE_KEY = 'tippulse_notifications_history';
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
  async init(onNotificationClick) {
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

        // Request permissions
        const status = await LocalNotifications.checkPermissions();
        if (status.display !== 'granted') {
          await LocalNotifications.requestPermissions();
        }

        // Add action listener when user taps on the notification in the phone status bar
        LocalNotifications.addListener('localNotificationActionPerformed', (notificationAction) => {
          playNotificationChime();
          const extra = notificationAction.notification.extra;
          if (extra && extra.articleId && typeof onNotificationClick === 'function') {
            onNotificationClick(extra.articleId, extra.article);
          }
        });
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

  // Post / Publish Instant Notification across device status bar & in-app
  async notifyNewArticle(article, customTitle = null) {
    if (!article) return null;

    const notifId = Math.floor(Date.now() % 2147483647);
    const title = customTitle || `🔔 New Tip: ${article.title}`;
    const body = article.summary || (article.content ? article.content.substring(0, 90) + '...' : 'Tap to read this new tip now!');
    const category = article.category || 'Tip';

    // 1. Play sound
    playNotificationChime();

    // 2. Trigger native mobile notification if running on Android/iOS
    if (Capacitor.isNativePlatform()) {
      try {
        await LocalNotifications.schedule({
          notifications: [
            {
              id: notifId,
              title: title,
              body: body,
              channelId: 'tippulse_alerts_v3',
              schedule: { at: new Date(Date.now() + 100) }, // Instant (0.1s)
              sound: 'default',
              smallIcon: 'ic_stat_icon_config_sample',
              iconColor: '#0284c7',
              extra: {
                articleId: article.id,
                article: article
              }
            }
          ]
        });
      } catch (err) {
        console.warn('Native notification trigger error:', err);
      }
    } else {
      // Web notification fallback for browser/PWA
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          const webNotif = new Notification(title, {
            body: body,
            icon: '/app-icon.png',
            badge: '/app-icon.png',
            tag: `tippulse-article-${article.id}`,
            data: { articleId: article.id }
          });
          webNotif.onclick = () => {
            window.focus();
            if (typeof window.__tippulse_on_notification_click === 'function') {
              window.__tippulse_on_notification_click(article.id, article);
            }
          };
        } catch (e) {
          console.debug('Web notification error:', e);
        }
      }
    }

    // 3. Save to in-app Notification Center history
    const newEntry = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      articleId: article.id,
      title: article.title,
      body: body,
      category: category,
      imageUrl: article.imageUrl || null,
      timestamp: new Date().toISOString(),
      read: false
    };

    const currentList = this.getNotifications();
    const updatedList = [newEntry, ...currentList.slice(0, 49)]; // keep latest 50
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
