export interface AcademicRecord {
  class_10_percentage: number;
  class_12_percentage: number;
  undergrad_percentage: number;
  undergrad_cgpa: number;
  undergrad_cgpa_scale: number;
  mba_cgpa: number;
  mba_cgpa_scale: number;
  certifications: string[];
}

export interface Employer {
  company: string;
  title: string;
  duration_months: number;
  responsibilities: string;
}

export interface Internship {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface Project {
  name: string;
  description: string;
  skills_used: string[];
}

export interface WorkExperience {
  is_fresher: boolean;
  total_months: number;
  employers: Employer[];
  skills: string[];
  industry_exposure: string[];
  internships: Internship[];
  projects: Project[];
}

export interface PlacementInfo {
  current_process_count: number;
  max_permitted_processes: number;
  processes_completed: string[];
  offers_received: number;
  offers_accepted: number;
  ppo_status: string;
  ppo_company: string | null;
  active_applications: string[];
  restrictions: string[];
  restriction_explanation: string;
}

export interface StudentPreferences {
  preferred_functions: string[];
  functions_to_avoid: string[];
  preferred_industries: string[];
  max_experience_requirement: number;
  skills_to_develop: string[];
}

export interface Candidate {
  id: number;
  name: string;
  mba_batch: string;
  mba_year: string;
  undergrad_degree: string;
  undergrad_specialization: string;
  undergrad_institution: string;
  institution_type: string;
  current_city: string;
  academics: AcademicRecord;
  work_experience: WorkExperience;
  placement: PlacementInfo;
  preferences: StudentPreferences;
}

export interface ExtractedRequirement {
  name: string;
  is_mandatory: boolean;
  extracted_value: string;
  evidence_text: string;
  confidence: string;
}

export interface EligibilityCheck {
  requirement: string;
  jd_requirement: string;
  candidate_evidence: string;
  result: string;
}

export interface SkillGap {
  skill: string;
  is_mandatory: boolean;
  jd_evidence: string;
  candidate_evidence: string;
  suggested_action: string;
}

export interface PolicyFlag {
  rule: string;
  description: string;
  current_value: string;
  threshold: string;
  status: string;
  blocks_participation: boolean;
}

export interface RoleFitDimension {
  dimension: string;
  score: number;
  weight: number;
  explanation: string;
  evidence: string[];
}

export interface AssessmentResult {
  assessment_id: string;
  timestamp: string;
  candidate_id: number;
  candidate_name: string;
  candidate_snapshot: Record<string, any>;
  job_title: string;
  company: string;
  jd_text: string;
  extracted_requirements: ExtractedRequirement[];
  eligibility_checks: EligibilityCheck[];
  jd_eligibility_status: string;
  policy_eligibility_status: string;
  policy_flags: PolicyFlag[];
  role_fit_score: number;
  role_fit_dimensions: RoleFitDimension[];
  strengths: { strength: string; relevance: string }[];
  skill_gaps: SkillGap[];
  disposition: string;
  executive_summary: string;
  recommendations: string[];
  policy_version: string;
  screening_stages: string[];
  disposition_reasons: string[];
  audit_note: string;
  data_quality_flags: { flag: string; detail: string; severity: string }[];
}

export interface PolicyRule {
  id: string;
  name: string;
  description: string;
  type: string;
  parameter?: string;
  value?: number;
}

export interface PolicyConfig {
  name: string;
  version: string;
  max_process_count: number;
  accepted_offer_behavior: string;
  accepted_ppo_behavior: string;
  rules: PolicyRule[];
  disclaimer: string;
}

export interface DashboardStats {
  total_candidates: number;
  total_assessments: number;
  good_match_count: number;
  needs_attention_count: number;
  not_eligible_count: number;
  recent_assessments: AssessmentResult[];
}

export type Disposition = 'Good Match' | 'Needs Attention' | 'Not Eligible';
