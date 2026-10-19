import pytest
from app.candidates import get_candidates
from app.screening import run_screening
from app.models import Disposition, PolicyEligibility, EligibilityStatus

@pytest.fixture
def candidates():
    return {c.id: c for c in get_candidates()}

def test_good_match_scenario(candidates):
    aarav = candidates[1]  # Aarav Sharma - Engineering Fresher, Product Management focus
    jd = """
    Job Title: Associate Product Manager - Fresher
    Company: Flipkart
    Function: Product Management
    
    About the Role:
    We are looking for an ambitious Associate Product Manager. Freshers are welcome to apply.
    
    Required Skills:
    - Product Management
    - SQL
    - Wireframing
    - Agile
    - Data Analysis
    
    Preferred Skills:
    - Python
    - Tableau
    
    Responsibilities:
    - Write PRDs and collaborate with engineering teams
    - Analyze user behavior metrics and conduct A/B tests
    - Manage sprint backlogs and product wireframes
    """
    result = run_screening(aarav, jd, job_title="Associate Product Manager", company="Flipkart")
    
    assert result.disposition == Disposition.GOOD_MATCH.value
    assert result.policy_eligibility_status == PolicyEligibility.ELIGIBLE.value
    assert result.jd_eligibility_status == EligibilityStatus.MEETS_REQUIREMENTS.value
    assert result.role_fit_score >= 70.0
    assert len(result.strengths) > 0
    assert "Flipkart" in result.company

def test_process_limit_exceeded_hard_block(candidates):
    ananya = candidates[8]  # Ananya Chatterjee - 6 processes completed (max 5)
    jd = """
    Job Title: Relationship Manager
    Company: Standard Chartered Bank
    Required Skills:
    - Relationship Management
    - Financial Analysis
    - Client Communication
    """
    result = run_screening(ananya, jd)
    
    # Precedence rule: hard block due to process count limit
    assert result.disposition == Disposition.NOT_ELIGIBLE.value
    assert result.policy_eligibility_status == PolicyEligibility.RESTRICTED.value
    
    blocked_flags = [f for f in result.policy_flags if f.blocks_participation]
    assert len(blocked_flags) > 0
    assert any("Rule A" in f.rule for f in blocked_flags)
    assert any("exceeds" in r.lower() for r in result.disposition_reasons)

def test_ppo_accepted_hard_block(candidates):
    vikram = candidates[7]  # Vikram Singh - PPO Accepted at Deloitte
    jd = """
    Job Title: Senior Consultant - Analytics
    Company: McKinsey & Company
    Required Skills:
    - SQL
    - Tableau
    - Business Consulting
    """
    result = run_screening(vikram, jd)
    
    assert result.disposition == Disposition.NOT_ELIGIBLE.value
    assert result.policy_eligibility_status == PolicyEligibility.RESTRICTED.value
    
    blocked_flags = [f for f in result.policy_flags if f.blocks_participation]
    assert len(blocked_flags) > 0
    assert any("Rule C" in f.rule for f in blocked_flags)
    assert any("PPO Accepted" in f.current_value for f in blocked_flags)

def test_offer_accepted_triggers_review(candidates):
    kavya = candidates[6]  # Kavya Reddy - 1 accepted offer (McKinsey)
    jd = """
    Job Title: Associate Consultant
    Company: Bain & Company
    Required Skills:
    - Structured Problem Solving
    - Python
    - Case Analysis
    """
    result = run_screening(kavya, jd)
    
    # Must trigger review for accepted offer
    assert result.policy_eligibility_status == PolicyEligibility.REVIEW_REQUIRED.value
    warning_flags = [f for f in result.policy_flags if f.status == "Warning" and "Rule B" in f.rule]
    assert len(warning_flags) > 0
    assert result.disposition in [Disposition.NEEDS_ATTENTION.value, Disposition.NOT_ELIGIBLE.value]

