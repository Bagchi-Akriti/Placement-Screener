import React, { useEffect, useState, useMemo } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  Users,
  CheckCircle2,
  UserPlus,
  X,
  Plus,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import type { Candidate } from '../types';
import CandidateCard from '../components/CandidateCard';

type FilterType = 'all' | 'freshers' | 'experienced' | 'offers' | 'restrictions';

export default function CandidateDirectory() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Add Candidate Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [creatingCandidate, setCreatingCandidate] = useState(false);
  const [createSuccessMsg, setCreateSuccessMsg] = useState<string | null>(null);
  const [createErrorMsg, setCreateErrorMsg] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [mbaBatch, setMbaBatch] = useState('2025-27');
  const [mbaYear, setMbaYear] = useState('Year 1');
  const [currentCity, setCurrentCity] = useState('Bangalore');
  const [undergradDegree, setUndergradDegree] = useState('B.Tech');
  const [undergradSpec, setUndergradSpec] = useState('Computer Science');
  const [undergradInst, setUndergradInst] = useState('IIT Madras');
  const [instType, setInstType] = useState('Engineering College');

  // Academics
  const [class10, setClass10] = useState('92.0');
  const [class12, setClass12] = useState('90.5');
  const [ugPct, setUgPct] = useState('84.0');
  const [ugCgpa, setUgCgpa] = useState('8.4');
  const [mbaCgpa, setMbaCgpa] = useState('3.7');
  const [certificationsStr, setCertificationsStr] = useState('SQL, Agile, Python');

  // Work Experience
  const [isFresher, setIsFresher] = useState(true);
  const [totalMonths, setTotalMonths] = useState('0');
  const [employerCompany, setEmployerCompany] = useState('');
  const [employerTitle, setEmployerTitle] = useState('');
  const [employerResp, setEmployerResp] = useState('');
  const [skillsStr, setSkillsStr] = useState('SQL, Python, Excel, Wireframing, Product Management');
  const [industriesStr, setIndustriesStr] = useState('Technology, E-commerce');

  // Placement info
  const [ppoStatus, setPpoStatus] = useState('No PPO');
  const [ppoCompany, setPpoCompany] = useState('');
  const [currentProcesses, setCurrentProcesses] = useState('1');
  const [offersReceived, setOffersReceived] = useState('0');
  const [offersAccepted, setOffersAccepted] = useState('0');

  // Preferences
  const [preferredFuncsStr, setPreferredFuncsStr] = useState('Product Management, Consulting, Analytics');
  const [avoidFuncsStr, setAvoidFuncsStr] = useState('Software Testing, Sales BPO');

  const fetchCandidates = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCandidates();
      setCandidates(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load candidates from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleOpenModal = () => {
    setCreateErrorMsg(null);
    setCreateSuccessMsg(null);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!creatingCandidate) {
      setIsAddModalOpen(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setCreateErrorMsg('Please provide a candidate name.');
      return;
    }

    setCreatingCandidate(true);
    setCreateErrorMsg(null);

    const skills = skillsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const certs = certificationsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const industries = industriesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const prefFuncs = preferredFuncsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const avoidFuncs = avoidFuncsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const employers =
      !isFresher && employerCompany.trim()
        ? [
            {
              company: employerCompany.trim(),
              title: employerTitle.trim() || 'Analyst',
              duration_months: parseInt(totalMonths, 10) || 12,
              responsibilities: employerResp.trim() || 'Core product analysis and deliverables.',
            },
          ]
        : [];

    const newCandidatePayload: Candidate = {
      id: 0, // backend assigns next available ID
      name: name.trim(),
      mba_batch: mbaBatch.trim(),
      mba_year: mbaYear.trim(),
      undergrad_degree: undergradDegree.trim(),
      undergrad_specialization: undergradSpec.trim(),
      undergrad_institution: undergradInst.trim(),
      institution_type: instType.trim(),
      current_city: currentCity.trim(),
      academics: {
        class_10_percentage: parseFloat(class10) || 85.0,
        class_12_percentage: parseFloat(class12) || 85.0,
        undergrad_percentage: parseFloat(ugPct) || 80.0,
        undergrad_cgpa: parseFloat(ugCgpa) || 8.0,
        undergrad_cgpa_scale: 10.0,
        mba_cgpa: parseFloat(mbaCgpa) || 3.5,
        mba_cgpa_scale: 4.0,
        certifications: certs,
      },
      work_experience: {
        is_fresher: isFresher,
        total_months: isFresher ? 0 : parseInt(totalMonths, 10) || 0,
        employers: employers,
        skills: skills.length > 0 ? skills : ['Management', 'Communication', 'Analysis'],
        industry_exposure: industries.length > 0 ? industries : ['General Management'],
        internships: [],
        projects: [],
      },
      placement: {
        current_process_count: parseInt(currentProcesses, 10) || 0,
        max_permitted_processes: 5,
        processes_completed: [],
        offers_received: parseInt(offersReceived, 10) || 0,
        offers_accepted: parseInt(offersAccepted, 10) || 0,
        ppo_status: ppoStatus,
        ppo_company: ppoCompany.trim() || null,
        active_applications: [],
        restrictions: ppoStatus === 'PPO Accepted' ? ['Restricted due to accepted PPO'] : [],
        restriction_explanation:
          ppoStatus === 'PPO Accepted'
            ? 'Candidate accepted a Pre-Placement Offer and is excluded from further processes under demo policy.'
            : '',
      },
      preferences: {
        preferred_functions: prefFuncs.length > 0 ? prefFuncs : ['Consulting', 'Operations'],
        functions_to_avoid: avoidFuncs,
        preferred_industries: industries.length > 0 ? industries : ['Consulting'],
        max_experience_requirement: 4,
        skills_to_develop: ['Strategy', 'Leadership'],
      },
    };

    try {
      const created = await api.createCandidate(newCandidatePayload);
      setCreateSuccessMsg(`Candidate #${created.id} (${created.name}) created successfully!`);
      // Refresh candidate list
      await fetchCandidates();
      setTimeout(() => {
        setIsAddModalOpen(false);
        setCreateSuccessMsg(null);
      }, 1200);
    } catch (err: any) {
      setCreateErrorMsg(err.message || 'Failed to create candidate.');
    } finally {
      setCreatingCandidate(false);
    }
  };

  // Filter & Search logic
  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      if (activeFilter === 'freshers' && !candidate.work_experience.is_fresher) {
        return false;
      }
      if (activeFilter === 'experienced' && candidate.work_experience.is_fresher) {
        return false;
      }
      if (
        activeFilter === 'offers' &&
        candidate.placement.offers_received === 0 &&
        candidate.placement.offers_accepted === 0 &&
        candidate.placement.ppo_status === 'No PPO'
      ) {
        return false;
      }
      if (
        activeFilter === 'restrictions' &&
        (!candidate.placement.restrictions || candidate.placement.restrictions.length === 0)
      ) {
        return false;
      }

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();

      const matchName = candidate.name.toLowerCase().includes(q);
      const matchId = candidate.id.toString() === q || `id ${candidate.id}`.includes(q);
      const matchDegree =
        candidate.undergrad_degree.toLowerCase().includes(q) ||
        candidate.undergrad_specialization.toLowerCase().includes(q) ||
        candidate.undergrad_institution.toLowerCase().includes(q);
      const matchSkills = candidate.work_experience.skills.some((s) =>
        s.toLowerCase().includes(q)
      );
      const matchBatch = candidate.mba_batch.toLowerCase().includes(q);

      return matchName || matchId || matchDegree || matchSkills || matchBatch;
    });
  }, [candidates, activeFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Candidate Directory
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse, manage, and screen registered MBA batch candidates, or add new candidates to the evaluation pool.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchCandidates}
            disabled={loading}
            className="btn-secondary !text-xs !py-2 !px-3"
            title="Refresh candidate list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleOpenModal}
            className="btn-primary !text-xs !py-2 !px-3.5 shadow-md shadow-indigo-600/20"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Candidate</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {createSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{createSuccessMsg}</span>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="card p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, ID, skills (e.g. SQL, Python, Excel), degree, institution..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeFilter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({candidates.length})
            </button>
            <button
              onClick={() => setActiveFilter('freshers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeFilter === 'freshers'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Freshers ({candidates.filter((c) => c.work_experience.is_fresher).length})
            </button>
            <button
              onClick={() => setActiveFilter('experienced')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeFilter === 'experienced'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Experienced ({candidates.filter((c) => !c.work_experience.is_fresher).length})
            </button>
            <button
              onClick={() => setActiveFilter('offers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeFilter === 'offers'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Has Offers / PPO
            </button>
            <button
              onClick={() => setActiveFilter('restrictions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeFilter === 'restrictions'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Restricted ({candidates.filter((c) => c.placement.restrictions?.length > 0).length})
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Failed to load candidates</p>
              <p className="text-xs text-red-600 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchCandidates}
            className="text-xs font-semibold text-red-700 underline hover:text-red-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && candidates.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card p-5 animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-6 bg-gray-200 rounded w-2/3"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {/* Candidates Grid */}
      {!loading && filteredCandidates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCandidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredCandidates.length === 0 && !error && (
        <div className="card p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">No candidates match your criteria</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or adding a new candidate to the system.
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="btn-secondary !text-xs !py-2 !px-3"
            >
              Reset Filters
            </button>
            <button onClick={handleOpenModal} className="btn-primary !text-xs !py-2 !px-3.5">
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Candidate</span>
            </button>
          </div>
        </div>
      )}

      {/* ADD CANDIDATE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 md:p-8 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Add New Candidate</h2>
                  <p className="text-xs text-gray-500">
                    Register candidate for automated placement screening and policy validation
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error banner in modal */}
            {createErrorMsg && (
              <div className="my-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{createErrorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleCreateSubmit} className="flex-1 overflow-y-auto pr-1 py-4 space-y-5 text-xs">
              {/* Basic Info */}
              <div className="space-y-3">
                <h3 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] text-indigo-600">
                  1. Candidate Identity & MBA Cohort
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rohan Varma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Current City</label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai, Bangalore"
                      value={currentCity}
                      onChange={(e) => setCurrentCity(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">MBA Batch</label>
                    <input
                      type="text"
                      value={mbaBatch}
                      onChange={(e) => setMbaBatch(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">MBA Year</label>
                    <select
                      value={mbaYear}
                      onChange={(e) => setMbaYear(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Year 1">Year 1</option>
                      <option value="Year 2">Year 2</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Undergrad & Academics */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <h3 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] text-indigo-600">
                  2. Educational Credentials & Academic Records
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">UG Degree</label>
                    <input
                      type="text"
                      placeholder="e.g. B.Tech, B.Com, B.Sc, BBA"
                      value={undergradDegree}
                      onChange={(e) => setUndergradDegree(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">UG Specialization</label>
                    <input
                      type="text"
                      placeholder="e.g. Computer Science, Finance"
                      value={undergradSpec}
                      onChange={(e) => setUndergradSpec(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">UG Institution</label>
                    <input
                      type="text"
                      placeholder="e.g. IIT Delhi, SRCC"
                      value={undergradInst}
                      onChange={(e) => setUndergradInst(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Institution Type</label>
                    <select
                      value={instType}
                      onChange={(e) => setInstType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Engineering College">Engineering College</option>
                      <option value="University">University</option>
                      <option value="Commerce College">Commerce College</option>
                      <option value="Management Institute">Management Institute</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Class 10 %</label>
                    <input
                      type="number"
                      step="0.1"
                      value={class10}
                      onChange={(e) => setClass10(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Class 12 %</label>
                    <input
                      type="number"
                      step="0.1"
                      value={class12}
                      onChange={(e) => setClass12(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">UG %</label>
                    <input
                      type="number"
                      step="0.1"
                      value={ugPct}
                      onChange={(e) => setUgPct(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">UG CGPA (10)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={ugCgpa}
                      onChange={(e) => setUgCgpa(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">MBA CGPA (4)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={mbaCgpa}
                      onChange={(e) => setMbaCgpa(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Certifications (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CFA Level 1, Google Analytics, Scrum Master"
                    value={certificationsStr}
                    onChange={(e) => setCertificationsStr(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Work Experience */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] text-indigo-600">
                    3. Work Experience & Skills
                  </h3>
                  <label className="inline-flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={isFresher}
                      onChange={(e) => setIsFresher(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    <span>Is Fresher (No full-time experience)</span>
                  </label>
                </div>

                {!isFresher && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-xl">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Total Experience (Months)</label>
                      <input
                        type="number"
                        value={totalMonths}
                        onChange={(e) => setTotalMonths(e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Prior Employer</label>
                      <input
                        type="text"
                        placeholder="e.g. Deloitte, Infosys"
                        value={employerCompany}
                        onChange={(e) => setEmployerCompany(e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Job Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Associate Analyst"
                        value={employerTitle}
                        onChange={(e) => setEmployerTitle(e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Key Skills (comma separated) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Python, SQL, Excel, Wireframing, Financial Modeling"
                    value={skillsStr}
                    onChange={(e) => setSkillsStr(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Placement Standing & Governance */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <h3 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] text-indigo-600">
                  4. Placement Standing & Policy Governance
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Current Process Count</label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={currentProcesses}
                      onChange={(e) => setCurrentProcesses(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                    />
                    <span className="text-[10px] text-gray-400">Policy limit is 5</span>
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">PPO Status</label>
                    <select
                      value={ppoStatus}
                      onChange={(e) => setPpoStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white"
                    >
                      <option value="No PPO">No PPO</option>
                      <option value="PPO Received">PPO Received</option>
                      <option value="PPO Accepted">PPO Accepted (Restricted)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">PPO Company (If Any)</label>
                    <input
                      type="text"
                      placeholder="e.g. Microsoft"
                      value={ppoCompany}
                      onChange={(e) => setPpoCompany(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <h3 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] text-indigo-600">
                  5. Career Interests & Functions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Preferred Functions (comma separated)
                    </label>
                    <input
                      type="text"
                      value={preferredFuncsStr}
                      onChange={(e) => setPreferredFuncsStr(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Functions to Avoid (comma separated)
                    </label>
                    <input
                      type="text"
                      value={avoidFuncsStr}
                      onChange={(e) => setAvoidFuncsStr(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={creatingCandidate}
                  className="btn-secondary !text-xs !py-2 !px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingCandidate}
                  className="btn-primary !text-xs !py-2 !px-5"
                >
                  {creatingCandidate ? 'Saving Candidate...' : 'Create Candidate Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
