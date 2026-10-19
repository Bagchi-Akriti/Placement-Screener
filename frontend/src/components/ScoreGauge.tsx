import React from 'react';

interface ScoreGaugeProps {
  score: number;
  label?: string;
  size?: number; // diameter in pixels, default 120
  strokeWidth?: number; // stroke width in pixels, default 10
}

export default function ScoreGauge({
  score,
  label = 'Role Fit Score',
  size = 120,
  strokeWidth = 10,
}: ScoreGaugeProps) {
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let strokeColor = '#ef4444'; // red-500
  let textColor = 'text-red-600';
  let bgColor = 'bg-red-50';

  if (normalizedScore >= 70) {
    strokeColor = '#10b981'; // emerald-500
    textColor = 'text-emerald-600';
    bgColor = 'bg-emerald-50';
  } else if (normalizedScore >= 40) {
    strokeColor = '#f59e0b'; // amber-500
    textColor = 'text-amber-600';
    bgColor = 'bg-amber-50';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold tracking-tight ${textColor}`}>
            {normalizedScore}
          </span>
          <span className="text-[11px] font-medium text-gray-500">/ 100</span>
        </div>
      </div>
      {label && (
        <span className="mt-2 text-xs font-semibold text-gray-700 tracking-wide text-center">
          {label}
        </span>
      )}
    </div>
  );
}
