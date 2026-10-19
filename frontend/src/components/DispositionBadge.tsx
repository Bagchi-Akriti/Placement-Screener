import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

interface DispositionBadgeProps {
  disposition: string;
  size?: 'sm' | 'lg';
}

export default function DispositionBadge({ disposition, size = 'sm' }: DispositionBadgeProps) {
  const isLarge = size === 'lg';
  const iconSize = isLarge ? 'w-5 h-5' : 'w-3.5 h-3.5';
  const textSize = isLarge ? 'text-sm font-semibold px-3.5 py-1.5' : 'text-xs font-medium px-2.5 py-0.5';

  switch (disposition) {
    case 'Good Match':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${textSize}`}
        >
          <CheckCircle2 className={`${iconSize} text-emerald-600 flex-shrink-0`} />
          <span>Good Match</span>
        </span>
      );
    case 'Needs Attention':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 ${textSize}`}
        >
          <AlertTriangle className={`${iconSize} text-amber-600 flex-shrink-0`} />
          <span>Needs Attention</span>
        </span>
      );
    case 'Not Eligible':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-red-50 text-red-700 border border-red-200 ${textSize}`}
        >
          <XCircle className={`${iconSize} text-red-600 flex-shrink-0`} />
          <span>Not Eligible</span>
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200 ${textSize}`}
        >
          <HelpCircle className={`${iconSize} text-gray-500 flex-shrink-0`} />
          <span>{disposition || 'Pending'}</span>
        </span>
      );
  }
}
