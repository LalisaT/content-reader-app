import React, { useState, useEffect, useMemo } from 'react';
import {
  Briefcase,
  Search,
  Sparkles,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  Award,
  Filter,
  Bookmark,
  ChevronRight,
  Flame,
  CheckCircle2,
  ArrowUpRight,
  Layers,
  Globe,
  SlidersHorizontal,
  GraduationCap,
  Video,
  AlertCircle,
  RefreshCw,
  Loader2,
  Lock,
  Play,
  Wifi
} from 'lucide-react';
import JobDetailModal from '../components/JobDetailModal';
import BannerAd from '../components/BannerAd';
import { storageService } from '../services/storageService';
import { firestoreSyncService } from '../services/firestoreSyncService';
import { admobService } from '../services/admobService';

// Executive 3-Stage In-Person Interview Stages (cand 9, cand 4, test interview 3)
const INTERVIEW_STAGES = [
  {
    id: 'handshake',
    stageNumber: '01',
    camLabel: 'CAM 01 • WELCOME SUITE',
    tag: 'Handshake',
    shortLabel: 'Handshake',
    title: 'Executive Welcome & Handshake',
    subtitle: 'Direct In-Person Office Screening • Step 01',
    badge: 'STAGE 1: GREETING',
    recTime: '00:04:18',
    src: '/interview-handshake.jpg', // test_interview_3
    fallback: 'https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=1200&q=80',
    description: 'Face-to-face executive greeting and introduction in our private boardroom.',
  },
  {
    id: 'tech_review',
    stageNumber: '02',
    camLabel: 'CAM 02 • TECH LAB',
    tag: 'Tech Review',
    shortLabel: 'Tech Review',
    title: 'Technical & Case Study Evaluation',
    subtitle: 'Pair Review & Architecture Deep Dive • Step 02',
    badge: 'STAGE 2: EVALUATION',
    recTime: '00:19:42',
    src: '/interview-tech-review.jpg', // cand_4
    fallback: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    description: 'In-office collaborative deep dive reviewing live systems & architecture.',
  },
  {
    id: 'celebrate',
    stageNumber: '03',
    camLabel: 'CAM 03 • OFFER SIGNED',
    tag: 'Celebration',
    shortLabel: 'Offer Signed',
    title: 'Offer Acceptance & High-Five',
    subtitle: 'Partnership Celebration & Onboarding • Step 03',
    badge: 'STAGE 3: APPOINTMENT',
    recTime: '00:36:15',
    src: '/interview-celebrate.jpg', // cand_9
    fallback: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    description: 'Formal offer extension and high-five celebration welcoming the selected fellow.',
  },
];

const HIGHLIGHT_ITEMS = [
  {
    badge: 'Presidential Scholarship',
    title: 'Global AI & Technology Fellowship 2026',
    subtitle: 'Vanguard Academic Foundation • Fully Funded Endowment',
    value: '$120k Grant',
    isScholarship: true
  },
  {
    badge: 'VIP Executive Search',
    title: 'Principal AI & Systems Architect',
    subtitle: 'Apex Global Labs • London HQ & Worldwide Remote',
    value: '$225k / yr',
    isScholarship: false
  },
  {
    badge: 'Creative Fellowship',
    title: 'Executive Creative Director & Luxury Brand Lead',
    subtitle: 'Maison Lalisa Studio • Paris & Hybrid',
    value: '$190k / yr',
    isScholarship: false
  },
  {
    badge: 'Endowed Research Chair',
    title: 'Cognitive UX & Spatial Systems Fellow',
    subtitle: 'Cerebral Dynamics • Worldwide Remote',
    value: '$175k Grant',
    isScholarship: true
  }
];

const GalaxyBackground = React.memo(function GalaxyBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40 dark:opacity-50"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(99,102,241,0.18),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(120,119,198,0.28),rgba(15,23,42,0))]" />
    </div>
  );
});

