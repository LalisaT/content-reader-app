import React from 'react';
import { ArrowLeft, AlertTriangle, ShieldCheck, Heart, DollarSign, Brain, Youtube, HelpCircle, Briefcase } from 'lucide-react';

export default function DisclaimerView({ onBack }) {
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

        {/* Section 4: Multimedia & YouTube Embed Disclaimer */}
        <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Youtube className="w-4 h-4 text-red-500" />
            <span>4. Multimedia & YouTube Embedded Content</span>
          </h2>
          <p>
            Audio, video, and background soundscapes displayed in dedicated music and focus guides are embedded using the official YouTube API / IFrame player. All video, audio, and visual assets are hosted by YouTube and remain the intellectual property and copyright of their respective owners and creators. TipPulse is not affiliated with, endorsed by, or sponsored by YouTube, LLC or Google LLC. TipPulse does not store, host, or allow downloading of any audio/video stream.
          </p>
        </section>

        {/* Section 5: Community Polls Disclaimer */}
        <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <span>5. Community Polls & Public Opinions</span>
          </h2>
          <p>
            Community polls embedded in articles represent the subjective opinions and experiences of voluntary readers. Poll results are aggregated anonymously and do not constitute scientific consensus, expert advice, or clinical validation.
          </p>
        </section>

        {/* Section 6: Executive Careers & Scholarship Notice */}
        <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-amber-500" />
            <span>6. Executive Careers & Scholarship Opportunities Notice</span>
          </h2>
          <p>
            Vacancy listings, compensation benchmarks, and fellowship endowment figures presented in the Job Vacancy & Scholarship Sanctuary are aggregated for informational discovery. TipPulse is not responsible for recruitment decisions, employer interview procedures, background evaluations, or visa sponsorships. Prospective candidates should verify exact terms directly with hiring institutions.
          </p>
        </section>

        {/* Section 7: Advertising Disclaimer */}
        <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>7. Advertising & External Links</span>
          </h2>
          <p>
            Advertisements displayed within the application are delivered via Google AdMob. Any purchases or interactions made with third-party advertisers are solely between you and the third-party sponsor.
          </p>
        </section>

        {/* Contact */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500">
          For any questions regarding this disclaimer, please contact: <strong>qaroo24@gmail.com</strong>.
        </div>
      </div>
    </div>
  );
}
