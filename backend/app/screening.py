import uuid
import re
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any, Tuple
from .models import (
    Candidate,
    AssessmentResult,
    ExtractedRequirement,
    EligibilityCheck,
    SkillGap,
    PolicyFlag,
    RoleFitDimension,
    Disposition,
    EligibilityStatus,
    PolicyEligibility,
    RequirementResult
)
from .policy import PLACEMENT_POLICY
from .jd_parser import parse_job_description, SYNONYM_MAP, normalize_skill

def normalize_text_for_match(text: str) -> str:
    cleaned = text.lower().strip()
    return SYNONYM_MAP.get(cleaned, cleaned)

def is_skill_matched(jd_skill: str, candidate_skills: List[str], candidate_certifications: List[str]) -> Tuple[bool, str]:
    jd_norm = normalize_text_for_match(jd_skill)
    all_cand_items = candidate_skills + candidate_certifications
    
    # 1. Exact or synonym match
    for c_skill in all_cand_items:
        c_norm = normalize_text_for_match(c_skill)
        if jd_norm == c_norm:
            return True, f"Directly matched with '{c_skill}' in candidate profile"
        if jd_norm in c_norm or c_norm in jd_norm:
            return True, f"Sub-string alignment with candidate's '{c_skill}'"
            
    # 2. Token overlap (e.g. 'Data Analytics' vs 'Data Analysis')
    jd_tokens = set(jd_norm.replace("/", " ").replace("-", " ").split())
    for c_skill in all_cand_items:
        c_tokens = set(normalize_text_for_match(c_skill).replace("/", " ").replace("-", " ").split())
        overlap = jd_tokens.intersection(c_tokens)
        if len(overlap) > 0 and len(overlap) >= len(jd_tokens) * 0.5:
            return True, f"Conceptual match with '{c_skill}' (overlap on: {', '.join(overlap)})"
            
    return False, "Not evidenced in the supplied profile"

