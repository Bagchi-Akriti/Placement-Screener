import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  ClipboardCheck,
  History,
  Scale,
  Info,
  X,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const navItems = [
    { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/candidates', label: 'Candidate Directory', icon: Users },
    { to: '/screening', label: 'New Screening', icon: ClipboardCheck },
    { to: '/history', label: 'Assessment History', icon: History },
    { to: '/rules', label: 'Placement Rules', icon: Scale },
    { to: '/about', label: 'About This Demo', icon: Info },
  ];

  return (
    <aside className="w-64 h-full bg-slate-900 text-white flex flex-col justify-between select-none shadow-xl border-r border-slate-800">
      <div>
        {/* Brand header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight text-white">
                PlacementIQ
              </h1>
              <span className="text-[11px] font-medium text-indigo-300 block">
                Screening & Role Fit
              </span>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation links */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/60 rounded-lg p-3 text-xs border border-slate-700/60">
          <div className="flex items-center gap-1.5 font-semibold text-indigo-300 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Synthetic Demo Data</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Evaluation sandbox for placement screening algorithms and policy governance.
          </p>
        </div>
      </div>
    </aside>
  );
}
