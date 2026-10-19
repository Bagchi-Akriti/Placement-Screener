import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  GraduationCap,
  Briefcase,
  Award,
  Layers,
  Heart,
  Ban,
  ShieldAlert,
  ClipboardCheck,
  Building,
  Calendar,
  AlertCircle,
  RefreshCw,
  FolderGit2,
} from 'lucide-react';
import { api } from '../services/api';
import type { Candidate } from '../types';

export default function CandidateProfile() {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCandidate(parseInt(id, 10));
      setCandidate(data);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve candidate profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="card p-8 animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-24 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="space-y-4">
        <Link
          to="/candidates"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Candidate Directory
        </Link>
        <div className="card p-8 text-center bg-red-50/50 border-red-200">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
          <h2 className="text-base font-bold text-gray-900">Profile Not Found</h2>
          <p className="text-xs text-gray-600 mt-1 max-w-sm mx-auto">
            {error || `Candidate ID #${id} could not be found or the backend server is unreachable.`}
          </p>
          <button onClick={fetchProfile} className="btn-secondary !text-xs !py-2 !px-3 mt-4">
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
          </button>
        </div>
      </div>
    );
  }

  const expYears = (candidate.work_experience.total_months / 12).toFixed(1);
  const isProcessLimitReached =
    candidate.placement.current_process_count >= candidate.placement.max_permitted_processes;

  return (
    <div className="space-y-6 pb-12">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/candidates"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Candidate Directory
        </Link>
        <Link to={`/screening/${candidate.id}`} className="btn-primary !text-xs !py-2 !px-4">
          <ClipboardCheck className="w-4 h-4" />
          <span>Screen Candidate for JD</span>
        </Link>
      </div>

      {/* Profile Header Hero */}
      <div className="card p-6 md:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Candidate #{candidate.id}
              </span>
              <span className="text-slate-400 text-xs">
                {candidate.mba_batch} ({candidate.mba_year})
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              {candidate.name}
            </h1>
            <p className="text-sm text-slate-300">
              {candidate.undergrad_degree} in {candidate.undergrad_specialization} •{' '}
              {candidate.undergrad_institution}
            </p>
            <p className="text-xs text-slate-400">
              Location: <span className="text-slate-200 font-medium">{candidate.current_city}</span> • Institution Type: <span className="text-slate-200 font-medium">{candidate.institution_type}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 items-start md:items-end">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 text-left md:text-right">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
                Placement Process Status
              </span>
              <span className="text-lg font-bold text-white">
                {candidate.placement.current_process_count} / {candidate.placement.max_permitted_processes}
              </span>
              <span className="text-xs text-slate-300 ml-1">Processes</span>
            </div>

            {candidate.placement.restrictions?.length > 0 && (
              <span className="badge bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1.5 py-1 px-3">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Placement Restricted</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Academics & Placement Governance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section: Academic Record */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-gray-900 font-bold text-base">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <h2>Academic Track Record</h2>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2.5 text-left font-semibold text-gray-700">Stage</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-gray-700">Score / Percentage</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-gray-700">Grading Scale</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-2.5 font-medium text-gray-900">Class 10 (Secondary)</td>
                  <td className="px-4 py-2.5 font-semibold text-gray-800">
                    {candidate.academics.class_10_percentage}%
                  </td>
                  <td className="px-4 py-2.5 text-gray-500">Percentage (0-100)</td>
                </tr>
                <tr className="bg-gray-50/50">
                  <td className="px-4 py-2.5 font-medium text-gray-900">Class 12 (Higher Secondary)</td>
                  <td className="px-4 py-2.5 font-semibold text-gray-800">
                    {candidate.academics.class_12_percentage}%
                  </td>
                  <td className="px-4 py-2.5 text-gray-500">Percentage (0-100)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium text-gray-900">Undergraduate (UG)</td>
                  <td className="px-4 py-2.5 font-semibold text-gray-800">
                    {candidate.academics.undergrad_cgpa > 0
                      ? `${candidate.academics.undergrad_cgpa} CGPA (${candidate.academics.undergrad_percentage}%)`
                      : `${candidate.academics.undergrad_percentage}%`}
                  </td>
                  <td className="px-4 py-2.5 text-gray-500">
                    Scale: {candidate.academics.undergrad_cgpa_scale || 10.0}
                  </td>
                </tr>
                <tr className="bg-gray-50/50">
                  <td className="px-4 py-2.5 font-medium text-gray-900">MBA Current CGPA</td>
                  <td className="px-4 py-2.5 font-semibold text-indigo-700">
                    {candidate.academics.mba_cgpa} CGPA
                  </td>
                  <td className="px-4 py-2.5 text-gray-500">
                    Scale: {candidate.academics.mba_cgpa_scale || 4.0}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {candidate.academics.certifications?.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-semibold text-gray-700 block mb-1.5">
                Certifications & Accreditations:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {candidate.academics.certifications.map((cert, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-indigo-50 text-indigo-700 border border-indigo-100"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section: Placement Status & Policy Governance */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-gray-900 font-bold text-base">
            <Award className="w-5 h-5 text-indigo-600" />
            <h2>Placement Standing & Governance</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-500 block mb-1 font-medium">Placement Process Count</span>
              <span className={`text-base font-bold ${isProcessLimitReached ? 'text-rose-600' : 'text-gray-900'}`}>
                {candidate.placement.current_process_count} of {candidate.placement.max_permitted_processes} max
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-500 block mb-1 font-medium">Pre-Placement Offer (PPO)</span>
              <span className="text-base font-bold text-gray-900">
                {candidate.placement.ppo_status}
              </span>
              {candidate.placement.ppo_company && (
                <span className="block text-[11px] text-gray-500 mt-0.5">
                  Company: {candidate.placement.ppo_company}
                </span>
              )}
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-500 block mb-1 font-medium">Offers Received</span>
              <span className="text-base font-bold text-gray-900">
                {candidate.placement.offers_received}
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-500 block mb-1 font-medium">Offers Accepted</span>
              <span className="text-base font-bold text-gray-900">
                {candidate.placement.offers_accepted}
              </span>
            </div>
          </div>

          {candidate.placement.restrictions?.length > 0 && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-rose-800">
                <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>Active Placement Restriction</span>
              </div>
              <p className="text-rose-700 leading-relaxed">
                {candidate.placement.restriction_explanation ||
                  candidate.placement.restrictions.join(', ')}
              </p>
            </div>
          )}

          {candidate.placement.processes_completed?.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-gray-600 block mb-1">
                Completed Processes:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {candidate.placement.processes_completed.map((p, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Work Experience Timeline */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-base">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <h2>Full-Time Professional Experience</h2>
          </div>
          <span className="badge bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs">
            {candidate.work_experience.is_fresher
              ? 'Fresher'
              : `${candidate.work_experience.total_months} months (${expYears} yrs)`}
          </span>
        </div>

        {candidate.work_experience.employers?.length > 0 ? (
          <div className="space-y-4">
            {candidate.work_experience.employers.map((emp, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-1.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="font-bold text-sm text-gray-900">
                    {emp.title} <span className="font-medium text-indigo-600">@ {emp.company}</span>
                  </h3>
                  <span className="text-xs text-gray-500 font-medium">
                    Duration: {emp.duration_months} months
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                  {emp.responsibilities}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg text-xs text-gray-500">
            Candidate is a Fresher with no prior full-time corporate work experience.
          </div>
        )}

        {/* Internships & Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
          <div>
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Internships
            </h4>
            {candidate.work_experience.internships?.length > 0 ? (
              <div className="space-y-2">
                {candidate.work_experience.internships.map((intern, i) => (
                  <div key={i} className="p-3 bg-white border border-gray-200 rounded-lg text-xs">
                    <div className="font-semibold text-gray-900">{intern.role}</div>
                    <div className="text-gray-500 text-[11px]">{intern.company} • {intern.duration}</div>
                    <p className="text-gray-600 mt-1 leading-relaxed">{intern.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No internships listed.</p>
            )}
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FolderGit2 className="w-3.5 h-3.5 text-indigo-500" /> Academic & Live Projects
            </h4>
            {candidate.work_experience.projects?.length > 0 ? (
              <div className="space-y-2">
                {candidate.work_experience.projects.map((proj, i) => (
                  <div key={i} className="p-3 bg-white border border-gray-200 rounded-lg text-xs">
                    <div className="font-semibold text-gray-900">{proj.name}</div>
                    <p className="text-gray-600 mt-1 leading-relaxed">{proj.description}</p>
                    {proj.skills_used?.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {proj.skills_used.map((sk, skIdx) => (
                          <span key={skIdx} className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                            {sk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No projects listed.</p>
            )}
          </div>
        </div>
      </div>

      {/* Skills Tag Cloud */}
      <div className="card p-6 space-y-3">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-gray-900 font-bold text-base">
          <Layers className="w-5 h-5 text-indigo-600" />
          <h2>Verified Skills & Industry Competencies</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {candidate.work_experience.skills.map((skill, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-indigo-50 text-indigo-800 border border-indigo-100 rounded-lg text-xs font-semibold"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Student Preferences & Exclusions */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-gray-900 font-bold text-base">
          <Heart className="w-5 h-5 text-rose-500" />
          <h2>Career Interests, Target Functions & Disclosures</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-2">
            <span className="font-bold text-emerald-900 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-emerald-600" /> Preferred Functions
            </span>
            <div className="flex flex-wrap gap-1">
              {candidate.preferences.preferred_functions?.map((f, i) => (
                <span key={i} className="px-2 py-0.5 bg-emerald-100/70 text-emerald-800 rounded">
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3.5 bg-rose-50/50 border border-rose-100 rounded-xl space-y-2">
            <span className="font-bold text-rose-900 flex items-center gap-1.5">
              <Ban className="w-3.5 h-3.5 text-rose-600" /> Functions to Avoid
            </span>
            <div className="flex flex-wrap gap-1">
              {candidate.preferences.functions_to_avoid?.map((f, i) => (
                <span key={i} className="px-2 py-0.5 bg-rose-100/70 text-rose-800 rounded">
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl space-y-2">
            <span className="font-bold text-blue-900 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-blue-600" /> Preferred Industries
            </span>
            <div className="flex flex-wrap gap-1">
              {candidate.preferences.preferred_industries?.map((ind, i) => (
                <span key={i} className="px-2 py-0.5 bg-blue-100/70 text-blue-800 rounded">
                  {ind}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
