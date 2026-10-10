import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseAdmin';
import { Sparkles, Save, CheckCircle2, Rocket, Smartphone, ChevronDown, X, PlusCircle } from 'lucide-react';

export default function BrandingSettings() {
  const [dailyTipTitle, setDailyTipTitle] = useState('The 2-Minute Momentum Rule');
  const [dailyTipContent, setDailyTipContent] = useState('If a habit takes less than 2 minutes to do, start it right now without hesitating.');
  const [appName, setAppName] = useState('TipPulse');

  // App Version & Google Play In-App Update Management
  const [latestVersionCode, setLatestVersionCode] = useState(34);
  const [latestVersionName, setLatestVersionName] = useState('1.4.1');
  const [minSupportedVersionCode, setMinSupportedVersionCode] = useState(1);
  const [updateSize, setUpdateSize] = useState('18 MB');
  const [updateRating, setUpdateRating] = useState('4.8');
  const [lastUpdatedDate, setLastUpdatedDate] = useState(
    new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  );
  const [releaseNotes, setReleaseNotes] = useState(
    '• Enhanced career & tip deep links for instant in-app opening\n• Real-time cloud streaming architecture\n• Stability & performance optimizations'
  );
  const [updatePromptEnabled, setUpdatePromptEnabled] = useState(true);
  const [updateUrl, setUpdateUrl] = useState('https://play.google.com/store/apps/details?id=com.tippulse.app');
  const [previewExpanded, setPreviewExpanded] = useState(false);

  // Independent saving states for Daily Nugget vs App Update
  const [isSavingNugget, setIsSavingNugget] = useState(false);
  const [savedNugget, setSavedNugget] = useState(false);

  const [isSavingUpdate, setIsSavingUpdate] = useState(false);
  const [savedUpdate, setSavedUpdate] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'app_config'));
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.dailyTipTitle) setDailyTipTitle(data.dailyTipTitle);
          if (data.dailyTipContent) setDailyTipContent(data.dailyTipContent);
          if (data.appName) setAppName(data.appName);

          // Version management fields
          if (data.latestVersionCode !== undefined) setLatestVersionCode(data.latestVersionCode);
          if (data.latestVersionName) setLatestVersionName(data.latestVersionName);
          if (data.minSupportedVersionCode !== undefined) setMinSupportedVersionCode(data.minSupportedVersionCode);
          if (data.updateSize) setUpdateSize(data.updateSize);
          if (data.updateRating) setUpdateRating(data.updateRating);
          if (data.lastUpdatedDate) setLastUpdatedDate(data.lastUpdatedDate);
          if (data.releaseNotes) setReleaseNotes(data.releaseNotes);
          if (data.updatePromptEnabled !== undefined) setUpdatePromptEnabled(data.updatePromptEnabled);
          if (data.updateUrl) setUpdateUrl(data.updateUrl);
        }
      } catch (err) {
        console.warn('Config fetch error:', err);
      }
    };
    fetchConfig();
  }, []);

  const handleBumpVersion = () => {
    const nextCode = Number(latestVersionCode || 32) + 1;
    setLatestVersionCode(nextCode);
    const parts = String(latestVersionName || '1.3.1').split('.').map((n) => parseInt(n, 10) || 0);
    if (parts.length >= 3) {
      parts[2] += 1;
      setLatestVersionName(parts.join('.'));
    } else {
      setLatestVersionName(`1.3.${nextCode - 29}`);
    }
    setLastUpdatedDate(
      new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    );
    setUpdatePromptEnabled(true);
  };

  // Save ONLY Branding & Daily Nugget
  const handleSaveNuggetOnly = async (e) => {
    if (e) e.preventDefault();
    setIsSavingNugget(true);
    try {
      await setDoc(
        doc(db, 'settings', 'app_config'),
        {
          appName,
          dailyTipTitle,
          dailyTipContent,
          nuggetUpdatedAt: Date.now()
        },
        { merge: true }
      );
      setSavedNugget(true);
      setTimeout(() => setSavedNugget(false), 3500);
    } catch (err) {
      alert(`Failed to update Daily Nugget: ${err.message}`);
    } finally {
      setIsSavingNugget(false);
    }
  };

  // Save & Broadcast Google Play In-App Update
  const handleSaveUpdateOnly = async (e) => {
    if (e) e.preventDefault();
    setIsSavingUpdate(true);
    try {
      await setDoc(
        doc(db, 'settings', 'app_config'),
        {
          latestVersionCode: Number(latestVersionCode),
          latestVersionName: String(latestVersionName),
          minSupportedVersionCode: Number(minSupportedVersionCode),
          updateSize: String(updateSize || '18 MB'),
          updateRating: String(updateRating || '4.8'),
          lastUpdatedDate: String(lastUpdatedDate),
          releaseNotes: String(releaseNotes),
          updatePromptEnabled: Boolean(updatePromptEnabled),
          updateUrl: String(updateUrl),
          updatedAt: Date.now()
        },
        { merge: true }
      );
      setSavedUpdate(true);
      setTimeout(() => setSavedUpdate(false), 3500);
    } catch (err) {
      alert(`Failed to broadcast app update: ${err.message}`);
    } finally {
      setIsSavingUpdate(false);
    }
  };

  return (
    <div className="max-w-5xl bg-slate-800/60 p-5 rounded-2xl border border-slate-700 space-y-5">
      <div>
        <h2 className="text-base font-bold text-white flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>App Customization & Google Play In-App Updates</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage your Daily Tip nugget independently or broadcast official Google Play style in-app update sheets across all devices.
        </p>
      </div>

      {/* Section 1: Branding & Daily Nugget (With Dedicated Update Button) */}
      <form
        onSubmit={handleSaveNuggetOnly}
        className="space-y-3.5 bg-slate-900/50 p-4 sm:p-5 rounded-xl border border-slate-700/60 text-xs"
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-bold text-slate-200 flex items-center space-x-1.5 text-sm">
            <Smartphone className="w-4 h-4 text-indigo-400" />
            <span>Branding & Daily Nugget</span>
          </h3>

          {savedNugget && (
            <span className="px-3 py-1 rounded-lg bg-emerald-950/90 border border-emerald-700 text-emerald-300 font-bold text-[11px] flex items-center space-x-1.5 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Daily Nugget Updated Live!</span>
            </span>
          )}
        </div>

        <div>
          <label className="block font-bold text-slate-300 mb-1">App Display Name</label>
          <input
            type="text"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-300 mb-1">Daily Insight Title</label>
          <input
            type="text"
            value={dailyTipTitle}
            onChange={(e) => setDailyTipTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-300 mb-1">Daily Insight Content</label>
          <textarea
            rows={2}
            value={dailyTipContent}
            onChange={(e) => setDailyTipContent(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Dedicated Update Button for Daily Nugget Only */}
        <div className="pt-1 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isSavingNugget}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/25 flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSavingNugget ? 'Updating Nugget...' : 'Update Daily Nugget'}</span>
          </button>
        </div>
      </form>

      {/* Section 2: Google Play In-App Update Manager + Live Sheet Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <form
          onSubmit={handleSaveUpdateOnly}
          className="lg:col-span-7 space-y-3.5 bg-slate-900/50 p-4 sm:p-5 rounded-xl border border-slate-700/60 text-xs"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-bold text-slate-200 flex items-center space-x-1.5 text-sm">
              <Rocket className="w-4 h-4 text-amber-400" />
              <span>Google Play In-App Update Sheet</span>
            </h3>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleBumpVersion}
                className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-[11px] flex items-center space-x-1 transition-colors cursor-pointer"
              >
                <PlusCircle className="w-3 h-3" />
                <span>Bump +1 Version</span>
              </button>
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={updatePromptEnabled}
                  onChange={(e) => setUpdatePromptEnabled(e.target.checked)}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                />
                <span className="text-[11px] font-semibold text-slate-300">Enable Sheet</span>
              </label>
            </div>
          </div>

          {savedUpdate && (
            <div className="p-2.5 rounded-xl bg-emerald-950/90 border border-emerald-700 text-emerald-300 font-bold text-[11px] flex items-center space-x-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Google Play Update Sheet synced & broadcasted to all devices!</span>
            </div>
          )}

          <p className="text-[11px] text-slate-400 leading-normal">
            When <strong>Latest Version Code</strong> is higher than the user&apos;s installed build (currently <code>32</code>), the Google Play update sheet appears automatically on launch.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Latest Version Code</label>
              <input
                type="number"
                value={latestVersionCode}
                onChange={(e) => setLatestVersionCode(e.target.value)}
                placeholder="e.g. 33"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">Latest Version Name</label>
              <input
                type="text"
                value={latestVersionName}
                onChange={(e) => setLatestVersionName(e.target.value)}
                placeholder="e.g. 1.3.2"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Update Size</label>
              <input
                type="text"
                value={updateSize}
                onChange={(e) => setUpdateSize(e.target.value)}
                placeholder="18 MB"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">Store Rating</label>
              <input
                type="text"
                value={updateRating}
                onChange={(e) => setUpdateRating(e.target.value)}
                placeholder="4.8"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">Last Updated</label>
              <input
                type="text"
                value={lastUpdatedDate}
                onChange={(e) => setLastUpdatedDate(e.target.value)}
                placeholder="Oct 10, 2026"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">
              Minimum Required Version Code (Force Update Threshold)
            </label>
            <input
              type="number"
              value={minSupportedVersionCode}
              onChange={(e) => setMinSupportedVersionCode(e.target.value)}
              placeholder="1"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            />
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Set above 32 to make the update mandatory (hides the top ✕ dismiss button).
            </span>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">What&apos;s New / Release Notes</label>
            <textarea
              rows={3}
              value={releaseNotes}
              onChange={(e) => setReleaseNotes(e.target.value)}
              placeholder="What's new in this update..."
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-1 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSavingUpdate}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-amber-500/20 flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>{isSavingUpdate ? 'Broadcasting Update...' : 'Save & Broadcast App Update'}</span>
            </button>
          </div>
        </form>

        {/* Live Google Play Update Sheet Preview */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between px-1">
            <span>Live Google Play Sheet Preview</span>
            <span className="text-emerald-400 font-mono">v{latestVersionName} ({latestVersionCode})</span>
          </div>

          <div
            className="w-full bg-[#1e1f22] text-[#e3e3e3] rounded-[28px] px-5 pt-5 pb-6 shadow-2xl border border-white/10 select-none"
            style={{ fontFamily: 'Roboto, "Google Sans", system-ui, sans-serif' }}
          >
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path d="M3.61 1.814L13.793 12 3.61 22.186a1.96 1.96 0 0 1-.61-1.424V3.238c0-.55.224-1.064.61-1.424z" fill="#4285F4" />
                  <path d="M17.237 8.556L13.793 12 3.61 1.814c.445-.416 1.116-.527 1.72-.186l11.907 6.928z" fill="#34A853" />
                  <path d="M17.237 15.444L5.33 22.372c-.604.341-1.275.23-1.72-.186L13.793 12l3.444 3.444z" fill="#EA4335" />
                  <path d="M21.397 10.976l-4.16-2.42L13.793 12l3.444 3.444 4.16-2.42c.804-.468.804-1.58 0-2.048z" fill="#FBBC04" />
                </svg>
                <span className="text-[14px] font-medium text-[#e3e3e3]">Google Play</span>
              </div>
              <X className="w-4 h-4 text-[#c4c7c5]" />
            </div>

            <div className="text-[19px] font-normal text-[#e3e3e3] leading-snug mb-1.5">
              Update available
            </div>
            <p className="text-[12.5px] text-[#c4c7c5] leading-[1.45] mb-4">
              To use this app, download the latest version. You can keep using this app while downloading the update.
            </p>

            <div className="flex items-start gap-3.5 mb-4">
              <img
                src="/app-icon.png"
                alt={appName}
                className="w-12 h-12 rounded-xl object-cover bg-[#131314] border border-white/10 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-[14.5px] font-medium text-[#e3e3e3] truncate">{appName}</div>
                <div className="flex items-center flex-wrap gap-x-2.5 text-[12px] text-[#c4c7c5] mt-0.5">
                  <span>{updateRating} ★</span>
                  <span>{updateSize}</span>
                  <span className="inline-flex items-center">
                    <span className="inline-flex items-center justify-center w-3 h-3 bg-[#e3e3e3] text-[#1e1f22] text-[8px] font-black rounded-[2px] mr-1">
                      E
                    </span>
                    Everyone
                  </span>
                </div>
                <div className="text-[11px] text-[#8e918f] mt-0.5">
                  Contains ads • In-app purchases
                </div>
              </div>
            </div>

            <div className="mb-5">
              <button
                type="button"
                onClick={() => setPreviewExpanded((p) => !p)}
                className="w-full flex items-center justify-between py-1 text-left cursor-pointer"
              >
                <div>
                  <div className="text-[13.5px] font-medium text-[#e3e3e3]">What&apos;s new</div>
                  <div className="text-[11px] text-[#c4c7c5]">Last updated {lastUpdatedDate}</div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#c4c7c5] transition-transform ${
                    previewExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {previewExpanded && (
                <div className="mt-2 pt-2 border-t border-white/10 text-[12px] text-[#c4c7c5] whitespace-pre-line">
                  {releaseNotes}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setPreviewExpanded((p) => !p)}
                className="py-2 px-4 rounded-full border border-[#8e918f]/70 text-[#a8c7fa] font-medium text-[13px] text-center cursor-pointer"
              >
                Learn more
              </button>
              <div className="py-2 px-4 rounded-full bg-[#a8c7fa] text-[#062e6f] font-semibold text-[13px] text-center">
                Update
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
