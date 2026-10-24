import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  ChevronDown,
  ChevronUp,
  Upload,
  Camera,
  Image as ImageIcon,
  GraduationCap,
  Users,
  ArrowUp,
  ArrowDown,
  FileText,
  Check,
  Lock,
  Wifi,
  Bell
} from 'lucide-react';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseAdmin';

const JOBS_COLLECTION = 'job_vacancies';

const JOB_TEMPLATES = [
  {
    name: 'Bank of Oromia (9 Banking Vacancies)',
    data: {
      title: 'Bank of Oromia Multiple Banking Vacancies (9 Positions)',
      company: 'Bank of Oromia',
      companyLogo: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=150&auto=format&fit=crop&q=80',
      logoFit: 'contain',
      department: 'Banking & Retail Operations',
      employmentType: 'Full-Time',
      workplaceType: 'On-Site',
      location: 'Addis Ababa & Regional Branches',
      salaryRange: 'As per Bank\'s Salary Scale & Benefits',
      experienceLevel: 'All Levels (Fresh Graduates to Managers)',
      summary: 'Bank of Oromia invites qualified applicants for 9 diverse banking vacancies ranging from Fresh Graduate Customer Service to Technical & Branch Management positions.',
      description: 'Bank of Oromia is dedicated to providing modern, inclusive, and value-adding banking solutions. We invite qualified, competent, and motivated professionals to join our expanding branch and head office operations across Ethiopia.',
      responsibilities: [
        'Deliver exceptional banking services aligned with the Bank\'s customer-centric values.',
        'Ensure rigorous compliance with National Bank of Ethiopia and internal operating policies.',
        'Collaborate with team members to meet branch deposit mobilization and operational targets.'
      ],
      requirements: [
        'Demonstrated integrity, professional work ethic, and teamwork spirit.',
        'Communication fluency in Afan Oromo and Amharic is an advantageous asset.',
        'Valid National ID, digital Kebele ID, or Passport with clean background records.'
      ],
      niceToHave: ['Prior banking software or digital financial services familiarity.'],
      benefits: [
        'Attractive salary as per the Bank\'s competitive institutional scale',
        'Comprehensive medical insurance and provident fund benefits',
        'Continuous professional training and clear banking career promotion ladder'
      ],
      skills: ['Banking Operations', 'Customer Service', 'Fresh Graduate', 'Accounting', 'Branch Management'],
      applyType: 'url',
      applyEmail: 'recruitment@bankoforomia.com',
      applyUrl: 'https://bankoforomia.com.et/careers',
      applyInstructions: 'Interested applicants who fulfill the minimum requirements should submit their application letter, updated CV, and non-returnable copies of degree/diploma certificates.\n\n1. Online Application: Apply via the official career portal before October 20, 2026.\n2. In-Person: You may submit credentials to Bank of Oromia HR Directorate, Head Office, Addis Ababa.',
      showExpressApply: true,
      showApplyNow: true,
      expressApplyLabel: 'Express In-App Application',
      applyNowLabel: 'Apply on Bank Portal',
      deadline: 'October 20, 2026',
      isFeatured: true,
      isUrgent: true,
      badgeText: '9 Positions Available',
      status: 'active',
      positions: [
        {
          id: 'pos-1',
          title: 'Associate Branch Sales & Customer Service Officer',
          targetGroup: 'Fresh Graduates (0 Years)',
          education: 'BA Degree in Economics, Accounting, Management, Banking & Finance, Marketing, or related business fields (CGPA 2.75+)',
          experience: '0 Years (Fresh Graduates / 2026 Batch)',
          location: 'Addis Ababa & Outlying Branch Network',
          slots: '50+ Openings',
          duties: 'Account opening, front-desk customer service, deposit mobilization, cash transactions, and digital mobile banking onboarding.',
          isExpanded: true
        },
        {
          id: 'pos-2',
          title: 'Administrative Assistant',
          targetGroup: 'Experienced (2+ Years)',
          education: 'Diploma or BA in Secretarial Science, Office Administration, or Business Management',
          experience: '2 years relevant administrative or secretarial experience',
          location: 'Head Office, Addis Ababa',
          slots: '4 Openings',
          duties: 'Manage correspondence, schedule meetings, maintain official department archives, and coordinate office workflows.',
          isExpanded: false
        },
        {
          id: 'pos-3',
          title: 'Cleaners Attendant',
          targetGroup: 'Entry-Level (1 Year)',
          education: '10th / 12th Grade Complete',
          experience: '1 year experience in office cleaning or hospitality upkeep',
          location: 'Addis Ababa Branches',
          slots: '10 Openings',
          duties: 'Maintain spotless sanitation across banking halls, office suites, and executive customer conference areas.',
          isExpanded: false
        },
        {
          id: 'pos-4',
          title: 'Maintenance Technician',
          targetGroup: 'Experienced (2+ Years)',
          education: 'TVET Level IV or Diploma in Electricity, Plumbing, or Building Maintenance',
          experience: '2 years experience in building electrical and plumbing systems maintenance',
          location: 'Head Office & Branch Facilities',
          slots: '3 Openings',
          duties: 'Perform preventive and corrective maintenance on backup generators, electrical wiring, HVAC, and plumbing.',
          isExpanded: false
        },
        {
          id: 'pos-5',
          title: 'Auto Mechanic',
          targetGroup: 'Experienced (3+ Years)',
          education: 'TVET Level IV or Diploma in Automotive Technology / Auto Mechanics',
          experience: '3 years experience in vehicle diagnosis, preventive maintenance, and engine overhaul',
          location: 'Fleet Management Garage, Addis Ababa',
          slots: '2 Openings',
          duties: 'Service bank vehicle fleet, perform mechanical troubleshooting, inspect vehicle safety, and log repairs.',
          isExpanded: false
        },
        {
          id: 'pos-6',
          title: 'Senior Transport Officer',
          targetGroup: 'Experienced (4+ Years)',
          education: 'BA in Logistics, Supply Chain Management, Transport Management, or Automotive Engineering',
          experience: '4 years relevant fleet operations and vehicle dispatching experience',
          location: 'Head Office, Addis Ababa',
          slots: '1 Opening',
          duties: 'Oversee vehicle allocation, fuel consumption tracking, driver scheduling, and regulatory vehicle compliance.',
          isExpanded: false
        },
        {
          id: 'pos-7',
          title: 'Senior Administrative Assistant',
          targetGroup: 'Experienced (4+ Years)',
          education: 'BA Degree in Management, Office Administration, or Business Information Systems',
          experience: '4 years progressive executive administration experience',
          location: 'Executive Directorate, Addis Ababa',
          slots: '2 Openings',
          duties: 'High-level executive correspondence, document preparation, minute taking, and inter-departmental liaison.',
          isExpanded: false
        },
        {
          id: 'pos-8',
          title: 'Branch Manager',
          targetGroup: 'Senior / Manager (6+ Years)',
          education: 'Master\'s or BA Degree in Banking, Finance, Economics, or Business Administration',
          experience: '6+ years in banking operations with at least 2 years in supervisory or managerial capacity',
          location: 'Selected City & Outlying Branches',
          slots: 'Multiple Outlets',
          duties: 'Drive total branch profitability, oversee loan portfolio quality, staff leadership, and community banking expansion.',
          isExpanded: false
        },
        {
          id: 'pos-9',
          title: 'Principal Data Analyst',
          targetGroup: 'Senior / Lead (5+ Years)',
          education: 'BSc or MSc in Data Science, Computer Science, Statistics, or Information Systems',
          experience: '5 years experience with SQL, Python/R, PowerBI, and banking predictive data models',
          location: 'FinTech & Analytics Directorate, Addis Ababa',
          slots: '2 Openings',
          duties: 'Build customer segmentation models, credit risk predictive analytics, and executive financial performance dashboards.',
          isExpanded: false
        }
      ]
    }
  },
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
  const [isEditorOpen, setIsEditorOpen] = useState(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      return p.get('create') === 'true' || p.get('newJob') === 'true';
    } catch {
      return false;
    }
  });
  const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);
  const [previewJob, setPreviewJob] = useState(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const [currentJobId, setCurrentJobId] = useState(null);
  const [slug, setSlug] = useState('');
  const [copiedSlugId, setCopiedSlugId] = useState(null);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');
  const [logoFit, setLogoFit] = useState('contain'); // 'contain' | 'cover'
  const [photos, setPhotos] = useState([]);
  const [photoFit, setPhotoFit] = useState('cover'); // 'cover' | 'contain'
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [cropModal, setCropModal] = useState({
    isOpen: false,
    target: 'logo', // 'logo' | 'photo'
    photoIndex: null,
    rawSrc: '',
    mode: 'fit-contain', // 'fit-contain' | 'crop-square' | 'crop-16-9' | 'original'
    bgColor: '#ffffff',
    zoom: 1,
    offsetX: 0,
    offsetY: 0
  });
  const logoInputRef = useRef(null);
  const photosInputRef = useRef(null);
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
  const [showExpressApply, setShowExpressApply] = useState(true);
  const [showApplyNow, setShowApplyNow] = useState(true);
  const [expressApplyLabel, setExpressApplyLabel] = useState('Express In-App Application');
  const [applyNowLabel, setApplyNowLabel] = useState('Apply Now');
  const [deadline, setDeadline] = useState('Open until filled');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isScholarship, setIsScholarship] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [needsData, setNeedsData] = useState(false);
  const [broadcastNotification, setBroadcastNotification] = useState(true);
  const [badgeText, setBadgeText] = useState('VIP Executive Search');
  const [status, setStatus] = useState('active');
  const [positions, setPositions] = useState([]);
  const [isBatchPasteOpen, setIsBatchPasteOpen] = useState(false);
  const [batchPasteText, setBatchPasteText] = useState('');
  const modalBodyRef = useRef(null);

  // Auto-resize all textareas inside the editor modal so they fit as much content as needed
  const autoResizeTextarea = (el, minHeight = 90) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.max(minHeight, el.scrollHeight + 4)}px`;
  };

  useEffect(() => {
    if (!isEditorOpen || !modalBodyRef.current) return;
    const timer = setTimeout(() => {
      if (!modalBodyRef.current) return;
      const textareas = modalBodyRef.current.querySelectorAll('textarea[data-autoresize="true"]');
      textareas.forEach((ta) => {
        const minH = Number(ta.getAttribute('data-minheight')) || 110;
        autoResizeTextarea(ta, minH);
      });
    }, 20);
    return () => clearTimeout(timer);
  }, [
    isEditorOpen,
    summary,
    description,
    responsibilitiesText,
    requirementsText,
    niceToHaveText,
    benefitsText,
    skillsText,
    applyInstructions
  ]);

  // Smart Canvas Image Crop & Fit Processor
  const renderCroppedOrFittedDataUrl = (rawSrc, options = {}) => {
    const {
      mode = 'fit-contain', // 'fit-contain' | 'crop-square' | 'crop-16-9' | 'original'
      bgColor = '#ffffff',
      zoom = 1,
      offsetX = 0,
      offsetY = 0,
      target = 'logo'
    } = options;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onerror = reject;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (mode === 'original') {
          const maxDim = target === 'logo' ? 500 : 1000;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          canvas.width = w;
          canvas.height = h;
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
          return;
        }

        const outW = mode === 'crop-16-9' ? 960 : target === 'logo' ? 400 : 800;
        const outH = mode === 'crop-16-9' ? 540 : target === 'logo' ? 400 : mode === 'crop-square' ? 800 : 540;
        canvas.width = outW;
        canvas.height = outH;

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, outW, outH);

        const scaleContain = Math.min(outW / img.width, outH / img.height);
        const scaleCover = Math.max(outW / img.width, outH / img.height);
        const baseScale = mode === 'fit-contain' ? scaleContain * 0.92 : scaleCover;
        const finalScale = baseScale * Math.max(0.5, Number(zoom) || 1);

        const drawW = img.width * finalScale;
        const drawH = img.height * finalScale;

        const panX = (Number(offsetX) / 100) * (outW * 0.5);
        const panY = (Number(offsetY) / 100) * (outH * 0.5);

        const dx = (outW - drawW) / 2 + panX;
        const dy = (outH - drawH) / 2 + panY;

        ctx.drawImage(img, dx, dy, drawW, drawH);
        resolve(canvas.toDataURL('image/jpeg', 0.86));
      };
      img.src = rawSrc;
    });
  };

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLogo(true);
    try {
      const rawDataUrl = await readFileAsDataUrl(file);
      // Auto-fit logo cleanly first AND open interactive Crop/Fit dialog so admin can choose Fit vs Crop
      const autoFitted = await renderCroppedOrFittedDataUrl(rawDataUrl, {
        mode: 'fit-contain',
        bgColor: '#ffffff',
        zoom: 1,
        offsetX: 0,
        offsetY: 0,
        target: 'logo'
      });
      setCompanyLogo(autoFitted);
      setLogoFit('contain');
      setCropModal({
        isOpen: true,
        target: 'logo',
        photoIndex: null,
        rawSrc: rawDataUrl,
        mode: 'fit-contain',
        bgColor: '#ffffff',
        zoom: 1,
        offsetX: 0,
        offsetY: 0
      });
    } catch (err) {
      console.error('Error processing logo file:', err);
      alert('Could not process the selected image.');
    } finally {
      setIsUploadingLogo(false);
      if (e.target) e.target.value = '';
    }
  };

  const handlePhotosUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setIsUploadingPhotos(true);
    try {
      const rawList = await Promise.all(files.map((f) => readFileAsDataUrl(f)));
      const processedList = await Promise.all(
        rawList.map((raw) =>
          renderCroppedOrFittedDataUrl(raw, {
            mode: 'original',
            bgColor: '#0f172a',
            zoom: 1,
            offsetX: 0,
            offsetY: 0,
            target: 'photo'
          })
        )
      );
      const nextPhotos = [...photos, ...processedList].slice(0, 6);
      setPhotos(nextPhotos);

      // Open Crop & Fit studio for the newly uploaded photo so admin can choose Crop 16:9 vs Full Fit
      if (rawList.length > 0) {
        setCropModal({
          isOpen: true,
          target: 'photo',
          photoIndex: Math.min(photos.length, 5),
          rawSrc: rawList[0],
          mode: 'original',
          bgColor: '#0f172a',
          zoom: 1,
          offsetX: 0,
          offsetY: 0
        });
      }
    } catch (err) {
      console.error('Error uploading photos:', err);
      alert('Could not process one or more photo files.');
    } finally {
      setIsUploadingPhotos(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleApplyCropModal = async () => {
    if (!cropModal.rawSrc) {
      setCropModal((prev) => ({ ...prev, isOpen: false }));
      return;
    }
    try {
      const resultUrl = await renderCroppedOrFittedDataUrl(cropModal.rawSrc, {
        mode: cropModal.mode,
        bgColor: cropModal.bgColor,
        zoom: cropModal.zoom,
        offsetX: cropModal.offsetX,
        offsetY: cropModal.offsetY,
        target: cropModal.target
      });
      if (cropModal.target === 'logo') {
        setCompanyLogo(resultUrl);
        setLogoFit(cropModal.mode === 'crop-square' ? 'cover' : 'contain');
      } else {
        setPhotos((prev) => {
          const updated = [...prev];
          const idx = cropModal.photoIndex !== null && cropModal.photoIndex < updated.length ? cropModal.photoIndex : updated.length - 1;
          if (idx >= 0) updated[idx] = resultUrl;
          return updated;
        });
        setPhotoFit(cropModal.mode === 'fit-contain' || cropModal.mode === 'original' ? 'contain' : 'cover');
      }
    } catch (err) {
      console.warn('Could not apply custom crop:', err);
    }
    setCropModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleRemovePhoto = (idx) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  // Multi-Position Vacancy Helpers
  const handleAddPosition = () => {
    const newPos = {
      id: `pos-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: '',
      targetGroup: 'Fresh Graduates (0 Years)',
      education: '',
      experience: '',
      location: location || '',
      slots: '',
      duties: '',
      enableApply: true,
      applyUrl: '',
      applyEmail: '',
      applyNote: '',
      isExpanded: true
    };
    setPositions((prev) => [...prev, newPos]);
  };

  const handleUpdatePosition = (id, field, value) => {
    setPositions((prev) =>
      prev.map((pos) => (pos.id === id ? { ...pos, [field]: value } : pos))
    );
  };

  const handleRemovePosition = (id) => {
    setPositions((prev) => prev.filter((pos) => pos.id !== id));
  };

  const handleMovePosition = (idx, direction) => {
    setPositions((prev) => {
      const copy = [...prev];
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= copy.length) return prev;
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  const handleDuplicatePosition = (pos) => {
    const duplicated = {
      ...pos,
      id: `pos-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: `${pos.title || 'Position'} (Copy)`,
      isExpanded: true
    };
    setPositions((prev) => {
      const idx = prev.findIndex((p) => p.id === pos.id);
      if (idx === -1) return [...prev, duplicated];
      const copy = [...prev];
      copy.splice(idx + 1, 0, duplicated);
      return copy;
    });
  };

  const handleTogglePositionExpand = (id) => {
    setPositions((prev) =>
      prev.map((pos) =>
        pos.id === id ? { ...pos, isExpanded: !pos.isExpanded } : pos
      )
    );
  };

  const handleToggleAllPositions = (expand) => {
    setPositions((prev) => prev.map((pos) => ({ ...pos, isExpanded: expand })));
  };

  const handleBatchImportPositions = () => {
    if (!batchPasteText.trim()) {
      setIsBatchPasteOpen(false);
      return;
    }

    const lines = batchPasteText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    const parsed = [];
    lines.forEach((line, idx) => {
      const cleanedLine = line.replace(/^\d+[\.\)\-:]\s*/, '').trim();
      if (!cleanedLine) return;

      if (cleanedLine.includes('|')) {
        const parts = cleanedLine.split('|').map((p) => p.trim());
        parsed.push({
          id: `pos-batch-${Date.now()}-${idx}`,
          title: parts[0] || `Position ${idx + 1}`,
          targetGroup: parts[1] || 'Open to All Candidates',
          education: parts[2] || '',
          experience: parts[3] || '',
          location: parts[4] || location || '',
          slots: parts[5] || '',
          duties: parts[6] || '',
          enableApply: true,
          applyUrl: '',
          applyEmail: '',
          applyNote: '',
          isExpanded: idx === 0
        });
      } else {
        parsed.push({
          id: `pos-batch-${Date.now()}-${idx}`,
          title: cleanedLine,
          targetGroup: 'Open to All Candidates',
          education: '',
          experience: '',
          location: location || '',
          slots: '',
          duties: '',
          enableApply: true,
          applyUrl: '',
          applyEmail: '',
          applyNote: '',
          isExpanded: idx === 0
        });
      }
    });

    if (parsed.length > 0) {
      setPositions((prev) => [...prev, ...parsed]);
    }
    setBatchPasteText('');
    setIsBatchPasteOpen(false);
  };

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
    setSlug('');
    setTitle('');
    setCompany('');
    setCompanyLogo('');
    setLogoFit('contain');
    setPhotos([]);
    setPhotoFit('cover');
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
    setShowExpressApply(true);
    setShowApplyNow(true);
    setExpressApplyLabel('Express In-App Application');
    setApplyNowLabel('Apply Now');
    setDeadline('Open until filled');
    setIsFeatured(true);
    setIsScholarship(false);
    setIsUrgent(false);
    setIsPremium(false);
    setNeedsData(false);
    setBroadcastNotification(true);
    setBadgeText('VIP Executive Search');
    setStatus('active');
    setPositions([]);
    setIsEditorOpen(true);
    setTimeout(() => {
      if (modalBodyRef.current) modalBodyRef.current.scrollTop = 0;
    }, 10);
  };

  const loadTemplate = (tmpl) => {
    const d = tmpl.data;
    setCurrentJobId(null);
    setSlug(d.slug || '');
    setTitle(d.title);
    setCompany(d.company);
    setCompanyLogo(d.companyLogo);
    setLogoFit(d.logoFit || 'contain');
    setPhotos(d.photos || []);
    setPhotoFit(d.photoFit || 'cover');
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
    setShowExpressApply(d.showExpressApply !== false);
    setShowApplyNow(d.showApplyNow !== false);
    setExpressApplyLabel(d.expressApplyLabel || 'Express In-App Application');
    setApplyNowLabel(d.applyNowLabel || 'Apply Now');
    setDeadline(d.deadline);
    setIsFeatured(d.isFeatured);
    setIsScholarship(Boolean(d.isScholarship));
    setIsUrgent(d.isUrgent);
    setIsPremium(Boolean(d.isPremium));
    setNeedsData(Boolean(d.needsData));
    setBroadcastNotification(true);
    setBadgeText(d.badgeText);
    setStatus(d.status);
    setPositions(
      Array.isArray(d.positions)
        ? d.positions.map((p, idx) => ({
            ...p,
            id: p.id || `pos-${Date.now()}-${idx}`,
            enableApply: p.enableApply !== false,
            applyUrl: p.applyUrl || '',
            applyEmail: p.applyEmail || '',
            applyNote: p.applyNote || '',
            isExpanded: idx === 0
          }))
        : []
    );
    setIsEditorOpen(true);
    setTimeout(() => {
      if (modalBodyRef.current) modalBodyRef.current.scrollTop = 0;
    }, 10);
  };

  const editJob = (job) => {
    setCurrentJobId(job.id);
    setSlug(job.slug || '');
    setTitle(job.title || '');
    setCompany(job.company || '');
    setCompanyLogo(job.companyLogo || '');
    setLogoFit(job.logoFit || 'contain');
    setPhotos(Array.isArray(job.photos) ? job.photos : []);
    setPhotoFit(job.photoFit || 'cover');
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
    setShowExpressApply(job.showExpressApply !== false);
    setShowApplyNow(job.showApplyNow !== false);
    setExpressApplyLabel(job.expressApplyLabel || 'Express In-App Application');
    setApplyNowLabel(job.applyNowLabel || 'Apply Now');
    setDeadline(job.deadline || 'Open until filled');
    setIsFeatured(Boolean(job.isFeatured));
    setIsScholarship(Boolean(job.isScholarship));
    setIsUrgent(Boolean(job.isUrgent));
    setIsPremium(Boolean(job.isPremium));
    setNeedsData(Boolean(job.needsData || job.requiresOnline));
    setBroadcastNotification(true);
    setBadgeText(job.badgeText || 'VIP Spotlight');
    setStatus(job.status || 'active');
    setPositions(
      Array.isArray(job.positions)
        ? job.positions.map((p, idx) => ({
            ...p,
            id: p.id || `pos-${Date.now()}-${idx}`,
            enableApply: p.enableApply !== false,
            applyUrl: p.applyUrl || '',
            applyEmail: p.applyEmail || '',
            applyNote: p.applyNote || '',
            isExpanded: false
          }))
        : []
    );
    setIsEditorOpen(true);
    setTimeout(() => {
      if (modalBodyRef.current) modalBodyRef.current.scrollTop = 0;
    }, 10);
  };

  const broadcastJobNotification = async (jobData, isUpdate = false) => {
    try {
      const notifId = `notif-job-${Date.now()}`;
      await setDoc(doc(db, 'notifications', notifId), {
        id: notifId,
        jobId: jobData.id,
        jobSlug: jobData.slug || jobData.id,
        isJobAlert: true,
        title: isUpdate ? `💼 Updated Vacancy: ${jobData.title}` : `🚀 New Job Vacancy: ${jobData.title}`,
        body: `${jobData.company} • ${jobData.location || 'Remote'} (${jobData.salaryRange || 'Competitive'}) — ${jobData.summary || 'Tap to view role details and apply.'}`,
        category: 'Job Vacancy',
        imageUrl: jobData.companyLogo || '/career-growth-icon-gold.png',
        createdAt: Date.now(),
        author: jobData.company || 'TipPulse Careers'
      });
    } catch (notifErr) {
      console.warn('Job notification broadcast warning:', notifErr);
    }
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

    const cleanSlug = (slug.trim() || title.trim())
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const payload = {
      id: currentJobId || `job-${Date.now()}`,
      slug: cleanSlug,
      title: title.trim(),
      company: company.trim(),
      companyLogo: companyLogo.trim(),
      logoFit: logoFit || 'contain',
      photos: Array.isArray(photos) ? photos : [],
      photoFit: photoFit || 'cover',
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
      showExpressApply: Boolean(showExpressApply),
      showApplyNow: Boolean(showApplyNow),
      expressApplyLabel: expressApplyLabel.trim() || 'Express In-App Application',
      applyNowLabel: applyNowLabel.trim() || 'Apply Now',
      deadline: deadline.trim(),
      isFeatured,
      isScholarship: Boolean(isScholarship),
      isUrgent,
      isPremium: Boolean(isPremium),
      needsData: Boolean(needsData),
      requiresOnline: Boolean(needsData),
      badgeText: badgeText.trim() || (isFeatured ? 'VIP Spotlight' : 'Executive Role'),
      status,
      positions: Array.isArray(positions)
        ? positions
            .filter((p) => p && (p.title || '').trim().length > 0)
            .map((p, idx) => ({
              id: p.id || `pos-${Date.now()}-${idx}`,
              title: (p.title || '').trim(),
              targetGroup: (p.targetGroup || '').trim(),
              education: (p.education || '').trim(),
              experience: (p.experience || '').trim(),
              location: (p.location || '').trim(),
              slots: (p.slots || '').trim(),
              duties: (p.duties || '').trim(),
              enableApply: p.enableApply !== false,
              applyUrl: (p.applyUrl || '').trim(),
              applyEmail: (p.applyEmail || '').trim(),
              applyNote: (p.applyNote || '').trim()
            }))
        : [],
      createdAt: currentJobId ? (jobs.find((j) => j.id === currentJobId)?.createdAt || Date.now()) : Date.now(),
      updatedAt: Date.now()
    };

    try {
      const docRef = doc(db, JOBS_COLLECTION, payload.id);
      await setDoc(docRef, payload, { merge: true });

      if (broadcastNotification) {
        await broadcastJobNotification(payload, Boolean(currentJobId));
      }

      setSaveSuccessMsg(
        broadcastNotification
          ? `Vacancy "${payload.title}" saved & Notification Alert broadcasted to all users!`
          : `Vacancy "${payload.title}" saved successfully to Cloud Firestore!`
      );
      setTimeout(() => setSaveSuccessMsg(''), 4000);
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
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsTemplateMenuOpen((prev) => !prev)}
                className="px-4 py-2.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-amber-500/40 flex items-center space-x-1.5 transition-all active:scale-95 shadow-md shadow-amber-500/10 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>⚡ Load Template</span>
                <ChevronDown className={`w-3.5 h-3.5 text-amber-400/80 transition-transform ${isTemplateMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isTemplateMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsTemplateMenuOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-40 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-2.5 py-1.5 border-b border-slate-800 mb-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                        Choose Executive Template
                      </span>
                    </div>
                    {JOB_TEMPLATES.map((tmpl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          loadTemplate(tmpl);
                          setIsTemplateMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-xl text-xs text-slate-200 hover:text-white hover:bg-indigo-600 transition-colors font-medium flex items-center justify-between group/item cursor-pointer"
                      >
                        <span className="truncate">{tmpl.name}</span>
                        <ArrowRight className="w-3 h-3 text-slate-500 group-hover/item:text-white shrink-0 ml-1.5" />
                      </button>
                    ))}
                  </div>
                </>
              )}
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

                    {job.isPremium && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/20 text-amber-300 border border-amber-500/40 flex items-center space-x-1">
                        <Lock className="w-2.5 h-2.5 text-amber-400" />
                        <span>PRO (Video Ad)</span>
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

                  {/* Shareable Deep Link & Direct Application Link */}
                  <div className="flex flex-wrap items-center gap-2 mt-2.5 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-amber-300">
                      <span className="text-slate-500 font-sans font-bold">🔗 Deep Link:</span>
                      <span className="select-all">https://tippulse.web.app/careers/{job.slug || (String(job.id) === 'job-synapse-neuro-ux' ? 'somethinglead' : job.id)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(`https://tippulse.web.app/careers/${job.slug || (String(job.id) === 'job-synapse-neuro-ux' ? 'somethinglead' : job.id)}`);
                        setCopiedSlugId(job.id);
                        setTimeout(() => setCopiedSlugId(null), 2500);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 text-[10px] font-bold flex items-center space-x-1 transition-all"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedSlugId === job.id ? 'Copied! ✓' : 'Copy'}</span>
                    </button>
                    {job.applyUrl && (
                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium flex items-center space-x-1 transition-all truncate max-w-[220px]"
                        title={job.applyUrl}
                      >
                        <ExternalLink className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span className="truncate">Portal: {job.applyUrl}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={async () => {
                    await broadcastJobNotification(job, false);
                    setSaveSuccessMsg(`Notification Alert sent to all users for "${job.title}"!`);
                    setTimeout(() => setSaveSuccessMsg(''), 3500);
                  }}
                  title="Send Push Notification Alert for this Job"
                  className="px-2.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden md:inline">Alert</span>
                </button>

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

      {/* Luxury Editor Modal: Guaranteed Centered, Never Cropped */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
          <form
            onSubmit={handleSave}
            style={{ height: '88vh', maxHeight: '880px', minHeight: '0px' }}
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full h-[88vh] max-h-[880px] min-h-0 flex flex-col shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Fixed Modal Header: Never Scrolls Away, Never Cropped */}
            <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0 z-30">
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

              <div className="flex items-center space-x-2.5">
                {/* In-Modal Template Quick Loader */}
                <select
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    if (!isNaN(idx) && JOB_TEMPLATES[idx]) {
                      loadTemplate(JOB_TEMPLATES[idx]);
                    }
                  }}
                  defaultValue=""
                  className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-amber-300 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer hidden sm:block"
                >
                  <option value="" disabled>⚡ Load Preset Template...</option>
                  {JOB_TEMPLATES.map((tmpl, idx) => (
                    <option key={idx} value={idx}>
                      {tmpl.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Form Body: Dedicated Scroll Container with min-h-0 so it scrolls cleanly */}
            <div
              ref={modalBodyRef}
              style={{ flex: '1 1 0%', minHeight: '0px', overflowY: 'auto' }}
              className="flex-1 min-h-0 overflow-y-auto p-6 sm:p-8 space-y-7 text-xs text-slate-200 overscroll-contain"
            >
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

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-slate-300 font-bold text-xs flex items-center space-x-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Department / Category</span>
                    </label>
                    <span className="text-[10px] text-amber-400 font-medium bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      Powers category tabs on candidate page
                    </span>
                  </div>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Artificial Intelligence, Brand Strategy, Product, Quantitative Finance"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                  />
                  {/* Quick Select Category Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap mt-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Quick Pick:</span>
                    {[
                      'Artificial Intelligence',
                      'Brand Strategy',
                      'Product',
                      'Quantitative Finance',
                      'Engineering & Tech',
                      'Scholarships & Fellowships',
                      'Executive Leadership'
                    ].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setDepartment(chip)}
                        className={`text-[10px] px-2 py-0.5 rounded-md border transition-all active:scale-95 ${
                          department.toLowerCase().includes(chip.toLowerCase())
                            ? 'bg-indigo-600 text-white border-indigo-500'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Company Logo / Brand Photo Upload Zone */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-slate-200 font-bold text-xs flex items-center space-x-1.5">
                      <Camera className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Company Logo / Brand Photo</span>
                    </label>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] text-slate-400 font-semibold">View Fit:</span>
                      <button
                        type="button"
                        onClick={() => setLogoFit('contain')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                          logoFit !== 'cover'
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        ✓ Fit Full Logo (No Cut)
                      </button>
                      <button
                        type="button"
                        onClick={() => setLogoFit('cover')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                          logoFit === 'cover'
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        Crop to Fill (1:1)
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
                    {/* Visual Avatar Preview (Exact 64x64 Badge Preview) */}
                    <div
                      style={{ width: '64px', height: '64px', minWidth: '64px', minHeight: '64px' }}
                      className="w-16 h-16 rounded-2xl bg-white border-2 border-slate-700 p-1 flex items-center justify-center overflow-hidden shrink-0 relative group shadow-sm"
                    >
                      {companyLogo ? (
                        <>
                          <img
                            src={companyLogo}
                            alt="Logo preview"
                            className={`w-full h-full ${logoFit === 'cover' ? 'object-cover' : 'object-contain'} rounded-xl`}
                          />
                          <button
                            type="button"
                            onClick={() => setCompanyLogo('')}
                            title="Remove Photo"
                            className="absolute inset-0 bg-slate-950/80 text-rose-400 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold"
                          >
                            <Trash2 className="w-4 h-4 mb-0.5" />
                            <span>Remove</span>
                          </button>
                        </>
                      ) : (
                        <Building2 className="w-7 h-7 text-slate-400" />
                      )}
                    </div>

                    {/* Action Buttons & Fallback URL */}
                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          ref={logoInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoUpload}
                        />
                        <button
                          type="button"
                          onClick={() => logoInputRef.current?.click()}
                          disabled={isUploadingLogo}
                          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-indigo-600/20 cursor-pointer disabled:opacity-50"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isUploadingLogo ? 'Processing...' : companyLogo ? 'Change Photo' : 'Upload Logo / Photo'}</span>
                        </button>

                        {companyLogo && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                setCropModal({
                                  isOpen: true,
                                  target: 'logo',
                                  photoIndex: null,
                                  rawSrc: companyLogo,
                                  mode: logoFit === 'cover' ? 'crop-square' : 'fit-contain',
                                  bgColor: '#ffffff',
                                  zoom: 1,
                                  offsetX: 0,
                                  offsetY: 0
                                })
                              }
                              className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Crop / Fit for View</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setCompanyLogo('')}
                              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                            >
                              Clear Photo
                            </button>
                          </>
                        )}
                      </div>

                      <div>
                        <input
                          type="url"
                          value={companyLogo.startsWith('data:') ? '' : companyLogo}
                          onChange={(e) => setCompanyLogo(e.target.value)}
                          placeholder={companyLogo.startsWith('data:') ? '✓ Photo uploaded & fitted for view' : 'Or paste direct image URL (https://...)'}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px] placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Workplace & Vacancy Showcase Photos */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h5 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center space-x-1.5">
                        <Camera className="w-3.5 h-3.5 text-amber-400" />
                        <span>Workplace & Vacancy Showcase Photos (Optional)</span>
                      </h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Upload office atmosphere, campus, or full vacancy flyer pictures to showcase on the candidate view.
                      </p>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] text-slate-400 font-semibold">Gallery Fit:</span>
                      <button
                        type="button"
                        onClick={() => setPhotoFit('contain')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                          photoFit === 'contain'
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        Full Flyer Fit (No Cut)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhotoFit('cover')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                          photoFit !== 'contain'
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        16:9 Card Crop
                      </button>
                      <span className="text-[10px] text-slate-500 font-bold shrink-0 ml-1">{photos.length}/6</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {photos.map((photoUrl, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-700 group shadow-xs"
                      >
                        <img
                          src={photoUrl}
                          alt={`Showcase ${idx + 1}`}
                          className={`w-full h-full ${photoFit === 'contain' ? 'object-contain' : 'object-cover'}`}
                        />
                        <div className="absolute inset-0 bg-slate-950/75 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() =>
                              setCropModal({
                                isOpen: true,
                                target: 'photo',
                                photoIndex: idx,
                                rawSrc: photoUrl,
                                mode: photoFit === 'contain' ? 'original' : 'crop-16-9',
                                bgColor: '#0f172a',
                                zoom: 1,
                                offsetX: 0,
                                offsetY: 0
                              })
                            }
                            className="px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-extrabold transition-colors cursor-pointer"
                            title="Crop or Fit Photo"
                          >
                            Crop / Fit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(idx)}
                            className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
                            title="Remove Photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-slate-950/80 text-[9px] font-bold text-slate-300 pointer-events-none">
                          Photo {idx + 1}
                        </span>
                      </div>
                    ))}

                    {photos.length < 6 && (
                      <>
                        <input
                          ref={photosInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handlePhotosUpload}
                        />
                        <button
                          type="button"
                          onClick={() => photosInputRef.current?.click()}
                          disabled={isUploadingPhotos}
                          className="aspect-video rounded-xl border-2 border-dashed border-slate-700 hover:border-indigo-500 hover:bg-indigo-950/20 text-slate-400 hover:text-indigo-300 flex flex-col items-center justify-center transition-all cursor-pointer p-2 disabled:opacity-50"
                        >
                          <Upload className="w-5 h-5 mb-1" />
                          <span className="text-[11px] font-bold">
                            {isUploadingPhotos ? 'Processing...' : '+ Upload Photos'}
                          </span>
                          <span className="text-[9px] text-slate-500">Auto Crop / Fit</span>
                        </button>
                      </>
                    )}
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <label className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer select-none hover:border-amber-500/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0"
                    />
                    <div>
                      <span className="font-bold text-xs text-amber-400 flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>VIP Spotlight</span>
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Powers "VIP Spotlight Only" filter pill</p>
                    </div>
                  </label>

                  <label className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer select-none hover:border-amber-500/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={isScholarship}
                      onChange={(e) => setIsScholarship(e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0"
                    />
                    <div>
                      <span className="font-bold text-xs text-amber-400 flex items-center space-x-1">
                        <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                        <span>Scholarship / Grant</span>
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Powers "Scholarships & Grants" filter pill</p>
                    </div>
                  </label>

                  <label className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer select-none hover:border-rose-500/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={isUrgent}
                      onChange={(e) => setIsUrgent(e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 bg-slate-950 text-rose-500 focus:ring-0"
                    />
                    <div>
                      <span className="font-bold text-xs text-rose-400 flex items-center space-x-1">
                        <Flame className="w-3.5 h-3.5" />
                        <span>Urgent Hiring Flag</span>
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Highlights opportunity with priority flame</p>
                    </div>
                  </label>
                </div>

                {/* Options: Lock as PRO Job (Video Ad), Require Internet Data, Send Notification Alert */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <label className="flex items-center space-x-2.5 cursor-pointer select-none p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={isPremium}
                      onChange={(e) => setIsPremium(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-0"
                    />
                    <span className="text-slate-200 flex items-center space-x-1.5 font-semibold">
                      <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Lock as PRO Job (Video Ad)</span>
                    </span>
                  </label>

                  <label className="flex items-center space-x-2.5 cursor-pointer select-none p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-blue-500/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={needsData}
                      onChange={(e) => setNeedsData(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-0"
                    />
                    <span className="text-slate-200 flex items-center space-x-1.5 font-semibold">
                      <Wifi className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>Require Internet Data</span>
                    </span>
                  </label>

                  <label className="flex items-center space-x-2.5 cursor-pointer select-none p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={broadcastNotification}
                      onChange={(e) => setBroadcastNotification(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-0"
                    />
                    <span className="text-indigo-300 font-bold flex items-center space-x-1.5">
                      <Bell className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>Send Notification Alert</span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Section 3: Multi-Position Vacancy Breakdown */}
              <div className="space-y-4 p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/25">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-indigo-500/20">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center space-x-2">
                      <Users className="w-4 h-4 text-indigo-400" />
                      <span>3. Multi-Position Vacancy Breakdown (Optional)</span>
                      {positions.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-extrabold text-[10px]">
                          {positions.length} {positions.length === 1 ? 'Position' : 'Positions'}
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Use this for announcements with multiple job roles (e.g. Bank of Oromia 9-role recruitment flyer). Each role gets an interactive accordion item with dedicated qualifications, experience, location, and apply button.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {positions.length > 0 && (
                      <div className="flex items-center space-x-1 mr-1">
                        <button
                          type="button"
                          onClick={() => handleToggleAllPositions(true)}
                          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          Expand All
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleAllPositions(false)}
                          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          Collapse All
                        </button>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setIsBatchPasteOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 font-extrabold text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                      title="Quickly import multiple position titles by pasting a list"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>⚡ Batch Paste List</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAddPosition}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Position</span>
                    </button>
                  </div>
                </div>

                {/* Positions List */}
                {positions.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-2">
                    <p className="text-xs text-slate-400">
                      This vacancy is currently configured as a single role. If this advertisement has multiple job openings (e.g. Trainees, Officers, Managers, Attendants), click <strong className="text-indigo-400">+ Add Position</strong> or <strong className="text-amber-300">⚡ Batch Paste List</strong>.
                    </p>
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleAddPosition}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add First Position</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsBatchPasteOpen(true)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Batch Paste Titles</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {positions.map((pos, idx) => (
                      <div
                        key={pos.id || idx}
                        className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden transition-all shadow-xs"
                      >
                        {/* Position Card Header */}
                        <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-2">
                          <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                            <span className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 font-black text-xs flex items-center justify-center shrink-0">
                              #{idx + 1}
                            </span>
                            <div className="min-w-0 flex-1 flex items-center space-x-2">
                              <span className="font-extrabold text-white text-xs sm:text-sm truncate">
                                {pos.title || `Position #${idx + 1} (Untitled)`}
                              </span>
                              {pos.targetGroup && (
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 hidden sm:inline-block ${
                                  pos.targetGroup.toLowerCase().includes('fresh') || pos.targetGroup.toLowerCase().includes('0 year')
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                }`}>
                                  {pos.targetGroup}
                                </span>
                              )}
                              {pos.slots && (
                                <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-semibold shrink-0 hidden md:inline-block">
                                  {pos.slots}
                                </span>
                              )}
                              {pos.enableApply === false && (
                                <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold shrink-0">
                                  Apply Button Removed
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center space-x-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleMovePosition(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMovePosition(idx, 'down')}
                              disabled={idx === positions.length - 1}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDuplicatePosition(pos)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors"
                              title="Duplicate Position"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemovePosition(pos.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                              title="Delete Position"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTogglePositionExpand(pos.id)}
                              className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-950/40 transition-colors"
                              title={pos.isExpanded ? 'Collapse' : 'Expand'}
                            >
                              {pos.isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Position Card Form (Expandable) */}
                        {pos.isExpanded && (
                          <div className="p-5 sm:p-6 space-y-5 bg-slate-950/95 border-t border-slate-800/80">
                            {/* Row 1: Title & Target Group */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-slate-200 font-extrabold text-xs mb-1.5 flex items-center justify-between">
                                  <span>Position Title *</span>
                                  <span className="text-[10px] text-indigo-400 font-normal">Official designation</span>
                                </label>
                                <input
                                  type="text"
                                  value={pos.title}
                                  onChange={(e) => handleUpdatePosition(pos.id, 'title', e.target.value)}
                                  placeholder="e.g. Associate Branch Sales & Customer Service Officer"
                                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm font-semibold"
                                />
                              </div>

                              <div>
                                <label className="block text-slate-200 font-extrabold text-xs mb-1.5 flex items-center justify-between">
                                  <span>Applicant Category / Seniority Badge</span>
                                  <span className="text-[10px] text-amber-400 font-normal">Card badge</span>
                                </label>
                                <input
                                  type="text"
                                  value={pos.targetGroup}
                                  onChange={(e) => handleUpdatePosition(pos.id, 'targetGroup', e.target.value)}
                                  placeholder="e.g. Fresh Graduates (0 Years) or Experienced (2+ Years)"
                                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                                />
                                <div className="flex items-center gap-1.5 flex-wrap mt-2">
                                  {[
                                    'Fresh Graduates (0 Years)',
                                    'Entry-Level (1 Year)',
                                    'Experienced (2+ Years)',
                                    'Senior / Lead (5+ Years)',
                                    'Open to All'
                                  ].map((chip) => (
                                    <button
                                      key={chip}
                                      type="button"
                                      onClick={() => handleUpdatePosition(pos.id, 'targetGroup', chip)}
                                      className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                                        pos.targetGroup === chip
                                          ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                                      }`}
                                    >
                                      {chip}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Row 2: Education / CGPA & Experience (Spacious Multi-line Textareas) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="block text-slate-200 font-extrabold text-xs flex items-center justify-between">
                                  <span>Educational Qualification & CGPA</span>
                                  <span className="text-[10px] text-emerald-400 font-normal">Spacious multi-line</span>
                                </label>
                                <textarea
                                  rows={3}
                                  value={pos.education}
                                  onChange={(e) => {
                                    handleUpdatePosition(pos.id, 'education', e.target.value);
                                    autoResizeTextarea(e.currentTarget, 85);
                                  }}
                                  placeholder="e.g. BA in Economics, Accounting, Management, Banking & Finance with CGPA of 2.75 and above for Male and 2.5 and above for Female candidates..."
                                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm leading-relaxed min-h-[85px] resize-y"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="block text-slate-200 font-extrabold text-xs flex items-center justify-between">
                                  <span>Experience Requirement</span>
                                  <span className="text-[10px] text-emerald-400 font-normal">Spacious multi-line</span>
                                </label>
                                <textarea
                                  rows={3}
                                  value={pos.experience}
                                  onChange={(e) => {
                                    handleUpdatePosition(pos.id, 'experience', e.target.value);
                                    autoResizeTextarea(e.currentTarget, 85);
                                  }}
                                  placeholder="e.g. 0 Years (Fresh Graduates / 2026 Batch) OR 2+ years direct experience in commercial banking operations..."
                                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm leading-relaxed min-h-[85px] resize-y"
                                />
                              </div>
                            </div>

                            {/* Row 3: Duty Station & Headcount */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-slate-200 font-extrabold text-xs mb-1.5">
                                  Duty Station / Location
                                </label>
                                <input
                                  type="text"
                                  value={pos.location}
                                  onChange={(e) => handleUpdatePosition(pos.id, 'location', e.target.value)}
                                  placeholder="e.g. Addis Ababa & Outlying Branches"
                                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                                />
                              </div>

                              <div>
                                <label className="block text-slate-200 font-extrabold text-xs mb-1.5">
                                  Available Openings / Headcount
                                </label>
                                <input
                                  type="text"
                                  value={pos.slots}
                                  onChange={(e) => handleUpdatePosition(pos.id, 'slots', e.target.value)}
                                  placeholder="e.g. 50+ Openings or 2 Vacancies"
                                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm font-semibold"
                                />
                              </div>
                            </div>

                            {/* Row 4: Duties / Key Details (Extra Large Writing Area) */}
                            <div className="space-y-1.5 pt-1">
                              <label className="block text-slate-200 font-extrabold text-xs flex items-center justify-between">
                                <span>Key Duties & Specific Requirements (Optional)</span>
                                <span className="text-[10px] text-amber-300 font-normal">Large writing area &bull; Press Enter for new lines</span>
                              </label>
                              <textarea
                                rows={5}
                                value={pos.duties}
                                onChange={(e) => {
                                  handleUpdatePosition(pos.id, 'duties', e.target.value);
                                  autoResizeTextarea(e.currentTarget, 130);
                                }}
                                placeholder="Describe specific responsibilities, age limits, driving license grade, examination notes, or any special instructions for this role...&#10;&#10;• Provide customer service across cash counters and accounts&#10;• Cross-sell digital banking services and mobile applications&#10;• Ensure compliance with operational procedures"
                                className="w-full px-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm leading-relaxed min-h-[130px] resize-y"
                              />
                            </div>

                            {/* Row 5: Position Application Controls ("Add or Remove Apply for each position") */}
                            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center space-x-2.5 min-w-0">
                                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                    pos.enableApply !== false
                                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                  }`}>
                                    <Send className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-xs font-black text-white">
                                        &ldquo;Apply for Position #{idx + 1}&rdquo; Button
                                      </span>
                                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                                        pos.enableApply !== false
                                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                      }`}>
                                        {pos.enableApply !== false ? 'Active in Reader' : 'Removed / Hidden'}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400">
                                      {pos.enableApply !== false
                                        ? 'Candidates can tap "Apply for Position" in the app to send their application.'
                                        : 'The Apply button is hidden for this role (e.g. for walk-in or offline-only jobs).'}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-2 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdatePosition(pos.id, 'enableApply', pos.enableApply === false)}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs ${
                                      pos.enableApply !== false
                                        ? 'bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30'
                                        : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-900/40'
                                    }`}
                                  >
                                    {pos.enableApply !== false ? (
                                      <>
                                        <X className="w-3.5 h-3.5" />
                                        <span>Remove Apply Button</span>
                                      </>
                                    ) : (
                                      <>
                                        <Check className="w-3.5 h-3.5" />
                                        <span>Add Apply Button</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>

                              {pos.enableApply !== false ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2.5 border-t border-slate-800">
                                  <div>
                                    <label className="block text-slate-300 font-bold text-xs mb-1 flex items-center space-x-1.5">
                                      <ExternalLink className="w-3 h-3 text-indigo-400" />
                                      <span>Custom Apply Link for Position #{idx + 1} (Optional)</span>
                                    </label>
                                    <input
                                      type="url"
                                      value={pos.applyUrl || ''}
                                      onChange={(e) => handleUpdatePosition(pos.id, 'applyUrl', e.target.value)}
                                      placeholder="Leave blank to use main vacancy link"
                                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                                      If provided, &ldquo;Open Portal&rdquo; on Position #{idx + 1} opens this specific link.
                                    </span>
                                  </div>

                                  <div>
                                    <label className="block text-slate-300 font-bold text-xs mb-1 flex items-center space-x-1.5">
                                      <Mail className="w-3 h-3 text-indigo-400" />
                                      <span>Custom Apply Email for Position #{idx + 1} (Optional)</span>
                                    </label>
                                    <input
                                      type="email"
                                      value={pos.applyEmail || ''}
                                      onChange={(e) => handleUpdatePosition(pos.id, 'applyEmail', e.target.value)}
                                      placeholder="Leave blank to use main vacancy email"
                                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                                      If provided, applications for this role route directly to this address.
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs space-y-2 pt-2.5 border-t border-slate-800">
                                  <div className="flex items-center space-x-1.5 font-bold">
                                    <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
                                    <span>Apply button is removed for this position. Candidates will not see an Apply button here.</span>
                                  </div>
                                  <div>
                                    <label className="block text-slate-300 font-bold text-xs mb-1">
                                      Offline / Walk-In Instructions Note (Optional):
                                    </label>
                                    <input
                                      type="text"
                                      value={pos.applyNote || ''}
                                      onChange={(e) => handleUpdatePosition(pos.id, 'applyNote', e.target.value)}
                                      placeholder="e.g. In-person submission only / Walk-in at Head Office 3rd Floor"
                                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-rose-500/30 text-white text-xs focus:ring-2 focus:ring-rose-500"
                                    />
                                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                                      Shown to candidates in the app in place of the Apply button.
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 4: Narrative & Scope (All Auto-Expanding Textareas) */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>4. General Vacancy Overview & Scope</span>
                  </h4>
                  <span className="text-[11px] text-emerald-400 font-semibold">✓ All boxes auto-expand as much as needed</span>
                </div>

                <div>
                  <label className="block text-slate-200 font-bold mb-1.5 text-xs flex items-center justify-between">
                    <span>Executive Summary (Short Excerpt)</span>
                    <span className="text-[10px] text-slate-400 font-normal">Shown on candidate feed card &bull; Auto-expands</span>
                  </label>
                  <textarea
                    rows={3}
                    data-autoresize="true"
                    data-minheight="95"
                    value={summary}
                    onChange={(e) => {
                      setSummary(e.target.value);
                      autoResizeTextarea(e.currentTarget, 95);
                    }}
                    placeholder="Enter a punchy, high-impact overview displayed on candidate cards..."
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed min-h-[95px] resize-y"
                  />
                </div>

                <div>
                  <label className="block text-slate-200 font-bold mb-1.5 text-xs flex items-center justify-between">
                    <span>Full Detailed Mission & Context (Role Overview)</span>
                    <span className="text-[10px] text-slate-400 font-normal">Displayed in detail modal &bull; Auto-expands</span>
                  </label>
                  <textarea
                    rows={6}
                    data-autoresize="true"
                    data-minheight="170"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      autoResizeTextarea(e.currentTarget, 170);
                    }}
                    placeholder="Provide a comprehensive narrative of the organization, core strategic mission, executive mandate, team culture, and engineering philosophy..."
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed min-h-[170px] resize-y"
                  />
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-slate-200 font-bold mb-1.5 text-xs flex items-center justify-between">
                      <span>Key Responsibilities & Deliverables (One per line)</span>
                      <span className="text-[10px] text-indigo-400 font-normal">Bullet points &bull; Auto-expands as you type</span>
                    </label>
                    <textarea
                      rows={6}
                      data-autoresize="true"
                      data-minheight="160"
                      value={responsibilitiesText}
                      onChange={(e) => {
                        setResponsibilitiesText(e.target.value);
                        autoResizeTextarea(e.currentTarget, 160);
                      }}
                      placeholder="Architect distributed systems...\nLead cross-functional engineering teams...\nDrive sub-50ms inference milestones..."
                      className="w-full px-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm font-mono leading-relaxed min-h-[160px] resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-200 font-bold mb-1.5 text-xs flex items-center justify-between">
                      <span>Requirements, Qualifications & Competencies (One per line)</span>
                      <span className="text-[10px] text-amber-400 font-normal">Candidate criteria &bull; Auto-expands as you type</span>
                    </label>
                    <textarea
                      rows={6}
                      data-autoresize="true"
                      data-minheight="160"
                      value={requirementsText}
                      onChange={(e) => {
                        setRequirementsText(e.target.value);
                        autoResizeTextarea(e.currentTarget, 160);
                      }}
                      placeholder="8+ years systems architecture...\nDemonstrated mastery in cloud pipelines...\nStrong track record with Rust / Python..."
                      className="w-full px-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm font-mono leading-relaxed min-h-[160px] resize-y"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-200 font-bold mb-1.5 text-xs flex items-center justify-between">
                      <span>Luxury Benefits & Perks (One per line)</span>
                      <span className="text-[10px] text-emerald-400 font-normal">Executive package &bull; Auto-expands</span>
                    </label>
                    <textarea
                      rows={5}
                      data-autoresize="true"
                      data-minheight="140"
                      value={benefitsText}
                      onChange={(e) => {
                        setBenefitsText(e.target.value);
                        autoResizeTextarea(e.currentTarget, 140);
                      }}
                      placeholder="Top-tier equity options and performance bonuses\nGlobal private executive healthcare & wellness\nUnlimited flexible PTO with mandatory rest recharge\n$5,000 workstation & equipment stipend..."
                      className="w-full px-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm leading-relaxed min-h-[140px] resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-200 font-bold mb-1.5 text-xs flex items-center justify-between">
                      <span>Distinguishing Plus Factors (Nice to have)</span>
                      <span className="text-[10px] text-sky-400 font-normal">Bonus qualifiers &bull; Auto-expands</span>
                    </label>
                    <textarea
                      rows={5}
                      data-autoresize="true"
                      data-minheight="140"
                      value={niceToHaveText}
                      onChange={(e) => {
                        setNiceToHaveText(e.target.value);
                        autoResizeTextarea(e.currentTarget, 140);
                      }}
                      placeholder="Major open-source contributions...\nDoctorate or advanced degree in Computer Science...\nPublished patents or technical papers..."
                      className="w-full px-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm leading-relaxed min-h-[140px] resize-y"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-200 font-bold mb-1.5 text-xs flex items-center justify-between">
                    <span>Skills / Tech Stack Tags (Comma-separated)</span>
                    <span className="text-[10px] text-slate-400 font-normal">Tags for search &bull; Auto-expands</span>
                  </label>
                  <textarea
                    rows={2}
                    data-autoresize="true"
                    data-minheight="64"
                    value={skillsText}
                    onChange={(e) => {
                      setSkillsText(e.target.value);
                      autoResizeTextarea(e.currentTarget, 64);
                    }}
                    placeholder="AI Systems, Distributed Architecture, Rust, Kubernetes, Vector DB"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed min-h-[64px] resize-y"
                  />
                </div>
              </div>

              {/* Section 5: Application Logistics & Deep Links */}
              <div className="space-y-4">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-sky-400 border-b border-slate-800 pb-1 flex items-center justify-between">
                  <span>5. Application Links & Shareable Deep Link</span>
                  <span className="text-[10px] font-normal text-slate-400">Where candidates apply & shareable URLs</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      🌐 Official Application Portal Link (Website URL)
                    </label>
                    <input
                      type="url"
                      value={applyUrl}
                      onChange={(e) => setApplyUrl(e.target.value)}
                      placeholder="https://company.com/careers/apply"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Direct link opened when candidate taps "Apply Now".
                    </p>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      ✉️ Talent Recruiter Email
                    </label>
                    <input
                      type="email"
                      value={applyEmail}
                      onChange={(e) => setApplyEmail(e.target.value)}
                      placeholder="careers@apexlabs.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Recruiter inbox where candidate inquiries and applications are routed.
                    </p>
                  </div>
                </div>

                {/* Custom Deep Link Slug for Sharing */}
                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-amber-300 font-extrabold text-xs flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Custom Deep Link Slug (For Sharing)</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">e.g. somethinglead</span>
                  </div>

                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="e.g. somethinglead"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  />

                  {/* Live Share Link Preview */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 border-t border-indigo-900/40">
                    <div className="text-[11px] font-mono text-slate-300 truncate">
                      <span className="text-slate-400">Live Share Link: </span>
                      <strong className="text-amber-300 select-all">
                        https://tippulse.web.app/careers/{slug.trim() || (title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'somethinglead')}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const targetUrl = `https://tippulse.web.app/careers/${slug.trim() || (title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'somethinglead')}`;
                        navigator.clipboard.writeText(targetUrl);
                        alert('Deep link copied to clipboard:\n' + targetUrl);
                      }}
                      className="px-3 py-1 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shrink-0 flex items-center space-x-1 hover:bg-amber-300 transition-all"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy Share Link</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Application Method</label>
                    <select
                      value={applyType}
                      onChange={(e) => setApplyType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="url">External Career Portal Link</option>
                      <option value="email">Direct Talent Email</option>
                    </select>
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

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Vacancy Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="active">Active (Visible in App)</option>
                      <option value="closed">Closed / Position Filled</option>
                    </select>
                  </div>
                </div>

                {/* Full-Width Spacious Auto-Expanding Instructions for Applicants (How to Apply) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-indigo-500/30 space-y-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="text-slate-100 font-extrabold text-xs sm:text-sm flex items-center space-x-2">
                        <Send className="w-4 h-4 text-indigo-400" />
                        <span>Instructions for Applicants (How to Apply)</span>
                      </label>
                      <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/15 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                        ✓ Auto-expands to fit as much writing as needed
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Write complete step-by-step application instructions, required documents, registration places, or contact details. Supports multiple paragraphs and bullet points.
                    </p>
                    <textarea
                      rows={5}
                      data-autoresize="true"
                      data-minheight="150"
                      value={applyInstructions}
                      onChange={(e) => {
                        setApplyInstructions(e.target.value);
                        autoResizeTextarea(e.currentTarget, 150);
                      }}
                      placeholder="Interested applicants must attach all original and copy of their supporting documents, CV, and educational credentials...\n\n• Step 1: Prepare your updated CV and supporting certificates\n• Step 2: Submit online via the official portal or email before the deadline"
                      className="w-full px-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed min-h-[150px] resize-y"
                    />
                  </div>

                  {/* Add / Remove Application Action Buttons Control */}
                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-extrabold text-white block">
                          🔘 Application Action Buttons (Add or Remove as Needed)
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Choose which buttons appear under &ldquo;How to Apply&rdquo; (or remove both for in-person / written instructions only)
                        </span>
                      </div>

                      {/* Quick Presets */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setShowExpressApply(true);
                            setShowApplyNow(true);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                            showExpressApply && showApplyNow
                              ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                              : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                          }`}
                        >
                          Show Both
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowExpressApply(false);
                            setShowApplyNow(true);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                            !showExpressApply && showApplyNow
                              ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                              : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                          }`}
                        >
                          Only &ldquo;Apply Now&rdquo;
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowExpressApply(true);
                            setShowApplyNow(false);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                            showExpressApply && !showApplyNow
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                              : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                          }`}
                        >
                          Only &ldquo;Express In-App&rdquo;
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowExpressApply(false);
                            setShowApplyNow(false);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                            !showExpressApply && !showApplyNow
                              ? 'bg-rose-600/20 border-rose-500 text-rose-300'
                              : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                          }`}
                        >
                          Remove Both (Instructions Only)
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Card 1: Express In-App Application Button */}
                      <div
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                          showExpressApply
                            ? 'bg-slate-900/90 border-amber-500/40'
                            : 'bg-slate-900/30 border-slate-800 opacity-75'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 block">
                              1. In-App Form Button
                            </span>
                            <div
                              className={`inline-flex px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs items-center space-x-1.5 shadow-xs ${
                                !showExpressApply ? 'line-through opacity-40' : ''
                              }`}
                            >
                              <Send className="w-3 h-3 shrink-0" />
                              <span>{expressApplyLabel || 'Express In-App Application'}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setShowExpressApply((prev) => !prev)}
                            className={`px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center space-x-1 transition-all cursor-pointer shrink-0 ${
                              showExpressApply
                                ? 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30'
                                : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                            }`}
                          >
                            {showExpressApply ? (
                              <>
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add Button</span>
                              </>
                            )}
                          </button>
                        </div>

                        {showExpressApply ? (
                          <div>
                            <label className="text-[10px] text-slate-400 font-semibold block mb-1">
                              Button Label Text:
                            </label>
                            <input
                              type="text"
                              value={expressApplyLabel}
                              onChange={(e) => setExpressApplyLabel(e.target.value)}
                              placeholder="Express In-App Application"
                              className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                            />
                          </div>
                        ) : (
                          <p className="text-[11px] text-rose-400 font-semibold">
                            ✕ Removed from vacancy page (Click &ldquo;+ Add Button&rdquo; to restore)
                          </p>
                        )}
                      </div>

                      {/* Card 2: Apply Now Button */}
                      <div
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                          showApplyNow
                            ? 'bg-slate-900/90 border-indigo-500/40'
                            : 'bg-slate-900/30 border-slate-800 opacity-75'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 block">
                              2. Primary &ldquo;Apply Now&rdquo; Button
                            </span>
                            <div
                              className={`inline-flex px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs items-center space-x-1.5 shadow-xs ${
                                !showApplyNow ? 'line-through opacity-40' : ''
                              }`}
                            >
                              <Send className="w-3 h-3 shrink-0" />
                              <span>{applyNowLabel || 'Apply Now'}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setShowApplyNow((prev) => !prev)}
                            className={`px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center space-x-1 transition-all cursor-pointer shrink-0 ${
                              showApplyNow
                                ? 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30'
                                : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                            }`}
                          >
                            {showApplyNow ? (
                              <>
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add Button</span>
                              </>
                            )}
                          </button>
                        </div>

                        {showApplyNow ? (
                          <div>
                            <label className="text-[10px] text-slate-400 font-semibold block mb-1">
                              Button Label Text:
                            </label>
                            <input
                              type="text"
                              value={applyNowLabel}
                              onChange={(e) => setApplyNowLabel(e.target.value)}
                              placeholder="Apply Now"
                              className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-400"
                            />
                          </div>
                        ) : (
                          <p className="text-[11px] text-rose-400 font-semibold">
                            ✕ Removed from vacancy page (Click &ldquo;+ Add Button&rdquo; to restore)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Options: Premium PRO (Video Ad), Online Data Required, and Push Notification */}
                <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <label className="flex items-center space-x-2 cursor-pointer select-none p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={isPremium}
                      onChange={(e) => setIsPremium(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-0"
                    />
                    <span className="text-slate-300 flex items-center space-x-1.5 font-medium">
                      <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Lock as PRO Job (Video Ad)</span>
                    </span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer select-none p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={needsData}
                      onChange={(e) => setNeedsData(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-0"
                    />
                    <span className="text-slate-300 flex items-center space-x-1.5 font-medium">
                      <Wifi className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>Require Internet Data</span>
                    </span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer select-none p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={broadcastNotification}
                      onChange={(e) => setBroadcastNotification(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-0"
                    />
                    <span className="text-indigo-300 font-semibold flex items-center space-x-1.5">
                      <Bell className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>Send Notification Alert</span>
                    </span>
                  </label>
                </div>
              </div>

            </div>

            {/* Fixed Modal Footer: Pinned at Bottom, Always Visible & Never Cropped */}
            <div className="px-6 py-3.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between shrink-0 z-30">
              <div className="text-[11px] text-slate-400 hidden sm:flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>All vacancies sync instantly to mobile candidates.</span>
              </div>
              <div className="flex items-center space-x-3 ml-auto">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Publish to Cloud Firestore</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Interactive Photo Crop & Fit Studio Modal */}
      {cropModal.isOpen && (
        <div className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">
                    Photo Crop & Fit for View
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Choose how your uploaded photo should fit on candidate cards & detail view
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCropModal((prev) => ({ ...prev, isOpen: false }))}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Visual Preview Box */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div
                style={{
                  backgroundColor: cropModal.bgColor,
                  width: cropModal.target === 'logo' || cropModal.mode === 'crop-square' ? '160px' : '280px',
                  height: cropModal.target === 'logo' || cropModal.mode === 'crop-square' ? '160px' : '158px'
                }}
                className="rounded-2xl border-2 border-indigo-500/50 overflow-hidden flex items-center justify-center shadow-lg relative"
              >
                <img
                  src={cropModal.rawSrc}
                  alt="Crop preview"
                  style={{
                    transform: `translate(${cropModal.offsetX * 0.5}%, ${cropModal.offsetY * 0.5}%) scale(${cropModal.zoom})`,
                    objectFit:
                      cropModal.mode === 'fit-contain' || cropModal.mode === 'original'
                        ? 'contain'
                        : 'cover'
                  }}
                  className="w-full h-full transition-transform duration-75"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-2">
                Live Mobile View Preview ({cropModal.target === 'logo' ? '64x64 Brand Badge' : 'Candidate Showcase Card'})
              </span>
            </div>

            {/* Fit / Crop Preset Buttons */}
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-300">Select Fit or Crop Mode:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCropModal((prev) => ({ ...prev, mode: 'fit-contain', zoom: 1, offsetX: 0, offsetY: 0 }))}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    cropModal.mode === 'fit-contain'
                      ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-extrabold text-amber-300">✓ Fit Full Photo (No Cut)</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Shows 100% of logo or text without cutting edges</div>
                </button>

                <button
                  type="button"
                  onClick={() => setCropModal((prev) => ({ ...prev, mode: 'crop-square', zoom: 1, offsetX: 0, offsetY: 0 }))}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    cropModal.mode === 'crop-square'
                      ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-extrabold text-white">Auto-Crop Square (1:1)</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Fills entire square badge edge-to-edge</div>
                </button>

                {cropModal.target === 'photo' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setCropModal((prev) => ({ ...prev, mode: 'crop-16-9', zoom: 1, offsetX: 0, offsetY: 0 }))}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        cropModal.mode === 'crop-16-9'
                          ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-extrabold text-white">Auto-Crop Banner (16:9)</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Widescreen card crop</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCropModal((prev) => ({ ...prev, mode: 'original', zoom: 1, offsetX: 0, offsetY: 0 }))}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        cropModal.mode === 'original'
                          ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-extrabold text-white">Original Full Flyer</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Keeps full poster proportions</div>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Zoom & Position Fine-Tuning Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Zoom</span>
                  <span className="font-mono text-white">{Math.round(cropModal.zoom * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="2.4"
                  step="0.05"
                  value={cropModal.zoom}
                  onChange={(e) => setCropModal((prev) => ({ ...prev, zoom: Number(e.target.value) }))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Left / Right</span>
                  <span className="font-mono text-white">{cropModal.offsetX}%</span>
                </div>
                <input
                  type="range"
                  min="-80"
                  max="80"
                  step="2"
                  value={cropModal.offsetX}
                  onChange={(e) => setCropModal((prev) => ({ ...prev, offsetX: Number(e.target.value) }))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Up / Down</span>
                  <span className="font-mono text-white">{cropModal.offsetY}%</span>
                </div>
                <input
                  type="range"
                  min="-80"
                  max="80"
                  step="2"
                  value={cropModal.offsetY}
                  onChange={(e) => setCropModal((prev) => ({ ...prev, offsetY: Number(e.target.value) }))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Background Fill Color for Fit Mode */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-slate-400 font-semibold">Backdrop:</span>
                <button
                  type="button"
                  onClick={() => setCropModal((prev) => ({ ...prev, bgColor: '#ffffff' }))}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border cursor-pointer ${
                    cropModal.bgColor === '#ffffff'
                      ? 'bg-white text-slate-900 border-indigo-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  White Backdrop
                </button>
                <button
                  type="button"
                  onClick={() => setCropModal((prev) => ({ ...prev, bgColor: '#0f172a' }))}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border cursor-pointer ${
                    cropModal.bgColor === '#0f172a'
                      ? 'bg-indigo-600 text-white border-indigo-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  Dark Backdrop
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setCropModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Keep As Is
                </button>
                <button
                  type="button"
                  onClick={handleApplyCropModal}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 cursor-pointer"
                >
                  ✓ Apply & Fit Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Batch Import Positions Modal */}
      {isBatchPasteOpen && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">⚡ Batch Import Vacancy Positions</h4>
                  <p className="text-[11px] text-slate-400">Paste your list of roles to add them instantly</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBatchPasteOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                Paste Position Titles (One per line or pipe-delimited):
              </label>
              <textarea
                rows={8}
                value={batchPasteText}
                onChange={(e) => setBatchPasteText(e.target.value)}
                placeholder={"1. Associate Customer Service Officer\n2. Junior IT Support Specialist\n3. Senior Accountant\n4. Branch Manager\n\n-- OR with pipes --\nAssociate CSO | Fresh Graduates | BA in Economics | 0 Years | Addis Ababa | 50 Openings"}
                className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 leading-relaxed"
              />
              <p className="text-[10px] text-slate-400">
                Tip: Number prefixes like &ldquo;1.&rdquo; or &ldquo;2)&rdquo; are stripped automatically. You can edit full qualifications, CGPA, and duties for each role afterward.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsBatchPasteOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBatchImportPositions}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                ✓ Import All Positions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
