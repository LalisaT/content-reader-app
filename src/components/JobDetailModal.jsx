import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  ChevronRight,
  Video,
  Copy,
  Camera
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
  const [copiedDeepLink, setCopiedDeepLink] = useState(false);

  if (!isOpen || !job) return null;

  const deepLinkSlug = job.slug || (String(job.id) === 'job-synapse-neuro-ux' ? 'somethinglead' : String(job.id));
  const deepLinkUrl = `https://tippulse.web.app/careers/${deepLinkSlug}`;

  const handleCopyDeepLink = async () => {
    try {
      await navigator.clipboard.writeText(deepLinkUrl);
      setCopiedDeepLink(true);
      setTimeout(() => setCopiedDeepLink(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleShare = async () => {
    const shareText = `Explore "${job.title}" at ${job.company} (${job.salaryRange || 'Competitive'}) - Discovered on TipPulse Careers.`;
    const shareUrl = deepLinkUrl;
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

  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || !job) return null;

  const modalNode = (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200 overflow-x-hidden">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[96dvh] sm:max-h-[90dvh] rounded-t-3xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden relative min-w-0"
        style={{
          paddingBottom: 'var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px))',
        }}
      >
        {/* Top Header Bar */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-3.5 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center flex-wrap gap-1.5 min-w-0 flex-1">
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/70 px-2.5 py-1 rounded-full border border-amber-200/60 dark:border-amber-800/50 flex items-center space-x-1.5 max-w-full min-w-0">
              <span className="w-3.5 h-3.5 rounded-full overflow-hidden inline-flex items-center justify-center shrink-0 border border-amber-400/60 bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 shadow-xs">
                <img
                  src="/career-growth-icon-gold.png"
                  alt="Career"
                  className="w-full h-full object-cover"
                />
              </span>
              <span className="truncate">{job.badgeText || (job.isFeatured ? 'VIP Spotlight' : 'Executive Career')}</span>
            </span>
            {job.isUrgent && (
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/70 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800/50 flex items-center space-x-1 shrink-0">
                <Flame className="w-3 h-3 text-rose-500 shrink-0" />
                <span>Urgent</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1 shrink-0">
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
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-0.5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3.5 sm:px-5 py-4 sm:py-5 pb-36 sm:pb-24 space-y-5 text-slate-800 dark:text-slate-200 min-w-0">
          {/* Company Branding & Role Title Banner */}
          <div className="relative rounded-2xl bg-gradient-to-br from-indigo-50/90 via-white to-amber-50/40 text-slate-900 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 dark:text-white p-4 sm:p-6 shadow-md dark:shadow-xl border border-slate-200/80 dark:border-indigo-900/40 overflow-hidden min-w-0">
            <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-start space-x-3.5 sm:space-x-4 min-w-0">
              <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-indigo-100/60 dark:bg-white/10 backdrop-blur-md border border-indigo-200/60 dark:border-white/20 p-1 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-amber-600 dark:text-amber-300" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 text-xs text-amber-700 dark:text-amber-300 font-semibold mb-1 min-w-0">
                  <span className="break-words">{job.company}</span>
                  <span className="w-1 h-1 rounded-full bg-amber-500/60 dark:bg-amber-400/60 shrink-0"></span>
                  <span className="text-slate-500 dark:text-slate-300 text-[11px] truncate">{job.department}</span>
                </div>
                <h2 className="text-base sm:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-snug break-words">
                  {job.title}
                </h2>
              </div>
            </div>

            {/* Compensation High-Impact Spotlight Box */}
            <div className="mt-4 sm:mt-5 pt-3.5 sm:pt-4 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-2.5 min-w-0">
              <div className="min-w-0">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
                  Target Compensation
                </span>
                <span className="text-sm sm:text-lg font-black text-emerald-600 dark:text-emerald-400 tracking-tight flex items-center break-words">
                  <DollarSign className="w-4 h-4 mr-0.5 shrink-0" />
                  <span className="break-words">{job.salaryRange || 'Competitive Package'}</span>
                </span>
              </div>

              <div className="flex items-center flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white text-xs font-semibold backdrop-blur-xs flex items-center space-x-1 border border-slate-200/60 dark:border-transparent">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-300 shrink-0" />
                  <span>{job.workplaceType || 'Remote'}</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white text-xs font-semibold backdrop-blur-xs flex items-center space-x-1 border border-slate-200/60 dark:border-transparent">
                  <Clock className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-300 shrink-0" />
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

              {/* Workplace & Vacancy Showcase Photos Gallery */}
              {Array.isArray(job.photos) && job.photos.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                      <Camera className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Workplace & Environment Gallery ({job.photos.length})
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {job.photos.map((photoUrl, pIdx) => (
                      <div
                        key={pIdx}
                        className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-slate-900 shadow-xs group"
                      >
                        <img
                          src={photoUrl}
                          alt={`${job.company} photo ${pIdx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Official "How to Apply for this Vacancy" Section */}
              <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/90 dark:border-indigo-500/30 p-3.5 sm:p-6 text-slate-900 dark:text-white shadow-sm dark:shadow-xl space-y-4 w-full min-w-0 overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
                  <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 border border-amber-300/80 dark:border-amber-400/60 flex items-center justify-center overflow-hidden p-0.5 shadow-md shadow-amber-500/20 shrink-0">
                      <img
                        src="/career-growth-icon-gold.png"
                        alt="How to Apply"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider break-words">
                        How to Apply for this Vacancy
                      </h4>
                      <span className="text-[10px] text-slate-500 dark:text-slate-300 block truncate">
                        Official recruitment & submission protocol
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/15 dark:bg-amber-400/15 border border-amber-500/30 dark:border-amber-400/30 px-2.5 py-1 rounded-full uppercase tracking-wider max-w-full truncate">
                    {job.salaryRange || 'Competitive Package'}
                  </span>
                </div>

                {/* Step-by-Step Application Guide */}
                <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 w-full min-w-0">
                  <div className="flex items-start space-x-2.5 sm:space-x-3 p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 shadow-xs dark:shadow-none w-full min-w-0 overflow-hidden">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-500/30 border border-indigo-200 dark:border-indigo-400/40 text-indigo-700 dark:text-indigo-300 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-slate-900 dark:text-white block">Prepare Candidate Portfolio</span>
                      <span className="text-slate-600 dark:text-slate-300/90 text-[11px] leading-relaxed break-words block">
                        {job.applyInstructions || 'Prepare your updated CV, executive portfolio, and a brief statement of interest highlighting relevant accomplishments.'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5 sm:space-x-3 p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 shadow-xs dark:shadow-none w-full min-w-0 overflow-hidden">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-500/30 border border-indigo-200 dark:border-indigo-400/40 text-indigo-700 dark:text-indigo-300 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-slate-900 dark:text-white block">Submit Direct Application</span>
                      <span className="text-slate-600 dark:text-slate-300/90 text-[11px] leading-relaxed block mb-2.5 break-words">
                        {job.applyUrl ? 'Apply directly via the organization’s verified application portal or candidate inbox.' : 'Apply directly via the official recruiter inbox.'}
                      </span>

                      {/* Primary Application Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 w-full min-w-0">
                        {job.applyUrl && (
                          <a
                            href={job.applyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                              if (onApplySuccess) onApplySuccess(job.id);
                            }}
                            className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold text-xs shadow-md shadow-indigo-500/25 flex items-center justify-center space-x-1.5 transition-all active:scale-95 max-w-full"
                          >
                            <span className="truncate">Apply via Official Portal</span>
                            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          </a>
                        )}

                        {job.applyEmail && (
                          <a
                            href={`mailto:${job.applyEmail}?subject=${encodeURIComponent(`Application: ${job.title}`)}`}
                            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white font-bold text-xs border border-slate-300 dark:border-white/20 flex items-center space-x-1.5 transition-all shadow-xs max-w-full min-w-0"
                          >
                            <Mail className="w-3.5 h-3.5 text-amber-600 dark:text-amber-300 shrink-0" />
                            <span className="truncate break-all">{job.applyEmail}</span>
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => setIsApplying(true)}
                          className="px-3.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md shadow-amber-400/25 flex items-center justify-center space-x-1.5 transition-all active:scale-95 max-w-full"
                        >
                          <Send className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">Express In-App Application</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5 sm:space-x-3 p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 shadow-xs dark:shadow-none w-full min-w-0 overflow-hidden">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-500/30 border border-indigo-200 dark:border-indigo-400/40 text-indigo-700 dark:text-indigo-300 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-slate-900 dark:text-white block">Review Timeline & Status</span>
                      <span className="text-slate-600 dark:text-slate-300/90 text-[11px] leading-relaxed break-words block">
                        Deadline: <strong className="text-amber-600 dark:text-amber-300 font-semibold">{job.deadline || 'Open until filled'}</strong>. Talent committee reviews submissions on a rolling basis.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Official Shareable Deep Link Box */}
                <div className="mt-3 p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 shadow-xs w-full min-w-0 overflow-hidden">
                  <div className="w-full min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                      🔗 Official Shareable Deep Link
                    </span>
                    <div className="text-[11px] sm:text-xs font-mono text-indigo-600 dark:text-amber-300 font-semibold break-all leading-relaxed select-all bg-slate-50 dark:bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-200/70 dark:border-slate-800 w-full">
                      {deepLinkUrl}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto pt-0.5 sm:pt-0">
                    <button
                      type="button"
                      onClick={handleCopyDeepLink}
                      className="flex-1 sm:flex-initial justify-center px-3 py-2 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white text-xs font-bold border border-slate-300 dark:border-white/15 flex items-center space-x-1.5 transition-all active:scale-95"
                    >
                      <Copy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-300 shrink-0" />
                      <span>{copiedDeepLink ? 'Copied! ✓' : 'Copy Link'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="flex-1 sm:flex-initial justify-center px-3 py-2 sm:py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-all active:scale-95 shadow-md shadow-indigo-600/20"
                    >
                      <Share2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
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
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 space-y-1 w-full min-w-0 overflow-hidden break-words">
              <span className="font-bold text-slate-900 dark:text-white block">Application Protocol:</span>
              <p className="break-words leading-relaxed">{job.applyInstructions}</p>
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
          <div className="absolute inset-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 sm:p-6 pb-28 sm:pb-8 flex flex-col justify-between overflow-y-auto overflow-x-hidden animate-in slide-in-from-bottom duration-200">
            <div className="w-full min-w-0">
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800 min-w-0">
                <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <Send className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                      Express Candidacy
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate">
                      {job.title} &bull; {job.company}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsApplying(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0"
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
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : modalNode;
}
