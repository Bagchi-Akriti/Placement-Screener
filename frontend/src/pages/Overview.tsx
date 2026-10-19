import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  PlusCircle,
  ArrowRight,
  RefreshCw,
  Clock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { api } from '../services/api';
import type { DashboardStats } from '../types';
import DispositionBadge from '../components/DispositionBadge';

export default function Overview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Placement Screening Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time MBA candidate eligibility, role fit scoring, and placement policy governance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadStats}
            disabled={loading}
            className="btn-secondary !text-xs !py-2 !px-3"
            title="Refresh dashboard metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Link to="/screening" className="btn-primary !text-xs !py-2 !px-3.5">
            <PlusCircle className="w-4 h-4" />
            <span>Start New Screening</span>
          </Link>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Unable to load dashboard metrics</p>
              <p className="text-xs text-red-600 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={loadStats}
            className="text-xs font-semibold text-red-700 underline hover:text-red-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton or Stats Cards */}
      {loading && !stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="card p-5 animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Candidates */}
          <div className="card p-5 border-l-4 border-l-indigo-600">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Candidates</span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {stats?.total_candidates ?? 0}
              </span>
              <span className="text-xs text-gray-400">profiles</span>
            </div>
            <Link
              to="/candidates"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 mt-3 inline-flex items-center gap-1"
            >
              View directory <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Total Assessments */}
          <div className="card p-5 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Assessments</span>
              <FileCheck className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {stats?.total_assessments ?? 0}
              </span>
              <span className="text-xs text-gray-400">completed</span>
            </div>
            <Link
              to="/history"
              className="text-xs font-medium text-blue-600 hover:text-blue-800 mt-3 inline-flex items-center gap-1"
            >
              View history <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Good Matches */}
          <div className="card p-5 border-l-4 border-l-emerald-500 bg-emerald-50/20">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                Good Match
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-700">
                {stats?.good_match_count ?? 0}
              </span>
              <span className="text-xs text-emerald-600 font-medium">candidates</span>
            </div>
            <span className="text-[11px] text-gray-400 mt-3 block">High fit, policy cleared</span>
          </div>

          {/* Needs Attention */}
          <div className="card p-5 border-l-4 border-l-amber-500 bg-amber-50/20">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                Attention
              </span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amber-700">
                {stats?.needs_attention_count ?? 0}
              </span>
              <span className="text-xs text-amber-600 font-medium">reviews</span>
            </div>
            <span className="text-[11px] text-gray-400 mt-3 block">Gaps or review required</span>
          </div>

          {/* Not Eligible */}
          <div className="card p-5 border-l-4 border-l-red-500 bg-red-50/20">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-red-800">
                Not Eligible
              </span>
              <XCircle className="w-4 h-4 text-red-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-red-700">
                {stats?.not_eligible_count ?? 0}
              </span>
              <span className="text-xs text-red-600 font-medium">restricted</span>
            </div>
            <span className="text-[11px] text-gray-400 mt-3 block">Policy block or hard criteria</span>
          </div>
        </div>
      )}

      {/* Main Grid: Recent Assessments & Quick Workflow Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Assessments List (2 cols on lg) */}
        <div className="lg:col-span-2 card p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-gray-900">Recent Assessments</h2>
            </div>
            <Link
              to="/history"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              See All
            </Link>
          </div>

          {stats?.recent_assessments && stats.recent_assessments.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {stats.recent_assessments.map((a: any, idx) => (
                <div
                  key={a.assessment_id || idx}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/80 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-900">
                        {a.candidate_name || `Candidate #${a.candidate_id}`}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({new Date(a.timestamp).toLocaleDateString()})
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {a.job_title || 'Role'} {a.company ? `• ${a.company}` : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs font-bold text-gray-800">
                        Score: {Math.round(a.role_fit_score || 0)}/100
                      </div>
                      <div className="mt-0.5">
                        <DispositionBadge disposition={a.disposition} size="sm" />
                      </div>
                    </div>
                    <Link
                      to={`/history/${a.assessment_id}`}
                      className="p-1 text-gray-400 hover:text-indigo-600"
                      title="View Full Report"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 bg-gray-50/60 rounded-xl border border-dashed border-gray-200">
              <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-gray-800">No assessments run yet</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Evaluate your first candidate against a Job Description using our AI-driven placement screening engine.
              </p>
              <Link to="/screening" className="btn-primary !text-xs !py-2 !px-4 mt-4 inline-flex">
                <PlusCircle className="w-4 h-4" />
                <span>Screen a Candidate</span>
              </Link>
            </div>
          )}
        </div>

        {/* Quick Launch & Guidelines Box */}
        <div className="space-y-4">
          <div className="card p-5 bg-gradient-to-br from-indigo-900 to-slate-900 text-white">
            <div className="flex items-center gap-2 mb-2 text-indigo-300">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-sm tracking-wide uppercase">PlacementIQ Engine</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              PlacementIQ combines academic thresholds, experience verification, multi-dimensional role fit scoring, and strict institutional placement rules.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Max 5 placement processes per student</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Hard blocks on accepted PPO candidates</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Structured audit trails and skill gap analysis</span>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-white/10">
              <Link
                to="/rules"
                className="text-xs font-semibold text-indigo-300 hover:text-white inline-flex items-center gap-1"
              >
                Inspect Placement Policy Rules <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-sm text-gray-900 mb-2">Need to test a scenario?</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-3">
              Choose from 10 synthetic MBA candidate profiles with diverse backgrounds: freshers, experienced consultants, tech PMs, and candidates with prior offers.
            </p>
            <Link
              to="/candidates"
              className="btn-secondary !text-xs !py-2 w-full justify-center"
            >
              Browse 10 Demo Candidates
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
