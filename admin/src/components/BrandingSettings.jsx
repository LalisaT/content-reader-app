import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseAdmin';
import { Sparkles, Save, CheckCircle2, Rocket, Smartphone } from 'lucide-react';

export default function BrandingSettings() {
  const [dailyTipTitle, setDailyTipTitle] = useState('The 2-Minute Momentum Rule');
  const [dailyTipContent, setDailyTipContent] = useState('If a habit takes less than 2 minutes to do, start it right now without hesitating.');
  const [appName, setAppName] = useState('TipPulse');

  // App Version & In-App Update Management
  const [latestVersionCode, setLatestVersionCode] = useState(32);
  const [latestVersionName, setLatestVersionName] = useState('1.3.1');
  const [minSupportedVersionCode, setMinSupportedVersionCode] = useState(1);
  const [releaseNotes, setReleaseNotes] = useState('• Enhanced link sharing with direct post opening\n• Real-time notification delivery improvements\n• Stability & performance optimizations');
  const [updatePromptEnabled, setUpdatePromptEnabled] = useState(true);
  const [updateUrl, setUpdateUrl] = useState('https://play.google.com/store/apps/details?id=com.tippulse.app');

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'app_config'), {
        appName,
        dailyTipTitle,
        dailyTipContent,
        latestVersionCode: Number(latestVersionCode),
        latestVersionName: String(latestVersionName),
        minSupportedVersionCode: Number(minSupportedVersionCode),
        releaseNotes: String(releaseNotes),
        updatePromptEnabled: Boolean(updatePromptEnabled),
        updateUrl: String(updateUrl),
        updatedAt: Date.now()
      }, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(`Failed to save config: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl bg-slate-800/60 p-5 rounded-2xl border border-slate-700 space-y-5">
      <div>
        <h2 className="text-base font-bold text-white flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>App Customization & In-App Updates</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage your Daily Tip nugget and control in-app update prompts across all mobile devices.
        </p>
      </div>

      {saved && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Settings & App Version successfully synced to cloud!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5 text-xs">
        {/* Section 1: Branding & Daily Nugget */}
        <div className="space-y-3.5 bg-slate-900/50 p-4 rounded-xl border border-slate-700/60">
          <h3 className="font-bold text-slate-200 flex items-center space-x-1.5">
            <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
            <span>Branding & Daily Nugget</span>
          </h3>

          <div>
            <label className="block font-bold text-slate-300 mb-1">App Display Name</label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Daily Insight Title</label>
            <input
              type="text"
              value={dailyTipTitle}
              onChange={(e) => setDailyTipTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Daily Insight Content</label>
            <textarea
              rows={2}
              value={dailyTipContent}
              onChange={(e) => setDailyTipContent(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Section 2: Mobile App In-App Update Manager */}
        <div className="space-y-3.5 bg-slate-900/50 p-4 rounded-xl border border-slate-700/60">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-200 flex items-center space-x-1.5">
              <Rocket className="w-3.5 h-3.5 text-amber-400" />
              <span>In-App Update Prompt (Update or Skip)</span>
            </h3>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={updatePromptEnabled}
                onChange={(e) => setUpdatePromptEnabled(e.target.checked)}
                className="rounded border-slate-700 text-indigo-600 focus:ring-0"
              />
              <span className="text-[11px] font-semibold text-slate-300">Enable Prompt</span>
            </label>
          </div>

          <p className="text-[11px] text-slate-400 leading-normal">
            When users open an older app version, TipPulse will automatically prompt them to update from Google Play with an option to <strong>Update Now</strong> or <strong>Skip / Later</strong>.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Latest Version Code (Play Store)</label>
              <input
                type="number"
                value={latestVersionCode}
                onChange={(e) => setLatestVersionCode(e.target.value)}
                placeholder="e.g. 32"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">Latest Version Name</label>
              <input
                type="text"
                value={latestVersionName}
                onChange={(e) => setLatestVersionName(e.target.value)}
                placeholder="e.g. 1.3.1"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">
              Minimum Required Version Code (Optional)
            </label>
            <input
              type="number"
              value={minSupportedVersionCode}
              onChange={(e) => setMinSupportedVersionCode(e.target.value)}
              placeholder="1"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            />
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Set higher to force all older versions to update immediately (hides the Skip button).
            </span>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">What's New / Release Notes</label>
            <textarea
              rows={3}
              value={releaseNotes}
              onChange={(e) => setReleaseNotes(e.target.value)}
              placeholder="What's new in this update..."
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition-colors cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Saving...' : 'Save Settings & Broadcast Update'}</span>
        </button>
      </form>
    </div>
  );
}
