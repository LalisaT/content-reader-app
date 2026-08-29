import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

const STORAGE_KEY = 'tippulse_notifications_history';
const NOTIFICATION_SOUND_ENABLED_KEY = 'tippulse_notification_sound_enabled';

// Play an instant crisp, pleasant dual-tone chime sound using Web Audio API
export function playNotificationChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    
    // Tone 1 (High note)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Tone 2 (Harmonic Bell tone)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(880, now + 0.12); // A5
    osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.28); // D6
    gain2.gain.setValueAtTime(0.25, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.005, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.55);
  } catch (err) {
    console.debug('Audio chime playback omitted:', err);
  }
}

export const notificationService = {
  // Initialize Android / iOS Notification Channels and Listeners
  async init(onNotificationClick) {
    if (Capacitor.isNativePlatform()) {
      try {
        // Create high-importance Android Notification Channel with sound & vibration
        await LocalNotifications.createChannel({
          id: 'tippulse_news_alerts',
          name: 'TipPulse Alerts & New Tips',
          description: 'Instant notification whenever a new tip or article is published',
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
              channelId: 'tippulse_news_alerts',
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
