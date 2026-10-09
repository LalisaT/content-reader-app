import React, { useState, useEffect, useMemo } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Sparkles,
  Building2,
  MapPin,
  Clock,
  DollarSign,
  Award,
  CheckCircle2,
  Trash2,
  Edit3,
  Eye,
  Copy,
  Flame,
  Globe,
  Send,
  X,
  ExternalLink,
  Mail,
  ShieldCheck,
  Calendar,
  Gift,
  ArrowRight,
  Layers,
  ChevronDown
} from 'lucide-react';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseAdmin';

const JOBS_COLLECTION = 'job_vacancies';

const JOB_TEMPLATES = [
  {
    name: 'Principal AI & Cloud Architect',
    data: {
      title: 'Principal AI & Cloud Architect',
      company: 'Apex Global Labs',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      department: 'Artificial Intelligence & Cloud',
      employmentType: 'Full-Time',
      workplaceType: 'Remote',
      location: 'Worldwide Remote / London',
      salaryRange: '$175,000 - $225,000 / yr',
      experienceLevel: 'Principal / Lead (8+ Years)',
      summary: 'Architect distributed real-time AI serving engines and transformer pipelines for enterprise operations.',
      description: 'Apex Global Labs is pioneering enterprise-grade neural architectures and low-latency inference pipelines. Lead our systems engineering division.',
      responsibilities: [
        'Design distributed inference infrastructure with sub-50ms latency SLAs.',
        'Architect high-scale vector retrieval and indexing pipelines.',
        'Mentor senior engineering staff and steer cloud technical roadmap.'
      ],
      requirements: [
        '8+ years in distributed backend systems and high-throughput microservices.',
        'Demonstrated production track record with Python, Rust, Go, or C++.',
        'Experience deploying neural networks at scale with Kubernetes and GPU clusters.'
      ],
      niceToHave: ['vLLM, TensorRT-LLM, or Triton Inference Server expertise'],
      benefits: [
        'Top-tier compensation with executive equity grant',
        'Unlimited flexible PTO & luxury home office equipment budget',
        'Private comprehensive global health and wellness coverage'
      ],
      skills: ['AI Systems', 'Distributed Computing', 'Rust/Python', 'Kubernetes'],
      applyType: 'email',
      applyEmail: 'careers@apexlabs.example.com',
      applyUrl: 'https://apexlabs.example.com/careers',
      applyInstructions: 'Send resume and technical achievements portfolio.',
      deadline: 'Open until filled',
      isFeatured: true,
      isUrgent: false,
      badgeText: 'VIP Executive Search',
      status: 'active'
    }
  },
  {
    name: 'Executive Creative Director',
    data: {
      title: 'Executive Creative Director & Luxury Brand Lead',
      company: 'Maison Lalisa Studio',
      companyLogo: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=150&auto=format&fit=crop&q=80',
      department: 'Brand Strategy & Creative Direction',
      employmentType: 'Full-Time',
      workplaceType: 'Hybrid',
      location: 'Dubai, UAE / Paris / Hybrid',
      salaryRange: '$145,000 - $190,000 / yr',
      experienceLevel: 'Director / Executive (7+ Years)',
      summary: 'Curate prestigious visual identities and haute digital design experiences for international luxury brands.',
      description: 'Lead our multi-disciplinary creative atelier spanning branding, typography, editorial media, and bespoke multimedia narratives.',
      responsibilities: [
        'Define global visual benchmarks and artistic direction for premier clients.',
        'Direct senior designers across 3D, typography, motion, and digital product.',
        'Present transformative brand visions to corporate executives and founders.'
      ],
      requirements: [
        '7+ years creative direction experience within luxury goods or high-end design ateliers.',
        'Flawless portfolio showcasing visionary brand design craftsmanship.',
        'Mastery of typography, editorial rhythm, and cinematic art direction.'
      ],
      niceToHave: ['Bespoke hospitality or architectural branding experience'],
      benefits: [
        'Bespoke executive salary + performance bonuses',
        'Luxury travel accommodations for international shoots and launches',
        'Private studio suite in Dubai Design District with full hybrid flexibility'
      ],
      skills: ['Creative Direction', 'Luxury Branding', 'Editorial Design', 'Art Direction'],
      applyType: 'email',
      applyEmail: 'talent@maisonlalisa.example.com',
      applyUrl: 'https://maisonlalisa.example.com/join',
      applyInstructions: 'Submit your curated portfolio deck with visionary statement.',
      deadline: 'Open until filled',
      isFeatured: true,
      isUrgent: false,
      badgeText: 'Featured Role',
      status: 'active'
    }
  },
  {
    name: 'Head of Mobile Product & Engineering',
    data: {
      title: 'Head of Mobile Product & Engineering',
      company: 'TipPulse Technologies',
      companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&auto=format&fit=crop&q=80',
      department: 'Product & Mobile Engineering',
      employmentType: 'Full-Time',
      workplaceType: 'Remote',
      location: 'San Francisco, CA / Remote Worldwide',
      salaryRange: '$150,000 - $195,000 / yr',
      experienceLevel: 'Lead / Head of Dept (6+ Years)',
      summary: 'Spearhead cross-platform mobile architecture, offline-first sync, and 120 FPS reader interactions.',
      description: 'Scale TipPulse mobile application to millions of readers worldwide with instant cold-start times and offline resilience.',
      responsibilities: [
        'Architect React + Capacitor Android/iOS cross-platform reader engine.',
        'Optimize offline-first cache layers between Firestore and local storage.',
        'Oversee monetization and Google Play / App Store release pipelines.'
      ],
      requirements: [
        '6+ years developing high-ranking consumer mobile applications.',
        'Deep mastery of modern JavaScript/TypeScript, React, and native plugins.',
        'Proven expertise in Android SDK, Gradle, and Play Console release lifecycle.'
      ],
      niceToHave: ['Experience with AdMob monetization mediation waterfalls'],
      benefits: [
        'Lucrative compensation with early-stage equity grants',
        '100% remote flexibility with modern Apple hardware provided',
        'Comprehensive healthcare and unlimited learning subscription budget'
      ],
      skills: ['Mobile Architecture', 'React & Capacitor', 'Android SDK', 'Offline Sync'],
      applyType: 'email',
      applyEmail: 'qaroo24@gmail.com',
      applyUrl: 'https://tippulse.web.app/careers',
      applyInstructions: 'Send CV and links to apps you have published on Google Play.',
      deadline: 'November 15, 2026',
      isFeatured: true,
      isUrgent: true,
      badgeText: 'Immediate Hiring',
      status: 'active'
    }
  },
  {
    name: 'Presidential Scholarship & Research Fellowship',
    data: {
      title: 'Global Presidential Scholarship & Research Fellowship',
      company: 'Vanguard Global Academic Foundation',
      companyLogo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=150&auto=format&fit=crop&q=80',
      department: 'Scholarships & Advanced Fellowships',
      employmentType: 'Endowed Fellowship',
      workplaceType: 'Remote & Global',
      location: 'Global Remote / Geneva & Cambridge',
      salaryRange: '$120,000 Fully Funded Grant / yr',
      experienceLevel: 'Graduate / Post-Doc / Distinguished Innovator',
      summary: 'Premier fully endowed 2026 scholarship and research fellowship supporting breakthrough developments in computational intelligence.',
      description: 'The Vanguard Global Academic Foundation is inviting applications for the 2026 Presidential Scholarship & Research Fellowship. Provides complete tuition, living stipends, compute clusters, and international symposium sponsorship.',
      responsibilities: [
        'Conduct innovative research in artificial intelligence and decentralized systems.',
        'Collaborate with international faculty and present findings at annual symposia.',
        'Publish open peer-reviewed papers and mentor emerging fellowship scholars.'
      ],
      requirements: [
        'Demonstrated academic excellence, published research, or outstanding open-source portfolio.',
        'Compelling research proposal for high-impact computing or ethical technology.',
        'Fluency in modern computing principles, mathematics, or computational science.'
      ],
      niceToHave: ['Prior recognition in international Olympiads, hackathons, or academic fellowships.'],
      benefits: [
        '$120,000 annual tax-advantaged living stipend & research grant',
        'Full coverage of international travel, accommodations, and academic conferences',
        'Dedicated access to top-tier GPU compute clusters and research labs'
      ],
      skills: ['Frontier AI', 'Research & Innovation', 'Grant Proposal', 'Computer Science'],
      applyType: 'email',
      applyEmail: 'fellowships@vanguardfoundation.example.com',
      applyUrl: 'https://vanguardfoundation.example.com/scholarships',
      applyInstructions: 'Submit your CV, research proposal (2 pages), and two reference letters.',
      deadline: 'December 15, 2026',
      isFeatured: true,
      isUrgent: false,
      badgeText: '100% Fully Funded Scholarship',
      status: 'active'
    }
  }
];

