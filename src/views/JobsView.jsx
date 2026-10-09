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
    <div className="max-w-2xl mx-auto px-4 py-4 pb-safe-nav animate-in fade-in duration-200">
      {/* Luxury Careers & Scholarships Hero Banner with Embedded Interview Video Opacity Animation */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 shadow-2xl border border-indigo-900/40 mb-6 overflow-hidden">
        {/* Ambient Hardware-Accelerated Opacity Breathing Orbs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-amber-500/20 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none animate-job-opacity-glow"></div>
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-gradient-to-tr from-indigo-500/25 via-purple-600/15 to-transparent rounded-full blur-2xl pointer-events-none animate-job-opacity-pulse"></div>

        {/* Ambient Job Interview Video Background (Low Opacity) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-25 mix-blend-screen">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover filter contrast-125 brightness-90 animate-interview-cam"
            poster="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-business-woman-talking-in-a-video-call-42880-large.mp4" type="video/mp4" />
          </video>
          {/* Subtle Video Scanline */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent h-24 animate-interview-scan pointer-events-none"></div>
          {/* Dark luxury vignette overlay so foreground text is high contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-slate-950/40"></div>
        </div>

        <div className="relative z-10">
          {/* Header Badges (Radar Active removed) */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center space-x-1.5 backdrop-blur-xs">
                <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400/20" />
                <span>Executive Career Sanctuary</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 hidden sm:inline">
                Verified Direct Openings
              </span>
            </div>

            {/* Virtual Screening Atelier Tag */}
            <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-400/25 text-indigo-300 backdrop-blur-xs">
              <Video className="w-3 h-3 text-indigo-400" />
              <span className="text-[9px] font-bold tracking-wider uppercase">
                Virtual Screening
              </span>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight mb-2">
            Executive Vacancies & Scholarship Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed max-w-lg mb-4">
            Discover bespoke executive roles, presidential scholarship endowments, and high-yield fellowships with verified global organizations.
          </p>

          {/* Embedded Job Interview Video Showcase Card (Low Opacity Styling) */}
          <div className="relative my-4 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 overflow-hidden shadow-inner group">
            {/* Low Opacity Interview Camera Feed Backdrop */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                alt="Executive Interview"
                className="w-full h-full object-cover filter brightness-90 contrast-125 animate-interview-cam"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-slate-950/90"></div>
            </div>

            {/* Shimmer Light Beam with Opacity Wave */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -inset-full bg-gradient-to-r from-transparent via-amber-400/10 to-transparent animate-job-shimmer"></div>
            </div>

            {/* Video Interview HUD & Opacity Animation Content */}
            <div className="relative z-10 p-3.5 sm:p-4">
              {/* Top Video HUD Bar */}
              <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  {/* Blinking REC Indicator */}
                  <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-interview-rec"></span>
                    <span className="text-[9px] font-black tracking-widest uppercase text-rose-300">REC</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-300 tracking-wider">
                    00:14:38
                  </span>
                  <span className="text-[9px] text-slate-400 font-semibold hidden xs:inline">• Virtual Interview Stream</span>
                </div>

                {/* Live Speech Waveform Equalizer & 1080p Badge */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-end space-x-0.5 h-3.5 px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                    <span className="w-0.5 bg-amber-400 rounded-full animate-interview-wave-1"></span>
                    <span className="w-0.5 bg-amber-400 rounded-full animate-interview-wave-2"></span>
                    <span className="w-0.5 bg-amber-400 rounded-full animate-interview-wave-3"></span>
                    <span className="w-0.5 bg-amber-400 rounded-full animate-interview-wave-4"></span>
                    <span className="w-0.5 bg-amber-400 rounded-full animate-interview-wave-2"></span>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-amber-300 px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                    1080p HD
                  </span>
                </div>
              </div>

              {/* Interview Role Details & Camera Viewfinder */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3 min-w-0">
                  {/* Camera Viewfinder Icon with Autofocus Brackets */}
                  <div className="relative flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/25 via-indigo-600/25 to-purple-600/20 border border-amber-400/40 flex items-center justify-center shadow-lg">
                    <div className="absolute inset-1 border border-dashed border-amber-400/50 rounded-lg animate-job-opacity-pulse pointer-events-none"></div>
                    {currentHighlight.isScholarship ? (
                      <GraduationCap className="w-5 h-5 text-amber-300 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                    ) : (
                      <Video className="w-5 h-5 text-amber-300 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2 mb-0.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 flex items-center space-x-1.5">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-job-beacon absolute inline-flex h-full w-full rounded-full bg-amber-400"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400"></span>
                        </span>
                        <span>{currentHighlight.badge}</span>
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium hidden xs:inline">• Direct Screening Active</span>
                    </div>
                    <div
                      className={`text-xs sm:text-sm font-black text-white truncate transition-opacity duration-300 ${
                        highlightVisible ? 'opacity-100' : 'opacity-20'
                      }`}
                    >
                      {currentHighlight.title}
                    </div>
                    <div className="text-[10px] text-slate-300/80 truncate">
                      {currentHighlight.subtitle}
                    </div>
                  </div>
                </div>

                {/* Endowment / Compensation Pill with Breathing Opacity */}
                <div className="flex-shrink-0 text-right">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                    Endowment / Grant
                  </span>
                  <span className="text-xs sm:text-sm font-black text-amber-300 animate-job-opacity-pulse block">
                    {currentHighlight.value}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid with Scholarships Prominently Displayed */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-3 border-t border-white/10">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Open Vacancies
              </span>
              <span className="text-base sm:text-lg font-black text-white">
                {activeCount} Roles
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Scholarships
              </span>
              <span className="text-base sm:text-lg font-black text-amber-300">
                {scholarshipCount > 0 ? scholarshipCount : 2} Grants
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Remote & Global
              </span>
              <span className="text-base sm:text-lg font-black text-emerald-300">
                {remoteCount} Positions
              </span>
            </div>
            <div className="hidden sm:block">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Saved Roles
              </span>
              <span className="text-base sm:text-lg font-black text-indigo-300">
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
          className={`px-3 py-1.5 rounded-xl border transition-all flex items-center space-x-1 whitespace-nowrap ${
            onlyFeatured
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
          }`}
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>VIP Spotlight Only</span>
        </button>

        <button
          onClick={() => setOnlyRemote(!onlyRemote)}
          className={`px-3 py-1.5 rounded-xl border transition-all flex items-center space-x-1 whitespace-nowrap ${
            onlyRemote
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
          }`}
        >
          <Globe className="w-3 h-3 text-indigo-400" />
          <span>Remote Roles</span>
        </button>

        <button
          onClick={() => setOnlySaved(!onlySaved)}
          className={`px-3 py-1.5 rounded-xl border transition-all flex items-center space-x-1 whitespace-nowrap ${
            onlySaved
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
          }`}
        >
          <Bookmark className="w-3 h-3 text-emerald-400" />
          <span>Saved ({savedJobIds.length})</span>
        </button>

        <button
          onClick={() => setOnlyScholarships(!onlyScholarships)}
          className={`px-3 py-1.5 rounded-xl border transition-all flex items-center space-x-1 whitespace-nowrap ${
            onlyScholarships
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm font-black'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
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
            className="px-2.5 py-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-semibold whitespace-nowrap"
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
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedDept === dept
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
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
                className={`group relative bg-white dark:bg-slate-800/90 rounded-3xl p-5 border transition-all duration-200 hover:shadow-xl cursor-pointer ${
                  job.isFeatured
                    ? 'border-amber-400/40 dark:border-amber-500/30 ring-1 ring-amber-400/20 shadow-md shadow-amber-500/5'
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
  );
}
