"""Script to run and persist sample screening evaluations across diverse candidate profiles and JDs."""

import asyncio
import os
import sys

# Ensure backend directory is in python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.candidates import get_candidates
from app.screening import run_screening
from app.database import init_db, save_assessment, get_assessments

SAMPLE_JDS = [
    {
        "candidate_id": 1,  # Aarav Sharma - Engineering Fresher
        "job_title": "Associate Product Manager",
        "company": "Swiggy",
        "jd_text": """
Role: Associate Product Manager
Company: Swiggy
Location: Bangalore
Experience: 0-1 years (Freshers eligible)

About the Team:
We are expanding Swiggy's consumer tech product team. We are looking for analytical, product-minded freshers who understand user journeys.

Key Requirements:
- Degree: B.Tech / B.E. or MBA
- Required Skills: Product Management, SQL, Wireframing, Agile, JIRA, Data Analysis
- Preferred Skills: Python, Tableau, A/B Testing

Responsibilities:
- Write detailed PRDs and manage sprint backlog in JIRA
- Collaborate with UX designers to create wireframes
- Track conversion metrics and analyze funnel drop-offs using SQL and Tableau
"""
    },
    {
        "candidate_id": 6,  # Kavya Reddy - Multiple offers, 1 accepted
        "job_title": "Associate Consultant",
        "company": "Bain & Company",
        "jd_text": """
Position: Associate Consultant
Company: Bain & Company
Location: Mumbai / Delhi
Experience: 0-2 years

About the Role:
Work with leadership teams of Global Fortune 500 companies to solve high-stakes strategic challenges.

Key Qualifications:
- Minimum 85% aggregate across Class 10, Class 12, and Undergrad
- Required Skills: Structured Problem Solving, Case Analysis, Management Consulting, Financial Analysis, Presentation Skills
- Preferred Skills: Python, R, Statistical Modeling

Responsibilities:
- Build financial and operational models for client engagements
- Conduct primary and secondary market research
- Synthesize strategic findings into executive presentation decks
"""
    },
    {
        "candidate_id": 7,  # Vikram Singh - PPO Accepted at Deloitte
        "job_title": "Strategy & Analytics Manager",
        "company": "Kearney",
        "jd_text": """
Role: Strategy & Analytics Manager
Company: Kearney
Experience: 3-5 years full-time experience required

Candidate Profile:
- Strong track record in analytics consulting and client management
- Required Skills: SQL, Tableau, Business Consulting, Market Research, Client Management
- Minimum 3 years relevant experience in advisory or consulting firms
"""
    },
    {
        "candidate_id": 8,  # Ananya Chatterjee - 6 processes completed (max 5)
        "job_title": "Wealth Management Relationship Manager",
        "company": "Standard Chartered Bank",
        "jd_text": """
Title: Wealth Management Relationship Manager
Company: Standard Chartered Bank
Department: Private Banking & Wealth

Qualifications & Skills:
- Required Skills: Relationship Management, Financial Analysis, Client Communication, Sales Analytics, CRM Tools
- Track record in financial services and retail banking clients
- Responsibilities: Manage high-net-worth portfolio, advise on investment products, and lead business development
"""
    },
    {
        "candidate_id": 4,  # Sneha Iyer - Class 12 is 61.4%
        "job_title": "Data Analytics Consultant",
        "company": "ZS Associates",
        "jd_text": """
Role: Data Analytics Consultant
Company: ZS Associates
Eligibility Requirements:
- Mandatory: Minimum 75% in Class 12 aggregate
- Minimum 70% in Undergraduate degree
Required Skills:
- Python, Tableau, Data Visualization, Statistical Analysis
"""
    }
]

async def seed_sample_screenings():
    print("Initializing SQLite Database...")
    await init_db()
    
    candidates_by_id = {c.id: c for c in get_candidates()}
    print(f"Loaded {len(candidates_by_id)} candidates. Executing {len(SAMPLE_JDS)} sample evaluations...\n")
    
    for idx, item in enumerate(SAMPLE_JDS, 1):
        cand = candidates_by_id.get(item["candidate_id"])
        if not cand:
            print(f"Candidate {item['candidate_id']} not found, skipping.")
            continue
            
        print(f"[{idx}/{len(SAMPLE_JDS)}] Screening Candidate #{cand.id} ({cand.name}) for '{item['job_title']}' at {item['company']}...")
        result = run_screening(
            candidate=cand,
            jd_text=item["jd_text"],
            job_title=item["job_title"],
            company=item["company"]
        )
        
        await save_assessment(result.model_dump())
        print(f"  -> Result: {result.disposition} | Score: {result.role_fit_score}/100")
        print(f"  -> Policy: {result.policy_eligibility_status} | JD: {result.jd_eligibility_status}")
        print(f"  -> Assessment ID: {result.assessment_id}\n")

    saved = await get_assessments()
    print(f"All sample evaluations completed successfully! Total saved in DB: {len(saved)}")

if __name__ == "__main__":
    asyncio.run(seed_sample_screenings())