def evaluate_eligibility(candidate: Candidate, parsed_jd: Dict[str, Any]) -> Tuple[str, List[EligibilityCheck], List[str]]:
    checks: List[EligibilityCheck] = []
    hard_failures: List[str] = []
    review_items: List[str] = []
    
    # 1. Degree / Education check
    edu_info = parsed_jd["education"]
    cand_degree = candidate.undergrad_degree
    cand_spec = candidate.undergrad_specialization
    cand_edu_text = f"{cand_degree} in {cand_spec} from {candidate.undergrad_institution} ({candidate.institution_type})"
    
    if edu_info["is_engineering_mandatory"]:
        is_engg = "tech" in cand_degree.lower() or "b.e" in cand_degree.lower() or "engineering" in candidate.institution_type.lower()
        if is_engg:
            checks.append(EligibilityCheck(
                requirement="Engineering Degree Mandatory",
                jd_requirement=edu_info["evidence"],
                candidate_evidence=cand_edu_text,
                result=RequirementResult.PASS.value
            ))
        else:
            checks.append(EligibilityCheck(
                requirement="Engineering Degree Mandatory",
                jd_requirement=edu_info["evidence"],
                candidate_evidence=cand_edu_text,
                result=RequirementResult.FAIL.value
            ))
            hard_failures.append(f"JD mandates an Engineering degree; candidate holds {cand_degree}.")
    elif edu_info["specified"]:
        checks.append(EligibilityCheck(
            requirement="Educational Background",
            jd_requirement=edu_info["evidence"],
            candidate_evidence=cand_edu_text,
            result=RequirementResult.PASS.value
        ))
    else:
        checks.append(EligibilityCheck(
            requirement="Educational Background",
            jd_requirement="No specific undergraduate degree mandated in JD",
            candidate_evidence=cand_edu_text,
            result=RequirementResult.NOT_SPECIFIED.value
        ))

    # 2. Experience check
    exp_info = parsed_jd["experience"]
    cand_exp_months = candidate.work_experience.total_months
    cand_exp_years = round(cand_exp_months / 12.0, 1)
    
    cand_exp_text = f"{cand_exp_years} years ({cand_exp_months} months full-time experience)"
    if candidate.work_experience.is_fresher:
        cand_exp_text = f"Fresher (0 months full-time experience, {len(candidate.work_experience.internships)} internships)"

    if exp_info["specified"] and exp_info["min_years"] is not None:
        min_req = exp_info["min_years"]
        if cand_exp_years < min_req:
            checks.append(EligibilityCheck(
                requirement="Minimum Work Experience",
                jd_requirement=f"Minimum {min_req} years required ({exp_info['evidence']})",
                candidate_evidence=cand_exp_text,
                result=RequirementResult.FAIL.value
            ))
            hard_failures.append(f"Requires minimum {min_req} years experience; candidate possesses {cand_exp_years} years.")
        else:
            checks.append(EligibilityCheck(
                requirement="Minimum Work Experience",
                jd_requirement=f"Minimum {min_req} years required ({exp_info['evidence']})",
                candidate_evidence=cand_exp_text,
                result=RequirementResult.PASS.value
            ))
    else:
        checks.append(EligibilityCheck(
            requirement="Minimum Work Experience",
            jd_requirement="No minimum experience threshold required in JD",
            candidate_evidence=cand_exp_text,
            result=RequirementResult.NOT_SPECIFIED.value
        ))

    # Check max experience if specified
    if exp_info["specified"] and exp_info["max_years"] is not None:
        max_req = exp_info["max_years"]
        if cand_exp_years > max_req:
            checks.append(EligibilityCheck(
                requirement="Maximum Experience Ceiling",
                jd_requirement=f"Maximum {max_req} years ({exp_info['evidence']})",
                candidate_evidence=cand_exp_text,
                result=RequirementResult.REVIEW.value
            ))
            review_items.append(f"Candidate's experience ({cand_exp_years} yrs) exceeds JD upper target range ({max_req} yrs).")

    # 3. Academic Cutoffs Check
    cutoffs = parsed_jd["cutoffs"]
    # Class 10
    if cutoffs["class_10"] is not None:
        target = cutoffs["class_10"]
        c10_actual = candidate.academics.class_10_percentage
        if c10_actual >= target:
            checks.append(EligibilityCheck(
                requirement="Class 10 Academic Cutoff",
                jd_requirement=f"Minimum {target}%",
                candidate_evidence=f"{c10_actual}%",
                result=RequirementResult.PASS.value
            ))
        else:
            checks.append(EligibilityCheck(
                requirement="Class 10 Academic Cutoff",
                jd_requirement=f"Minimum {target}%",
                candidate_evidence=f"{c10_actual}%",
                result=RequirementResult.FAIL.value
            ))
            hard_failures.append(f"Class 10 percentage ({c10_actual}%) below threshold of {target}%.")

    # Class 12
    if cutoffs["class_12"] is not None:
        target = cutoffs["class_12"]
        c12_actual = candidate.academics.class_12_percentage
        if c12_actual >= target:
            checks.append(EligibilityCheck(
                requirement="Class 12 Academic Cutoff",
                jd_requirement=f"Minimum {target}%",
                candidate_evidence=f"{c12_actual}%",
                result=RequirementResult.PASS.value
            ))
        else:
            checks.append(EligibilityCheck(
                requirement="Class 12 Academic Cutoff",
                jd_requirement=f"Minimum {target}%",
                candidate_evidence=f"{c12_actual}%",
                result=RequirementResult.FAIL.value
            ))
            hard_failures.append(f"Class 12 percentage ({c12_actual}%) below threshold of {target}%.")

    # Undergrad cutoff
    if cutoffs["undergrad"] is not None:
        target = cutoffs["undergrad"]
        ug_actual = candidate.academics.undergrad_percentage
        if ug_actual >= target:
            checks.append(EligibilityCheck(
                requirement="Undergraduate Aggregate Cutoff",
                jd_requirement=f"Minimum {target}%",
                candidate_evidence=f"{ug_actual}% (CGPA: {candidate.academics.undergrad_cgpa})",
                result=RequirementResult.PASS.value
            ))
        else:
            checks.append(EligibilityCheck(
                requirement="Undergraduate Aggregate Cutoff",
                jd_requirement=f"Minimum {target}%",
                candidate_evidence=f"{ug_actual}% (CGPA: {candidate.academics.undergrad_cgpa})",
                result=RequirementResult.FAIL.value
            ))
            hard_failures.append(f"Undergraduate percentage ({ug_actual}%) below cutoff of {target}%.")

    # Overall JD status resolution
    if hard_failures:
        jd_status = EligibilityStatus.DOES_NOT_MEET.value
    elif review_items:
        jd_status = EligibilityStatus.REVIEW_REQUIRED.value
    else:
        jd_status = EligibilityStatus.MEETS_REQUIREMENTS.value

    return jd_status, checks, hard_failures + review_items

