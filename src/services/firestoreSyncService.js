import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { storageService } from './storageService';
import initialArticlesData from '../data/articles.json';

const ARTICLES_COLLECTION = 'articles';
const NOTIFICATIONS_COLLECTION = 'notifications';
const CONFIG_DOC = 'app_config';
const CATEGORIES_DOC = 'app_categories';

export const firestoreSyncService = {
  // Subscribe to real-time articles sync across all devices
  subscribeArticles: (onArticlesUpdate, onError) => {
    try {
      const articlesRef = collection(db, ARTICLES_COLLECTION);
      
      const unsubscribe = onSnapshot(
        articlesRef,
        async (snapshot) => {
          if (snapshot.empty) {
            // First run: Seed initial curated articles into Firestore
            console.log('Firestore articles collection is empty. Seeding initial curated articles...');
            try {
              const batch = writeBatch(db);
              initialArticlesData.forEach((art) => {
                const docRef = doc(db, ARTICLES_COLLECTION, String(art.id));
                batch.set(docRef, {
                  ...art,
                  createdAt: Date.now()
                });
              });
              await batch.commit();
              storageService.setCachedArticles(initialArticlesData);
              onArticlesUpdate(initialArticlesData);
            } catch (seedErr) {
              console.warn('Could not auto-seed Firestore (check security rules):', seedErr);
              const fallback = storageService.getCachedArticles().length > 0
                ? storageService.getCachedArticles()
                : initialArticlesData;
              onArticlesUpdate(fallback);
            }
          } else {
            const articles = snapshot.docs.map((docSnap) => {
              const data = docSnap.data();
              return {
                id: docSnap.id,
                ...data,
              };
            });
            // Sort by custom order or newest first
            articles.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            // Permanently cache into device storage so it NEVER disappears when data is OFF
            storageService.setCachedArticles(articles);
            onArticlesUpdate(articles);
          }
        },
        (err) => {
          console.warn('Firestore subscription error (using local offline cache):', err);
          const cached = storageService.getCachedArticles();
          if (cached && cached.length > 0) {
            onArticlesUpdate(cached);
          }
          if (onError) onError(err);
        }
      );

      return unsubscribe;
    } catch (err) {
      console.warn('Failed to initialize Firestore listener:', err);
      const cached = storageService.getCachedArticles();
      if (cached && cached.length > 0) {
        onArticlesUpdate(cached);
      }
      return () => {};
    }
  },

  // Save or update an article in Firestore
  saveArticle: async (article) => {
    try {
      const articleId = String(article.id || `custom-${Date.now()}`);
      const articleToSave = {
        ...article,
        id: articleId,
        updatedAt: Date.now(),
        createdAt: article.createdAt || Date.now()
      };
      
      const docRef = doc(db, ARTICLES_COLLECTION, articleId);
      await setDoc(docRef, articleToSave, { merge: true });
      return articleToSave;
    } catch (err) {
      console.error('Error saving article to Firestore:', err);
      throw err;
    }
  },

  // Delete an article from Firestore
  deleteArticle: async (articleId) => {
    try {
      const docRef = doc(db, ARTICLES_COLLECTION, String(articleId));
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.error('Error deleting article from Firestore:', err);
      throw err;
    }
  },

  // Subscribe to real-time App Branding & Theme configuration
  subscribeAppConfig: (onConfigUpdate) => {
    try {
      const configRef = doc(db, 'settings', CONFIG_DOC);
      const unsubscribe = onSnapshot(configRef, (docSnap) => {
        if (docSnap.exists()) {
          onConfigUpdate(docSnap.data());
        }
      }, (err) => {
        console.warn('Firestore config listener warning:', err);
      });
      return unsubscribe;
    } catch (err) {
      console.warn('Failed to listen to cloud config:', err);
      return () => {};
    }
  },

  // Save App Branding configuration to Firestore
  saveAppConfig: async (config) => {
    try {
      const configRef = doc(db, 'settings', CONFIG_DOC);
      await setDoc(configRef, config, { merge: true });
    } catch (err) {
      console.warn('Failed to save cloud config:', err);
    }
  },

  // Subscribe to real-time custom Categories
  subscribeCategories: (onCategoriesUpdate) => {
    try {
      const catRef = doc(db, 'settings', CATEGORIES_DOC);
      const unsubscribe = onSnapshot(catRef, (docSnap) => {
        if (docSnap.exists() && docSnap.data().list) {
          onCategoriesUpdate(docSnap.data().list);
        }
      }, (err) => {
        console.warn('Firestore categories listener warning:', err);
      });
      return unsubscribe;
    } catch (err) {
      console.warn('Failed to listen to cloud categories:', err);
      return () => {};
    }
  },

  // Save Categories list to Firestore
  saveCategories: async (categoriesList) => {
    try {
      const catRef = doc(db, 'settings', CATEGORIES_DOC);
      await setDoc(catRef, { list: categoriesList, updatedAt: Date.now() }, { merge: true });
    } catch (err) {
      console.warn('Failed to save cloud categories:', err);
    }
  },

  // Broadcast a cloud notification across all user devices in real time
  broadcastNotification: async (notifData) => {
    try {
      const notifId = String(notifData.id || `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
      const docRef = doc(db, NOTIFICATIONS_COLLECTION, notifId);
      const dataToSave = {
        ...notifData,
        id: notifId,
        createdAt: notifData.createdAt || Date.now()
      };
      await setDoc(docRef, dataToSave);
      return dataToSave;
    } catch (err) {
      console.warn('Failed to broadcast cloud notification:', err);
      return null;
    }
  },

  // Subscribe to real-time notifications across all user devices
  subscribeNotifications: (onNotificationsUpdate) => {
    try {
      const notifsRef = collection(db, NOTIFICATIONS_COLLECTION);
      const q = query(notifsRef, orderBy('createdAt', 'desc'), limit(50));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const notifs = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
          onNotificationsUpdate(notifs);
        },
        (err) => {
          console.warn('Firestore notifications listener error:', err);
        }
      );
      return unsubscribe;
    } catch (err) {
      console.warn('Failed to listen to cloud notifications:', err);
      return () => {};
    }
  },

  // Delete a cloud notification from Firestore
  deleteNotification: async (notifId) => {
    try {
      const docRef = doc(db, NOTIFICATIONS_COLLECTION, String(notifId));
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.warn('Failed to delete cloud notification:', err);
      return false;
    }
  }
};
