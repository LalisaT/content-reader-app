import React, { useState, useMemo } from 'react';
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
  SlidersHorizontal
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
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedJobsMap, setAppliedJobsMap] = useState(() => storageService.getAppliedJobIds());

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

      return true;
    });
  }, [jobs, searchQuery, selectedDept, onlyRemote, onlyFeatured, onlySaved, savedJobIds]);

  const handleApplySuccess = async (jobId, metadata) => {
    storageService.recordJobApplication(jobId, metadata);
    setAppliedJobsMap(storageService.getAppliedJobIds());
    await firestoreSyncService.incrementJobInquiry(jobId);
    if (onRecordApply) onRecordApply(jobId);
  };

  const activeCount = jobs.filter((j) => j.status !== 'closed').length;
  const remoteCount = jobs.filter((j) => (j.workplaceType || '').toLowerCase().includes('remote')).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-safe-nav animate-in fade-in duration-200">
      {/* Luxury Careers Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 shadow-2xl border border-indigo-900/40 mb-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center space-x-1.5 backdrop-blur-xs">
              <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400/20" />
              <span>Executive Career Sanctuary</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 hidden sm:inline">
              Verified Direct Openings
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight mb-2">
            Executive Vacancies & Leadership Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed max-w-lg mb-5">
            Discover bespoke executive roles, senior architecture posts, and high-yield creative directions with verified global organizations.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
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
                Remote & Global
              </span>
              <span className="text-base sm:text-lg font-black text-amber-300">
                {remoteCount} Positions
              </span>
            </div>
            <div>
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

        {(onlyFeatured || onlyRemote || onlySaved || selectedDept !== 'All' || searchQuery) && (
          <button
            onClick={() => {
              setOnlyFeatured(false);
              setOnlyRemote(false);
              setOnlySaved(false);
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
