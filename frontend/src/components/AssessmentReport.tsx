import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Printer,
  PlusCircle,
  User,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Award,
  Layers,
  FileCheck2,
  AlertTriangle,
  Lightbulb,
  Info,
  Clock,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { AssessmentResult } from '../types';
import DispositionBadge from './DispositionBadge';
import ScoreGauge from './ScoreGauge';

interface AssessmentReportProps {
  result: AssessmentResult;
  onNewAssessment?: () => void;
}

export default function AssessmentReport({ result, onNewAssessment }: AssessmentReportProps) {
  // Collapsible state for sections
  const [showJDText, setShowJDText] = useState(false);
  const [showExtractedReqs, setShowExtractedReqs] = useState(false);

  // Format date nicely
  const formattedDate = new Date(result.timestamp).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  // Chart data for role fit dimensions
  const chartData = (result.role_fit_dimensions || []).map((dim) => ({
    name: dim.dimension,
    score: Math.round(dim.score),
    weight: Math.round(dim.weight * 100),
    explanation: dim.explanation,
  }));

  const getDimensionColor = (score: number) => {
    if (score >= 70) return '#10b981'; // emerald-500
    if (score >= 40) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  const getResultBadge = (res: string) => {
    const lower = (res || '').toLowerCase();
    if (lower === 'pass' || lower === 'meets') {
      return (
        <span className="badge bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> Pass
        </span>
      );
    }
    if (lower === 'fail' || lower === 'does not meet') {
      return (
        <span className="badge bg-red-100 text-red-800 border border-red-200">
          <XCircle className="w-3 h-3 mr-1 text-red-600" /> Fail
        </span>
      );
    }
    if (lower === 'review' || lower === 'review required') {
      return (
        <span className="badge bg-amber-100 text-amber-800 border border-amber-200">
          <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" /> Review
        </span>
      );
    }
    return (
      <span className="badge bg-gray-100 text-gray-700 border border-gray-200">
        <HelpCircle className="w-3 h-3 mr-1 text-gray-400" /> {res || 'Not Specified'}
      </span>
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm print:p-0 print:border-none print:shadow-none">
      {/* Action Header / Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-200 print:hidden">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
            Assessment Report
          </span>
          <p className="text-xs text-gray-400 mt-1">
            Reference ID: <span className="font-mono text-gray-600">{result.assessment_id}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="btn-secondary !text-xs !py-2 !px-3"
            title="Print or save as PDF"
          >
            <Printer className="w-4 h-4 text-gray-500" />
            <span>Print Report</span>
          </button>
          <Link
            to={`/candidates/${result.candidate_id}`}
            className="btn-secondary !text-xs !py-2 !px-3"
          >
            <User className="w-4 h-4 text-gray-500" />
            <span>Candidate Profile</span>
          </Link>
          {onNewAssessment ? (
            <button
              onClick={onNewAssessment}
              className="btn-primary !text-xs !py-2 !px-3.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Assessment</span>
            </button>
          ) : (
            <Link
              to="/screening"
              className="btn-primary !text-xs !py-2 !px-3.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Assessment</span>
            </Link>
          )}
        </div>
      </div>

      {/* Report Header: Candidate & Job Details + Big Gauge & Badge */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/30 text-indigo-200 text-xs px-2.5 py-0.5 rounded-full font-medium">
                Candidate ID #{result.candidate_id}
              </span>
              <span className="text-slate-400 text-xs">• {formattedDate}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              {result.candidate_name}
            </h1>
            <p className="text-slate-300 text-base font-medium">
              Target Role:{' '}
              <span className="text-white font-semibold">
                {result.job_title || 'Position'}
              </span>{' '}
              {result.company && (
                <span className="text-indigo-200 font-normal">at {result.company}</span>
              )}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg text-xs">
                <span className="text-slate-300">Policy Eligibility: </span>
                <span className="font-semibold text-white">{result.policy_eligibility_status}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg text-xs">
                <span className="text-slate-300">JD Eligibility: </span>
                <span className="font-semibold text-white">{result.jd_eligibility_status}</span>
              </div>
            </div>
          </div>

          {/* Right score and badge block */}
          <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15">
            <div className="text-center">
              <span className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Final Disposition
              </span>
              <DispositionBadge disposition={result.disposition} size="lg" />
            </div>
            <div className="h-14 w-px bg-white/20" />
            <div>
              <ScoreGauge score={result.role_fit_score} label="Role Fit" size={100} strokeWidth={8} />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: Executive Summary */}
      <section className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-5 md:p-6">
        <div className="flex items-center gap-2 mb-2 text-indigo-900 font-bold text-base">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h2>Section 1: Executive Summary</h2>
        </div>
        <p className="text-gray-800 text-sm md:text-base leading-relaxed whitespace-pre-line font-normal">
          {result.executive_summary}
        </p>
      </section>

      {/* SECTION 2: Eligibility Assessment */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
            <FileCheck2 className="w-5 h-5 text-indigo-600" />
            <h2>Section 2: Eligibility Assessment</h2>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            Status: <span className="text-gray-800 font-semibold">{result.jd_eligibility_status}</span>
          </span>
        </div>

        {result.eligibility_checks && result.eligibility_checks.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-xs md:text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Requirement</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">JD Stated Requirement</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Candidate Evidence</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 w-28">Result</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {result.eligibility_checks.map((check, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap align-top">
                      {check.requirement}
                    </td>
                    <td className="px-4 py-3 text-gray-700 align-top">
                      {check.jd_requirement}
                    </td>
                    <td className="px-4 py-3 text-gray-700 align-top">
                      {check.candidate_evidence}
                    </td>
                    <td className="px-4 py-3 align-top">
                      {getResultBadge(check.result)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-500">
            No specific eligibility check requirements were extracted from this job description.
          </div>
        )}
      </section>

      {/* SECTION 3: Role Fit Analysis */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
            <Award className="w-5 h-5 text-indigo-600" />
            <h2>Section 3: Role Fit Analysis</h2>
          </div>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
            Overall Score: {result.role_fit_score}/100
          </span>
        </div>

        {/* Breakdown chart & list */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart preview */}
          {chartData.length > 0 && (
            <div className="lg:col-span-5 bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col justify-between">
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Dimension Score Breakdown
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                  >
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={110}
                      tick={{ fontSize: 11, fill: '#4b5563' }}
                    />
                    <Tooltip
                      formatter={(val: any) => [`${val} / 100`, 'Score']}
                      labelFormatter={(name) => `Dimension: ${name}`}
                      contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: '#e5e7eb' }}
                    />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getDimensionColor(entry.score)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[11px] text-gray-400 text-center mt-1">
                Scored on a scale of 0 to 100 per weighted role dimension
              </p>
            </div>
          )}

          {/* Dimension Details */}
          <div className={chartData.length > 0 ? 'lg:col-span-7 space-y-3' : 'lg:col-span-12 space-y-3'}>
            {result.role_fit_dimensions && result.role_fit_dimensions.map((dim, idx) => {
              const scoreColorClass =
                dim.score >= 70 ? 'text-emerald-600 bg-emerald-50' :
                dim.score >= 40 ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50';
              const barColorClass =
                dim.score >= 70 ? 'bg-emerald-500' :
                dim.score >= 40 ? 'bg-amber-500' : 'bg-red-500';

              return (
                <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-white hover:border-indigo-200 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-sm text-gray-900">{dim.dimension}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 font-medium">
                        Weight: {Math.round(dim.weight * 100)}%
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${scoreColorClass}`}>
                        {Math.round(dim.score)}/100
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${barColorClass} transition-all duration-500`}
                      style={{ width: `${Math.min(100, Math.max(0, dim.score))}%` }}
                    />
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">{dim.explanation}</p>

                  {dim.evidence && dim.evidence.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-100 flex flex-wrap gap-1.5 items-center">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                        Evidence:
                      </span>
                      {dim.evidence.map((ev, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700"
                        >
                          {ev}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: Strengths */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2 text-gray-900 font-bold text-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <h2>Section 4: Strengths</h2>
        </div>

        {result.strengths && result.strengths.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.strengths.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/40"
              >
                <div className="p-1 rounded-full bg-emerald-100 text-emerald-700 mt-0.5 flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{item.strength}</h4>
                  <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{item.relevance}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic p-3 bg-gray-50 rounded-lg">
            No specific dominant strengths identified for this profile against the given JD.
          </p>
        )}
      </section>

      {/* SECTION 5: Skill Gaps */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h2>Section 5: Skill & Competency Gaps</h2>
          </div>
          <span className="text-xs text-gray-500">
            {result.skill_gaps ? result.skill_gaps.length : 0} gap(s) identified
          </span>
        </div>

        {result.skill_gaps && result.skill_gaps.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-xs md:text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Skill / Competency</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 w-28">Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">JD Stated Expectation</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Candidate Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Suggested Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {result.skill_gaps.map((gap, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-4 py-3 font-semibold text-gray-900 align-top">
                      {gap.skill}
                    </td>
                    <td className="px-4 py-3 align-top whitespace-nowrap">
                      {gap.is_mandatory ? (
                        <span className="badge bg-red-100 text-red-800 border border-red-200">
                          Mandatory
                        </span>
                      ) : (
                        <span className="badge bg-amber-100 text-amber-800 border border-amber-200">
                          Preferred
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 align-top">{gap.jd_evidence}</td>
                    <td className="px-4 py-3 text-gray-600 align-top">{gap.candidate_evidence}</td>
                    <td className="px-4 py-3 text-indigo-900 font-medium align-top">
                      {gap.suggested_action}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 bg-emerald-50 rounded-lg text-sm text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>No significant skill gaps were detected for this candidate!</span>
          </div>
        )}
      </section>

      {/* SECTION 6: Policy Flags */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
            <ShieldAlert className="w-5 h-5 text-indigo-600" />
            <h2>Section 6: Institutional Placement Policy Checks</h2>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            Overall: <span className="font-bold text-gray-800">{result.policy_eligibility_status}</span>
          </span>
        </div>

        {result.policy_flags && result.policy_flags.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {result.policy_flags.map((flag, idx) => {
              const isBlocked = flag.status === 'Blocked' || flag.blocks_participation;
              const isWarning = flag.status === 'Warning' || flag.status === 'Review';
              const cardBg = isBlocked
                ? 'bg-red-50/70 border-red-200'
                : isWarning
                ? 'bg-amber-50/70 border-amber-200'
                : 'bg-gray-50 border-gray-200';

              const badgeColor = isBlocked
                ? 'bg-red-100 text-red-800 border-red-200'
                : isWarning
                ? 'bg-amber-100 text-amber-800 border-amber-200'
                : 'bg-emerald-100 text-emerald-800 border-emerald-200';

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border flex flex-col justify-between ${cardBg}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-gray-900">{flag.rule}</span>
                      <span className={`badge ${badgeColor}`}>
                        {flag.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                      {flag.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-[11px] text-gray-500">
                    <span>
                      Current: <strong className="text-gray-800">{flag.current_value}</strong>
                    </span>
                    {flag.threshold && (
                      <span>
                        Rule limit: <strong className="text-gray-800">{flag.threshold}</strong>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
            No institutional policy flags recorded.
          </div>
        )}
      </section>

      {/* SECTION 7: Recommendations */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2 text-gray-900 font-bold text-lg">
          <Lightbulb className="w-5 h-5 text-indigo-600" />
          <h2>Section 7: Next Steps & Actionable Recommendations</h2>
        </div>

        {result.recommendations && result.recommendations.length > 0 ? (
          <ol className="space-y-2.5">
            {result.recommendations.map((rec, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-200 bg-white shadow-xs"
              >
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-sm text-gray-800 leading-relaxed">{rec}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-xs text-gray-500 p-3 bg-gray-50 rounded-lg">
            No specific next steps generated.
          </p>
        )}
      </section>

      {/* SECTION 8: Audit & Transparency */}
      <section className="border border-gray-200 rounded-xl p-5 bg-gray-50/70 space-y-4">
        <div className="flex items-center gap-2 text-gray-900 font-bold text-base">
          <Info className="w-5 h-5 text-gray-600" />
          <h2>Section 8: Audit, Transparency & Governance</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-gray-400 block font-medium">Assessment ID</span>
            <span className="font-mono text-gray-800 font-semibold truncate block" title={result.assessment_id}>
              {result.assessment_id}
            </span>
          </div>
          <div>
            <span className="text-gray-400 block font-medium">Policy Version</span>
            <span className="text-gray-800 font-semibold">{result.policy_version || '1.0.0-demo'}</span>
          </div>
          <div>
            <span className="text-gray-400 block font-medium">Evaluation Date</span>
            <span className="text-gray-800 font-semibold">{formattedDate}</span>
          </div>
          <div>
            <span className="text-gray-400 block font-medium">Candidate ID</span>
            <span className="text-gray-800 font-semibold">#{result.candidate_id}</span>
          </div>
        </div>

        {/* Screening stages */}
        {result.screening_stages && result.screening_stages.length > 0 && (
          <div className="pt-3 border-t border-gray-200">
            <span className="text-xs font-semibold text-gray-700 block mb-2">
              Automated Screening Pipeline Stages Executed:
            </span>
            <div className="flex flex-wrap gap-2">
              {result.screening_stages.map((stage, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-white text-gray-700 border border-gray-200"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {stage}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Disposition Reasons */}
        {result.disposition_reasons && result.disposition_reasons.length > 0 && (
          <div className="pt-3 border-t border-gray-200">
            <span className="text-xs font-semibold text-gray-700 block mb-1">
              Disposition Decision Rationale:
            </span>
            <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
              {result.disposition_reasons.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Audit Note */}
        {result.audit_note && (
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 leading-relaxed">
            <strong>Audit Note: </strong>
            {result.audit_note}
          </div>
        )}

        {/* Collapsible JD text & extracted requirements */}
        <div className="pt-3 border-t border-gray-200 space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowExtractedReqs(!showExtractedReqs)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1"
            >
              {showExtractedReqs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {showExtractedReqs ? 'Hide' : 'View'} Extracted Requirements ({result.extracted_requirements?.length || 0})
            </button>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              onClick={() => setShowJDText(!showJDText)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1"
            >
              {showJDText ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {showJDText ? 'Hide' : 'View'} Raw Job Description Text
            </button>
          </div>

          {showExtractedReqs && result.extracted_requirements && (
            <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200 text-xs space-y-2">
              <h4 className="font-semibold text-gray-800">Parsed JD Requirements:</h4>
              <div className="space-y-1.5">
                {result.extracted_requirements.map((req, i) => (
                  <div key={i} className="flex items-start justify-between gap-2 border-b border-gray-100 pb-1">
                    <div>
                      <span className="font-medium text-gray-900">{req.name}: </span>
                      <span className="text-gray-600">{req.extracted_value}</span>
                      {req.evidence_text && (
                        <span className="block text-[11px] text-gray-400 italic">
                          "{req.evidence_text}"
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {req.is_mandatory ? (
                        <span className="badge bg-red-50 text-red-700">Mandatory</span>
                      ) : (
                        <span className="badge bg-gray-100 text-gray-600">Preferred</span>
                      )}
                      <span className="text-[10px] text-gray-400">({req.confidence} conf)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showJDText && (
            <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200 text-xs">
              <h4 className="font-semibold text-gray-800 mb-1">Raw Job Description:</h4>
              <pre className="font-mono text-gray-700 whitespace-pre-wrap max-h-60 overflow-y-auto bg-gray-50 p-2.5 rounded text-[11px] leading-relaxed">
                {result.jd_text}
              </pre>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
