/**
 * Patches @capacitor-community/admob Android BannerExecutor.java so that:
 * 1. The AdMob Banner is NEVER removed or destroyed on onAdFailedToLoad (stays mounted 24/7 and retries in 10s).
 * 2. Calling showBanner when mAdView != null dynamically updates the bottom margin + safe system navigation bar inset
 *    without reloading or interrupting the live ad.
 * 3. Fixes the Android 15+ DecorView OnApplyWindowInsetsListener bug in @capacitor-community/admob so the Android
 *    3-button navigation bar (||| O <) NEVER overlaps the AdMob Banner Ad.
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

  // Ensure currentDensityMargin field and computeSafeBottomMargin helper exist on BannerExecutor
  if (!content.includes('private int currentDensityMargin = 0;')) {
    content = content.replace(
      '    private ViewGroup mViewGroup;',
      `    private ViewGroup mViewGroup;
    private int currentDensityMargin = 0;

    private int computeSafeBottomMargin(int baseMarginPx) {
        int unconsumedBottomInset = 0;
        try {
            Activity activity = activitySupplier.get();
            if (activity != null && activity.getWindow() != null) {
                View decorView = activity.getWindow().getDecorView();
                View contentView = activity.findViewById(android.R.id.content);
                int rawBottom = 0;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R && decorView.getRootWindowInsets() != null) {
                    rawBottom = decorView.getRootWindowInsets().getInsetsIgnoringVisibility(
                        android.view.WindowInsets.Type.systemBars() | android.view.WindowInsets.Type.navigationBars()
                    ).bottom;
                } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && decorView.getRootWindowInsets() != null) {
                    rawBottom = decorView.getRootWindowInsets().getSystemWindowInsetBottom();
                }
                int paddedBottom = 0;
                if (mViewGroup != null) paddedBottom += mViewGroup.getPaddingBottom();
                if (contentView != null) paddedBottom += contentView.getPaddingBottom();
                if (mViewGroup != null && decorView.getHeight() > 0 && mViewGroup.getBottom() > 0) {
                    int gapFromDecorBottom = decorView.getHeight() - mViewGroup.getBottom();
                    if (gapFromDecorBottom > 0) {
                        paddedBottom = Math.max(paddedBottom, gapFromDecorBottom);
                    }
                }
                unconsumedBottomInset = Math.max(0, rawBottom - paddedBottom);
            }
        } catch (Exception ignored) {}
        return baseMarginPx + unconsumedBottomInset;
    }`
    );
  }

  // Replace any existing `if (mAdView != null)` block in showBanner
  const mAdViewBlockRegex = /if\s*\(\s*mAdView\s*!=\s*null\s*\)\s*\{[\s\S]*?return;\s*\}/;
  const newExistingBlock = `if (mAdView != null) {
            final int updatedDensityMargin = (int) (adOptions.margin * density);
            currentDensityMargin = updatedDensityMargin;
            activitySupplier.get().runOnUiThread(() -> {
                if (mAdViewLayout != null) {
                    if (mAdViewLayout.getLayoutParams() instanceof CoordinatorLayout.LayoutParams) {
                        CoordinatorLayout.LayoutParams params = (CoordinatorLayout.LayoutParams) mAdViewLayout.getLayoutParams();
                        int safeBottom = computeSafeBottomMargin(updatedDensityMargin);
                        params.setMargins(params.leftMargin, updatedDensityMargin, params.rightMargin, safeBottom);
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

  content = content.replace(mAdViewBlockRegex, newExistingBlock);

  // Update initial densityMargin assignment to also set currentDensityMargin and use computeSafeBottomMargin
  content = content.replace(
    'int densityMargin = (int) (adOptions.margin * density);',
    'int densityMargin = (int) (adOptions.margin * density);\n            currentDensityMargin = densityMargin;'
  );

  content = content.replace(
    'mAdViewLayoutParams.setMargins(margin, densityMargin, margin, densityMargin);',
    'mAdViewLayoutParams.setMargins(margin, densityMargin, margin, computeSafeBottomMargin(densityMargin));'
  );

  content = content.replace(
    'mAdViewLayoutParams.setMargins(sideMargin, densityMargin, sideMargin, densityMargin);',
    'mAdViewLayoutParams.setMargins(sideMargin, densityMargin, sideMargin, computeSafeBottomMargin(densityMargin));'
  );

  // Fix the Android 15+ WindowInsets listener so it NEVER swallows DecorView.onApplyWindowInsets(insets)
  // and always uses currentDensityMargin + unconsumedBottomInset
  const windowInsetsRegex = /\/\/\s*set Safe Area only for Android 15\+[\s\S]*?createNewAdView\(adOptions\);/;
  const newWindowInsetsBlock = `// Keep Banner above Android system navigation bar across all inset updates without breaking DecorView
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && mAdViewLayout != null) {
                mAdViewLayout.post(() -> {
                    try {
                        if (mAdViewLayout != null && mAdViewLayout.getLayoutParams() instanceof CoordinatorLayout.LayoutParams) {
                            CoordinatorLayout.LayoutParams params = (CoordinatorLayout.LayoutParams) mAdViewLayout.getLayoutParams();
                            params.setMargins(params.leftMargin, currentDensityMargin, params.rightMargin, computeSafeBottomMargin(currentDensityMargin));
                            mAdViewLayout.setLayoutParams(params);
                        }
                    } catch (Exception ignored) {}
                });
            }

            createNewAdView(adOptions);`;

  content = content.replace(windowInsetsRegex, newWindowInsetsBlock);

  // Fix onAdFailedToLoad removing & destroying the banner view
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
  }

  fs.writeFileSync(targetFile, content, 'utf8');
  console.log('[patch-admob-banner] Successfully patched BannerExecutor.java for 24/7 non-removable AdMob banner with safe navigation bar inset.');
} catch (err) {
  console.warn('[patch-admob-banner] Warning:', err.message);
}
