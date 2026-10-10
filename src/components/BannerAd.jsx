import { useEffect } from 'react';
import { admobService } from '../services/admobService';

export default function BannerAd() {
  // Ensure the real Google AdMob adaptive banner stays active 24/7
  useEffect(() => {
    admobService.ensureBannerAlive();
  }, []);

  // Real banner ads are rendered natively by Google AdMob SDK (no custom fake HTML cards)
  return null;
}


