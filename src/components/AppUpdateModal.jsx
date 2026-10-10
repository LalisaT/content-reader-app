import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown } from 'lucide-react';

export default function AppUpdateModal({ updateInfo, appConfig, onUpdate, onSkip }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isForceUpdate = Boolean(updateInfo?.isForceUpdate);

  // Handle Android hardware back button
  useEffect(() => {
    if (!updateInfo) return;
    const handleHardwareBack = (e) => {
      e.preventDefault();
      if (!isForceUpdate && typeof onSkip === 'function') {
        onSkip();
      }
    };
    window.addEventListener('tippulse_hardware_back', handleHardwareBack);
    return () => window.removeEventListener('tippulse_hardware_back', handleHardwareBack);
  }, [updateInfo, isForceUpdate, onSkip]);

  if (!updateInfo) return null;

  const {
    appName = appConfig?.appName || 'TipPulse',
    currentVersionName = '1.3.1',
    latestVersionName = '1.3.2',
    latestVersionCode = 33,
    releaseNotes = '• Enhanced career & tip deep links for instant in-app opening\n• Real-time cloud streaming architecture\n• Performance and stability improvements',
    updateSize = '18 MB',
    updateRating = '4.8',
    lastUpdatedDate = 'Oct 10, 2026',
  } = updateInfo;

  const handleLearnMore = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    } else if (typeof onUpdate === 'function') {
      onUpdate();
    }
  };

  const sheetNode = (
    <div
      className="fixed inset-0 z-[9999] bg-black/65 backdrop-blur-[2px] flex items-end sm:items-center justify-center animate-in fade-in duration-200"
      style={{ fontFamily: 'Roboto, "Google Sans", system-ui, -apple-system, sans-serif' }}
    >
      {/* Backdrop tap dismisses only when update is optional */}
      {!isForceUpdate && (
        <div className="absolute inset-0" onClick={onSkip} aria-label="Close update prompt" />
      )}

      {/* Authentic Google Play Material 3 Dark Bottom Sheet */}
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gp-update-title"
        className="relative z-10 w-full sm:max-w-[430px] bg-[#1e1f22] text-[#e3e3e3] rounded-t-[28px] sm:rounded-[28px] px-6 pt-5 pb-6 shadow-[0_-12px_48px_rgba(0,0,0,0.75)] border-t border-white/10 sm:border animate-in slide-in-from-bottom duration-300 select-none"
      >
        {/* Top Row: Google Play Brand & Close Button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            {/* Official 4-Color Google Play Prism Icon */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M3.61 1.814L13.793 12 3.61 22.186a1.96 1.96 0 0 1-.61-1.424V3.238c0-.55.224-1.064.61-1.424z"
                fill="#4285F4"
              />
              <path
                d="M17.237 8.556L13.793 12 3.61 1.814c.445-.416 1.116-.527 1.72-.186l11.907 6.928z"
                fill="#34A853"
              />
              <path
                d="M17.237 15.444L5.33 22.372c-.604.341-1.275.23-1.72-.186L13.793 12l3.444 3.444z"
                fill="#EA4335"
              />
              <path
                d="M21.397 10.976l-4.16-2.42L13.793 12l3.444 3.444 4.16-2.42c.804-.468.804-1.58 0-2.048z"
                fill="#FBBC04"
              />
            </svg>
            <span className="text-[15px] font-medium text-[#e3e3e3] tracking-tight">
              Google Play
            </span>
          </div>

          {!isForceUpdate && (
            <button
              type="button"
              onClick={onSkip}
              className="p-1.5 -mr-1.5 rounded-full text-[#c4c7c5] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Dismiss update"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Title & Explanatory Copy */}
        <h2
          id="gp-update-title"
          className="text-[22px] font-normal text-[#e3e3e3] tracking-tight leading-snug mb-2"
        >
          {isForceUpdate ? 'Update required' : 'Update available'}
        </h2>

        <p className="text-[14px] text-[#c4c7c5] leading-[1.45] mb-5">
          {isForceUpdate
            ? 'To continue using this app, download the latest version from Google Play.'
            : 'To use this app, download the latest version. You can keep using this app while downloading the update.'}
        </p>

        {/* App Metadata Row */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#131314] border border-white/10 shadow-md shrink-0 flex items-center justify-center">
            <img
              src="/app-icon.png"
              alt={appName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-[16px] font-medium text-[#e3e3e3] leading-snug truncate">
              {appName}
            </div>

            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-[13px] text-[#c4c7c5] mt-1">
              <span className="inline-flex items-center font-medium">
                {updateRating} <span className="ml-0.5 text-[11px]">★</span>
              </span>
              <span>{updateSize}</span>
              <span className="inline-flex items-center">
                <span className="inline-flex items-center justify-center w-3.5 h-3.5 bg-[#e3e3e3] text-[#1e1f22] text-[9px] font-black rounded-[2px] leading-none mr-1.5">
                  E
                </span>
                <span>Everyone</span>
              </span>
            </div>

            <div className="text-[12px] text-[#8e918f] mt-0.5">
              Contains ads • In-app purchases
            </div>
          </div>
        </div>

        {/* Expandable "What's new" Accordion */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="w-full flex items-center justify-between py-1.5 text-left group cursor-pointer"
          >
            <div>
              <div className="text-[15px] font-medium text-[#e3e3e3]">What&apos;s new</div>
              <div className="text-[12px] text-[#c4c7c5] mt-0.5">
                Last updated {lastUpdatedDate}
              </div>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-[#c4c7c5] group-hover:text-white transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isExpanded && (
            <div className="mt-2.5 pt-3 border-t border-white/10 text-[13px] text-[#c4c7c5] leading-relaxed space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-[11px] text-[#8e918f] font-medium">
                <span>
                  Version {latestVersionName} (Build {latestVersionCode})
                </span>
                <span>Installed: v{currentVersionName}</span>
              </div>
              <p className="whitespace-pre-line text-[#e3e3e3]/90 max-h-36 overflow-y-auto pr-1">
                {releaseNotes}
              </p>
            </div>
          )}
        </div>

        {/* Bottom Dual Pill Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={handleLearnMore}
            className="w-full py-2.5 px-5 rounded-full border border-[#8e918f]/70 hover:bg-white/5 active:bg-white/10 text-[#a8c7fa] font-medium text-[14px] transition-colors cursor-pointer text-center"
          >
            Learn more
          </button>

          <button
            type="button"
            onClick={onUpdate}
            className="w-full py-2.5 px-5 rounded-full bg-[#a8c7fa] hover:bg-[#b8d3fc] active:scale-[0.99] text-[#062e6f] font-semibold text-[14px] transition-all shadow-sm cursor-pointer text-center"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(sheetNode, document.body);
  }
  return sheetNode;
}