def evaluate_policy(candidate: Candidate) -> Tuple[str, List[PolicyFlag], List[str]]:
    flags: List[PolicyFlag] = []
    blocking_reasons: List[str] = []
    policy = PLACEMENT_POLICY
    max_proc = policy["max_process_count"]
    
    # Rule A: Process Count
    cur_count = candidate.placement.current_process_count
    if cur_count > max_proc:
        flags.append(PolicyFlag(
            rule="Rule A - Maximum Placement Process Count",
            description=f"Participation limit capped at {max_proc} processes.",
            current_value=f"{cur_count} processes participated",
            threshold=f"Max {max_proc} processes",
            status="Blocked",
            blocks_participation=True
        ))
        blocking_reasons.append(f"Process count ({cur_count}) exceeds maximum institutional limit of {max_proc}.")
    elif cur_count == max_proc:
        flags.append(PolicyFlag(
            rule="Rule A - Maximum Placement Process Count",
            description=f"Candidate has reached the process cap of {max_proc}.",
            current_value=f"{cur_count} processes participated",
            threshold=f"Max {max_proc} processes",
            status="Warning",
            blocks_participation=False
        ))
    else:
        flags.append(PolicyFlag(
            rule="Rule A - Maximum Placement Process Count",
            description="Process participation count is within permitted ceiling.",
            current_value=f"{cur_count} processes participated",
            threshold=f"Max {max_proc} processes",
            status="OK",
            blocks_participation=False
        ))

    # Rule B: Offer Acceptance Tracking
    accepted_offers = candidate.placement.offers_accepted
    received_offers = candidate.placement.offers_received
    if accepted_offers > 0:
        flags.append(PolicyFlag(
            rule="Rule B - Offer Acceptance Tracking",
            description="Candidate has previously accepted an employment offer; review flag raised.",
            current_value=f"{accepted_offers} offer(s) accepted ({received_offers} received)",
            threshold="0 accepted offers for unrestricted entry",
            status="Warning",
            blocks_participation=False
        ))
    else:
        flags.append(PolicyFlag(
            rule="Rule B - Offer Acceptance Tracking",
            description="No offers accepted; candidate is cleared under offer tracking rules.",
            current_value=f"{received_offers} received, 0 accepted",
            threshold="No accepted offers",
            status="OK",
            blocks_participation=False
        ))

    # Rule C: Pre-Placement Offer (PPO) Policy
    ppo_status = candidate.placement.ppo_status
    if ppo_status == "PPO Accepted":
        flags.append(PolicyFlag(
            rule="Rule C - Pre-Placement Offer (PPO) Policy",
            description="Candidate has accepted a PPO; further placement applications are restricted under policy.",
            current_value=f"PPO Accepted ({candidate.placement.ppo_company or 'Designated Employer'})",
            threshold="No PPO accepted",
            status="Blocked",
            blocks_participation=True
        ))
        blocking_reasons.append(f"Candidate accepted Pre-Placement Offer from {candidate.placement.ppo_company or 'partner company'}.")
    else:
        flags.append(PolicyFlag(
            rule="Rule C - Pre-Placement Offer (PPO) Policy",
            description="No PPO accepted; candidate is clear to apply.",
            current_value=ppo_status,
            threshold="No PPO accepted",
            status="OK",
            blocks_participation=False
        ))

    # Resolve Policy Eligibility Status
    has_blocked = any(f.blocks_participation for f in flags)
    has_warning = any(f.status == "Warning" for f in flags)
    
    if has_blocked:
        policy_status = PolicyEligibility.RESTRICTED.value
    elif has_warning:
        policy_status = PolicyEligibility.REVIEW_REQUIRED.value
    else:
        policy_status = PolicyEligibility.ELIGIBLE.value

    return policy_status, flags, blocking_reasons

