import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  History,
  Clock,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  FileText,
  Search,
  PlusCircle,
} from 'lucide-react';
import { api } from '../services/api';
import type { AssessmentResult } from '../types';
import DispositionBadge from '../components/DispositionBadge';
import AssessmentReport from '../components/AssessmentReport';

export default function AssessmentHistory() {
  const { assessmentId } = useParams<{ assessmentId?: string }>();
  const navigate = useNavigate();

  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  // Fetch all assessments
  const fetchAssessments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAssessments();
      setAssessments(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load assessment history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  // When assessmentId route param changes or is present, fetch the full assessment
  useEffect(() => {
    async function loadSpecificAssessment() {
      if (!assessmentId) {
        setSelectedAssessment(null);
        return;
      }
      setLoadingDetail(true);
      setError(null);
      try {
        const detail = await api.getAssessment(assessmentId);
        setSelectedAssessment(detail);
      } catch (err: any) {
        setError(err.message || `Failed to fetch assessment ${assessmentId}`);
      } finally {
        setLoadingDetail(false);
      }
    }

    loadSpecificAssessment();
  }, [assessmentId]);

  // Filtered assessments list
  const filteredAssessments = assessments.filter((a) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase().trim();
    return (
      (a.candidate_name && a.candidate_name.toLowerCase().includes(q)) ||
      (a.job_title && a.job_title.toLowerCase().includes(q)) ||
      (a.company && a.company.toLowerCase().includes(q)) ||
      (a.assessment_id && a.assessment_id.toLowerCase().includes(q)) ||
      (a.disposition && a.disposition.toLowerCase().includes(q))
    );
  });

  const handleRowClick = (id: string) => {
    navigate(`/history/${id}`);
  };

  const handleBackToList = () => {
    navigate('/history');
  };

  // If viewing a specific assessment detail
  if (assessmentId) {
    return (
      <div className="space-y-6 pb-12">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackToList}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Assessment History List
          </button>
          <Link to="/screening" className="btn-primary !text-xs !py-1.5 !px-3">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Screening</span>
          </Link>
        </div>

        {loadingDetail && (
          <div className="card p-12 text-center animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800">
            <p className="font-semibold text-sm">Failed to retrieve assessment details</p>
            <p className="text-xs text-red-600 mt-1">{error}</p>
            <button
              onClick={handleBackToList}
              className="mt-3 text-xs font-semibold text-indigo-600 underline"
            >
              Return to assessment list
            </button>
          </div>
        )}

        {selectedAssessment && !loadingDetail && (
          <AssessmentReport
            result={selectedAssessment}
            onNewAssessment={() => navigate('/screening')}
          />
        )}
      </div>
    );
  }

  // List view of assessments
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Assessment History
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Complete audit trail of all candidate role screenings, eligibility checks, and fit assessments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchAssessments}
            disabled={loading}
            className="btn-secondary !text-xs !py-2 !px-3"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Link to="/screening" className="btn-primary !text-xs !py-2 !px-3.5">
            <PlusCircle className="w-4 h-4" />
            <span>New Screening</span>
          </Link>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Failed to load history</p>
              <p className="text-xs text-red-600 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchAssessments}
            className="text-xs font-semibold text-red-700 underline hover:text-red-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* Search and stats bar */}
      <div className="card p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by candidate, role, company..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="text-xs text-gray-500 font-medium">
          Showing <span className="font-bold text-gray-800">{filteredAssessments.length}</span> of{' '}
          <span className="font-bold text-gray-800">{assessments.length}</span> recorded evaluations
        </div>
      </div>

      {/* Loading state */}
      {loading && assessments.length === 0 && (
        <div className="card p-8 animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      )}

      {/* History Table */}
      {!loading && filteredAssessments.length > 0 && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-xs md:text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3.5 text-left font-semibold text-gray-700">Assessment ID</th>
                  <th className="px-4 py-3.5 text-left font-semibold text-gray-700">Date & Time</th>
                  <th className="px-4 py-3.5 text-left font-semibold text-gray-700">Candidate</th>
                  <th className="px-4 py-3.5 text-left font-semibold text-gray-700">Role & Company</th>
                  <th className="px-4 py-3.5 text-left font-semibold text-gray-700">Disposition</th>
                  <th className="px-4 py-3.5 text-left font-semibold text-gray-700">Fit Score</th>
                  <th className="px-4 py-3.5 text-right font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAssessments.map((a, idx) => (
                  <tr
                    key={a.assessment_id || idx}
                    onClick={() => handleRowClick(a.assessment_id)}
                    className="hover:bg-indigo-50/40 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3.5 font-mono text-xs text-gray-500 whitespace-nowrap">
                      {a.assessment_id ? `${a.assessment_id.slice(0, 8)}...` : `#${idx + 1}`}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                      {a.timestamp ? new Date(a.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-gray-900 whitespace-nowrap">
                      {a.candidate_name || `Candidate #${a.candidate_id}`}
                    </td>
                    <td className="px-4 py-3.5 text-gray-700">
                      <div className="font-medium text-gray-900">{a.job_title || 'Unspecified Role'}</div>
                      {a.company && <div className="text-xs text-gray-500">{a.company}</div>}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <DispositionBadge disposition={a.disposition} size="sm" />
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="font-bold text-gray-800">
                        {Math.round(a.role_fit_score || 0)}
                      </span>
                      <span className="text-gray-400 text-xs"> / 100</span>
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <span className="text-indigo-600 hover:text-indigo-900 font-semibold inline-flex items-center gap-1">
                        View <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredAssessments.length === 0 && !error && (
        <div className="card p-12 text-center">
          <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">
            {searchFilter ? 'No matching assessments' : 'No assessments found'}
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {searchFilter
              ? 'Try modifying your search filter keywords.'
              : 'Screen your first candidate against a job description to populate the audit log.'}
          </p>
          <Link to="/screening" className="btn-primary !text-xs !py-2 !px-4 mt-4 inline-flex">
            <PlusCircle className="w-4 h-4" />
            <span>Start Candidate Screening</span>
          </Link>
        </div>
      )}
    </div>
  );
}
