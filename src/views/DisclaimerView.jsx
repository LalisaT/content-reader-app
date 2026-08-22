import React from 'react';
import { ArrowLeft, AlertTriangle, ShieldCheck, Heart, DollarSign, Brain } from 'lucide-react';

export default function DisclaimerView({ onBack }) {
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
        <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
          <AlertTriangle className="w-6 h-6" />
          <h1 className="text-xl font-bold">Disclaimer & Educational Notice</h1>
        </div>

        <div className="inline-block bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
          General Educational & Informational Purposes Only
        </div>

        {/* Section 1: General Educational Purpose */}
        <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Brain className="w-4 h-4 text-indigo-600" />
            <span>1. General Informational Use</span>
          </h2>
          <p>
            The content, tips, frameworks, and insights presented in TipPulse are provided solely for general educational, self-improvement, and informational purposes. While we strive to provide accurate and up-to-date information, we make no representations or warranties of any kind regarding completeness, reliability, or accuracy.
          </p>
        </section>

        {/* Section 2: Health & Wellness Disclaimer */}
        <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Heart className="w-4 h-4 text-rose-500" />
            <span>2. No Medical or Health Advice</span>
          </h2>
          <p>
            Articles relating to health, circadian rhythm protocols, relaxation methods (e.g. NSDR), or nutrition are not intended as medical advice, diagnosis, or treatment. Always consult a qualified medical physician or healthcare provider before undertaking any new health routine, exercise regimen, or lifestyle change.
          </p>
        </section>

        {/* Section 3: Financial Disclaimer */}
        <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>3. No Financial or Investment Advice</span>
          </h2>
          <p>
            Articles relating to budgeting (e.g. 50/30/20 rule), compounding, or savings concepts are for conceptual educational demonstration only. TipPulse is not a registered financial advisor or broker. Any financial decisions should be made with the guidance of a licensed Certified Financial Planner (CFP) or financial fiduciary.
          </p>
        </section>

        {/* Section 4: Advertising Disclaimer */}
        <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>4. Advertising & External Links</span>
          </h2>
          <p>
            Advertisements displayed within the application are delivered via Google AdMob. Any purchases or interactions made with third-party advertisers are solely between you and the third-party sponsor.
          </p>
        </section>

        {/* Contact */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500">
          For any questions regarding this disclaimer, please contact: <strong>legal@tippulse.app</strong> or <strong>contact@tippulse.app</strong>.
        </div>
      </div>
    </div>
  );
}
