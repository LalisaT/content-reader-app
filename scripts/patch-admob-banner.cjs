/**
 * Patches @capacitor-community/admob Android BannerExecutor.java so that:
 * 1. The AdMob Banner is NEVER removed or destroyed on onAdFailedToLoad (e.g. during auto-refresh or temporary no-fill).
 * 2. Instead, it stays mounted 24/7 and automatically retries loading after 10 seconds.
 * 3. Calling showBanner when mAdView already exists dynamically updates the bottom margin (e.g. 0px in reader vs 56px above BottomNav)
 *    and resolves the Capacitor call cleanly without reloading or interrupting the live ad.
 */
const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(
  __dirname,
  '../node_modules/@capacitor-community/admob/android/src/main/java/com/getcapacitor/community/admob/banner/BannerExecutor.java'
);

try {
  if (!fs.existsSync(targetFile)) {
    console.log('[patch-admob-banner] BannerExecutor.java not found, skipping.');
    process.exit(0);
  }

  let content = fs.readFileSync(targetFile, 'utf8');
  let modified = false;

  // 1. Update showBanner when mAdView != null so it adjusts margin dynamically without reloading the ad
  const oldExistingCheck1 = `        if (mAdView != null) {
            updateExistingAdView(adOptions);
            return;
        }`;

  const oldExistingCheck2 = `        if (mAdView != null) {
            activitySupplier.get().runOnUiThread(() -> {
                if (mAdViewLayout != null) {
                    mAdViewLayout.setVisibility(View.VISIBLE);
                }
                if (mAdView != null) {
                    mAdView.resume();
                }
            });
            call.resolve();
            return;
        }`;

  const newExistingCheck = `        if (mAdView != null) {
            final int updatedDensityMargin = (int) (adOptions.margin * density);
            activitySupplier.get().runOnUiThread(() -> {
                if (mAdViewLayout != null) {
                    if (mAdViewLayout.getLayoutParams() instanceof CoordinatorLayout.LayoutParams) {
                        CoordinatorLayout.LayoutParams params = (CoordinatorLayout.LayoutParams) mAdViewLayout.getLayoutParams();
                        params.setMargins(params.leftMargin, updatedDensityMargin, params.rightMargin, updatedDensityMargin);
                        mAdViewLayout.setLayoutParams(params);
                    }
                    mAdViewLayout.setVisibility(View.VISIBLE);
                }
                if (mAdView != null) {
                    mAdView.resume();
                }
            });
            call.resolve();
            return;
        }`;

  if (content.includes(oldExistingCheck1)) {
    content = content.replace(oldExistingCheck1, newExistingCheck);
    modified = true;
  } else if (content.includes(oldExistingCheck2)) {
    content = content.replace(oldExistingCheck2, newExistingCheck);
    modified = true;
  }

  // 2. Fix onAdFailedToLoad removing & destroying the banner view
  const oldFailedBlock = `                            mViewGroup.removeView(mAdViewLayout);
                            mAdViewLayout.removeView(adView);
                            adView.destroy();
                            mAdView = null;`;

  const newFailedBlock = `                            // Keep mAdViewLayout & mAdView mounted 24/7 without removing; retry loadAd in 10s
                            adView.postDelayed(() -> {
                                try {
                                    if (adView == mAdView) {
                                        adView.loadAd(RequestHelper.createRequest(adOptions));
                                    }
                                } catch (Exception ignored) {}
                            }, 10000);`;

  if (content.includes(oldFailedBlock)) {
    content = content.replace(oldFailedBlock, newFailedBlock);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log('[patch-admob-banner] Successfully patched BannerExecutor.java for 24/7 non-removable AdMob banner with dynamic margin.');
  } else {
    console.log('[patch-admob-banner] BannerExecutor.java already up to date.');
  }
} catch (err) {
  console.warn('[patch-admob-banner] Warning:', err.message);
}