const JobsHeroBanner = React.memo(function JobsHeroBanner({
  activeCount,
  scholarshipCount,
  remoteCount,
  savedCount
}) {
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [highlightIdx, setHighlightIdx] = useState(0);
  const [highlightVisible, setHighlightVisible] = useState(true);

  useEffect(() => {
    const stageTimer = setInterval(() => {
      setActiveStageIdx((prev) => (prev + 1) % INTERVIEW_STAGES.length);
    }, 5000);
    return () => clearInterval(stageTimer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setHighlightVisible(false);
      setTimeout(() => {
        setHighlightIdx((prev) => (prev + 1) % HIGHLIGHT_ITEMS.length);
        setHighlightVisible(true);
      }, 280);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  const currentHighlight = HIGHLIGHT_ITEMS[highlightIdx] || HIGHLIGHT_ITEMS[0];

  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-indigo-50/90 via-slate-50 to-amber-50/40 text-slate-900 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900 dark:text-white p-5 sm:p-7 shadow-lg border border-slate-200/90 dark:border-indigo-900/40 mb-6 overflow-hidden min-w-0">
      {/* Ambient Job Interview Video Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-35 dark:opacity-30">
        {INTERVIEW_STAGES.map((stg, sIdx) => (
          <img
            key={`bg-${stg.id}`}
            src={stg.src}
            alt={stg.title}
            decoding="async"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              sIdx === activeStageIdx ? 'opacity-100' : 'opacity-0'
            }`}
            onError={(e) => {
              e.currentTarget.src = stg.fallback;
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/60 to-white/25 dark:from-slate-950/90 dark:via-slate-950/65 dark:to-slate-950/35"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full bg-amber-500/15 dark:bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 dark:border-amber-400/30 flex items-center space-x-1.5">
              <span className="w-3.5 h-3.5 rounded-full overflow-hidden inline-flex items-center justify-center shrink-0 shadow-xs border border-amber-400/60 bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500">
                <img
                  src="/career-growth-icon-gold.png"
                  alt="Career Progression"
                  className="w-full h-full object-cover object-center"
                />
              </span>
              <span>Job Vacancy</span>
            </span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">
              Verified Direct Openings
            </span>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-2">
          Executive Vacancies & Scholarship Opportunities
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300/90 leading-relaxed max-w-lg mb-3">
          Discover bespoke executive roles, presidential scholarship endowments, and high-yield fellowships with verified global organizations.
        </p>

        {/* Special Slim Embedded Interview Showcase Card */}
        <div className="relative my-3 rounded-2xl bg-white/80 dark:bg-slate-950/55 border border-slate-200/80 dark:border-white/10 overflow-hidden shadow-xs group">
          <div className="relative z-10 p-3 sm:p-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="relative flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 via-indigo-600/20 to-purple-600/15 border border-amber-500/40 dark:border-amber-400/40 flex items-center justify-center shadow-xs">
                  {currentHighlight.isScholarship ? (
                    <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-300 relative z-10" />
                  ) : (
                    <Video className="w-4 h-4 text-amber-600 dark:text-amber-300 relative z-10" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center space-x-2 mb-0.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 dark:text-amber-300 flex items-center space-x-1.5">
                      <span className="inline-flex rounded-full h-1.5 w-1.5 bg-amber-500 dark:bg-amber-400"></span>
                      <span>{currentHighlight.badge}</span>
                    </span>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium hidden xs:inline">• Direct Screening Active</span>
                  </div>
                  <div
                    className={`text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate transition-opacity duration-200 ${
                      highlightVisible ? 'opacity-100' : 'opacity-20'
                    }`}
                  >
                    {currentHighlight.title}
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-300/80 truncate">
                    {currentHighlight.subtitle}
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 text-right">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Endowment / Grant
                </span>
                <span className="text-xs sm:text-sm font-black text-amber-600 dark:text-amber-300 block">
                  {currentHighlight.value}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-200/80 dark:border-white/10">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">
              Open Vacancies
            </span>
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {activeCount} Roles
            </span>
          </div>
          <div>
            <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold uppercase tracking-wider block">
              Scholarships
            </span>
            <span className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-300">
              {scholarshipCount > 0 ? scholarshipCount : 2} Grants
            </span>
          </div>
          <div>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider block">
              Remote & Global
            </span>
            <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-300">
              {remoteCount} Positions
            </span>
          </div>
          <div className="hidden sm:block">
            <span className="text-[10px] text-indigo-700 dark:text-indigo-400 font-bold uppercase tracking-wider block">
              Saved Roles
            </span>
            <span className="text-base sm:text-lg font-black text-indigo-600 dark:text-indigo-300">
              {savedCount} Saved
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default function JobsView({
  jobs = [],
  savedJobIds = [],
  onToggleSaveJob,
  onRecordApply,
  targetCareerSlug = null,
  onClearTargetCareer = null,
  isLoading = false,
  error = null,
  onRetry = null,
  unlockedGuides = [],
  onUnlockPremium = null,
  onTriggerInterstitial = null,
  isOnline = true
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [onlyRemote, setOnlyRemote] = useState(false);
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [onlySaved, setOnlySaved] = useState(false);
  const [onlyScholarships, setOnlyScholarships] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedJobsMap, setAppliedJobsMap] = useState(() => storageService.getAppliedJobIds());

  const handleOpenJob = (job) => {
    if (!job) return;
    setSelectedJob(job);
    admobService.setBannerReadingMode(true);
    try {
      window.history.pushState({ view: 'job', id: job.id }, '');
    } catch {}
  };

  const handleCloseJob = () => {
    setSelectedJob(null);
    admobService.setBannerReadingMode(false);
    if (typeof onTriggerInterstitial === 'function') {
      onTriggerInterstitial();
    }
  };

  // Automatic Deep Link Resolver (e.g. /careers/principal-ai-systems-architect, tippulse://careers/..., or ?job=...)
  useEffect(() => {
    try {
      let targetSlug = targetCareerSlug || null;
      if (!targetSlug) {
        const pathname = window.location.pathname || '';
        if (pathname.includes('/careers/')) {
          targetSlug = decodeURIComponent(pathname.split('/careers/')[1] || '').replace(/\/$/, '').trim();
        }
      }
      if (!targetSlug) {
        const params = new URLSearchParams(window.location.search);
        targetSlug = params.get('job') || params.get('career') || params.get('slug') || (window.location.pathname.includes('/careers') ? params.get('id') : null);
      }
      if (!targetSlug && window.location.hash) {
        const hash = window.location.hash.replace('#', '');
        if (hash.includes('careers/')) {
          targetSlug = hash.split('careers/')[1]?.trim();
        }
      }
      if (targetSlug && jobs.length > 0) {
        const lower = targetSlug.toLowerCase();
        const slugify = (str) => String(str || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const found = jobs.find((j) =>
          String(j.id).toLowerCase() === lower ||
          (j.slug && j.slug.toLowerCase() === lower) ||
          slugify(j.title) === lower ||
          (lower === 'somethinglead' && (j.id === 'job-synapse-neuro-ux' || j.title?.toLowerCase().includes('lead cognitive')))
        );
        if (found) {
          handleOpenJob(found);
          if (onClearTargetCareer) onClearTargetCareer();
        }
      }
    } catch (e) {
      console.warn('Deep link resolution error:', e);
    }
  }, [jobs, targetCareerSlug]);

  // Derive unique departments from existing jobs
  const departments = useMemo(() => {
    const set = new Set();
    jobs.forEach((j) => {
      if (j.department) set.add(j.department.split('&')[0].trim());
    });
    return ['All', ...Array.from(set)];
  }, [jobs]);

  // Filtered jobs list
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Status check (only active jobs shown to candidates)
      if (job.status === 'closed') return false;

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = job.title?.toLowerCase().includes(q);
        const matchesCompany = job.company?.toLowerCase().includes(q);
        const matchesDept = job.department?.toLowerCase().includes(q);
        const matchesSummary = job.summary?.toLowerCase().includes(q);
        const matchesSkills = job.skills?.some((s) => s.toLowerCase().includes(q));
        const matchesLocation = job.location?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCompany && !matchesDept && !matchesSummary && !matchesSkills && !matchesLocation) {
          return false;
        }
      }

      // Department filter
      if (selectedDept !== 'All') {
        if (!job.department?.toLowerCase().includes(selectedDept.toLowerCase())) {
          return false;
        }
      }

      // Remote filter
      if (onlyRemote) {
        const isRemote = job.workplaceType?.toLowerCase().includes('remote') || job.location?.toLowerCase().includes('remote');
        if (!isRemote) return false;
      }

      // Featured filter
      if (onlyFeatured && !job.isFeatured) {
        return false;
      }

      // Saved filter
      if (onlySaved && !savedJobIds.includes(String(job.id))) {
        return false;
      }

      // Scholarship filter
      if (onlyScholarships) {
        const isSchol =
          (job.department || '').toLowerCase().includes('scholarship') ||
          (job.department || '').toLowerCase().includes('fellowship') ||
          (job.employmentType || '').toLowerCase().includes('fellowship') ||
          (job.title || '').toLowerCase().includes('scholarship') ||
          (job.badgeText || '').toLowerCase().includes('scholarship');
        if (!isSchol) return false;
      }

      return true;
    });
  }, [jobs, searchQuery, selectedDept, onlyRemote, onlyFeatured, onlySaved, onlyScholarships, savedJobIds]);

  const handleApplySuccess = async (jobId, metadata) => {
    storageService.recordJobApplication(jobId, metadata);
    setAppliedJobsMap(storageService.getAppliedJobIds());
    await firestoreSyncService.incrementJobInquiry(jobId);
    if (onRecordApply) onRecordApply(jobId);
  };

  const activeCount = jobs.filter((j) => j.status !== 'closed').length;
  const remoteCount = jobs.filter((j) => (j.workplaceType || '').toLowerCase().includes('remote')).length;
  const scholarshipCount = jobs.filter(
    (j) =>
      (j.department || '').toLowerCase().includes('scholarship') ||
      (j.department || '').toLowerCase().includes('fellowship') ||
      (j.employmentType || '').toLowerCase().includes('fellowship') ||
      (j.title || '').toLowerCase().includes('scholarship') ||
      (j.badgeText || '').toLowerCase().includes('scholarship')
  ).length;

  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-hidden">
      {/* Low-Opacity Galaxy Animation Background (Moves When Scrolled) */}
      <GalaxyBackground />

      <div className="relative z-10 max-w-2xl mx-auto px-3.5 sm:px-4 py-4 pb-safe-nav w-full min-w-0">
        <JobsHeroBanner
          activeCount={activeCount}
          scholarshipCount={scholarshipCount}
          remoteCount={remoteCount}
          savedCount={savedJobIds.length}
        />

      {/* Search Input Bar */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search roles by title, company, skills, or location..."
          className="w-full pl-10 sm:pl-11 pr-12 py-3 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-xs transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            Clear
          </button>
        )}
      </div>

      {/* Luxury Filter Toggle Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none pb-2 mb-4 text-xs font-bold">
        <button
          onClick={() => setOnlyFeatured(!onlyFeatured)}
          className={`px-3 py-1.5 rounded-xl border transition-all duration-200 active:scale-95 ease-out flex items-center space-x-1 whitespace-nowrap ${
            onlyFeatured
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
              : 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-xs text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300'
          }`}
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>VIP Spotlight Only</span>
        </button>

        <button
          onClick={() => setOnlyRemote(!onlyRemote)}
          className={`px-3 py-1.5 rounded-xl border transition-all duration-200 active:scale-95 ease-out flex items-center space-x-1 whitespace-nowrap ${
            onlyRemote
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
              : 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-xs text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300'
          }`}
        >
          <Globe className="w-3 h-3 text-indigo-400" />
          <span>Remote Roles</span>
        </button>

        <button
          onClick={() => setOnlySaved(!onlySaved)}
          className={`px-3 py-1.5 rounded-xl border transition-all duration-200 active:scale-95 ease-out flex items-center space-x-1 whitespace-nowrap ${
            onlySaved
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
              : 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-xs text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300'
          }`}
        >
          <Bookmark className="w-3 h-3 text-emerald-400" />
          <span>Saved ({savedJobIds.length})</span>
        </button>

        <button
          onClick={() => setOnlyScholarships(!onlyScholarships)}
          className={`px-3 py-1.5 rounded-xl border transition-all duration-200 active:scale-95 ease-out flex items-center space-x-1 whitespace-nowrap ${
            onlyScholarships
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm font-black'
              : 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-xs text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
          <span>Scholarships & Grants</span>
        </button>

        {(onlyFeatured || onlyRemote || onlySaved || onlyScholarships || selectedDept !== 'All' || searchQuery) && (
          <button
            onClick={() => {
              setOnlyFeatured(false);
              setOnlyRemote(false);
              setOnlySaved(false);
              setOnlyScholarships(false);
              setSelectedDept('All');
              setSearchQuery('');
            }}
            className="px-2.5 py-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-semibold whitespace-nowrap active:scale-95 transition-all"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Department Tabs Bar */}
      {departments.length > 2 && (
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-2 mb-5">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                selectedDept === dept
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800/60'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      )}

      {/* Vacancies Directory List */}
      <div className="space-y-4">
        {isLoading && jobs.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm animate-pulse space-y-4"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
                  <div className="space-y-2 flex-1">
                    <div className="w-1/3 h-4 bg-slate-200 dark:bg-slate-700 rounded-md" />
                    <div className="w-1/4 h-3 bg-slate-200 dark:bg-slate-750 rounded-md" />
                  </div>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-md" />
                <div className="w-3/4 h-3 bg-slate-100 dark:bg-slate-800 rounded-md" />
                <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="w-20 h-4 bg-slate-200 dark:bg-slate-700 rounded-md" />
                  <div className="w-16 h-4 bg-slate-200 dark:bg-slate-700 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : error && jobs.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-3xl border border-rose-200 dark:border-rose-900/50 p-6 space-y-3 shadow-sm">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <h4 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-200">
              Connection to Executive Career Cloud Interrupted
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {error}
            </p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Connection</span>
              </button>
            )}
          </div>
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map((job) => {
            const isSaved = savedJobIds.includes(String(job.id));
            const hasApplied = Boolean(appliedJobsMap[String(job.id)]);
            const isLocked = Boolean(job.isPremium) && !unlockedGuides.includes(String(job.id));

            return (
              <div
                key={job.id}
                onClick={() => handleOpenJob(job)}
                className={`group relative bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border soft-card cv-auto cursor-pointer w-full min-w-0 overflow-hidden ${
                  job.isFeatured
                    ? 'border-amber-400/50 dark:border-amber-500/30 ring-1 ring-amber-400/20 shadow-md shadow-amber-500/5'
                    : 'border-slate-200/90 dark:border-slate-700/80 shadow-xs'
                }`}
              >
                {/* VIP Shimmering Top Accent */}
                {job.isFeatured && (
                  <div className="absolute top-2.5 right-14">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-sans shadow-sm shadow-amber-500/20 flex items-center space-x-1">
                      <Sparkles className="w-2.5 h-2.5 text-slate-950 fill-slate-950 shrink-0" />
                      <span className="truncate max-w-[120px]">{job.badgeText || 'VIP Spotlight'}</span>
                    </span>
                  </div>
                )}

                {/* Company & Role Header */}
                <div className="flex items-start justify-between gap-2.5 sm:gap-3 mb-3 min-w-0">
                  <div className="flex items-start space-x-3 sm:space-x-3.5 min-w-0 flex-1">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-slate-100 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 flex items-center justify-center p-1 shrink-0 overflow-hidden shadow-xs">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo}
                          alt={job.company}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <Building2 className="w-6 h-6 text-slate-400" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-bold mb-0.5 min-w-0">
                        <span className="truncate">{job.company}</span>
                        {job.department && (
                          <>
                            <span className="text-slate-300 dark:text-slate-600 shrink-0">&bull;</span>
                            <span className="text-slate-500 text-[11px] font-normal truncate hidden sm:inline">
                              {job.department}
                            </span>
                          </>
                        )}
                        {job.isPremium && (
                          isLocked ? (
                            <span className="px-1.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-wider flex items-center space-x-1 shrink-0">
                              <Lock className="w-2.5 h-2.5" />
                              <span>PRO</span>
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider flex items-center space-x-1 shrink-0">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              <span>Unlocked</span>
                            </span>
                          )
                        )}
                      </div>
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug break-words">
                        {job.title}
                      </h3>
                    </div>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSaveJob(job.id);
                    }}
                    title={isSaved ? 'Remove from Saved' : 'Save Job'}
                    className={`p-2 rounded-xl transition-colors shrink-0 ${
                      isSaved
                        ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/80'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
                  </button>
                </div>

                {/* Role Brief Summary */}
                {job.summary && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 mb-4">
                    {job.summary}
                  </p>
                )}

                {/* Skills Chips */}
                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {job.skills.slice(0, 4).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 text-[11px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 4 && (
                      <span className="text-[10px] text-slate-400 font-semibold self-center">
                        +{job.skills.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                {/* Footer Meta & Compensation */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="font-black text-emerald-600 dark:text-emerald-400 flex items-center">
                      <DollarSign className="w-3.5 h-3.5 mr-0.5" />
                      {job.salaryRange || 'Competitive'}
                    </span>

                    <span className="text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[130px]">{job.location || 'Remote'}</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {hasApplied ? (
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/60 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Applied</span>
                      </span>
                    ) : isLocked ? (
                      <span className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-xl border border-amber-300/60 dark:border-amber-700/60 flex items-center space-x-1">
                        <Play className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>Watch Ad to View</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform flex items-center space-x-0.5">
                        <span>View Role</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6">
            <Briefcase className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-200">
              No matching vacancies found
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find any opportunities matching your active criteria. Try broadening your keywords or resetting filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDept('All');
                setOnlyRemote(false);
                setOnlyFeatured(false);
                setOnlySaved(false);
              }}
              className="mt-4 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-xl border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* 24/7 Inline Sponsored Banner Ad */}
        <BannerAd position="inline" />
      </div>

      {/* Selected Job Full Detail Modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          isOpen={Boolean(selectedJob)}
          onClose={handleCloseJob}
          isSaved={savedJobIds.includes(String(selectedJob.id))}
          onToggleSave={onToggleSaveJob}
          hasApplied={Boolean(appliedJobsMap[String(selectedJob.id)])}
          onApplySuccess={handleApplySuccess}
          isUnlocked={unlockedGuides.includes(String(selectedJob.id))}
          onUnlockPremium={onUnlockPremium}
          isOnline={isOnline}
        />
      )}
      </div>
    </div>
  );
}