def test_academic_cutoff_failure(candidates):
    sneha = candidates[4]  # Sneha Iyer - Class 12 is 61.4%
    jd = """
    Role: Business Analytics Specialist
    Company: Mu Sigma
    Eligibility Criteria:
    - Minimum 75% in Class 12 aggregate
    Required Skills:
    - Python
    - Tableau
    """
    result = run_screening(sneha, jd)
    
    assert result.disposition == Disposition.NOT_ELIGIBLE.value
    assert result.jd_eligibility_status == EligibilityStatus.DOES_NOT_MEET.value
    failed_checks = [c for c in result.eligibility_checks if c.result == "Fail"]
    assert len(failed_checks) > 0
    assert any("Class 12" in c.requirement for c in failed_checks)

def test_mandatory_engineering_degree_failure(candidates):
    priya = candidates[2]  # Priya Deshmukh - B.Com (Non-Engineering)
    jd = """
    Title: Technical Systems Analyst
    Company: Cisco
    Eligibility:
    - B.Tech degree mandatory
    Required Skills:
    - Excel
    - Financial Analysis
    """
    result = run_screening(priya, jd)
    
    assert result.disposition == Disposition.NOT_ELIGIBLE.value
    assert result.jd_eligibility_status == EligibilityStatus.DOES_NOT_MEET.value
    failed_checks = [c for c in result.eligibility_checks if c.result == "Fail"]
    assert any("Engineering Degree Mandatory" in c.requirement for c in failed_checks)

def test_experience_cutoff_failure_for_fresher(candidates):
    aarav = candidates[1]  # Aarav Sharma - Fresher (0 months)
    jd = """
    Job Title: Senior Product Manager
    Company: Atlassian
    Requirements:
    - Minimum 3 years of work experience required
    - SQL
    - Product Management
    """
    result = run_screening(aarav, jd)
    
    assert result.disposition == Disposition.NOT_ELIGIBLE.value
    assert result.jd_eligibility_status == EligibilityStatus.DOES_NOT_MEET.value
    failed_checks = [c for c in result.eligibility_checks if c.result == "Fail"]
    assert any("Minimum Work Experience" in c.requirement for c in failed_checks)

def test_student_preference_avoidance_conflict(candidates):
    aarav = candidates[1]  # Aarav avoids "Sales"
    jd = """
    Job Title: Enterprise Sales Executive
    Company: Salesforce
    Function: Sales
    Responsibilities:
    - Cold calling enterprise prospects
    - Closing quarterly sales targets
    Required Skills:
    - Business Communication
    """
    result = run_screening(aarav, jd, job_title="Enterprise Sales Executive")
    
    # Aarav avoids sales -> should be flagged as Needs Attention
    assert result.disposition == Disposition.NEEDS_ATTENTION.value
    assert any("Preference Alert" in reason or "Sales" in reason for reason in result.disposition_reasons)

def test_high_fit_cannot_override_policy_block(candidates):
    ananya = candidates[8]  # Candidate 8 - strong banking profile, but blocked on process count
    jd = """
    Job Title: Retail Banking Relationship Manager
    Company: Standard Chartered Bank
    Required Skills:
    - Relationship Management
    - Financial Analysis
    - Client Communication
    - Sales Analytics
    - CRM Tools
    """
    result = run_screening(ananya, jd)
    
    # Despite strong skill match and fit, disposition must be strictly NOT ELIGIBLE
    assert result.disposition == Disposition.NOT_ELIGIBLE.value
    assert result.policy_eligibility_status == PolicyEligibility.RESTRICTED.value

def test_freeform_unstructured_jd_with_data_quality_flags(candidates):
    aarav = candidates[1]  # Candidate 1: Aarav Sharma
    # HR writes in a freeform conversational email format without any labels
    conversational_jd = """
    Hey Team,
    We at Google are urgently looking for a Product Manager to join our Bangalore payments squad.
    The ideal candidate should have hands-on command over SQL, Wireframing, Agile, and Product Management.
    Freshers or anyone with foundational project exposure can apply.
    Immediate joining preferred!
    """
    result = run_screening(aarav, conversational_jd)
    
    # Title & Company detected from narrative text
    assert result.job_title == "Product Manager"
    assert result.company == "Google"
    assert result.jd_text == conversational_jd
    
    # Missing information flags generated
    assert len(result.data_quality_flags) > 0
    flag_fields = [f["field"] for f in result.data_quality_flags]
    assert "Academic Cutoffs" in flag_fields  # Flagged because HR omitted cutoffs
    assert "Educational Qualification" in flag_fields  # Flagged because no specific degree mandated
    
    # Disposition should resolve cleanly
    assert result.disposition in [Disposition.GOOD_MATCH.value, Disposition.NEEDS_ATTENTION.value]

