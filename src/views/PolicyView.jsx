import React from 'react';
import { ArrowLeft, ShieldCheck, Lock, ExternalLink, Mail, CheckCircle2 } from 'lucide-react';

export default function PolicyView({ onBack }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-safe-nav animate-in fade-in duration-200">
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
          <h1 className="text-xl font-bold">Privacy Policy</h1>
        </div>

        <div className="inline-block bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
          Last Updated: October 2026
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          TipPulse respects your privacy. This policy explains how our application handles your data, local storage, community polls, embedded YouTube services, and third-party advertising.
        </p>

        {/* Section 1 */}
        <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. Data Collection & Local Storage
          </h2>
          <p>
            TipPulse operates on an offline-first, privacy-respecting architecture:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Local Data:</strong> Your reading history, bookmarks, saved tips, theme preferences, and font settings are stored directly on your device via local storage.</li>
            <li><strong>Community Polls:</strong> When participating in interactive community polls, votes are recorded anonymously to compute aggregate percentages. A local vote flag is saved on your device solely to display your voted state and prevent duplicate submissions. No personal identifiers or profile data are collected.</li>
            <li><strong>External Transmission:</strong> Personal reading habits and local device settings remain on your device and are never sold or transmitted to external advertising databases.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. Third-Party Advertising (Google AdMob)
          </h2>
          <p>
            We use Google AdMob to serve advertisements within the app (including adaptive banners, rewarded video ads, and occasional interstitial transitions). AdMob may automatically collect and process certain data to display relevant ads, including:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Device identifiers (e.g., Google Advertising ID, IDFA)</li>
            <li>IP address and approximate coarse location</li>
            <li>In-app diagnostic, crash, and ad performance metrics</li>
          </ul>
          <p className="pt-1">
            For more details on how Google processes ad data, visit{' '}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 dark:text-indigo-400 font-semibold underline inline-flex items-center"
            >
              <span>Google Advertising & Privacy Terms</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. YouTube API Services & Embedded Multimedia
          </h2>
          <p>
            TipPulse includes embedded audio and multimedia tracks (such as ambient focus, sleep soundscapes, and educational video guides) using official YouTube API services and embedded players:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              By using and accessing embedded YouTube content within TipPulse, you agree to be bound by the{' '}
              <a
                href="https://www.youtube.com/t/terms"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 dark:text-indigo-400 font-semibold underline inline-flex items-center"
              >
                <span>YouTube Terms of Service</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>.
            </li>
            <li>
              YouTube and Google may collect usage data, cookies, and device information in accordance with the{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 dark:text-indigo-400 font-semibold underline inline-flex items-center"
              >
                <span>Google Privacy Policy</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>.
            </li>
            <li>
              <strong>No Stream Ripping or Downloading:</strong> TipPulse complies strictly with the YouTube API Developer Policies. We do not download, rip, or convert YouTube streams, nor do we provide background or screen-off playback.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            4. User Rights & Choices
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>EEA/UK Residents (GDPR):</strong> You can review or adjust your personalized ad consent choices anytime through the in-app consent preferences.</li>
            <li><strong>California Residents (CCPA/CPRA):</strong> You can opt out of interest-based ads by adjusting device settings (e.g. "Opt out of Ads Personalization" or "Delete advertising ID" on Android).</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            5. Children’s Privacy (COPPA)
          </h2>
          <p>
            TipPulse is not directed toward children under 13 (or 16 in the EEA). We do not knowingly solicit or collect personal information from children.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            6. Policy Updates
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be reflected directly within the application and at our public privacy URL alongside the updated date.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-700">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            7. Contact Us
          </h2>
          <p>
            For questions regarding this policy or data practices, contact us at:
          </p>
          <a
            href="mailto:qaroo24@gmail.com"
            className="inline-flex items-center space-x-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold rounded-xl border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>qaroo24@gmail.com</span>
          </a>
        </section>
      </div>
    </div>
  );
}
