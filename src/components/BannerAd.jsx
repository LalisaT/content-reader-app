import React, { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { admobService } from '../services/admobService';

export default function BannerAd({ position = 'bottom' }) {
  // Ensure the real Google AdMob adaptive banner stays active 24/7
  useEffect(() => {
    admobService.ensureBannerAlive();
  }, []);

  // In full-screen reader views on native Android, render a clean dock backdrop
  // behind the native AdMob banner so scrolling text never gets sliced by the ad edge
  if (position === 'reader-bottom' && Capacitor.isNativePlatform()) {
    return (
      <div
        aria-hidden="true"
        className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pointer-events-none"
        style={{
          height: 'calc(58px + var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px)))',
        }}
      />
    );
  }

  // Real banner ads are rendered natively by Google AdMob SDK (no custom fake HTML cards)
  return null;
}
