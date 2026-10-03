import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

const CURRENT_VERSION_CODE = 32;
const CURRENT_VERSION_NAME = '1.3.1';
const SKIP_STORAGE_KEY = 'tippulse_skip_update_v';
const SKIP_TIME_KEY = 'tippulse_skip_update_ts';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.tippulse.app';

export const updateService = {
  // Get installed app version
  getCurrentVersion: async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        const info = await App.getInfo();
        return {
          versionName: info.version || CURRENT_VERSION_NAME,
          versionCode: parseInt(info.build, 10) || CURRENT_VERSION_CODE,
        };
      } catch (e) {
        console.warn('App.getInfo error:', e);
      }
    }
    return {
      versionName: CURRENT_VERSION_NAME,
      versionCode: CURRENT_VERSION_CODE,
    };
  },

  // Check if a new version exists in cloud config
  checkForUpdate: async (cloudConfig) => {
    if (!cloudConfig) return null;

    const latestVersionCode = Number(cloudConfig.latestVersionCode || 0);
    const latestVersionName = cloudConfig.latestVersionName || '';
    const minSupportedVersionCode = Number(cloudConfig.minSupportedVersionCode || 0);
    const releaseNotes = cloudConfig.releaseNotes || 'Exciting new features and performance enhancements are now available.';
    const isUpdateEnabled = cloudConfig.updatePromptEnabled !== false;

    // If update prompt is disabled or latest version not configured, return null
    if (!isUpdateEnabled || !latestVersionCode) return null;

    const current = await updateService.getCurrentVersion();

    // If current version is equal to or newer than the latest on store, no update needed
    if (current.versionCode >= latestVersionCode) {
      return null;
    }

    // Force update if installed version is below minimum supported threshold
    const isForceUpdate = minSupportedVersionCode > 0 && current.versionCode < minSupportedVersionCode;

    // If optional update, respect user's "Skip / Later" preference for 24 hours
    if (!isForceUpdate) {
      try {
        const skippedVersion = localStorage.getItem(SKIP_STORAGE_KEY);
        const skippedTs = Number(localStorage.getItem(SKIP_TIME_KEY) || 0);
        const now = Date.now();
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;

        if (skippedVersion === String(latestVersionCode) && (now - skippedTs) < ONE_DAY_MS) {
          return null;
        }
      } catch (e) {}
    }

    return {
      hasUpdate: true,
      isForceUpdate,
      currentVersionCode: current.versionCode,
      currentVersionName: current.versionName,
      latestVersionCode,
      latestVersionName: latestVersionName || `v${latestVersionCode}`,
      releaseNotes,
      updateUrl: cloudConfig.updateUrl || PLAY_STORE_URL,
    };
  },

  // Remember that the user skipped this update version (24-hour cooldown)
  skipUpdate: (versionCode) => {
    try {
      localStorage.setItem(SKIP_STORAGE_KEY, String(versionCode));
      localStorage.setItem(SKIP_TIME_KEY, String(Date.now()));
    } catch (e) {}
  },

  // Launch Google Play Store directly
  openPlayStore: (customUrl) => {
    const targetUrl = customUrl || PLAY_STORE_URL;
    if (Capacitor.isNativePlatform()) {
      try {
        // Try opening native Google Play Store app directly
        window.location.href = `market://details?id=com.tippulse.app`;
        return;
      } catch (e) {}
    }
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  }
};
