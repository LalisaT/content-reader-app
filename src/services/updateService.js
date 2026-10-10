import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

const CURRENT_VERSION_CODE = 34;
const CURRENT_VERSION_NAME = '1.4.1';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.tippulse.app';

// Session-only memory state for skipped optional updates (no local storage persistence)
const skippedSessionVersions = new Set();

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
    const releaseNotes =
      cloudConfig.releaseNotes ||
      '• Enhanced career & tip deep links for instant in-app opening\n• Real-time cloud streaming architecture\n• Performance and stability improvements';
    const isUpdateEnabled = cloudConfig.updatePromptEnabled !== false;

    // Allow instant visual verification via ?previewUpdate=1
    let forcePreview = false;
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('previewUpdate') === '1') {
        forcePreview = true;
      }
    } catch (e) {}

    // If update prompt is disabled or latest version not configured, return null (unless previewing)
    if ((!isUpdateEnabled || !latestVersionCode) && !forcePreview) return null;

    const current = await updateService.getCurrentVersion();

    // If current version is equal to or newer than the latest on store, no update needed
    if (!forcePreview && current.versionCode >= latestVersionCode) {
      return null;
    }

    // Force update if installed version is below minimum supported threshold
    const isForceUpdate = minSupportedVersionCode > 0 && current.versionCode < minSupportedVersionCode;

    // If optional update, respect user's dismiss choice during active session
    if (!isForceUpdate && !forcePreview && skippedSessionVersions.has(String(latestVersionCode))) {
      return null;
    }

    const formattedDate =
      cloudConfig.lastUpdatedDate ||
      new Date(cloudConfig.updatedAt || Date.now()).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

    return {
      hasUpdate: true,
      isForceUpdate,
      appName: cloudConfig.appName || 'TipPulse',
      currentVersionCode: current.versionCode,
      currentVersionName: current.versionName,
      latestVersionCode: latestVersionCode || current.versionCode + 1,
      latestVersionName: latestVersionName || `1.3.${(latestVersionCode || current.versionCode + 1) - 29}`,
      releaseNotes,
      updateSize: cloudConfig.updateSize || '18 MB',
      updateRating: cloudConfig.updateRating || '4.8',
      lastUpdatedDate: formattedDate,
      updateUrl: cloudConfig.updateUrl || PLAY_STORE_URL,
    };
  },

  // Remember that the user skipped this update version for the current session
  skipUpdate: (versionCode) => {
    if (versionCode !== undefined && versionCode !== null) {
      skippedSessionVersions.add(String(versionCode));
    }
  },

  // Launch Google Play Store directly
  openPlayStore: (customUrl) => {
    const targetUrl = customUrl || PLAY_STORE_URL;
    if (Capacitor.isNativePlatform()) {
      try {
        window.location.href = `market://details?id=com.tippulse.app`;
        return;
      } catch (e) {}
    }
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  }
};
