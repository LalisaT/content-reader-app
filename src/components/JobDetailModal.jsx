import React, { useState } from 'react';
import {
  X,
  Briefcase,
  Building2,
  MapPin,
  Clock,
  DollarSign,
  Award,
  Sparkles,
  CheckCircle2,
  Bookmark,
  Share2,
  ExternalLink,
  Mail,
  Calendar,
  Gift,
  ShieldCheck,
  Send,
  Check,
  ArrowUpRight,
  Globe,
  Flame,
  ChevronRight
} from 'lucide-react';
import { Share as CapacitorShare } from '@capacitor/share';

export default function JobDetailModal({
  job,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
  hasApplied,
  onApplySuccess
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'responsibilities' | 'requirements' | 'benefits'
  const [isApplying, setIsApplying] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPortfolio, setApplicantPortfolio] = useState('');
  const [applicantNote, setApplicantNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !job) return null;

  const handleShare = async () => {
    const shareText = `Explore "${job.title}" at ${job.company} (${job.salaryRange || 'Competitive'}) - Discovered on TipPulse Careers.`;
    const shareUrl = job.applyUrl || window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: job.title,
          text: shareText,
          url: shareUrl
        });
      } else {
        await CapacitorShare.share({
          title: job.title,
          text: shareText,
          url: shareUrl,
          dialogTitle: 'Share Job Opportunity'
        });
      }
    } catch {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(`${job.title} at ${job.company}: ${shareUrl}`);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      } catch {
        // ignore
      }
    }
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantEmail.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsApplying(false);

      if (onApplySuccess) {
        onApplySuccess(job.id, {
          name: applicantName.trim(),
          email: applicantEmail.trim(),
          portfolio: applicantPortfolio.trim()
        });
      }

      // If job has mailto, optionally trigger mail client
      if (job.applyEmail) {
        const mailSubject = encodeURIComponent(`Application: ${job.title} - ${applicantName.trim()}`);
        const mailBody = encodeURIComponent(
          `Dear Hiring Team at ${job.company},\n\nI am applying for the position of ${job.title}.\n\nName: ${applicantName.trim()}\nEmail: ${applicantEmail.trim()}\nPortfolio/Profile: ${applicantPortfolio.trim()}\n\nNote:\n${applicantNote.trim()}\n\nThank you for your consideration.`
        );
        window.open(`mailto:${job.applyEmail}?subject=${mailSubject}&body=${mailBody}`, '_system');
      } else if (job.applyUrl) {
        window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
      }
    }, 600);
  };

  const handleDirectLaunch = () => {
    if (job.applyUrl && job.applyType === 'url') {
      window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
      if (onApplySuccess) onApplySuccess(job.id);
    } else {
      setIsApplying(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] rounded-t-3xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden relative"
        style={{
          paddingBottom: 'var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px))',
        }}
      >
        {/* Top Header Bar */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/70 px-2.5 py-1 rounded-full border border-amber-200/60 dark:border-amber-800/50 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500/20" />
              <span>{job.badgeText || (job.isFeatured ? 'VIP Spotlight' : 'Executive Career')}</span>
            </span>
            {job.isUrgent && (
              <span className="text-[11px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/70 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800/50 flex items-center space-x-1">
                <Flame className="w-3 h-3 text-rose-500" />
                <span>Urgent</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleShare}
              title="Share Opportunity"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => onToggleSave(job.id)}
              title={isSaved ? 'Saved to Bookmarks' : 'Save Vacancy'}
              className={`p-2 rounded-xl transition-all ${
                isSaved
                  ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/80 dark:text-amber-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6 text-slate-800 dark:text-slate-200">
          {/* Company Branding & Role Title Banner */}
          <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 shadow-xl border border-indigo-900/40 overflow-hidden">
            <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-1 flex items-center justify-center shrink-0 shadow-lg overflow-hidden">
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-amber-300" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 text-xs text-amber-300 font-semibold mb-1">
                  <span>{job.company}</span>
                  <span className="w-1 h-1 rounded-full bg-amber-400/60"></span>
                  <span className="text-slate-300 text-[11px] truncate">{job.department}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug">
                  {job.title}
                </h2>
              </div>
            </div>

            {/* Compensation High-Impact Spotlight Box */}
            <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                  Target Compensation
                </span>
                <span className="text-base sm:text-lg font-black text-emerald-400 tracking-tight flex items-center">
                  <DollarSign className="w-4 h-4 mr-0.5" />
                  {job.salaryRange || 'Competitive Package'}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-xs font-semibold backdrop-blur-xs flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-300" />
                  <span>{job.workplaceType || 'Remote'}</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-xs font-semibold backdrop-blur-xs flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-300" />
                  <span>{job.employmentType || 'Full-Time'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center space-x-2.5">
              <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Location</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                  {job.location || 'Worldwide'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center space-x-2.5">
              <Award className="w-4 h-4 text-amber-500 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Seniority</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                  {job.experienceLevel || 'Lead / Executive'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center space-x-2.5">
              <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Deadline</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                  {job.deadline || 'Open until filled'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center space-x-2.5">
              <ShieldCheck className="w-4 h-4 text-violet-500 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Verification</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 truncate block">
                  Verified Recruiter
                </span>
              </div>
            </div>
          </div>

          {/* Luxury Tab Navigation */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-2 overflow-x-auto scrollbar-none pb-1">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'responsibilities', label: `Responsibilities (${job.responsibilities?.length || 0})` },
              { id: 'requirements', label: `Requirements (${job.requirements?.length || 0})` },
              { id: 'benefits', label: `Perks & Prestige (${job.benefits?.length || 0})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {job.summary && (
                <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
                  <h4 className="text-xs font-black uppercase tracking-wider text-indigo-800 dark:text-indigo-300 mb-1.5 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Executive Summary</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {job.summary}
                  </p>
                </div>
              )}

              {job.description && (
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Detailed Mission & Role Scope
                  </h4>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {job.description}
                  </div>
                </div>
              )}

              {/* Skills & Tech Stack Chips */}
              {job.skills && job.skills.length > 0 && (
                <div className="space-y-2.5 pt-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Core Competencies & Technologies
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200/80 dark:border-slate-700/80"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Responsibilities */}
          {activeTab === 'responsibilities' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Key Strategic Deliverables & Expectations
              </h4>
              <div className="space-y-2.5">
                {job.responsibilities && job.responsibilities.length > 0 ? (
                  job.responsibilities.map((resp, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-start space-x-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {resp}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No specific responsibilities listed.</p>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Requirements */}
          {activeTab === 'requirements' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="space-y-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Required Background & Qualifications
                </h4>
                {job.requirements && job.requirements.length > 0 ? (
                  job.requirements.map((req, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-start space-x-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {req}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">Standard industry competencies apply.</p>
                )}
              </div>

              {job.niceToHave && job.niceToHave.length > 0 && (
                <div className="space-y-2.5 pt-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-500">
                    Distinguishing Plus Factors (Nice-To-Have)
                  </h4>
                  {job.niceToHave.map((nth, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 flex items-start space-x-3"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {nth}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Benefits & Perks */}
          {activeTab === 'benefits' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Luxury Compensation & Executive Lifestyle Perks
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {job.benefits && job.benefits.length > 0 ? (
                  job.benefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-800/80 dark:to-indigo-950/20 border border-slate-200/80 dark:border-slate-800 flex items-start space-x-3 shadow-xs"
                    >
                      <Gift className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                        {benefit}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">Competitive benefits discussed during interview.</p>
                )}
              </div>
            </div>
          )}

          {/* Application Instructions Card */}
          {job.applyInstructions && (
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block">Application Protocol:</span>
              <p>{job.applyInstructions}</p>
            </div>
          )}

          {/* Copied toast notice */}
          {copiedLink && (
            <div className="p-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold text-center animate-in fade-in">
              Opportunity link copied to clipboard!
            </div>
          )}
        </div>

        {/* Quick In-Modal Application Sheet (When user taps apply) */}
        {isApplying && (
          <div className="absolute inset-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Express Candidacy
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate max-w-[220px]">
                      {job.title} &bull; {job.company}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsApplying(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleApplySubmit} className="mt-5 space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Full Legal / Professional Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="e.g. Dr. Alexandra Vance"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Contact Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    placeholder="e.g. alexandra@executive.io"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    LinkedIn / Portfolio / GitHub Link
                  </label>
                  <input
                    type="url"
                    value={applicantPortfolio}
                    onChange={(e) => setApplicantPortfolio(e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Executive Brief / Candidate Note
                  </label>
                  <textarea
                    rows={3}
                    value={applicantNote}
                    onChange={(e) => setApplicantNote(e.target.value)}
                    placeholder="Highlight your most relevant achievements or vision for this role..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white font-black text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 active:scale-95 transition-all"
                  >
                    {isSubmitting ? (
                      <span>Submitting Candidacy...</span>
                    ) : (
                      <>
                        <span>Submit Application Directly</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-slate-400 mt-2">
                    Your details are transferred directly to the designated talent team. TipPulse preserves candidate confidentiality.
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Persistent Bottom Action Bar */}
        <div className="sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 p-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Annual Package</span>
            <span className="text-sm font-black text-slate-900 dark:text-white truncate block">
              {job.salaryRange || 'Competitive Tier'}
            </span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {hasApplied ? (
              <div className="px-5 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Candidacy Submitted ✓</span>
              </div>
            ) : job.status === 'closed' ? (
              <div className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-bold">
                Position Filled
              </div>
            ) : (
              <button
                onClick={handleDirectLaunch}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2 active:scale-95 transition-all"
              >
                <span>Apply for Role</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
