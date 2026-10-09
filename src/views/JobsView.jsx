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
  Video
} from 'lucide-react';
import JobDetailModal from '../components/JobDetailModal';
import { storageService } from '../services/storageService';
import { firestoreSyncService } from '../services/firestoreSyncService';

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

// -------------------------------------------------------------
// Low-Opacity Galaxy Background with Scroll-Responsive Parallax
// Soft, celestial cosmic motion: deep nebula clouds, rotating star vortex,
// twinkling constellations, and subtle shooting comet passage.
// -------------------------------------------------------------
function GalaxyBackground({ scrollY = 0 }) {
  // Parallax offsets (silky dampening for buttery smooth 60fps)
  const nebulaOffset1 = -scrollY * 0.16;
  const nebulaOffset2 = -scrollY * 0.26;
  const nebulaOffset3 = -scrollY * 0.12;
  const starfieldOffset = -scrollY * 0.38;
  const spiralRotation = scrollY * 0.05;

  // Curated Starfield constellation coordinates (percentages)
  const STARS = [
    { top: '5%', left: '12%', size: 2.5, delay: '0s', fast: true },
    { top: '8%', left: '76%', size: 3, delay: '1.2s', fast: false },
    { top: '14%', left: '38%', size: 2, delay: '2.4s', fast: true },
    { top: '19%', left: '88%', size: 2.5, delay: '0.8s', fast: false },
    { top: '24%', left: '7%', size: 3.5, delay: '1.8s', fast: false },
    { top: '30%', left: '60%', size: 2, delay: '3.1s', fast: true },
    { top: '36%', left: '22%', size: 2.5, delay: '0.5s', fast: true },
    { top: '42%', left: '84%', size: 3, delay: '2.1s', fast: false },
    { top: '48%', left: '35%', size: 2, delay: '1.5s', fast: true },
    { top: '54%', left: '92%', size: 2.5, delay: '3.7s', fast: false },
    { top: '60%', left: '14%', size: 3, delay: '0.3s', fast: true },
    { top: '66%', left: '50%', size: 2, delay: '2.8s', fast: false },
    { top: '72%', left: '78%', size: 3.5, delay: '1.1s', fast: true },
    { top: '78%', left: '25%', size: 2, delay: '2.2s', fast: false },
    { top: '84%', left: '86%', size: 2.5, delay: '0.9s', fast: true },
    { top: '90%', left: '18%', size: 3, delay: '1.9s', fast: false },
    { top: '95%', left: '65%', size: 2, delay: '2.7s', fast: true },
    { top: '12%', left: '22%', size: 2, delay: '1.9s', fast: false },
    { top: '33%', left: '95%', size: 2.5, delay: '2.7s', fast: true },
    { top: '58%', left: '44%', size: 2, delay: '0.6s', fast: true },
    { top: '75%', left: '8%', size: 2.5, delay: '3.3s', fast: false },
    { top: '88%', left: '58%', size: 2, delay: '1.4s', fast: true },
    { top: '45%', left: '6%', size: 2, delay: '2.9s', fast: false },
    { top: '2%', left: '48%', size: 2.5, delay: '0.7s', fast: true },
    { top: '22%', left: '50%', size: 2, delay: '3.5s', fast: false },
  ];

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 transition-opacity duration-700 opacity-40 dark:opacity-55"
      style={{ willChange: 'transform' }}
    >
      {/* Deep Space Background Aura - Cosmic Gradient Dust */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.2),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.35),rgba(15,23,42,0))]" />

      {/* Layer 1: Parallax Cosmic Nebula 1 (Top-Right Violet / Indigo Swirl) */}
      <div
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full blur-3xl animate-galaxy-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.45) 0%, rgba(99, 102, 241, 0.28) 40%, transparent 70%)',
          transform: `translate3d(0, ${nebulaOffset1}px, 0)`,
          willChange: 'transform'
        }}
      />

      {/* Layer 2: Parallax Cosmic Nebula 2 (Mid-Left Cyan / Deep Sapphire Cloud) */}
      <div
        className="absolute top-[35%] -left-44 w-[540px] h-[540px] rounded-full blur-3xl animate-galaxy-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, rgba(59, 130, 246, 0.24) 45%, transparent 75%)',
          transform: `translate3d(0, ${nebulaOffset2}px, 0)`,
          animationDelay: '-6s',
          willChange: 'transform'
        }}
      />

      {/* Layer 3: Parallax Golden Starlight / Warm Amber Endowments Aurora */}
      <div
        className="absolute top-[65%] -right-24 w-[520px] h-[520px] rounded-full blur-3xl animate-galaxy-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, rgba(244, 63, 94, 0.2) 50%, transparent 75%)',
          transform: `translate3d(0, ${nebulaOffset3}px, 0)`,
          animationDelay: '-10s',
          willChange: 'transform'
        }}
      />

      {/* Layer 4: Rotating Spiral Galaxy Core (Slow Ambient Celestial Spin + Scroll Shift) */}
      <div
        className="absolute top-20 left-1/2 -translate-x-1/2 w-[720px] h-[720px] rounded-full opacity-50 dark:opacity-75 animate-galaxy-spin pointer-events-none"
        style={{
          background: 'conic-gradient(from 0deg, rgba(99, 102, 241, 0.22), rgba(168, 85, 247, 0.28), rgba(6, 182, 212, 0.2), rgba(245, 158, 11, 0.18), rgba(99, 102, 241, 0.22))',
          filter: 'blur(60px)',
          transform: `translate3d(-50%, ${nebulaOffset1 * 0.75}px, 0) rotate(${spiralRotation}deg)`,
          willChange: 'transform'
        }}
      />

      {/* Layer 5: Parallax Starfield Constellations with Soft Twinkling */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate3d(0, ${starfieldOffset}px, 0)`,
          willChange: 'transform'
        }}
      >
        {STARS.map((star, idx) => (
          <div
            key={`star-${idx}`}
            className={`absolute rounded-full bg-indigo-500/80 dark:bg-amber-100 ${
              star.fast ? 'animate-star-twinkle-fast' : 'animate-star-twinkle-slow'
            }`}
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: star.delay,
              boxShadow: `0 0 ${star.size * 2}px rgba(99, 102, 241, 0.7), 0 0 ${star.size * 4}px rgba(168, 85, 247, 0.5)`
            }}
          />
        ))}

        {/* Ambient Comet Passage (Subtle Shooting Star) */}
        <div
          className="absolute top-10 left-12 w-32 h-[2px] bg-gradient-to-r from-transparent via-indigo-400 dark:via-white to-transparent rounded-full animate-comet pointer-events-none"
          style={{
            boxShadow: '0 0 6px rgba(99,102,241,0.9), 0 0 12px rgba(168,85,247,0.7)'
          }}
        />
      </div>
    </div>
  );
}

export default function JobsView({
  jobs = [],
  savedJobIds = [],
  onToggleSaveJob,
  onRecordApply
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [onlyRemote, setOnlyRemote] = useState(false);
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [onlySaved, setOnlySaved] = useState(false);
  const [onlyScholarships, setOnlyScholarships] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedJobsMap, setAppliedJobsMap] = useState(() => storageService.getAppliedJobIds());

  // Parallax Scroll Tracker for Silky Smooth Galaxy Animation
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let rafId = null;
    const handleScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        setScrollY(window.scrollY || document.documentElement.scrollTop || 0);
        rafId = null;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  // Automatic Deep Link Resolver (e.g. /careers/somethinglead or ?job=somethinglead)
  useEffect(() => {
    try {
      const pathname = window.location.pathname || '';
      let targetSlug = null;
      if (pathname.includes('/careers/')) {
        targetSlug = decodeURIComponent(pathname.split('/careers/')[1] || '').replace(/\/$/, '').trim();
      }
      if (!targetSlug) {
        const params = new URLSearchParams(window.location.search);
        targetSlug = params.get('job') || params.get('career') || params.get('slug');
      }
      if (!targetSlug && window.location.hash) {
        const hash = window.location.hash.replace('#', '');
        if (hash.includes('careers/')) {
          targetSlug = hash.split('careers/')[1]?.trim();
        }
      }
      if (targetSlug && jobs.length > 0) {
        const lower = targetSlug.toLowerCase();
        const found = jobs.find((j) =>
          String(j.id).toLowerCase() === lower ||
          (j.slug && j.slug.toLowerCase() === lower) ||
          (lower === 'somethinglead' && (j.id === 'job-synapse-neuro-ux' || j.title?.toLowerCase().includes('lead cognitive')))
        );
        if (found) {
          setSelectedJob(found);
        }
      }
    } catch (e) {
      console.warn('Deep link resolution error:', e);
    }
  }, [jobs]);

  // Active camera interview feed stage (cycles or user switchable)
  const [activeStageIdx, setActiveStageIdx] = useState(0);

  useEffect(() => {
    const stageTimer = setInterval(() => {
      setActiveStageIdx((prev) => (prev + 1) % INTERVIEW_STAGES.length);
    }, 4500);
    return () => clearInterval(stageTimer);
  }, []);

  const currentStage = INTERVIEW_STAGES[activeStageIdx] || INTERVIEW_STAGES[0];

  // Embedded opacity animation highlight rotation
  const highlightItems = useMemo(() => [
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
  ], []);

  const [highlightIdx, setHighlightIdx] = useState(0);
  const [highlightVisible, setHighlightVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setHighlightVisible(false);
      setTimeout(() => {
        setHighlightIdx((prev) => (prev + 1) % highlightItems.length);
        setHighlightVisible(true);
      }, 350);
    }, 3800);
    return () => clearInterval(timer);
  }, [highlightItems.length]);

  const currentHighlight = highlightItems[highlightIdx] || highlightItems[0];

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
    <div className="relative min-h-screen">
      {/* Low-Opacity Galaxy Animation Background (Moves When Scrolled) */}
      <GalaxyBackground scrollY={scrollY} />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-4 pb-safe-nav animate-in fade-in duration-200">
        {/* Luxury Careers & Scholarships Hero Banner with Embedded Interview Video Opacity Animation */}
      <div className="relative rounded-3xl bg-gradient-to-br from-indigo-50/90 via-slate-50 to-amber-50/40 text-slate-900 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900 dark:text-white p-6 sm:p-7 shadow-xl dark:shadow-2xl border border-slate-200/90 dark:border-indigo-900/40 mb-6 overflow-hidden">
        {/* Ambient Hardware-Accelerated Opacity Breathing Orbs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-amber-500/15 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none animate-job-opacity-glow"></div>
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-gradient-to-tr from-indigo-500/20 via-purple-600/10 to-transparent rounded-full blur-2xl pointer-events-none animate-job-opacity-pulse"></div>

        {/* Ambient Job Interview Video Background: Cycling Interview Feeds (cand_9, cand_4, test_interview_3) with Rich Visible Opacity */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-35">
          {INTERVIEW_STAGES.map((stg, sIdx) => (
            <img
              key={`bg-${stg.id}`}
              src={stg.src}
              alt={stg.title}
              className={`absolute inset-0 w-full h-full object-cover filter contrast-120 brightness-100 animate-interview-cam transition-opacity duration-1000 ${
                sIdx === activeStageIdx ? 'opacity-100' : 'opacity-0'
              }`}
              onError={(e) => {
                e.currentTarget.src = stg.fallback;
              }}
            />
          ))}
          {/* Subtle Video Scanline */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent h-24 animate-interview-scan pointer-events-none"></div>
          {/* Luxury vignette overlay so foreground text is high contrast and ultra readable while office interview remains clearly visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/85 via-white/55 to-white/20 dark:from-slate-950/90 dark:via-slate-950/65 dark:to-slate-950/35"></div>
        </div>

        <div className="relative z-10">
          {/* Header Badges */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full bg-amber-500/15 dark:bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 dark:border-amber-400/30 flex items-center space-x-1.5 backdrop-blur-xs">
                <span className="w-3.5 h-3.5 rounded-full overflow-hidden inline-flex items-center justify-center shrink-0 shadow-xs border border-sky-400/30 bg-sky-500/10">
                  <img
                    src="/career-growth-icon.png"
                    alt="Career Progression"
                    className="w-[118%] h-[118%] object-cover object-center max-w-none"
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

          {/* Special Slim Embedded Interview Showcase Card (Glassmorphism & Balanced Interview Opacity) */}
          <div className="relative my-3 rounded-2xl bg-white/70 dark:bg-slate-950/40 backdrop-blur-md border border-slate-200/80 dark:border-white/10 overflow-hidden shadow-sm dark:shadow-inner group">
            {/* Low Opacity Interview Camera Feed Backdrop (Cycling Stages: Handshake -> Tech Review -> Offer) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 dark:opacity-30">
              {INTERVIEW_STAGES.map((stg, sIdx) => (
                <img
                  key={`showcase-${stg.id}`}
                  src={stg.src}
                  alt={stg.title}
                  className={`absolute inset-0 w-full h-full object-cover filter brightness-95 contrast-125 animate-interview-cam transition-opacity duration-1000 ${
                    sIdx === activeStageIdx ? 'opacity-100' : 'opacity-0'
                  }`}
                  onError={(e) => {
                    e.currentTarget.src = stg.fallback;
                  }}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/45 to-white/80 dark:from-slate-950/85 dark:via-slate-950/50 dark:to-slate-950/85"></div>
            </div>

            {/* Shimmer Light Beam with Opacity Wave */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -inset-full bg-gradient-to-r from-transparent via-amber-400/15 to-transparent animate-job-shimmer"></div>
            </div>

            {/* Video Interview Content */}
            <div className="relative z-10 p-3 sm:p-3.5">
              {/* Interview Role Details & Camera Viewfinder */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3 min-w-0">
                  {/* Camera Viewfinder Icon with Autofocus Brackets */}
                  <div className="relative flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 via-indigo-600/20 to-purple-600/15 border border-amber-500/40 dark:border-amber-400/40 flex items-center justify-center shadow-sm">
                    <div className="absolute inset-1 border border-dashed border-amber-500/50 dark:border-amber-400/50 rounded-lg animate-job-opacity-pulse pointer-events-none"></div>
                    {currentHighlight.isScholarship ? (
                      <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-300 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                    ) : (
                      <Video className="w-4 h-4 text-amber-600 dark:text-amber-300 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2 mb-0.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 dark:text-amber-300 flex items-center space-x-1.5">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-job-beacon absolute inline-flex h-full w-full rounded-full bg-amber-500 dark:bg-amber-400"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500 dark:bg-amber-400"></span>
                        </span>
                        <span>{currentHighlight.badge}</span>
                      </span>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium hidden xs:inline">• Direct Screening Active</span>
                    </div>
                    <div
                      className={`text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate transition-opacity duration-300 ${
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

                {/* Endowment / Compensation Pill with Breathing Opacity */}
                <div className="flex-shrink-0 text-right">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Endowment / Grant
                  </span>
                  <span className="text-xs sm:text-sm font-black text-amber-600 dark:text-amber-300 animate-job-opacity-pulse block">
                    {currentHighlight.value}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid with Scholarships Prominently Displayed */}
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
                {savedJobIds.length} Saved
              </span>
            </div>
          </div>
        </div>
      </div>

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
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => {
            const isSaved = savedJobIds.includes(String(job.id));
            const hasApplied = Boolean(appliedJobsMap[String(job.id)]);

            return (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`group relative bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl p-5 border soft-card cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-[0.99] ${
                  job.isFeatured
                    ? 'border-amber-400/50 dark:border-amber-500/30 ring-1 ring-amber-400/20 shadow-md shadow-amber-500/5'
                    : 'border-slate-200/90 dark:border-slate-700/80 shadow-xs'
                }`}
              >
                {/* VIP Shimmering Top Accent */}
                {job.isFeatured && (
                  <div className="absolute top-0 right-8 -translate-y-1/2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-sans shadow-md shadow-amber-500/20 flex items-center space-x-1">
                      <Sparkles className="w-2.5 h-2.5 text-slate-950 fill-slate-950" />
                      <span>{job.badgeText || 'VIP Spotlight'}</span>
                    </span>
                  </div>
                )}

                {/* Company & Role Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start space-x-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 flex items-center justify-center p-1 shrink-0 overflow-hidden shadow-xs">
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

                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-bold mb-0.5">
                        <span className="truncate">{job.company}</span>
                        {job.department && (
                          <>
                            <span className="text-slate-300 dark:text-slate-600">&bull;</span>
                            <span className="text-slate-500 text-[11px] font-normal truncate hidden sm:inline">
                              {job.department}
                            </span>
                          </>
                        )}
                      </div>
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
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
      </div>

      {/* Selected Job Full Detail Modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          isOpen={Boolean(selectedJob)}
          onClose={() => setSelectedJob(null)}
          isSaved={savedJobIds.includes(String(selectedJob.id))}
          onToggleSave={onToggleSaveJob}
          hasApplied={Boolean(appliedJobsMap[String(selectedJob.id)])}
          onApplySuccess={handleApplySuccess}
        />
      )}
      </div>
    </div>
  );
}
