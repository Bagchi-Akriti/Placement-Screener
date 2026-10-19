from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from enum import Enum
from datetime import datetime
import uuid

class Disposition(str, Enum):
    GOOD_MATCH = "Good Match"
    NEEDS_ATTENTION = "Needs Attention"
    NOT_ELIGIBLE = "Not Eligible"

class EligibilityStatus(str, Enum):
    MEETS_REQUIREMENTS = "Meets Stated Requirements"
    DOES_NOT_MEET = "Does Not Meet Stated Requirements"
    REVIEW_REQUIRED = "Review Required"

class PolicyEligibility(str, Enum):
    ELIGIBLE = "Eligible Under Demo Policy"
    RESTRICTED = "Restricted Under Demo Policy"
    REVIEW_REQUIRED = "Review Required"

class RequirementResult(str, Enum):
    PASS = "Pass"
    FAIL = "Fail"
    REVIEW = "Review"
    NOT_SPECIFIED = "Not Specified in JD"

class AcademicRecord(BaseModel):
    class_10_percentage: float
    class_12_percentage: float
    undergrad_percentage: float
    undergrad_cgpa: float
    undergrad_cgpa_scale: float  # e.g. 10.0
    mba_cgpa: float
    mba_cgpa_scale: float  # e.g. 4.0
    certifications: List[str] = Field(default_factory=list)

class WorkExperience(BaseModel):
    is_fresher: bool
    total_months: int
    employers: List[dict] = Field(default_factory=list)  # {company, title, duration_months, responsibilities}
    skills: List[str] = Field(default_factory=list)
    industry_exposure: List[str] = Field(default_factory=list)
    internships: List[dict] = Field(default_factory=list)  # {company, role, duration, description}
    projects: List[dict] = Field(default_factory=list)  # {name, description, skills_used}

class PlacementInfo(BaseModel):
    current_process_count: int
    max_permitted_processes: int
    processes_completed: List[str] = Field(default_factory=list)
    offers_received: int
    offers_accepted: int
    ppo_status: str  # "No PPO", "PPO Received", "PPO Accepted"
    ppo_company: Optional[str] = None
    active_applications: List[str] = Field(default_factory=list)
    restrictions: List[str] = Field(default_factory=list)
    restriction_explanation: str = ""

class StudentPreferences(BaseModel):
    preferred_functions: List[str] = Field(default_factory=list)
    functions_to_avoid: List[str] = Field(default_factory=list)
    preferred_industries: List[str] = Field(default_factory=list)
    max_experience_requirement: int  # max years of experience the student is comfortable with
    skills_to_develop: List[str] = Field(default_factory=list)

class Candidate(BaseModel):
    id: int
    name: str
    mba_batch: str
    mba_year: str
    undergrad_degree: str
    undergrad_specialization: str
    undergrad_institution: str
    institution_type: str  # "Engineering College", "University", etc.
    current_city: str
    academics: AcademicRecord
    work_experience: WorkExperience
    placement: PlacementInfo
    preferences: StudentPreferences

class ExtractedRequirement(BaseModel):
    name: str
    is_mandatory: bool
    extracted_value: str
    evidence_text: str
    confidence: str  # "High", "Medium", "Low"

class EligibilityCheck(BaseModel):
    requirement: str
    jd_requirement: str
    candidate_evidence: str
    result: str  # Pass/Fail/Review/Not Specified

class SkillGap(BaseModel):
    skill: str
    is_mandatory: bool
    jd_evidence: str
    candidate_evidence: str
    suggested_action: str

class PolicyFlag(BaseModel):
    rule: str
    description: str
    current_value: str
    threshold: str
    status: str  # "OK", "Warning", "Blocked"
    blocks_participation: bool

class RoleFitDimension(BaseModel):
    dimension: str
    score: float
    weight: float
    explanation: str
    evidence: List[str] = Field(default_factory=list)

class AssessmentRequest(BaseModel):
    candidate_id: int
    jd_text: str
    job_title: Optional[str] = None
    company: Optional[str] = None

class AssessmentResult(BaseModel):
    assessment_id: str
    timestamp: str
    candidate_id: int
    candidate_name: str
    candidate_snapshot: dict  # Full candidate data at time of assessment
    job_title: str
    company: str
    jd_text: str
    extracted_requirements: List[ExtractedRequirement] = Field(default_factory=list)
    eligibility_checks: List[EligibilityCheck] = Field(default_factory=list)
    jd_eligibility_status: str
    policy_eligibility_status: str
    policy_flags: List[PolicyFlag] = Field(default_factory=list)
    role_fit_score: float
    role_fit_dimensions: List[RoleFitDimension] = Field(default_factory=list)
    strengths: List[dict] = Field(default_factory=list)  # {strength, relevance}
    skill_gaps: List[SkillGap] = Field(default_factory=list)
    disposition: str
    executive_summary: str
    recommendations: List[str] = Field(default_factory=list)
    policy_version: str
    screening_stages: List[str] = Field(default_factory=list)
    disposition_reasons: List[str] = Field(default_factory=list)
    audit_note: str
    data_quality_flags: List[dict] = Field(default_factory=list)

class PolicyConfig(BaseModel):
    name: str
    version: str
    max_process_count: int
    accepted_offer_behavior: str
    accepted_ppo_behavior: str
    rules: List[dict] = Field(default_factory=list)
    disclaimer: str

class DashboardStats(BaseModel):
    total_candidates: int
    total_assessments: int
    good_match_count: int
    needs_attention_count: int
    not_eligible_count: int
    recent_assessments: List[dict] = Field(default_factory=list)
