import type { Candidate, AssessmentResult, PolicyConfig, DashboardStats } from '../types';

const API_BASE = 'https://placement-screener.onrender.com/api';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(errorData.detail || `API error: ${response.status}`);
  }
  return response.json();
}

export const api = {
  health: () => fetchJSON<{ status: string; candidates: number; policy_version: string }>('/health'),
  getCandidates: () => fetchJSON<Candidate[]>('/candidates'),
  getCandidate: (id: number) => fetchJSON<Candidate>(`/candidates/${id}`),
  createCandidate: (data: any) =>
    fetchJSON<Candidate>('/candidates', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getPolicy: () => fetchJSON<PolicyConfig>('/policy'),
  createAssessment: (data: { candidate_id: number; jd_text: string; job_title?: string; company?: string }) =>
    fetchJSON<AssessmentResult>('/assessments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getAssessments: () => fetchJSON<AssessmentResult[]>('/assessments'),
  getAssessment: (id: string) => fetchJSON<AssessmentResult>(`/assessments/${id}`),
  getStats: () => fetchJSON<DashboardStats>('/stats'),
};