export default function JobsManager() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All'); // 'All' | 'active' | 'closed'
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [previewJob, setPreviewJob] = useState(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Form State
  const [currentJobId, setCurrentJobId] = useState(null);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');
  const [department, setDepartment] = useState('Engineering & Tech');
  const [employmentType, setEmploymentType] = useState('Full-Time');
  const [workplaceType, setWorkplaceType] = useState('Remote');
  const [location, setLocation] = useState('Worldwide Remote');
  const [salaryRange, setSalaryRange] = useState('$150,000 - $190,000 / yr');
  const [experienceLevel, setExperienceLevel] = useState('Senior / Lead (5+ Years)');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [responsibilitiesText, setResponsibilitiesText] = useState('');
  const [requirementsText, setRequirementsText] = useState('');
  const [niceToHaveText, setNiceToHaveText] = useState('');
  const [benefitsText, setBenefitsText] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [applyType, setApplyType] = useState('email');
  const [applyEmail, setApplyEmail] = useState('');
  const [applyUrl, setApplyUrl] = useState('');
  const [applyInstructions, setApplyInstructions] = useState('');
  const [deadline, setDeadline] = useState('Open until filled');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [badgeText, setBadgeText] = useState('VIP Executive Search');
  const [status, setStatus] = useState('active');

  // Real-time Firestore Subscription
  useEffect(() => {
    setIsLoading(true);
    try {
      const jobsRef = collection(db, JOBS_COLLECTION);
      const unsubscribe = onSnapshot(
        jobsRef,
        (snapshot) => {
          const items = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
          items.sort((a, b) => {
            if (a.isFeatured && !b.isFeatured) return -1;
            if (!a.isFeatured && b.isFeatured) return 1;
            return (b.createdAt || 0) - (a.createdAt || 0);
          });
          setJobs(items);
          setIsLoading(false);
        },
        (err) => {
          console.warn('Jobs listener error:', err);
          setIsLoading(false);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firestore subscription failed:', err);
      setIsLoading(false);
    }
  }, []);

  const openNewJobModal = () => {
    setCurrentJobId(null);
    setTitle('');
    setCompany('');
    setCompanyLogo('');
    setDepartment('Engineering & Artificial Intelligence');
    setEmploymentType('Full-Time');
    setWorkplaceType('Remote');
    setLocation('Worldwide Remote');
    setSalaryRange('$150,000 - $195,000 / yr');
    setExperienceLevel('Principal / Lead (7+ Years)');
    setSummary('');
    setDescription('');
    setResponsibilitiesText('');
    setRequirementsText('');
    setNiceToHaveText('');
    setBenefitsText('Comprehensive private executive healthcare & wellness\nTop-tier equity options and performance bonuses\nUnlimited flexible PTO with mandatory rest recharge\n$5,000 luxury workstation & ergonomic setup stipend');
    setSkillsText('Leadership, System Architecture, Innovation');
    setApplyType('email');
    setApplyEmail('careers@company.com');
    setApplyUrl('https://company.com/careers');
    setApplyInstructions('Submit CV, portfolio, and brief executive summary.');
    setDeadline('Open until filled');
    setIsFeatured(true);
    setIsUrgent(false);
    setBadgeText('VIP Executive Search');
    setStatus('active');
    setIsEditorOpen(true);
  };

  const loadTemplate = (tmpl) => {
    const d = tmpl.data;
    setCurrentJobId(null);
    setTitle(d.title);
    setCompany(d.company);
    setCompanyLogo(d.companyLogo);
    setDepartment(d.department);
    setEmploymentType(d.employmentType);
    setWorkplaceType(d.workplaceType);
    setLocation(d.location);
    setSalaryRange(d.salaryRange);
    setExperienceLevel(d.experienceLevel);
    setSummary(d.summary);
    setDescription(d.description);
    setResponsibilitiesText(d.responsibilities.join('\n'));
    setRequirementsText(d.requirements.join('\n'));
    setNiceToHaveText((d.niceToHave || []).join('\n'));
    setBenefitsText(d.benefits.join('\n'));
    setSkillsText(d.skills.join(', '));
    setApplyType(d.applyType);
    setApplyEmail(d.applyEmail);
    setApplyUrl(d.applyUrl);
    setApplyInstructions(d.applyInstructions);
    setDeadline(d.deadline);
    setIsFeatured(d.isFeatured);
    setIsUrgent(d.isUrgent);
    setBadgeText(d.badgeText);
    setStatus(d.status);
    setIsEditorOpen(true);
  };

  const editJob = (job) => {
    setCurrentJobId(job.id);
    setTitle(job.title || '');
    setCompany(job.company || '');
    setCompanyLogo(job.companyLogo || '');
    setDepartment(job.department || 'General');
    setEmploymentType(job.employmentType || 'Full-Time');
    setWorkplaceType(job.workplaceType || 'Remote');
    setLocation(job.location || 'Worldwide');
    setSalaryRange(job.salaryRange || '');
    setExperienceLevel(job.experienceLevel || '');
    setSummary(job.summary || '');
    setDescription(job.description || '');
    setResponsibilitiesText((job.responsibilities || []).join('\n'));
    setRequirementsText((job.requirements || []).join('\n'));
    setNiceToHaveText((job.niceToHave || []).join('\n'));
    setBenefitsText((job.benefits || []).join('\n'));
    setSkillsText((job.skills || []).join(', '));
    setApplyType(job.applyType || 'email');
    setApplyEmail(job.applyEmail || '');
    setApplyUrl(job.applyUrl || '');
    setApplyInstructions(job.applyInstructions || '');
    setDeadline(job.deadline || 'Open until filled');
    setIsFeatured(Boolean(job.isFeatured));
    setIsUrgent(Boolean(job.isUrgent));
    setBadgeText(job.badgeText || 'VIP Spotlight');
    setStatus(job.status || 'active');
    setIsEditorOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim() || !company.trim()) return;

    const parseLines = (txt) =>
      txt
        .split('\n')
        .map((l) => l.trim().replace(/^[-*•]\s*/, ''))
        .filter(Boolean);

    const parseSkills = (txt) =>
      txt
        .split(/[,|\n]/)
        .map((s) => s.trim())
        .filter(Boolean);

    const payload = {
      id: currentJobId || `job-${Date.now()}`,
      title: title.trim(),
      company: company.trim(),
      companyLogo: companyLogo.trim(),
      department: department.trim(),
      employmentType,
      workplaceType,
      location: location.trim(),
      salaryRange: salaryRange.trim(),
      experienceLevel: experienceLevel.trim(),
      summary: summary.trim(),
      description: description.trim(),
      responsibilities: parseLines(responsibilitiesText),
      requirements: parseLines(requirementsText),
      niceToHave: parseLines(niceToHaveText),
      benefits: parseLines(benefitsText),
      skills: parseSkills(skillsText),
      applyType,
      applyEmail: applyEmail.trim(),
      applyUrl: applyUrl.trim(),
      applyInstructions: applyInstructions.trim(),
      deadline: deadline.trim(),
      isFeatured,
      isUrgent,
      badgeText: badgeText.trim() || (isFeatured ? 'VIP Spotlight' : 'Executive Role'),
      status,
      createdAt: currentJobId ? (jobs.find((j) => j.id === currentJobId)?.createdAt || Date.now()) : Date.now(),
      updatedAt: Date.now()
    };

    try {
      const docRef = doc(db, JOBS_COLLECTION, payload.id);
      await setDoc(docRef, payload, { merge: true });
      setSaveSuccessMsg(`Vacancy "${payload.title}" saved successfully to Cloud Firestore!`);
      setTimeout(() => setSaveSuccessMsg(''), 3500);
      setIsEditorOpen(false);
    } catch (err) {
      console.error('Failed to save vacancy in Firestore:', err);
      alert('Could not save vacancy. Please check connection and permissions.');
    }
  };

  const handleDelete = async (jobId, jobTitle) => {
    if (window.confirm(`Are you sure you want to delete "${jobTitle}" permanently?`)) {
      try {
        const docRef = doc(db, JOBS_COLLECTION, String(jobId));
        await deleteDoc(docRef);
      } catch (err) {
        console.error('Failed to delete vacancy:', err);
      }
    }
  };

  const handleToggleStatus = async (job) => {
    const nextStatus = job.status === 'active' ? 'closed' : 'active';
    try {
      const docRef = doc(db, JOBS_COLLECTION, String(job.id));
      await setDoc(docRef, { status: nextStatus, updatedAt: Date.now() }, { merge: true });
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      if (filterStatus !== 'All' && j.status !== filterStatus) return false;
      if (filterDept !== 'All' && !j.department?.toLowerCase().includes(filterDept.toLowerCase())) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = j.title?.toLowerCase().includes(q);
        const matchesCompany = j.company?.toLowerCase().includes(q);
        const matchesDept = j.department?.toLowerCase().includes(q);
        const matchesSkills = j.skills?.some((s) => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCompany && !matchesDept && !matchesSkills) return false;
      }
      return true;
    });
  }, [jobs, filterStatus, filterDept, searchQuery]);

  // Unique departments for filter
  const departments = useMemo(() => {
    const set = new Set();
    jobs.forEach((j) => {
      if (j.department) set.add(j.department.split('&')[0].trim());
    });
    return ['All', ...Array.from(set)];
  }, [jobs]);

  const activeCount = jobs.filter((j) => j.status === 'active').length;
  const vipCount = jobs.filter((j) => j.isFeatured).length;
  const remoteCount = jobs.filter((j) => (j.workplaceType || '').toLowerCase().includes('remote')).length;

  return (
    <div className="space-y-6">
      {/* Luxury Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/40 p-6 sm:p-8 shadow-2xl text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>Executive Careers Atelier</span>
              </span>
              <span className="text-xs text-slate-400">Direct Cloud Firestore Publishing</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Job Vacancies & Scholarship Opportunities
            </h2>
            <p className="text-xs sm:text-sm text-slate-300/80 max-w-xl mt-1">
              Publish and curate high-caliber vacancies and prestigious scholarship endowments with bespoke compensation badges, verified recruiter statuses, and luxury mobile presentations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Template Menu */}
            <div className="relative group">
              <button
                type="button"
                className="px-3.5 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 font-bold text-xs border border-amber-500/30 flex items-center space-x-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>⚡ Load Template</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <div className="absolute right-0 mt-1 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-1.5 hidden group-hover:block z-30 animate-in fade-in">
                {JOB_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => loadTemplate(tmpl)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:text-white hover:bg-indigo-600 transition-colors font-medium truncate block"
                  >
                    {tmpl.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={openNewJobModal}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create Vacancy</span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
          <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Vacancies</span>
            <span className="text-lg font-black text-white mt-0.5 block">{jobs.length}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Active Openings</span>
            <span className="text-lg font-black text-emerald-400 mt-0.5 block">{activeCount}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">VIP Spotlights</span>
            <span className="text-lg font-black text-amber-300 mt-0.5 block">{vipCount}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Remote Worldwide</span>
            <span className="text-lg font-black text-indigo-300 mt-0.5 block">{remoteCount}</span>
          </div>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by role, company, skills, or department..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-3 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === 'All' ? 'All Departments' : dept}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="closed">Closed Only</option>
          </select>
        </div>
      </div>

      {/* Vacancies Directory Grid / Cards */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            Connecting to Cloud Firestore vacancies...
          </div>
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className={`bg-slate-900/90 rounded-2xl border p-4 sm:p-5 transition-all hover:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                job.isFeatured
                  ? 'border-amber-500/30 ring-1 ring-amber-500/20'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center p-1 shrink-0 overflow-hidden">
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
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="text-xs font-bold text-amber-400">{job.company}</span>
                    <span className="text-slate-600 text-xs">&bull;</span>
                    <span className="text-xs text-slate-400 truncate">{job.department}</span>

                    {job.isFeatured && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
                        <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                        <span>{job.badgeText || 'VIP'}</span>
                      </span>
                    )}

                    {job.isUrgent && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center space-x-1">
                        <Flame className="w-2.5 h-2.5 text-rose-400" />
                        <span>Urgent</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug">
                    {job.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-2">
                    <span className="text-emerald-400 font-bold flex items-center">
                      <DollarSign className="w-3.5 h-3.5 mr-0.5" />
                      {job.salaryRange || 'Competitive'}
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{job.location || 'Remote'}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{job.employmentType || 'Full-Time'}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => handleToggleStatus(job)}
                  title={`Click to ${job.status === 'active' ? 'close' : 'activate'} role`}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-colors ${
                    job.status === 'active'
                      ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {job.status === 'active' ? 'Active' : 'Closed'}
                </button>

                <button
                  onClick={() => editJob(job)}
                  title="Edit Role"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(job.id, job.title)}
                  title="Delete Role"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-slate-900 rounded-3xl border border-slate-800 p-6 text-slate-400 text-xs">
            No vacancies matching the criteria. Click "Create Vacancy" to add a new role.
          </div>
        )}
      </div>

      {/* Luxury Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between sticky top-0 z-20">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white">
                    {currentJobId ? 'Edit Executive Vacancy' : 'Create Executive Vacancy'}
                  </h3>
                  <p className="text-[11px] text-slate-400">Direct Real-Time Firestore Sync</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-200">
              {/* Section 1: Core Identity */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-indigo-400 border-b border-slate-800 pb-1">
                  1. Organization & Role Identity
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Job Title *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Principal AI & Cloud Architect"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Company / Organization *</label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Apex Global Labs"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Company Logo URL (Optional)</label>
                    <input
                      type="url"
                      value={companyLogo}
                      onChange={(e) => setCompanyLogo(e.target.value)}
                      placeholder="https://.../logo.png"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Department / Practice Area</label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Artificial Intelligence & Cloud"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Compensation & Seniority */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-1">
                  2. Prestige & Compensation
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Target Compensation Range</label>
                    <input
                      type="text"
                      value={salaryRange}
                      onChange={(e) => setSalaryRange(e.target.value)}
                      placeholder="e.g. $175,000 - $225,000 / yr"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Experience Level</label>
                    <input
                      type="text"
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                      placeholder="e.g. Principal / Lead (8+ Years)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Custom VIP Badge</label>
                    <input
                      type="text"
                      value={badgeText}
                      onChange={(e) => setBadgeText(e.target.value)}
                      placeholder="e.g. VIP Spotlight"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Workplace Modality</label>
                    <select
                      value={workplaceType}
                      onChange={(e) => setWorkplaceType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="On-Site">On-Site</option>
                      <option value="Worldwide">Worldwide Anywhere</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Employment Type</label>
                    <select
                      value={employmentType}
                      onChange={(e) => setEmploymentType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Contract">Executive Contract</option>
                      <option value="Interim">Interim / Advisory</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Location Scope</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Dubai / London / Remote"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex items-center space-x-6 pt-2">
                  <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0"
                    />
                    <span className="font-bold text-amber-400 flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>VIP Spotlight Highlight (Golden Glow)</span>
                    </span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isUrgent}
                      onChange={(e) => setIsUrgent(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-rose-500 focus:ring-0"
                    />
                    <span className="font-bold text-rose-400 flex items-center space-x-1">
                      <Flame className="w-3.5 h-3.5" />
                      <span>Urgent Hiring Flag</span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Section 3: Narrative & Scope */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-1">
                  3. Executive Narrative & Scope
                </h4>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Executive Summary (Short Excerpt)</label>
                  <textarea
                    rows={2}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Punchy overview displayed on candidate cards..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Full Detailed Mission & Context</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Comprehensive description of the organization and role..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Key Responsibilities (One per line)
                    </label>
                    <textarea
                      rows={4}
                      value={responsibilitiesText}
                      onChange={(e) => setResponsibilitiesText(e.target.value)}
                      placeholder="Architect distributed systems...\nLead cross-functional engineering teams..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Requirements & Competencies (One per line)
                    </label>
                    <textarea
                      rows={4}
                      value={requirementsText}
                      onChange={(e) => setRequirementsText(e.target.value)}
                      placeholder="8+ years systems architecture...\nDemonstrated mastery in cloud pipelines..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Luxury Benefits & Perks (One per line)
                    </label>
                    <textarea
                      rows={3}
                      value={benefitsText}
                      onChange={(e) => setBenefitsText(e.target.value)}
                      placeholder="Top-tier equity options\nGlobal executive healthcare\nUnlimited flexible PTO..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Distinguishing Plus Factors (Nice to have)
                    </label>
                    <textarea
                      rows={3}
                      value={niceToHaveText}
                      onChange={(e) => setNiceToHaveText(e.target.value)}
                      placeholder="Open-source contributions...\nAdvanced degree in Computer Science..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Skills / Tech Stack Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={skillsText}
                    onChange={(e) => setSkillsText(e.target.value)}
                    placeholder="AI Systems, Distributed Architecture, Rust, Kubernetes"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Section 4: Application Logistics */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-sky-400 border-b border-slate-800 pb-1">
                  4. Candidacy Protocol & Application Logistics
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Application Method</label>
                    <select
                      value={applyType}
                      onChange={(e) => setApplyType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="email">Direct Talent Email</option>
                      <option value="url">External Career Portal Link</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Talent Email</label>
                    <input
                      type="email"
                      value={applyEmail}
                      onChange={(e) => setApplyEmail(e.target.value)}
                      placeholder="careers@apexlabs.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Application Portal URL</label>
                    <input
                      type="url"
                      value={applyUrl}
                      onChange={(e) => setApplyUrl(e.target.value)}
                      placeholder="https://.../apply"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Instructions for Applicants</label>
                    <input
                      type="text"
                      value={applyInstructions}
                      onChange={(e) => setApplyInstructions(e.target.value)}
                      placeholder="Submit portfolio and CV with subject line..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Deadline Date</label>
                    <input
                      type="text"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      placeholder="e.g. November 30, 2026 or Open until filled"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Vacancy Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full sm:w-48 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="active">Active (Visible in App)</option>
                    <option value="closed">Closed / Position Filled</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors font-bold text-xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Publish to Cloud Firestore</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
