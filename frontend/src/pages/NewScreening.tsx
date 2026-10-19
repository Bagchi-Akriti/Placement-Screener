import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Sparkles,
  User,
  FileText,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { api } from '../services/api';
import type { Candidate, AssessmentResult } from '../types';
import AssessmentReport from '../components/AssessmentReport';

interface SampleJD {
  id: string;
  title: string;
  company: string;
  label: string;
  jdText: string;
}

const SAMPLE_JDS: SampleJD[] = [
  {
    id: 'tech-pm',
    label: 'Tech Product Manager (0-2 yrs, TechNova Solutions)',
    title: 'Associate Product Manager',
    company: 'TechNova Solutions',
    jdText: `Role: Associate Product Manager
Company: TechNova Solutions
Location: Bangalore

About the Role:
We are looking for an Associate Product Manager to join our product team. You will work closely with engineering, design, and business teams to define and deliver product features.

Responsibilities:
- Define product requirements and write PRDs
- Manage product backlog and sprint planning
- Analyze user data to inform product decisions
- Conduct user research and competitive analysis
- Collaborate with cross-functional teams
- Track product metrics and KPIs

Requirements:
- MBA or equivalent
- Strong analytical and problem-solving skills
- Proficiency in SQL and data analysis tools
- Experience with Agile/Scrum methodology
- Excellent communication and presentation skills
- Familiarity with wireframing tools

Preferred:
- Prior product management experience
- Technical background (B.Tech/B.E.)
- Experience with A/B testing
- Knowledge of Python or R

Experience: 0-2 years`,
  },
  {
    id: 'consultant',
    label: 'Management Consultant (0-3 yrs, 60% academics, Meridian Consulting)',
    title: 'Associate Consultant',
    company: 'Meridian Consulting Group',
    jdText: `Role: Associate Consultant
Company: Meridian Consulting Group
Location: Mumbai

About the Role:
Join our strategy consulting practice to work on high-impact business transformation projects across industries. You will conduct research, develop frameworks, and present recommendations to C-level executives.

Responsibilities:
- Conduct market research and competitive analysis
- Build financial models and business cases
- Develop strategic recommendations
- Prepare client presentations and deliverables
- Collaborate with senior partners on engagement delivery
- Manage project workstreams independently

Requirements:
- MBA from a premier institute
- Minimum 60% in Class 10, Class 12, and Graduation
- Strong structured problem-solving ability
- Advanced Excel and PowerPoint skills
- Excellent verbal and written communication
- Ability to work under pressure and meet deadlines

Preferred:
- Prior consulting or analytics experience
- Knowledge of industry verticals (BFSI, Healthcare, Technology)
- Familiarity with data visualization tools

Experience: 0-3 years`,
  },
  {
    id: 'marketing-mgr',
    label: 'Marketing Manager (2+ yrs exp, 60% min academics, ConsumerFirst)',
    title: 'Marketing Manager — Digital & Brand',
    company: 'ConsumerFirst Brands Pvt. Ltd.',
    jdText: `Role: Marketing Manager — Digital & Brand
Company: ConsumerFirst Brands Pvt. Ltd.
Location: Mumbai

About the Role:
We are seeking a Marketing Manager to lead our digital marketing and brand strategy initiatives. You will manage campaigns, analyze performance, and drive brand growth.

Responsibilities:
- Plan and execute digital marketing campaigns across channels
- Manage social media strategy and content calendar
- Analyze campaign performance using Google Analytics
- Coordinate with creative agencies and vendors
- Develop brand positioning and messaging
- Prepare marketing budgets and ROI reports

Requirements:
- MBA in Marketing
- Minimum 2 years of experience in marketing or advertising
- Proficiency in Google Analytics, social media tools
- Strong project management skills
- Excellent communication and creative thinking

Preferred:
- Experience with marketing automation tools (HubSpot, Salesforce Marketing Cloud)
- SQL and Python for marketing analytics
- Digital advertising certification (Google Ads, Facebook Blueprint)

Academic Criteria:
- Minimum 60% in all academic stages`,
  },
  {
    id: 'banking-analyst',
    label: 'Business Analyst Banking (B.Tech mandatory, 70% academics, Pinnacle)',
    title: 'Business Analyst — Corporate Banking',
    company: 'Pinnacle Financial Services',
    jdText: `Role: Business Analyst — Corporate Banking
Company: Pinnacle Financial Services
Location: Mumbai

About the Role:
Join our corporate banking analytics team to drive data-driven decision making. You will analyze banking products, customer segments, and market trends.

Responsibilities:
- Analyze corporate banking portfolio performance
- Build financial models and risk assessment frameworks
- Prepare management information system (MIS) reports
- Support relationship managers with data insights
- Conduct competitive benchmarking studies
- Develop automated reporting dashboards

Requirements:
- B.Tech/B.E. (mandatory)
- MBA in Finance
- Minimum 70% in Class 10, Class 12, and Graduation
- Strong SQL and Excel skills
- Knowledge of financial products and banking regulations
- Minimum 1 year of relevant work experience

Preferred:
- Experience with Tableau or Power BI
- CFA or FRM certification
- Prior banking or financial services experience

Experience: 1-3 years`,
  },
];

