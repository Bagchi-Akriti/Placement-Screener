import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Briefcase, Award, ArrowRight, UserCheck, ShieldAlert } from 'lucide-react';
import type { Candidate } from '../types';

interface CandidateCardProps {
  candidate: Candidate;
}

export default function CandidateCard({ candidate }: CandidateCardProps) {
  const expYears = (candidate.work_experience.total_months / 12).toFixed(1);
  const isAtOrAboveProcessLimit =
    candidate.placement.current_process_count >= candidate.placement.max_permitted_processes;
  const hasAcceptedOffer = candidate.placement.offers_accepted > 0;
  const hasAcceptedPPO = candidate.placement.ppo_status === 'PPO Accepted';
  const hasRestrictions = candidate.placement.restrictions && candidate.placement.restrictions.length > 0;

  return (
    <div className="card hover:shadow-md transition-shadow duration-200 flex flex-col justify-between p-5 border border-gray-200 bg-white">
      <div>
        {/* Top header: ID & Status badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
            ID #{candidate.id}
          </span>
          <div className="flex flex-wrap gap-1.5 justify-end">
            {hasAcceptedPPO ? (
              <span className="badge bg-red-100 text-red-800">PPO Accepted</span>
            ) : candidate.placement.ppo_status === 'PPO Received' ? (
              <span className="badge bg-amber-100 text-amber-800">PPO Received</span>
            ) : null}

            {hasAcceptedOffer ? (
              <span className="badge bg-purple-100 text-purple-800">Offer Accepted</span>
            ) : candidate.placement.offers_received > 0 ? (
              <span className="badge bg-blue-100 text-blue-800">
                {candidate.placement.offers_received} Offer{candidate.placement.offers_received > 1 ? 's' : ''}
              </span>
            ) : null}

            {hasRestrictions && (
              <span className="badge bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" />
                Restricted
              </span>
            )}
          </div>
        </div>

        {/* Candidate name & batch */}
        <div className="mb-3">
          <Link
            to={`/candidates/${candidate.id}`}
            className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors"
          >
            {candidate.name}
          </Link>
          <p className="text-xs text-gray-500 mt-0.5">
            {candidate.mba_batch} ({candidate.mba_year}) • {candidate.current_city}
          </p>
        </div>

        {/* Education & Experience info */}
        <div className="space-y-1.5 text-xs text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate" title={`${candidate.undergrad_degree} (${candidate.undergrad_specialization}), ${candidate.undergrad_institution}`}>
              {candidate.undergrad_degree} in {candidate.undergrad_specialization} — {candidate.undergrad_institution}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>
              {candidate.work_experience.is_fresher
                ? 'Fresher (No full-time experience)'
                : `${candidate.work_experience.total_months} mos (${expYears} yrs) experience`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className={isAtOrAboveProcessLimit ? 'text-rose-600 font-medium' : ''}>
              Processes: {candidate.placement.current_process_count} / {candidate.placement.max_permitted_processes}
              {isAtOrAboveProcessLimit && ' (Limit Reached)'}
            </span>
          </div>
        </div>

        {/* Key skills chips */}
        <div className="mb-4">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-1.5">
            Key Skills
          </p>
          <div className="flex flex-wrap gap-1">
            {candidate.work_experience.skills.slice(0, 5).map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700"
              >
                {skill}
              </span>
            ))}
            {candidate.work_experience.skills.length > 5 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium text-gray-500 bg-gray-50">
                +{candidate.work_experience.skills.length - 5}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
        <Link
          to={`/candidates/${candidate.id}`}
          className="text-xs font-semibold text-gray-600 hover:text-indigo-600 px-2.5 py-1.5 rounded hover:bg-gray-50 transition-colors"
        >
          View Profile
        </Link>
        <Link
          to={`/screening/${candidate.id}`}
          className="btn-primary !text-xs !py-1.5 !px-3"
        >
          <span>Screen</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
