import React, { useEffect, useState } from 'react';
import {
  Scale,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';
import { api } from '../services/api';
import type { PolicyConfig, PolicyRule } from '../types';

export default function PlacementRules() {
  const [policy, setPolicy] = useState<PolicyConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPolicy = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getPolicy();
      setPolicy(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load placement policy configuration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicy();
  }, []);

  const getRuleBadge = (type: string) => {
    const lower = (type || '').toLowerCase();
    switch (lower) {
      case 'hard':
        return (
          <span className="badge bg-red-100 text-red-800 border border-red-200">
            Hard Rule (Strict Disqualification)
          </span>
        );
      case 'review':
        return (
          <span className="badge bg-amber-100 text-amber-800 border border-amber-200">
            Review Required
          </span>
        );
      case 'advisory':
        return (
          <span className="badge bg-blue-100 text-blue-800 border border-blue-200">
            Advisory Notice
          </span>
        );
      case 'jd_dependent':
      case 'jd-dependent':
        return (
          <span className="badge bg-gray-100 text-gray-800 border border-gray-200">
            JD Dependent
          </span>
        );
      default:
        return (
          <span className="badge bg-purple-100 text-purple-800 border border-purple-200">
            {type}
          </span>
        );
    }
  };

  const getRuleBorder = (type: string) => {
    const lower = (type || '').toLowerCase();
    switch (lower) {
      case 'hard':
        return 'border-l-4 border-l-red-500 hover:border-red-300';
      case 'review':
        return 'border-l-4 border-l-amber-500 hover:border-amber-300';
      case 'advisory':
        return 'border-l-4 border-l-blue-500 hover:border-blue-300';
      default:
        return 'border-l-4 border-l-gray-400 hover:border-gray-400';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Institutional Placement Policy
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Rules, operational thresholds, and compliance constraints enforced during candidate screening.
          </p>
        </div>
        <button
          onClick={fetchPolicy}
          disabled={loading}
          className="btn-secondary !text-xs !py-2 !px-3 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Reload Policy</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Failed to load policy rules</p>
              <p className="text-xs text-red-600 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchPolicy}
            className="text-xs font-semibold text-red-700 underline hover:text-red-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* Policy Meta & Disclaimer Banner */}
      {policy && (
        <div className="space-y-4">
          <div className="card p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="badge bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-xs py-1 px-3">
                Version {policy.version}
              </span>
              <span className="text-xs text-slate-400">
                Governance Framework: Automated Placement Compliance
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">{policy.name}</h2>
            <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-300">
              <div>
                <span className="text-slate-400">Max Permitted Processes: </span>
                <span className="font-bold text-white">{policy.max_process_count}</span>
              </div>
              <span className="text-slate-600">•</span>
              <div>
                <span className="text-slate-400">Accepted Offer Policy: </span>
                <span className="font-bold text-white">{policy.accepted_offer_behavior}</span>
              </div>
            </div>
          </div>

          {/* Academic Disclaimer Callout */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-amber-900 mb-0.5">Policy Disclaimer</p>
              <p className="leading-relaxed text-amber-800">{policy.disclaimer}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !policy && (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-5 animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      )}

      {/* Rules Cards List */}
      {policy && policy.rules && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-indigo-600" /> Active Placement Rules (
              {policy.rules.length})
            </h2>
            <span className="text-xs text-gray-500">Configured in engine runtime</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {policy.rules.map((rule, idx) => (
              <div
                key={rule.id || idx}
                className={`card p-5 transition-shadow duration-150 ${getRuleBorder(rule.type)}`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-indigo-600 tracking-wider">
                      {rule.id}
                    </span>
                    <h3 className="font-bold text-sm text-gray-900 mt-0.5">{rule.name}</h3>
                  </div>
                  <div>{getRuleBadge(rule.type)}</div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed mb-3">{rule.description}</p>

                {(rule.parameter || rule.value !== undefined) && (
                  <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                    {rule.parameter && (
                      <span>
                        Parameter: <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700">{rule.parameter}</code>
                      </span>
                    )}
                    {rule.value !== undefined && (
                      <span>
                        Value: <strong className="text-gray-900">{rule.value}</strong>
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
