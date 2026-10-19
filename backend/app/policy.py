from .models import PolicyConfig

PLACEMENT_POLICY = {
    "name": "PlacementIQ Demo Placement Policy",
    "version": "1.0.0-demo",
    "disclaimer": "This is a demonstration policy created for academic purposes. It does not represent the official placement policy of any educational institution.",
    "max_process_count": 5,
    "accepted_offer_behavior": "Candidates with an accepted offer are flagged for review. Multiple received offers without acceptance do not restrict participation.",
    "accepted_ppo_behavior": "Candidates who have accepted a Pre-Placement Offer (PPO) are restricted from further placement participation under this demo policy.",
    "rules": [
        {
            "id": "RULE_A",
            "name": "Maximum Placement Process Count",
            "description": "A candidate may participate in at most 5 placement processes. Participation beyond this limit restricts further applications.",
            "type": "hard",
            "parameter": "max_process_count",
            "value": 5
        },
        {
            "id": "RULE_B",
            "name": "Offer Acceptance Tracking",
            "description": "Offers received and accepted are tracked separately. Receiving multiple offers does not automatically restrict participation; however, an accepted offer triggers a review flag.",
            "type": "review",
            "parameter": "offers_accepted"
        },
        {
            "id": "RULE_C",
            "name": "Pre-Placement Offer (PPO) Policy",
            "description": "A candidate who has accepted a PPO is restricted from further participation in the placement process under this demo policy.",
            "type": "hard",
            "parameter": "ppo_accepted"
        },
        {
            "id": "RULE_D",
            "name": "Academic Eligibility",
            "description": "Academic thresholds are checked only when explicitly stated in the job description or configured policy. No default minimum is assumed.",
            "type": "jd_dependent"
        },
        {
            "id": "RULE_E",
            "name": "Work Experience Requirements",
            "description": "Experience requirements from the JD are compared against the candidate's total full-time work experience. Internships and academic projects are not counted as full-time experience.",
            "type": "jd_dependent"
        },
        {
            "id": "RULE_F",
            "name": "Degree and Specialization",
            "description": "Degree requirements are checked only when the JD mandates a specific qualification. Non-engineering candidates are not automatically disqualified unless the JD explicitly requires an engineering degree.",
            "type": "jd_dependent"
        },
        {
            "id": "RULE_G",
            "name": "Student Role Preferences",
            "description": "The student's declared preferences and exclusions are surfaced as advisory flags. A preference conflict is not a formal eligibility failure unless configured otherwise.",
            "type": "advisory"
        }
    ]
}

def get_policy() -> PolicyConfig:
    return PolicyConfig(**PLACEMENT_POLICY)