def test_jd_text_updates_properly_on_change(candidates):
    aarav = candidates[1]
    
    jd_initial = """
    Job Title: Associate Product Manager
    Company: Swiggy
    Required Skills: SQL, Python
    """
    res1 = run_screening(aarav, jd_initial)
    assert res1.job_title == "Associate Product Manager"
    assert res1.company == "Swiggy"
    assert res1.jd_text == jd_initial
    
    # Changing the JD completely
    jd_updated = """
    We are hiring an Associate Consultant at McKinsey & Company.
    Required Skills: Structured Problem Solving, Case Analysis, Financial Analysis.
    """
    res2 = run_screening(aarav, jd_updated)
    assert res2.job_title == "Associate Consultant"
    assert res2.company == "McKinsey & Company"
    assert res2.jd_text == jd_updated
    assert res2.assessment_id != res1.assessment_id

def test_user_explicit_company_and_title_override_takes_absolute_precedence(candidates):
    aarav = candidates[1]
    # JD text mentions several brands and titles in the body
    jd_with_many_brands = """
    We build software products. Clients include Amazon, Flipkart, and Unilever.
    Ideal candidate worked previously at Deloitte or McKinsey.
    Proficiency in Salesforce CRM and Google Analytics is mandatory.
    Looking for candidates with strong SQL and Agile background.
    """
    # User explicitly specifies their own custom company and title
    result = run_screening(
        candidate=aarav,
        jd_text=jd_with_many_brands,
        job_title="Fintech Growth Manager",
        company="Acme Innovations Ltd"
    )
    
    # Must strictly preserve the user's explicit input and NOT override with Amazon, Google, or Deloitte
    assert result.company == "Acme Innovations Ltd"
    assert result.job_title == "Fintech Growth Manager"

def test_vendor_tools_in_body_do_not_falsely_autodetect_company(candidates):
    aarav = candidates[1]
    jd_with_tools = """
    Seeking talented candidates for our analytics division.
    Requirements:
    - 2 years experience working with Google Analytics, Salesforce CRM, and AWS Cloud
    - SQL and Python proficiency
    """
    # When user leaves company blank, it should NOT autodetect "Google" or "Salesforce" from tool names in body
    result = run_screening(candidate=aarav, jd_text=jd_with_tools)
    assert result.company != "Google"
    assert result.company != "Salesforce"
    assert result.company != "Amazon"
    assert "Unspecified" in result.company

def test_hyphenated_compound_words_do_not_falsely_autodetect_as_company(candidates):
    aarav = candidates[1]
    # Reproduction of user's exact uploaded JD text
    user_uploaded_jd = """
    - organization-wide committee facilitation and participation
    - How to engage professionally in HR meetings and seminars with other HR professionals in the region
    - Gain experience with Human Resources Information system (HRIS) database management and record keeping
    - Application of HR law and compliance with governmental regulations
    Qualifications: - Proficient with Microsoft Word and Excel
    - General knowledge of employment law and practices
    - Able to maintain a high level of confidentiality
    - Effective oral and written management communication skills
    """
    # When company is not specified, it should NOT capture "wide committee facilitation and participation"
    res_blank = run_screening(candidate=aarav, jd_text=user_uploaded_jd)
    assert res_blank.company != "wide committee facilitation and participation"
    assert "committee" not in res_blank.company.lower()
    assert "facilitation" not in res_blank.company.lower()
    assert "Unspecified" in res_blank.company

    # When user explicitly enters a company, it must strictly be preserved
    res_custom = run_screening(
        candidate=aarav,
        jd_text=user_uploaded_jd,
        job_title="HR Associate",
        company="Global Enterprises Ltd"
    )
    assert res_custom.company == "Global Enterprises Ltd"
    assert res_custom.job_title == "HR Associate"



