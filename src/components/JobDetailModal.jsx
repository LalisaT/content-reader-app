import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowLeft,
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
  Flame,
  Copy,
  Camera,
  ThumbsUp
} from 'lucide-react';
import { Share as CapacitorShare } from '@capacitor/share';
import RichMarkdownRenderer from './RichMarkdownRenderer';
import BannerAd from './BannerAd';

export default function JobDetailModal({
  job,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
  hasApplied,
  onApplySuccess
}) {
  const scrollContainerRef = useRef(null);
  const progressBarRef = useRef(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPortfolio, setApplicantPortfolio] = useState('');
  const [applicantNote, setApplicantNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedDeepLink, setCopiedDeepLink] = useState(false);
  const [isHelpful, setIsHelpful] = useState(false);
  const [heroImageError, setHeroImageError] = useState(false);

  useEffect(() => {
    setHeroImageError(false);
    if (isOpen && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    if (progressBarRef.current) {
      progressBarRef.current.style.width = '0%';
    }
  }, [isOpen, job?.id]);

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

  const deepLinkSlug = job.slug || (String(job.id) === 'job-synapse-neuro-ux' ? 'somethinglead' : String(job.id));
  const deepLinkUrl = `https://tippulse.web.app/careers/${deepLinkSlug}`;

  const handleScroll = (e) => {
    const el = e.currentTarget;
    const totalHeight = el.scrollHeight - el.clientHeight;
    if (totalHeight > 0 && progressBarRef.current) {
      const pct = Math.min(100, Math.max(0, (el.scrollTop / totalHeight) * 100));
      progressBarRef.current.style.width = `${pct}%`;
    }
  };

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

  const primaryHeroPhoto = Array.isArray(job.photos) && job.photos.length > 0
    ? job.photos[0]
    : 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80';

  const readerNode = (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="fixed inset-0 z-[9999] bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-y-auto overflow-x-hidden animate-in fade-in duration-200"
    >
      {/* Top Reading Progress Bar */}
      <div
        className="fixed left-0 right-0 z-50 h-1 bg-slate-200 dark:bg-slate-800"
        style={{ top: 'var(--safe-area-inset-top, env(safe-area-inset-top, 0px))' }}
      >
        <div
          ref={progressBarRef}
          className="h-full bg-indigo-600 dark:bg-indigo-400 transition-all duration-75"
          style={{ width: '0%' }}
        />
      </div>

      {/* Sticky Editorial Reader Navigation Toolbar (Matches ArticleDetail) */}
      <header
        className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 h-14 flex items-center justify-between gap-2"
        style={{ paddingTop: 'var(--safe-area-inset-top, env(safe-area-inset-top, 0px))' }}
      >
        <button
          onClick={onClose}
          className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xs font-semibold">Back</span>
        </button>

        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <button
            onClick={() => onToggleSave(job.id)}
            title={isSaved ? 'Saved to Bookmarks' : 'Save Vacancy'}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-600 text-indigo-600 dark:fill-indigo-400 dark:text-indigo-400' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            title="Share Vacancy"
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsApplying(true)}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95 flex items-center space-x-1"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Apply Now</span>
          </button>
        </div>
      </header>

      {/* Main Editorial Reading Container (Matches Screenshot 2 / ArticleDetail) */}
      <article className="max-w-xl mx-auto px-4 pt-4 sm:pt-6 pb-40 w-full min-w-0 overflow-x-hidden">
        {/* Category & Modality Meta */}
        <div className="flex items-center flex-wrap gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
          <span className="uppercase tracking-wider px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/70 rounded-md border border-indigo-200/60 dark:border-indigo-800/40">
            {job.department || 'CAREERS'}
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500 dark:text-slate-400 flex items-center font-normal">
            <Clock className="w-3.5 h-3.5 mr-1 shrink-0" />
            {job.employmentType || 'Full-Time'} ({job.workplaceType || 'Remote'})
          </span>
          {job.isUrgent && (
            <>
              <span className="text-slate-400">•</span>
              <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center">
                <Flame className="w-3.5 h-3.5 mr-0.5 shrink-0" />
                Urgent Hiring
              </span>
            </>
          )}
        </div>

        {/* Vacancy Headline */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug mb-3 break-words text-slate-900 dark:text-white">
          {job.title}
        </h1>

        {/* Company, Location & Deadline Sub-Bar */}
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 py-3 border-y border-slate-100 dark:border-slate-800 mb-5">
          <div className="flex items-center space-x-1.5 min-w-0">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate font-semibold text-slate-700 dark:text-slate-300">
              {job.company}
            </span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{job.location || 'Worldwide'}</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{job.deadline ? `Deadline: ${job.deadline}` : (job.postedAt || 'Active Today')}</span>
          </div>
        </div>

        {/* Rounded-3xl Cover Photo Banner (Matches Screenshot 2) */}
        <div className="rounded-3xl overflow-hidden mb-6 shadow-sm border border-slate-200/80 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 relative">
          {!heroImageError && primaryHeroPhoto ? (
            <img
              src={primaryHeroPhoto}
              alt={job.title}
              onError={() => setHeroImageError(true)}
              className="w-full h-56 sm:h-72 object-cover"
            />
          ) : (
            <div className="w-full py-10 px-6 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-amber-50 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center p-2 mb-3">
                {job.companyLogo ? (
                  <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain rounded-xl" />
                ) : (
                  <Briefcase className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                )}
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">{job.company}</h2>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                {job.salaryRange || 'Competitive Executive Package'}
              </span>
            </div>
          )}
        </div>

        {/* Soft Indigo Callout Box: Key Actionable Role Takeaways (Matches Screenshot 2) */}
        <div className="reader-card bg-indigo-50/70 dark:bg-slate-800/80 border border-indigo-200/70 dark:border-indigo-900/60 rounded-2xl p-4 sm:p-5 mb-6 shadow-xs">
          <div className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider mb-2.5">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Key Actionable Takeaways</span>
          </div>
          <ul className="space-y-2">
            <li className="flex items-start space-x-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="font-bold text-slate-900 dark:text-white">Target Compensation:</strong>{' '}
                {job.salaryRange || 'Competitive Executive Package'}
              </span>
            </li>
            <li className="flex items-start space-x-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="font-bold text-slate-900 dark:text-white">Location & Modality:</strong>{' '}
                {job.location || 'Worldwide'} ({job.workplaceType || 'Remote'} • {job.employmentType || 'Full-Time'})
              </span>
            </li>
            <li className="flex items-start space-x-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="font-bold text-slate-900 dark:text-white">Experience & Seniority:</strong>{' '}
                {job.experienceLevel || 'Lead / Executive'} • Verified Organization
              </span>
            </li>
            <li className="flex items-start space-x-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="font-bold text-slate-900 dark:text-white">Application Window:</strong>{' '}
                {job.deadline || 'Open until filled (Rolling candidate review)'}
              </span>
            </li>
          </ul>
        </div>

        {/* Left-Bordered Italic Blockquote Summary (Matches Screenshot 2) */}
        {job.summary && (
          <blockquote className="my-5 pl-4 pr-3 py-2.5 border-l-4 border-indigo-600 dark:border-indigo-400 bg-indigo-50/40 dark:bg-slate-800/50 rounded-r-2xl text-slate-700 dark:text-slate-300 italic font-sans text-sm sm:text-base leading-relaxed">
            "{job.summary}"
          </blockquote>
        )}

        {/* Continuous Editorial Body Content with Vertical Indigo Bar Headings */}
        <div className="reader-text space-y-6 font-serif text-base leading-relaxed text-slate-800 dark:text-slate-200">
          {/* Section 1: Role Overview & Mission */}
          {job.description && (
            <section className="space-y-3">
              <h4 className="text-lg sm:text-xl font-bold font-sans text-slate-900 dark:text-white pt-2 pb-1 flex items-center space-x-2">
                <span className="w-1.5 h-4 bg-indigo-600 dark:bg-indigo-400 rounded-full inline-block flex-shrink-0"></span>
                <span>1. Role Overview & Strategic Mission</span>
              </h4>
              <RichMarkdownRenderer
                content={job.description}
                className="font-serif text-base leading-relaxed"
              />
            </section>
          )}

          {/* Section 2: Key Responsibilities */}
          {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && (
            <section className="space-y-3">
              <h4 className="text-lg sm:text-xl font-bold font-sans text-slate-900 dark:text-white pt-2 pb-1 flex items-center space-x-2">
                <span className="w-1.5 h-4 bg-indigo-600 dark:bg-indigo-400 rounded-full inline-block flex-shrink-0"></span>
                <span>2. Key Responsibilities & Deliverables</span>
              </h4>
              <ul className="space-y-2.5 pl-1 font-serif">
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 flex-shrink-0 mt-2.5"></span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Section 3: Requirements & Qualifications */}
          {((Array.isArray(job.requirements) && job.requirements.length > 0) ||
            (Array.isArray(job.niceToHave) && job.niceToHave.length > 0)) && (
            <section className="space-y-3">
              <h4 className="text-lg sm:text-xl font-bold font-sans text-slate-900 dark:text-white pt-2 pb-1 flex items-center space-x-2">
                <span className="w-1.5 h-4 bg-indigo-600 dark:bg-indigo-400 rounded-full inline-block flex-shrink-0"></span>
                <span>3. Required Background & Qualifications</span>
              </h4>
              {Array.isArray(job.requirements) && job.requirements.length > 0 && (
                <ul className="space-y-2.5 pl-1 font-serif">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 flex-shrink-0 mt-2.5"></span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              )}

              {Array.isArray(job.niceToHave) && job.niceToHave.length > 0 && (
                <div className="pt-2 space-y-2">
                  <p className="font-sans text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Bonus / Nice-To-Have Qualifications:
                  </p>
                  <ul className="space-y-2 pl-1 font-serif">
                    {job.niceToHave.map((nth, idx) => (
                      <li key={idx} className="flex items-start space-x-2.5 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-2.5"></span>
                        <span>{nth}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {/* Section 4: Perks & Benefits */}
          {Array.isArray(job.benefits) && job.benefits.length > 0 && (
            <section className="space-y-3">
              <h4 className="text-lg sm:text-xl font-bold font-sans text-slate-900 dark:text-white pt-2 pb-1 flex items-center space-x-2">
                <span className="w-1.5 h-4 bg-indigo-600 dark:bg-indigo-400 rounded-full inline-block flex-shrink-0"></span>
                <span>4. Compensation, Perks & Benefits</span>
              </h4>
              <ul className="space-y-2.5 pl-1 font-serif">
                {job.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Additional Workplace Gallery Photos */}
          {Array.isArray(job.photos) && job.photos.length > 1 && (
            <section className="space-y-3 font-sans">
              <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white pt-2 pb-1 flex items-center space-x-2">
                <span className="w-1.5 h-4 bg-indigo-600 dark:bg-indigo-400 rounded-full inline-block flex-shrink-0"></span>
                <span>Workplace & Environment Gallery</span>
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {job.photos.slice(1).map((photoUrl, pIdx) => (
                  <div
                    key={pIdx}
                    className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-xs"
                  >
                    <img
                      src={photoUrl}
                      alt={`${job.company} showcase ${pIdx + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section 5: Official How to Apply Protocol */}
          <section className="space-y-3 font-sans pt-2">
            <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white pb-1 flex items-center space-x-2">
              <span className="w-1.5 h-4 bg-indigo-600 dark:bg-indigo-400 rounded-full inline-block flex-shrink-0"></span>
              <span>5. How to Apply for This Vacancy</span>
            </h4>

            <div className="rounded-2xl bg-indigo-50/50 dark:bg-slate-800/70 border border-indigo-200/70 dark:border-slate-700 p-4 sm:p-5 space-y-4">
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {job.applyInstructions ||
                  'Submit your application directly through the official recruitment portal, recruiter email, or express in-app candidacy form below.'}
              </p>

              {/* Primary Application Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                {job.applyUrl && (
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      if (onApplySuccess) onApplySuccess(job.id);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 transition-all active:scale-95 no-underline"
                  >
                    <span>Apply via Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                )}

                {job.applyEmail && (
                  <a
                    href={`mailto:${job.applyEmail}?subject=${encodeURIComponent(`Application: ${job.title}`)}`}
                    className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-bold text-xs border border-slate-300 dark:border-slate-700 flex items-center space-x-1.5 transition-all no-underline"
                  >
                    <Mail className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span className="truncate">{job.applyEmail}</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setIsApplying(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-sm flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 shrink-0" />
                  <span>{hasApplied ? 'Update Application' : 'Express In-App Application'}</span>
                </button>
              </div>

              {/* Official Shareable Deep Link Box */}
              <div className="pt-3 border-t border-indigo-200/60 dark:border-slate-700/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                    🔗 Official Shareable Career Link
                  </span>
                  <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-300 font-semibold break-all bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    {deepLinkUrl}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyDeepLink}
                    className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs font-bold border border-slate-300 dark:border-slate-700 flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>{copiedDeepLink ? 'Copied! ✓' : 'Copy'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 24/7 Inline Sponsored Banner Ad */}
        <BannerAd position="inline" />

        {/* Copied toast notice */}
        {copiedLink && (
          <div className="my-3 p-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold text-center animate-in fade-in">
            Opportunity link copied to clipboard!
          </div>
        )}

        {/* Editorial Reader Footer (Matches ArticleDetail) */}
        <div className="flex items-center justify-between py-4 mt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setIsHelpful(!isHelpful)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isHelpful
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${isHelpful ? 'fill-white' : ''}`} />
            <span>{isHelpful ? 'Helpful Vacancy (1)' : 'Found this helpful?'}</span>
          </button>

          <button
            onClick={onClose}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            ← Back to Careers
          </button>
        </div>
      </article>

      {/* Permanent 24/7 Docked Bottom Banner Ad inside Job Reader */}
      <BannerAd position="reader-bottom" hasBottomNav={false} />

      {/* Express In-App Application Overlay Sheet */}
      {isApplying && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 pb-28 sm:pb-6 shadow-2xl max-h-[92dvh] overflow-y-auto">
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
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

            <form onSubmit={handleApplySubmit} className="mt-4 space-y-3.5 text-xs">
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
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(readerNode, document.body) : readerNode;
}