const STAGES = [
  'Parsing JD',
  'Checking Eligibility',
  'Evaluating Policy',
  'Scoring Role Fit',
  'Generating Report',
];

export default function NewScreening() {
  const { candidateId } = useParams<{ candidateId?: string }>();

  // Candidates list state
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Form input state
  const [jdText, setJdText] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');

  // Assessment process state
  const [assessing, setAssessing] = useState(false);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reportRef = useRef<HTMLDivElement>(null);

  // Load all candidates
  useEffect(() => {
    async function loadCandidates() {
      setLoadingCandidates(true);
      try {
        const list = await api.getCandidates();
        setCandidates(list);

        if (candidateId) {
          const match = list.find((c) => c.id === parseInt(candidateId, 10));
          if (match) {
            setSelectedCandidate(match);
          }
        }
      } catch (err: any) {
        setError('Failed to fetch candidate directory from backend.');
      } finally {
        setLoadingCandidates(false);
      }
    }
    loadCandidates();
  }, [candidateId]);

  // Handle sample JD load
  const handleSelectSample = (sampleId: string) => {
    const sample = SAMPLE_JDS.find((s) => s.id === sampleId);
    if (sample) {
      setJdText(sample.jdText);
      setJobTitle(sample.title);
      setCompany(sample.company);
      setError(null);
    }
  };

  // Run assessment
  const handleAssess = async () => {
    if (!selectedCandidate) {
      setError('Please select a candidate to screen.');
      return;
    }
    if (jdText.trim().length < 50) {
      setError('Job description must be at least 50 characters.');
      return;
    }
    if (jdText.trim().length > 10000) {
      setError('Job description cannot exceed 10,000 characters.');
      return;
    }

    setError(null);
    setAssessing(true);
    setAssessmentResult(null);
    setCurrentStageIdx(0);

    // Simulate pipeline stage progression
    const interval = setInterval(() => {
      setCurrentStageIdx((prev) => {
        if (prev < STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    try {
      const result = await api.createAssessment({
        candidate_id: selectedCandidate.id,
        jd_text: jdText,
        job_title: jobTitle.trim() || undefined,
        company: company.trim() || undefined,
      });

      clearInterval(interval);
      setCurrentStageIdx(STAGES.length - 1);
      setAssessmentResult(result);

      // Smooth scroll to report
      setTimeout(() => {
        reportRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || 'An error occurred during candidate assessment.');
    } finally {
      setAssessing(false);
    }
  };

  const handleReset = () => {
    setAssessmentResult(null);
    setJdText('');
    setJobTitle('');
    setCompany('');
    setError(null);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          New Placement Screening
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Automated multi-stage evaluation: JD parsing, eligibility verification, placement policy enforcement, and role fit scoring.
        </p>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Assessment Error</p>
              <p className="text-xs text-red-600 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-xs text-red-600 hover:text-red-900 font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Workflow Form */}
      <div className="space-y-6">
        {/* STEP 1: Select Candidate */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h2 className="text-base font-bold text-gray-900">Select Candidate</h2>
            </div>
            {selectedCandidate && (
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Change Candidate
              </button>
            )}
          </div>

          {!selectedCandidate ? (
            <div className="space-y-2">
              <label htmlFor="candidate-select" className="block text-xs font-semibold text-gray-700">
                Choose candidate from registered pool ({candidates.length} available)
              </label>
              <div className="relative">
                <select
                  id="candidate-select"
                  value=""
                  onChange={(e) => {
                    const id = parseInt(e.target.value, 10);
                    const c = candidates.find((cand) => cand.id === id);
                    if (c) setSelectedCandidate(c);
                  }}
                  disabled={loadingCandidates}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 cursor-pointer"
                >
                  <option value="" disabled>
                    {loadingCandidates ? 'Loading candidates...' : '-- Select a candidate to screen --'}
                  </option>
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      #{c.id} - {c.name} ({c.undergrad_degree}, {c.work_experience.is_fresher ? 'Fresher' : `${c.work_experience.total_months} mos exp`}, Processes: {c.placement.current_process_count}/{c.placement.max_permitted_processes})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            /* Candidate Summary Card */
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    ID #{selectedCandidate.id}
                  </span>
                  <h3 className="text-base font-bold text-gray-900">{selectedCandidate.name}</h3>
                  <span className="text-xs text-gray-500">
                    ({selectedCandidate.mba_batch})
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  {selectedCandidate.undergrad_degree} in {selectedCandidate.undergrad_specialization} •{' '}
                  {selectedCandidate.undergrad_institution}
                </p>
                <div className="flex flex-wrap gap-2 text-xs pt-1">
                  <span className="text-gray-500">
                    Experience:{' '}
                    <strong className="text-gray-700">
                      {selectedCandidate.work_experience.is_fresher
                        ? 'Fresher'
                        : `${selectedCandidate.work_experience.total_months} mos`}
                    </strong>
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-500">
                    Processes:{' '}
                    <strong className="text-gray-700">
                      {selectedCandidate.placement.current_process_count} / {selectedCandidate.placement.max_permitted_processes}
                    </strong>
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-500">
                    PPO: <strong className="text-gray-700">{selectedCandidate.placement.ppo_status}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <Link
                  to={`/candidates/${selectedCandidate.id}`}
                  target="_blank"
                  className="btn-secondary !text-xs !py-1.5 !px-3"
                >
                  <span>Full Profile</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedCandidate(null)}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-800 px-2.5 py-1.5 rounded hover:bg-gray-200"
                >
                  Change
                </button>
              </div>
            </div>
          )}
        </div>

        {/* STEP 2: Enter Job Description */}
        <div className="card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h2 className="text-base font-bold text-gray-900">Job Description & Role Context</h2>
            </div>

            {/* Load Sample JD Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Quick load:</span>
              <select
                onChange={(e) => handleSelectSample(e.target.value)}
                defaultValue=""
                className="text-xs font-medium bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg px-2.5 py-1.5 hover:bg-indigo-100 cursor-pointer focus:outline-none"
              >
                <option value="" disabled>
                  Load Sample JD...
                </option>
                {SAMPLE_JDS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional Meta fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="job-title" className="block text-xs font-semibold text-gray-700 mb-1">
                Target Job Title (Optional)
              </label>
              <input
                id="job-title"
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Associate Product Manager"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="company-name" className="block text-xs font-semibold text-gray-700 mb-1">
                Company / Organization (Optional)
              </label>
              <input
                id="company-name"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. TechNova Solutions"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* JD Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <label htmlFor="jd-text" className="font-semibold text-gray-700">
                Job Description Text <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <span className={jdText.length > 10000 ? 'text-rose-600 font-bold' : ''}>
                  {jdText.length} / 10,000 chars
                </span>
                {jdText.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setJdText('')}
                    className="text-gray-400 hover:text-gray-600 font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            <textarea
              id="jd-text"
              rows={10}
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste any job description here... (min 50 chars)"
              className="w-full p-3.5 border border-gray-300 rounded-xl text-xs md:text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* STEP 3: Assess Button & Live Progress */}
        <div className="card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-sm text-gray-900">Execute Automated Screening</h3>
              <p className="text-xs text-gray-500">
                Candidate snapshot, JD eligibility, institutional policy checks, and weighted role fit scoring will be calculated.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {assessmentResult && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-secondary !text-xs !py-2.5 !px-4 flex-1 sm:flex-none justify-center"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  <span>Reset Form</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleAssess}
                disabled={assessing || !selectedCandidate || jdText.trim().length < 50}
                className="btn-primary !py-3 !px-6 text-sm font-bold flex-1 sm:flex-none justify-center shadow-lg shadow-indigo-600/20"
              >
                {assessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Screening Candidate...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Assess Candidate</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Progress Indicator when Assessing */}
          {assessing && (
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-700">
                <span>Stage: {STAGES[currentStageIdx]}</span>
                <span>{Math.round(((currentStageIdx + 1) / STAGES.length) * 100)}%</span>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-2.5 rounded-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${((currentStageIdx + 1) / STAGES.length) * 100}%` }}
                />
              </div>
              <div className="grid grid-cols-5 gap-1 text-[11px] text-gray-400 font-medium">
                {STAGES.map((stg, i) => (
                  <span
                    key={i}
                    className={`text-center truncate ${
                      i <= currentStageIdx ? 'text-indigo-600 font-bold' : ''
                    }`}
                  >
                    {stg}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inline Assessment Report Output */}
      {assessmentResult && (
        <div ref={reportRef} className="pt-4 scroll-mt-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Screening Outcome Report</h2>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Start Another Screening
            </button>
          </div>
          <AssessmentReport result={assessmentResult} onNewAssessment={handleReset} />
        </div>
      )}
    </div>
  );
}