def evaluate_role_fit(candidate: Candidate, parsed_jd: Dict[str, Any]) -> Tuple[float, List[RoleFitDimension], List[Dict[str, str]], List[SkillGap], List[str]]:
    strengths: List[Dict[str, str]] = []
    skill_gaps: List[SkillGap] = []
    advisory_notes: List[str] = []
    
    # --- 1. Skills Alignment (40%) ---
    all_jd_req_skills = parsed_jd["skills"]["required_skills"]
    all_jd_pref_skills = parsed_jd["skills"]["preferred_skills"]
    cand_skills = candidate.work_experience.skills
    cand_certs = candidate.academics.certifications
    
    matched_req_count = 0
    total_req_count = len(all_jd_req_skills)
    
    for req_s in all_jd_req_skills:
        matched, evidence = is_skill_matched(req_s, cand_skills, cand_certs)
        if matched:
            matched_req_count += 1
            strengths.append({"strength": f"Demonstrated {req_s}", "relevance": evidence})
        else:
            skill_gaps.append(SkillGap(
                skill=req_s,
                is_mandatory=True,
                jd_evidence=f"Specified as required skill in JD",
                candidate_evidence="Not evidenced in the supplied profile",
                suggested_action=f"Undergo accelerated coursework or complete capstone project demonstrating {req_s} proficiency"
            ))

    matched_pref_count = 0
    total_pref_count = len(all_jd_pref_skills)
    for pref_s in all_jd_pref_skills:
        matched, evidence = is_skill_matched(pref_s, cand_skills, cand_certs)
        if matched:
            matched_pref_count += 1
            strengths.append({"strength": f"Demonstrated {pref_s} (Preferred)", "relevance": evidence})
        else:
            skill_gaps.append(SkillGap(
                skill=pref_s,
                is_mandatory=False,
                jd_evidence=f"Listed as preferred skill in JD",
                candidate_evidence="Not evidenced in the supplied profile",
                suggested_action=f"Acquire foundational familiarity with {pref_s}"
            ))

    if total_req_count > 0:
        req_ratio = matched_req_count / total_req_count
    else:
        req_ratio = 0.85  # Default baseline when no specific skills extracted

    if total_pref_count > 0:
        pref_ratio = matched_pref_count / total_pref_count
    else:
        pref_ratio = 1.0

    skill_score = min(100.0, (req_ratio * 80.0) + (pref_ratio * 20.0))
    skill_dim = RoleFitDimension(
        dimension="Skills Alignment",
        score=round(skill_score, 1),
        weight=0.40,
        explanation=f"Matched {matched_req_count}/{max(1, total_req_count)} required and {matched_pref_count}/{max(1, total_pref_count)} preferred skills.",
        evidence=[f"{s['strength']}: {s['relevance']}" for s in strengths[:4]]
    )

    # --- 2. Relevant Experience (25%) ---
    exp_months = candidate.work_experience.total_months
    exp_years = exp_months / 12.0
    jd_min_exp = parsed_jd["experience"]["min_years"] or 0.0
    
    # Industry alignment check
    jd_func = parsed_jd["function"]
    cand_industries = [ind.lower() for ind in candidate.work_experience.industry_exposure]
    has_industry_match = any(ind in parsed_jd["company"].lower() or ind in jd_func.lower() for ind in cand_industries)
    
    exp_score = 70.0  # Base score
    if exp_years >= jd_min_exp:
        exp_score += 15.0
        if exp_years > 0:
            exp_score += min(15.0, exp_years * 3.0)
    else:
        exp_score -= min(40.0, (jd_min_exp - exp_years) * 20.0)

    if has_industry_match:
        exp_score += 10.0
        strengths.append({"strength": "Relevant Industry Exposure", "relevance": f"Candidate has domain exposure in {', '.join(candidate.work_experience.industry_exposure)}"})

    exp_score = max(20.0, min(100.0, exp_score))
    exp_dim = RoleFitDimension(
        dimension="Relevant Experience",
        score=round(exp_score, 1),
        weight=0.25,
        explanation=f"Evaluated {exp_years:.1f} years full-time experience against requirement (Min: {jd_min_exp} yrs).",
        evidence=[f"Total months: {exp_months}", f"Prior employers: {len(candidate.work_experience.employers)}", f"Internships: {len(candidate.work_experience.internships)}"]
    )

    # --- 3. Education Alignment (15%) ---
    # MBA CGPA (scaled 4.0), UG CGPA (scaled 10.0)
    mba_pct = (candidate.academics.mba_cgpa / candidate.academics.mba_cgpa_scale) * 100.0
    ug_pct = candidate.academics.undergrad_percentage
    edu_score = (mba_pct * 0.5) + (ug_pct * 0.5)
    
    # Bonus for tier 1 or prestigious institution
    if any(k in candidate.undergrad_institution for k in ["IIT", "NIT", "BITS", "St. Xavier", "Presidency"]):
        edu_score = min(100.0, edu_score + 5.0)
        
    edu_dim = RoleFitDimension(
        dimension="Education Alignment",
        score=round(edu_score, 1),
        weight=0.15,
        explanation=f"Academic performance benchmarked (MBA CGPA: {candidate.academics.mba_cgpa}/{candidate.academics.mba_cgpa_scale}, UG: {ug_pct}%).",
        evidence=[f"UG Degree: {candidate.undergrad_degree} ({candidate.undergrad_institution})", f"MBA CGPA: {candidate.academics.mba_cgpa}/{candidate.academics.mba_cgpa_scale}"]
    )

    # --- 4. Responsibilities Alignment (15%) ---
    jd_resps = parsed_jd["responsibilities"]
    resp_matches = 0
    cand_resp_corpus = " ".join([
        emp.get("responsibilities", "") for emp in candidate.work_experience.employers
    ] + [
        proj.get("description", "") for proj in candidate.work_experience.projects
    ] + [
        intern.get("description", "") for intern in candidate.work_experience.internships
    ]).lower()
    
    for r in jd_resps:
        r_tokens = set(re.findall(r'\b\w{4,}\b', r.lower()))
        if any(t in cand_resp_corpus for t in r_tokens):
            resp_matches += 1
            
    if jd_resps:
        resp_score = 50.0 + min(50.0, (resp_matches / len(jd_resps)) * 50.0)
    else:
        resp_score = 75.0
        
    resp_dim = RoleFitDimension(
        dimension="Responsibilities Alignment",
        score=round(resp_score, 1),
        weight=0.15,
        explanation=f"Candidate's past project and work experience reflects {resp_matches} overlap areas with JD responsibilities.",
        evidence=[f"Projects analyzed: {len(candidate.work_experience.projects)}", f"Past responsibilities mapped: {resp_matches}"]
    )

    # --- 5. Student Preferences (5%) ---
    pref_score = 80.0
    cand_prefs = candidate.preferences
    
    # Function alignment
    is_pref_func = any(jd_func.lower() in pf.lower() or pf.lower() in jd_func.lower() for pf in cand_prefs.preferred_functions)
    is_avoid_func = any(jd_func.lower() in af.lower() or af.lower() in jd_func.lower() for af in cand_prefs.functions_to_avoid)
    
    if is_avoid_func:
        pref_score = 20.0
        advisory_notes.append(f"Preference Alert: Role function '{jd_func}' is on candidate's exclusion list ({', '.join(cand_prefs.functions_to_avoid)}).")
    elif is_pref_func:
        pref_score = 100.0
        strengths.append({"strength": "High Student Aspiration Fit", "relevance": f"Role function '{jd_func}' is among candidate's top preferred career tracks"})
    else:
        pref_score = 70.0

    # Max experience comfort
    if exp_info_val := parsed_jd["experience"]["min_years"]:
        if exp_info_val > cand_prefs.max_experience_requirement:
            pref_score = max(30.0, pref_score - 20.0)
            advisory_notes.append(f"Candidate prefers roles requiring at most {cand_prefs.max_experience_requirement} years experience; JD requires {exp_info_val} years.")

    pref_dim = RoleFitDimension(
        dimension="Student Preferences",
        score=round(pref_score, 1),
        weight=0.05,
        explanation=f"Evaluated functional interest for '{jd_func}'. Preferred: {is_pref_func}, Avoid conflict: {is_avoid_func}.",
        evidence=[f"Preferred functions: {', '.join(cand_prefs.preferred_functions)}", f"Functions to avoid: {', '.join(cand_prefs.functions_to_avoid)}"]
    )

    # Composite weighted score
    dimensions = [skill_dim, exp_dim, edu_dim, resp_dim, pref_dim]
    overall_score = sum(dim.score * dim.weight for dim in dimensions)
    overall_score = round(max(0.0, min(100.0, overall_score)), 1)

    return overall_score, dimensions, strengths, skill_gaps, advisory_notes

