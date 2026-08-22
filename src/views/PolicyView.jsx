import React from 'react';
import { ArrowLeft, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export default function PolicyView({ onBack }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-24 animate-in fade-in duration-200">
      <button
        onClick={onBack}
        className="flex items-center space-x-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-xs font-semibold">Back to Settings</span>
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5 text-slate-800 dark:text-slate-200">
        <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
          <ShieldCheck className="w-6 h-6" />
          <h1 className="text-xl font-bold">Privacy Policy & Advertising Standards</h1>
        </div>

        <div className="inline-block bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
          Last Updated: August 2026
        </div>

        <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. Offline-First Architecture
          </h2>
          <p>
            TipPulse is built with an offline-first architecture. Your bookmarks, reading progress, and custom font preferences are stored locally on your device via HTML5 LocalStorage and are not transmitted to any proprietary external analytics servers.
          </p>
        </section>

        <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. Google AdMob Advertising & Data Use
          </h2>
          <p>
            This application uses <strong>Google AdMob</strong> (provided by Google LLC) to display advertisements. Google may collect device identifiers, advertising ID, IP address, and interaction metrics to serve relevant ads.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>GDPR (European Economic Area):</strong> Users have the option to receive personalized or non-personalized ads via the app settings.</li>
            <li><strong>CCPA (California Residents):</strong> You may opt-out of data collection through your Android or iOS device advertising settings.</li>
          </ul>
        </section>

        <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. Safe Ad Placement Guarantee
          </h2>
          <p>
            We strictly enforce Google AdMob placement policies:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>No ads are placed under or adjacent to interactive buttons to avoid accidental taps.</li>
            <li>All native ads are explicitly marked with a "Sponsored Ad" badge.</li>
            <li>Interstitial ads are shown only on natural page transitions with frequency capping limits.</li>
          </ul>
        </section>

        <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            4. Contact
          </h2>
          <p>
            For privacy inquiries, reach us at: <strong>privacy@tippulse.app</strong>
          </p>
        </section>
      </div>
    </div>
  );
}
