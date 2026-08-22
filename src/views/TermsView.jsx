import React from 'react';
import { ArrowLeft, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function TermsView({ onBack }) {
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
          <FileText className="w-6 h-6" />
          <h1 className="text-xl font-bold">Terms & Conditions</h1>
        </div>

        <div className="inline-block bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
          Effective Date: August 2026
        </div>

        <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. Agreement to Terms
          </h2>
          <p>
            By downloading, installing, or accessing TipPulse ("the Application"), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use the application.
          </p>
        </section>

        <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. Intellectual Property & Usage License
          </h2>
          <p>
            All original editorial articles, interfaces, graphics, and design elements within TipPulse are the intellectual property of the application developers.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>You are granted a personal, non-exclusive, non-transferable license to use the app for personal, non-commercial reading and self-improvement purposes.</li>
            <li>You may not redistribute, scrape, reverse-engineer, or commercially republish the content without prior written permission.</li>
          </ul>
        </section>

        <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. Third-Party Advertisements & Google AdMob
          </h2>
          <p>
            TipPulse is supported by advertisements served through <strong>Google AdMob</strong>. Advertisements may link to external third-party products, websites, or services. We do not endorse or assume responsibility for any third-party websites, products, or content.
          </p>
        </section>

        <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            4. Limitation of Liability
          </h2>
          <p>
            TipPulse and its contributors shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the application or reliance on any educational content provided.
          </p>
        </section>

        <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            5. Contact Information
          </h2>
          <p>
            If you have questions about these Terms, please contact us at: <strong>terms@tippulse.app</strong> or <strong>contact@tippulse.app</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
