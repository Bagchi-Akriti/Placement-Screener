import React from 'react';
import {
  GraduationCap,
  Layers,
  Cpu,
  ShieldCheck,
  Code2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Database,
  Server,
  FileCheck2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="card p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/40">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <span className="badge bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-xs py-0.5 px-2.5">
              Version 1.0.0
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight mt-1">PlacementIQ</h1>
          </div>
        </div>
        <p className="text-slate-300 text-sm md:text-base leading-relaxed pt-1">
          PlacementIQ is an intelligent MBA placement screening and role-fit evaluation system. It automates candidate eligibility verification against unstructured Job Descriptions (JDs), checks institutional placement governance constraints, and calculates multi-dimensional candidate role suitability.
        </p>
      </div>

      {/* How Screening Works */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-600" />
          How the Automated Screening Pipeline Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card p-5 border-t-4 border-t-indigo-600 space-y-2">
            <span className="text-xs font-mono font-bold text-indigo-600">STAGE 1</span>
            <h3 className="font-bold text-sm text-gray-900">JD Parsing & Extraction</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Analyzes unstructured job postings to extract academic thresholds, required work experience, required degrees, and key technical/soft skills.
            </p>
          </div>

          <div className="card p-5 border-t-4 border-t-blue-500 space-y-2">
            <span className="text-xs font-mono font-bold text-blue-500">STAGE 2</span>
            <h3 className="font-bold text-sm text-gray-900">Eligibility Verification</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Directly cross-examines candidate’s verified academic marks (10th, 12th, UG, MBA) and total full-time work months against mandatory JD criteria.
            </p>
          </div>

          <div className="card p-5 border-t-4 border-t-purple-500 space-y-2">
            <span className="text-xs font-mono font-bold text-purple-500">STAGE 3</span>
            <h3 className="font-bold text-sm text-gray-900">Institutional Policy</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Validates institutional placement rules (e.g. max 5 processes limit, PPO acceptance restrictions, and prior offer governance).
            </p>
          </div>

          <div className="card p-5 border-t-4 border-t-emerald-500 space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-500">STAGE 4</span>
            <h3 className="font-bold text-sm text-gray-900">Role Fit & Audit</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Computes weighted multi-dimensional fit scores, isolates skill gaps, and synthesizes executive recommendations and full audit trails.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-indigo-600" />
          Technical Architecture & Stack
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-5 space-y-3">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
              <Server className="w-4 h-4 text-indigo-600" />
              <span>Backend Engine (FastAPI)</span>
            </div>
            <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
              <li>FastAPI asynchronous REST API with Pydantic v2 schemas</li>
              <li>Heuristic and LLM-assisted JD requirement extraction & validation</li>
              <li>Deterministic placement policy enforcement engine</li>
              <li>SQLite-backed persistent evaluation audit log</li>
              <li>Configurable policy rules matrix</li>
            </ul>
          </div>

          <div className="card p-5 space-y-3">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Frontend Application (React & Vite)</span>
            </div>
            <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
              <li>React 18 with TypeScript and Vite bundler</li>
              <li>Tailwind CSS for responsive design and clean UI</li>
              <li>Recharts for interactive dimension breakdown visualization</li>
              <li>Lucide React icon system</li>
              <li>React Router v6 client-side routing</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Synthetic Data Disclaimer */}
      <section className="card p-6 bg-slate-50 border border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <span>Synthetic Demo Data & Governance Disclosure</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          All student records, academic percentages, employer histories, and company postings featured in this demonstration environment are entirely synthetic and created strictly for software verification and algorithmic benchmarking. They do not represent real individuals, educational institutions, or corporate employers.
        </p>
        <div className="pt-2">
          <Link to="/screening" className="btn-primary !text-xs !py-2 !px-4 inline-flex items-center gap-1.5">
            <span>Try Candidate Screening Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
