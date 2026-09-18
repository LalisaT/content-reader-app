import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseAdmin';
import { Sparkles, Save, CheckCircle2 } from 'lucide-react';

export default function BrandingSettings() {
  const [dailyTipTitle, setDailyTipTitle] = useState('The 2-Minute Momentum Rule');
  const [dailyTipContent, setDailyTipContent] = useState('If a habit takes less than 2 minutes to do, start it right now without hesitating.');
  const [appName, setAppName] = useState('TipPulse');
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
        dailyTipTitle,
        dailyTipContent,
        appName,
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
    <div className="max-w-2xl bg-slate-800/60 p-5 rounded-2xl border border-slate-700 space-y-4">
      <div>
        <h2 className="text-base font-bold text-white flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Daily Tip & App Customization</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Changes here update the Daily Pulse Nugget dialog across all mobile devices instantly.
        </p>
      </div>

      {saved && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Daily Tip & Settings updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4 text-xs">
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
            rows={3}
            value={dailyTipContent}
            onChange={(e) => setDailyTipContent(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Saving...' : 'Save Settings to Cloud'}</span>
        </button>
      </form>
    </div>
  );
}
