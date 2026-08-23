import React from 'react';
import { ArrowLeft, ShieldCheck, Lock, ExternalLink, Mail, CheckCircle2 } from 'lucide-react';

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
          <h1 className="text-xl font-bold">Privacy Policy</h1>
        </div>

        <div className="inline-block bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
          Last Updated: August 2026
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          TipPulse respects your privacy. This policy explains how our application handles your data, local storage, and third-party advertising services.
        </p>

        {/* Section 1 */}
        <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. Data Collection & Local Storage
          </h2>
          <p>
            TipPulse operates primarily on an offline-first architecture.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Local Data:</strong> Your reading history, bookmarks, saved tips, theme preferences, and font settings are stored directly on your device via local storage.</li>
            <li><strong>External Transmission:</strong> This reading and customization data remains on your device and is not transmitted to or stored on our external servers.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. Third-Party Advertising (Google AdMob)
          </h2>
          <p>
            We use Google AdMob to serve advertisements within the app. AdMob may automatically collect and process certain data to display relevant ads, including:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Device identifiers (e.g., Advertising ID, IDFA)</li>
            <li>IP address and approximate location</li>
            <li>In-app diagnostic, crash, and ad performance data</li>
          </ul>
          <p className="pt-1">
            For more details on how Google processes ad data, visit{' '}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 dark:text-indigo-400 font-semibold underline inline-flex items-center"
            >
              <span>Google's Privacy & Terms</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. User Rights & Choices
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>EEA/UK Residents (GDPR):</strong> You can manage your personalized ad consent preferences at any time through the in-app consent settings.</li>
            <li><strong>California Residents (CCPA/CPRA):</strong> You can opt out of interest-based advertising by adjusting the privacy settings on your mobile device (e.g., "Opt out of Ads Personalization" on Android or "Ask App not to Track" on iOS).</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            4. Children’s Privacy (COPPA)
          </h2>
          <p>
            TipPulse is not directed toward children under the age of 13 (or 16 in the EEA), and we do not knowingly collect personal information from children.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            5. Policy Updates
          </h2>
          <p>
            We may update this Privacy Policy periodically. Any modifications will be reflected directly within the application alongside an updated "Last Updated" date.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-700">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            6. Contact Us
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