def run_screening(candidate: Candidate, jd_text: str, job_title: str = "", company: str = "") -> AssessmentResult:
    assessment_id = str(uuid.uuid4())
    timestamp = datetime.now(timezone.utc).isoformat()
    stages = [
        "Stage 1: Job Description Parsing & Deterministic Extraction",
        "Stage 2: Institutional Placement Policy Verification",
        "Stage 3: Stated Requirements & Academic Cutoff Validation",
        "Stage 4: Multi-Dimensional Role Fit & Competency Scoring",
        "Stage 5: Disposition Resolution & Advisory Synthesis"
    ]
    disposition_reasons: List[str] = []
    recommendations: List[str] = []

    # Stage 1: Parse JD
    parsed_jd = parse_job_description(jd_text, job_title, company)
    resolved_title = parsed_jd["job_title"]
    resolved_company = parsed_jd["company"]
    extracted_reqs = parsed_jd["extracted_requirements"]

    # Stage 2: Placement Policy
    policy_status, policy_flags, policy_blockers = evaluate_policy(candidate)

    # Stage 3: JD Requirements Eligibility
    jd_status, eligibility_checks, jd_failures = evaluate_eligibility(candidate, parsed_jd)

    # Stage 4: Role Fit Scoring
    fit_score, fit_dimensions, strengths, skill_gaps, advisory_notes = evaluate_role_fit(candidate, parsed_jd)

    # Stage 5: Determine Final Disposition by Precedence Rule
    # Precedence:
    # 1. Placement policy blocks (process limit exceeded, PPO accepted) -> NOT ELIGIBLE
    # 2. JD mandatory requirement fails -> NOT ELIGIBLE
    # 3. Review items, skill gaps, or preference conflicts -> NEEDS ATTENTION
    # 4. Everything aligns well -> GOOD MATCH
    
    is_policy_blocked = (policy_status == PolicyEligibility.RESTRICTED.value)
    is_jd_failed = (jd_status == EligibilityStatus.DOES_NOT_MEET.value)

    if is_policy_blocked:
        disposition = Disposition.NOT_ELIGIBLE.value
        disposition_reasons.extend(policy_blockers)
        disposition_reasons.append("Institutional placement policy restrictions override competency fit scoring.")
        recommendations.append("Audit candidate's current process allocation or verify PPO acceptance status with placement cell.")
    elif is_jd_failed:
        disposition = Disposition.NOT_ELIGIBLE.value
        disposition_reasons.extend(jd_failures)
        disposition_reasons.append("Mandatory educational, experience, or academic thresholds specified in the JD were not satisfied.")
        recommendations.append("Route candidate to alternative roles whose baseline eligibility criteria match their profile.")
    elif policy_status == PolicyEligibility.REVIEW_REQUIRED.value or jd_status == EligibilityStatus.REVIEW_REQUIRED.value or len(skill_gaps) > 2 or advisory_notes:
        disposition = Disposition.NEEDS_ATTENTION.value
        if policy_status == PolicyEligibility.REVIEW_REQUIRED.value:
            disposition_reasons.append("Placement policy review flag active (e.g. accepted offer on file).")
        if jd_status == EligibilityStatus.REVIEW_REQUIRED.value:
            disposition_reasons.append("JD criteria flagged for manual committee review.")
        if advisory_notes:
            disposition_reasons.extend(advisory_notes)
        if len(skill_gaps) > 0:
            disposition_reasons.append(f"Identified {len(skill_gaps)} competency/skill gaps relative to stated JD expectations.")
            
        recommendations.append("Conduct advisor interview to review role alignment, student preferences, and resume positioning.")
        if skill_gaps:
            missing_mandatory = [g.skill for g in skill_gaps if g.is_mandatory]
            if missing_mandatory:
                recommendations.append(f"Focus interview prep or bridging projects on: {', '.join(missing_mandatory[:3])}.")
    else:
        disposition = Disposition.GOOD_MATCH.value
        disposition_reasons.append("Candidate satisfies all mandatory JD prerequisites and complies fully with institutional placement policy.")
        disposition_reasons.append(f"High multi-dimensional role fit score of {fit_score}/100 with strong competency overlap.")
        recommendations.append("Approve profile for direct application submission and schedule mock technical interview.")

    # Executive Summary Generation
    if disposition == Disposition.NOT_ELIGIBLE.value:
        exec_summary = (
            f"Screening completed for {candidate.name} for the position of '{resolved_title}' at {resolved_company}. "
            f"Candidate is classified as '{disposition}' due to critical eligibility barriers: {'; '.join(disposition_reasons[:2])}. "
            f"Overall role fit score is {fit_score}/100, but policy and statutory thresholds take strict precedence."
        )
    elif disposition == Disposition.NEEDS_ATTENTION.value:
        exec_summary = (
            f"Screening completed for {candidate.name} applying for '{resolved_title}' at {resolved_company}. "
            f"Candidate has been categorized as '{disposition}'. While achieving a role fit score of {fit_score}/100, "
            f"specific advisory flags require placement officer review ({'; '.join(disposition_reasons[:2])})."
        )
    else:
        exec_summary = (
            f"{candidate.name} is assessed as a '{disposition}' for '{resolved_title}' at {resolved_company} "
            f"with an impressive role fit score of {fit_score}/100. "
            f"Candidate meets all required criteria and is clear of policy constraints."
        )

    audit_note = (
        f"Evaluation performed by PlacementIQ Screening Engine v1.0.0 adhering to {PLACEMENT_POLICY['name']} (v{PLACEMENT_POLICY['version']}). "
        f"Deterministic audit trail generated at {timestamp}. No non-deterministic external LLM calls were utilized."
    )

    return AssessmentResult(
        assessment_id=assessment_id,
        timestamp=timestamp,
        candidate_id=candidate.id,
        candidate_name=candidate.name,
        candidate_snapshot=candidate.model_dump(),
        job_title=resolved_title,
        company=resolved_company,
        jd_text=jd_text,
        extracted_requirements=extracted_reqs,
        eligibility_checks=eligibility_checks,
        jd_eligibility_status=jd_status,
        policy_eligibility_status=policy_status,
        policy_flags=policy_flags,
        role_fit_score=fit_score,
        role_fit_dimensions=fit_dimensions,
        strengths=strengths,
        skill_gaps=skill_gaps,
        disposition=disposition,
        executive_summary=exec_summary,
        recommendations=recommendations,
        policy_version=PLACEMENT_POLICY["version"],
        screening_stages=stages,
        disposition_reasons=disposition_reasons,
        audit_note=audit_note,
        data_quality_flags=parsed_jd.get("data_quality_flags", [])
    )
