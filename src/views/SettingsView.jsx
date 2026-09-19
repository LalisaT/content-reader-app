import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  Sliders,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Trash2,
  Mail,
  Info,
  BookOpen
} from 'lucide-react';
import { ADMOB_CONFIG } from '../services/admobService';
import { storageService } from '../services/storageService';
import { THEME_PALETTES } from '../services/appConfigService';

export default function SettingsView({
  readerTheme,
  onChangeReaderTheme,
  fontSize,
  onChangeFontSize,
  onOpenPolicy,
  onOpenTerms,
  onOpenDisclaimer,
  appConfig,
}) {
  const [adConsent, setAdConsent] = useState(storageService.getAdConsent());

  const togglePersonalizedAds = () => {
    const updated = { ...adConsent, personalized: !adConsent.personalized };
    setAdConsent(updated);
    storageService.setAdConsent(updated);
  };

  const handleClearCache = () => {
    if (window.confirm('Clear all saved bookmarks, reading history, and cache?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-safe-nav animate-in fade-in duration-200">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Reader Settings & Appearance
        </h2>
        <p className="text-xs text-slate-500">
          Customize reading appearance, font sizing, and view compliance policies.
        </p>
      </div>

      <div className="space-y-4">

        {/* Privacy & Ad Preferences */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Privacy & Ad Preferences</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                Personalized Ads (GDPR / Consent)
              </div>
              <p className="text-[11px] text-slate-500">
                {adConsent.personalized ? 'Tailored ads enabled based on consent' : 'Non-personalized ads only'}
              </p>
            </div>
            <button
              onClick={togglePersonalizedAds}
              className="text-indigo-600 dark:text-indigo-400 p-1"
            >
              {adConsent.personalized ? (
                <ToggleRight className="w-8 h-8 fill-indigo-600" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {/* Section 4: Reader Themes & Font Scale */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-3">
            <Sliders className="w-4 h-4" />
            <span>Reading Appearance</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Theme mode */}
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Reader Theme Mode</span>
              <div className="flex space-x-1.5">
                {[
                  { id: 'light', label: 'Light' },
                  { id: 'sepia', label: 'Sepia' },
                  { id: 'dark', label: 'Dark' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onChangeReaderTheme(t.id)}
                    className={`px-3 py-1 rounded-lg font-semibold capitalize border transition-all ${
                      readerTheme === t.id
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Default Font Size</span>
              <div className="flex space-x-1">
                {['sm', 'base', 'lg', 'xl'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => onChangeFontSize(sz)}
                    className={`px-2.5 py-1 rounded-lg font-mono uppercase font-bold border transition-all ${
                      fontSize === sz
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Legal & Store Policy Documents */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-3">
            <FileText className="w-4 h-4" />
            <span>Store & Legal Compliance Documents</span>
          </div>

          <div className="space-y-2 text-xs">
            <button
              onClick={onOpenPolicy}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left"
            >
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                Privacy Policy (GDPR & COPPA Compliant)
              </span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={onOpenTerms}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left"
            >
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                Terms & Conditions
              </span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={onOpenDisclaimer}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left"
            >
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                Educational, Health & Financial Disclaimer
              </span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Section 6: About & Contact Support */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Info className="w-4 h-4" />
            <span>About & Developer Contact</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <div className="flex items-center space-x-2 mb-1.5">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                {appConfig?.appName || 'TipPulse'}
              </h4>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              A curated reader application providing daily educational insights, productivity protocols, health habits, financial literacy, and mindset frameworks for lifelong learners.
            </p>
          </div>

          {/* Contact Email Box */}
          <a
            href="mailto:qaroo24@gmail.com"
            className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/50 border border-indigo-200/70 dark:border-indigo-800/60 hover:bg-indigo-100 transition-colors group"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">
                  Contact & Reader Support
                </div>
                <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                  qaroo24@gmail.com
                </div>
              </div>
            </div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
              Send Email &rarr;
            </span>
          </a>
        </div>

        {/* Section 7: Diagnostics & Footer */}
        <div className="text-center pt-2">
          <button
            onClick={handleClearCache}
            className="inline-flex items-center space-x-1.5 text-xs text-rose-600 dark:text-rose-400 hover:underline p-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset App Storage & Cache</span>
          </button>
          <p className="text-[11px] text-slate-400 mt-2">
            {appConfig?.appName || 'TipPulse'} v1.0.0 • Built for Daily Educational & Practical Tips
          </p>
        </div>
      </div>
    </div>
  );
}
