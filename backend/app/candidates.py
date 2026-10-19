from typing import List, Optional
from .models import Candidate, AcademicRecord, WorkExperience, PlacementInfo, StudentPreferences

_SEED_CANDIDATES: List[Candidate] = [
        Candidate(
            id=1,
            name="Aarav Sharma",
            mba_batch="2025-27",
            mba_year="Year 1",
            undergrad_degree="B.Tech",
            undergrad_specialization="Computer Science",
            undergrad_institution="NIT Trichy",
            institution_type="Engineering College",
            current_city="Bangalore",
            academics=AcademicRecord(
                class_10_percentage=95.4,
                class_12_percentage=92.8,
                undergrad_percentage=87.0,
                undergrad_cgpa=8.7,
                undergrad_cgpa_scale=10.0,
                mba_cgpa=3.6,
                mba_cgpa_scale=4.0,
                certifications=["Google Analytics", "SQL for Data Science (Coursera)"]
            ),
            work_experience=WorkExperience(
                is_fresher=True,
                total_months=0,
                employers=[],
                skills=[
                    "Python", "SQL", "Excel", "Tableau", "Product Management",
                    "Agile", "JIRA", "A/B Testing", "Data Analysis", "Wireframing"
                ],
                industry_exposure=["Technology", "E-commerce"],
                internships=[
                    {
                        "company": "TechStart Solutions",
                        "role": "Product Intern",
                        "duration": "2 months",
                        "description": "Supported MVP launch for mobile application, mapped customer journeys, documented user stories, and assisted with A/B test setups."
                    }
                ],
                projects=[
                    {
                        "name": "E-Commerce User Behavior Analytics",
                        "description": "Analyzed clickstream logs to identify checkout bottlenecks using SQL and Tableau.",
                        "skills_used": ["SQL", "Tableau", "Data Analysis"]
                    },
                    {
                        "name": "Campus Delivery App Wireframing",
                        "description": "Designed product wireframes and conducted user feedback sessions for university grocery delivery platform.",
                        "skills_used": ["Wireframing", "Agile", "JIRA"]
                    }
                ]
            ),
            placement=PlacementInfo(
                current_process_count=2,
                max_permitted_processes=5,
                processes_completed=["Infosys", "Wipro"],
                offers_received=0,
                offers_accepted=0,
                ppo_status="No PPO",
                ppo_company=None,
                active_applications=[],
                restrictions=[],
                restriction_explanation=""
            ),
            preferences=StudentPreferences(
                preferred_functions=["Product Management", "Business Analytics", "Technology Consulting"],
                functions_to_avoid=["Sales"],
                preferred_industries=["Technology", "E-commerce", "Consulting"],
                max_experience_requirement=2,
                skills_to_develop=["Product Strategy", "User Research", "Machine Learning"]
            )
        ),
        Candidate(
            id=2,
            name="Priya Deshmukh",
            mba_batch="2025-27",
            mba_year="Year 1",
            undergrad_degree="B.Com (Hons)",
            undergrad_specialization="Commerce & Accountancy",
            undergrad_institution="St. Xavier's College Mumbai",
            institution_type="University",
            current_city="Mumbai",
            academics=AcademicRecord(
                class_10_percentage=91.2,
                class_12_percentage=88.6,
                undergrad_percentage=78.0,
                undergrad_cgpa=7.8,
                undergrad_cgpa_scale=10.0,
                mba_cgpa=3.4,
                mba_cgpa_scale=4.0,
                certifications=["CFA Level 1", "Advanced Excel (NISM)"]
            ),
            work_experience=WorkExperience(
                is_fresher=True,
                total_months=0,
                employers=[],
                skills=[
                    "Financial Analysis", "Excel (Advanced)", "Market Research", "PowerPoint",
                    "Business Communication", "Accounting", "Valuation", "Report Writing",
                    "Data Interpretation", "Presentation Skills"
                ],
                industry_exposure=["BFSI", "FMCG"],
                internships=[
                    {
                        "company": "Kotak Securities",
                        "role": "Equity Research Intern",
                        "duration": "2 months",
                        "description": "Prepared equity research notes on FMCG sector and updated DCF valuation models in Excel."
                    }
                ],
                projects=[
                    {
                        "name": "FMCG Sector Financial Analysis",
                        "description": "Comparative 5-year balance sheet and ratio analysis of leading Indian FMCG players.",
                        "skills_used": ["Financial Analysis", "Excel", "Valuation"]
                    },
                    {
                        "name": "Consumer Spending Market Research",
                        "description": "Surveyed urban retail buying patterns post-inflation and presented synthesis reports.",
                        "skills_used": ["Market Research", "Report Writing", "PowerPoint"]
                    }
                ]
            ),
            placement=PlacementInfo(
                current_process_count=1,
                max_permitted_processes=5,
                processes_completed=["HDFC Bank"],
                offers_received=0,
                offers_accepted=0,
                ppo_status="No PPO",
                ppo_company=None,
                active_applications=[],
                restrictions=[],
                restriction_explanation=""
            ),
            preferences=StudentPreferences(
                preferred_functions=["Marketing", "Finance", "General Management"],
                functions_to_avoid=["IT/Software Development"],
                preferred_industries=["BFSI", "FMCG", "Consulting"],
                max_experience_requirement=1,
                skills_to_develop=["Digital Marketing", "Brand Management", "Investment Analysis"]
            )
        ),
        Candidate(
            id=3,
            name="Rohan Mehta",
            mba_batch="2024-26",
            mba_year="Year 2",
            undergrad_degree="B.Tech",
            undergrad_specialization="Electronics",
            undergrad_institution="BITS Pilani",
            institution_type="Engineering College",
            current_city="Hyderabad",
            academics=AcademicRecord(
                class_10_percentage=89.6,
                class_12_percentage=85.2,
                undergrad_percentage=75.0,
                undergrad_cgpa=7.5,
                undergrad_cgpa_scale=10.0,
                mba_cgpa=3.5,
                mba_cgpa_scale=4.0,
                certifications=["Certified Scrum Product Owner", "AWS Cloud Practitioner"]
            ),
            work_experience=WorkExperience(
                is_fresher=False,
                total_months=36,
                employers=[
                    {
                        "company": "Flipkart",
                        "title": "Associate Product Analyst",
                        "duration_months": 18,
                        "responsibilities": "Led feature prioritization for seller onboarding module, wrote PRDs, managed sprint backlogs, analyzed user behavior data"
                    },
                    {
                        "company": "Freshworks",
                        "title": "Business Analyst",
                        "duration_months": 18,
                        "responsibilities": "Gathered requirements from enterprise clients, created wireframes, wrote SQL queries for product analytics, managed stakeholder communications"
                    }
                ],
                skills=[
                    "SQL", "Product Management", "Stakeholder Management", "Requirements Gathering",
                    "JIRA", "Agile/Scrum", "Wireframing", "A/B Testing", "Data Analysis",
                    "PRD Writing", "User Story Mapping"
                ],
                industry_exposure=["Technology", "E-commerce", "SaaS"],
                internships=[],
                projects=[
                    {
                        "name": "Seller Funnel Conversion Optimization",
                        "description": "Formulated hypotheses and sprint experiments reducing drop-off during KYC verification by 14%.",
                        "skills_used": ["PRD Writing", "A/B Testing", "SQL", "JIRA"]
                    }
                ]
            ),
            placement=PlacementInfo(
                current_process_count=3,
                max_permitted_processes=5,
                processes_completed=["Amazon", "Uber"],
                offers_received=1,
                offers_accepted=0,
                ppo_status="No PPO",
                ppo_company=None,
                active_applications=[],
                restrictions=[],
                restriction_explanation=""
            ),
            preferences=StudentPreferences(
                preferred_functions=["Product Management", "Product Operations", "Strategy Consulting"],
                functions_to_avoid=["Pure Sales", "Back-office Operations"],
                preferred_industries=["Technology", "E-commerce", "SaaS"],
                max_experience_requirement=5,
                skills_to_develop=["Machine Learning", "Product Strategy", "Growth Hacking"]
            )
        ),
        Candidate(
            id=4,
            name="Sneha Iyer",
            mba_batch="2025-27",
            mba_year="Year 1",
            undergrad_degree="B.Tech",
            undergrad_specialization="Information Technology",
            undergrad_institution="Anna University",
            institution_type="Engineering College",
            current_city="Chennai",
            academics=AcademicRecord(
                class_10_percentage=94.0,
                class_12_percentage=61.4,
                undergrad_percentage=68.0,
                undergrad_cgpa=6.8,
                undergrad_cgpa_scale=10.0,
                mba_cgpa=3.2,
                mba_cgpa_scale=4.0,
                certifications=["Tableau Desktop Specialist", "Python for Everybody (Coursera)"]
            ),
            work_experience=WorkExperience(
                is_fresher=True,
                total_months=0,
                employers=[],
                skills=[
                    "Python", "Tableau", "Excel", "Data Visualization", "Web Development",
                    "HTML/CSS", "JavaScript", "Statistical Analysis", "Problem Solving", "Research"
                ],
                industry_exposure=["Technology", "Analytics"],
                internships=[
                    {
                        "company": "DataKraft Analytics",
                        "role": "BI Intern",
                        "duration": "3 months",
                        "description": "Built operational dashboards in Tableau for supply chain tracking and prepared data validation scripts."
                    }
                ],
                projects=[
                    {
                        "name": "Web Analytics Dashboard",
                        "description": "Created interactive dashboard using Python, HTML/CSS and Tableau to monitor web traffic trends.",
                        "skills_used": ["Python", "Tableau", "Web Development", "HTML/CSS"]
                    },
                    {
                        "name": "Retail Demand Forecasting Analysis",
                        "description": "Performed exploratory statistical data analysis on retail sales dataset.",
                        "skills_used": ["Statistical Analysis", "Data Visualization", "Problem Solving"]
                    }
                ]
            ),
            placement=PlacementInfo(
                current_process_count=3,
                max_permitted_processes=5,
                processes_completed=["TCS", "Cognizant", "Mu Sigma"],
                offers_received=0,
                offers_accepted=0,
                ppo_status="No PPO",
                ppo_company=None,
                active_applications=[],
                restrictions=[],
                restriction_explanation=""
            ),
            preferences=StudentPreferences(
                preferred_functions=["Business Analytics", "Data Analytics", "Technology Consulting"],
                functions_to_avoid=["Field Sales", "Logistics"],
                preferred_industries=["Technology", "Analytics", "Consulting"],
                max_experience_requirement=2,
                skills_to_develop=["Advanced SQL", "Power BI", "Cloud Computing"]
            )
        ),
        Candidate(
            id=5,
            name="Arjun Nair",
            mba_batch="2024-26",
            mba_year="Year 2",
            undergrad_degree="BBA",
            undergrad_specialization="Business Administration",
            undergrad_institution="Christ University Bangalore",
            institution_type="University",
            current_city="Pune",
            academics=AcademicRecord(
                class_10_percentage=82.6,
                class_12_percentage=79.8,
                undergrad_percentage=72.0,
                undergrad_cgpa=7.2,
                undergrad_cgpa_scale=10.0,
                mba_cgpa=3.3,
                mba_cgpa_scale=4.0,
                certifications=["Six Sigma Green Belt", "PMP Fundamentals"]
            ),
            work_experience=WorkExperience(
                is_fresher=False,
                total_months=60,
                employers=[
                    {
                        "company": "Amazon",
                        "title": "Operations Manager",
                        "duration_months": 30,
                        "responsibilities": "Managed warehouse operations for 150+ staff, improved delivery SLA by 12%, designed process workflows, handled vendor relationships"
                    },
                    {
                        "company": "Swiggy",
                        "title": "Customer Success Lead",
                        "duration_months": 30,
                        "responsibilities": "Led customer escalation team, reduced complaint resolution time by 35%, built reporting dashboards, managed cross-functional stakeholder meetings"
                    }
                ],
                skills=[
                    "Operations Management", "Process Improvement", "Excel", "Stakeholder Management",
                    "Project Coordination", "Reporting", "Vendor Management", "Team Leadership",
                    "Communication", "Six Sigma"
                ],
                industry_exposure=["E-commerce", "Supply Chain", "Logistics"],
                internships=[],
                projects=[
                    {
                        "name": "Fulfillment Center Throughput Optimization",
                        "description": "Streamlined inbound sorting workflow implementing lean standard work practices.",
                        "skills_used": ["Operations Management", "Process Improvement", "Six Sigma"]
                    }
                ]
            ),
            placement=PlacementInfo(
                current_process_count=2,
                max_permitted_processes=5,
                processes_completed=["Delhivery", "Shadowfax"],
                offers_received=1,
                offers_accepted=0,
                ppo_status="No PPO",
                ppo_company=None,
                active_applications=[],
                restrictions=[],
                restriction_explanation=""
            ),
            preferences=StudentPreferences(
                preferred_functions=["Operations", "Consulting", "Project Management"],
                functions_to_avoid=["Software Engineering", "Data Science (pure technical)"],
                preferred_industries=["E-commerce", "Supply Chain", "Consulting"],
                max_experience_requirement=5,
                skills_to_develop=["Data Analytics", "Digital Transformation", "Strategy Frameworks"]
            )
        ),
        Candidate(
            id=6,
            name="Kavya Reddy",
            mba_batch="2024-26",
            mba_year="Year 2",
            undergrad_degree="B.Tech",
            undergrad_specialization="Computer Science",
            undergrad_institution="IIT Madras",
            institution_type="Engineering College",
            current_city="Delhi",
            academics=AcademicRecord(
                class_10_percentage=97.8,
                class_12_percentage=96.2,
                undergrad_percentage=91.0,
                undergrad_cgpa=9.1,
                undergrad_cgpa_scale=10.0,
                mba_cgpa=3.8,
                mba_cgpa_scale=4.0,
                certifications=["Google Data Analytics Professional", "Machine Learning Specialization (Stanford Online)"]
            ),
            work_experience=WorkExperience(
                is_fresher=True,
                total_months=0,
                employers=[],
                skills=[
                    "Python", "R", "SQL", "Machine Learning", "Data Analytics",
                    "Statistical Modeling", "Excel", "PowerPoint", "Case Analysis",
                    "Structured Problem Solving", "Communication"
                ],
                industry_exposure=["Consulting", "Technology", "Financial Services"],
                internships=[
                    {
                        "company": "McKinsey & Company",
                        "role": "Business Analyst Intern",
                        "duration": "2 months",
                        "description": "Conducted market size analysis for private equity due diligence and built commercial assessment decks."
                    }
                ],
                projects=[
                    {
                        "name": "Predictive Modeling for Customer Retention",
                        "description": "Trained ML models using Python and R to predict churn on telco benchmark dataset.",
                        "skills_used": ["Python", "R", "Machine Learning", "Statistical Modeling"]
                    }
                ]
            ),
            placement=PlacementInfo(
                current_process_count=5,
                max_permitted_processes=5,
                processes_completed=["Boston Consulting Group", "Oliver Wyman", "Strategy&", "Dalberg"],
                offers_received=3,
                offers_accepted=1,
                ppo_status="No PPO",
                ppo_company=None,
                active_applications=["Bain & Company - Associate Consultant"],
                restrictions=["Accepted offer on record - Further placement participation subject to review"],
                restriction_explanation="Candidate has accepted an offer from McKinsey & Company. Active applications trigger review under demo policy."
            ),
            preferences=StudentPreferences(
                preferred_functions=["Management Consulting", "Strategy", "Business Analytics"],
                functions_to_avoid=["Back-office Operations", "Routine Administration"],
                preferred_industries=["Consulting", "Technology", "Financial Services"],
                max_experience_requirement=3,
                skills_to_develop=["Client Management", "Industry Expertise", "Leadership"]
            )
        ),
        Candidate(
            id=7,
            name="Vikram Singh",
            mba_batch="2024-26",
            mba_year="Year 2",
            undergrad_degree="B.Tech",
            undergrad_specialization="Mechanical",
            undergrad_institution="NIT Warangal",
            institution_type="Engineering College",
            current_city="Gurgaon",
            academics=AcademicRecord(
                class_10_percentage=88.4,
                class_12_percentage=84.6,
                undergrad_percentage=79.0,
                undergrad_cgpa=7.9,
                undergrad_cgpa_scale=10.0,
                mba_cgpa=3.5,
                mba_cgpa_scale=4.0,
                certifications=["Advanced SQL (HackerRank)", "Lean Six Sigma Yellow Belt"]
            ),
            work_experience=WorkExperience(
                is_fresher=False,
                total_months=48,
                employers=[
                    {
                        "company": "Deloitte",
                        "title": "Business Technology Analyst",
                        "duration_months": 24,
                        "responsibilities": "Delivered analytics solutions for banking clients, built Tableau dashboards, performed data modeling, wrote client-facing reports"
                    },
                    {
                        "company": "ZS Associates",
                        "title": "Associate Consultant",
                        "duration_months": 24,
                        "responsibilities": "Conducted market research for pharma clients, built pricing models, designed go-to-market strategies, managed client relationships"
                    }
                ],
                skills=[
                    "SQL", "Tableau", "Data Modeling", "Business Consulting", "Market Research",
                    "Pricing Strategy", "Client Management", "PowerPoint", "Excel",
                    "Python (Basic)", "Problem Solving", "Presentation"
                ],
                industry_exposure=["Consulting", "Technology", "Financial Services", "Pharma"],
                internships=[],
                projects=[
                    {
                        "name": "Pharma Commercial Launch Pricing Engine",
                        "description": "Modeled tiered pricing options and payback scenarios for tier-1 European pharma launch.",
                        "skills_used": ["Pricing Strategy", "Market Research", "Excel"]
                    }
                ]
            ),
            placement=PlacementInfo(
                current_process_count=5,
                max_permitted_processes=5,
                processes_completed=["Deloitte", "ZS Associates", "EY", "KPMG", "PwC"],
                offers_received=1,
                offers_accepted=1,
                ppo_status="PPO Accepted",
                ppo_company="Deloitte",
                active_applications=[],
                restrictions=["PPO Accepted - Further placement participation restricted under demo policy"],
                restriction_explanation="Candidate has accepted a Pre-Placement Offer from Deloitte. Further placement participation is restricted under demo policy."
            ),
            preferences=StudentPreferences(
                preferred_functions=["Analytics", "Management Consulting", "Strategy"],
                functions_to_avoid=["Operations", "Field Sales"],
                preferred_industries=["Consulting", "Technology", "Financial Services"],
                max_experience_requirement=6,
                skills_to_develop=["Advanced Analytics", "AI/ML Applications", "Executive Communication"]
            )
        ),
        Candidate(
            id=8,
            name="Ananya Chatterjee",
            mba_batch="2024-26",
            mba_year="Year 2",
            undergrad_degree="BA Economics",
            undergrad_specialization="Economics",
            undergrad_institution="Presidency University Kolkata",
            institution_type="University",
            current_city="Kolkata",
            academics=AcademicRecord(
                class_10_percentage=86.2,
                class_12_percentage=83.4,
                undergrad_percentage=74.0,
                undergrad_cgpa=7.4,
                undergrad_cgpa_scale=10.0,
                mba_cgpa=3.1,
                mba_cgpa_scale=4.0,
                certifications=["Google Ads Certification", "HubSpot Inbound Marketing"]
            ),
            work_experience=WorkExperience(
                is_fresher=False,
                total_months=18,
                employers=[
                    {
                        "company": "HDFC Bank",
                        "title": "Relationship Manager",
                        "duration_months": 18,
                        "responsibilities": "Managed portfolio of 200+ retail clients, achieved 115% of quarterly targets, conducted financial needs analysis, cross-sold banking products"
                    }
                ],
                skills=[
                    "Relationship Management", "Financial Analysis", "Client Communication",
                    "Sales Analytics", "Excel", "CRM Tools", "Presentation", "Market Analysis",
                    "Business Development", "Report Writing"
                ],
                industry_exposure=["Banking", "Financial Services", "Insurance"],
                internships=[],
                projects=[
                    {
                        "name": "Wealth Management Portfolio Optimization",
                        "description": "Formulated tailored asset allocation strategy for high-net-worth individual clients.",
                        "skills_used": ["Financial Analysis", "Relationship Management", "CRM Tools"]
                    }
                ]
            ),
            placement=PlacementInfo(
                current_process_count=6,
                max_permitted_processes=5,
                processes_completed=["Goldman Sachs", "JP Morgan", "ICICI Bank", "Kotak Mahindra", "Axis Bank", "Bajaj Finserv"],
                offers_received=0,
                offers_accepted=0,
                ppo_status="No PPO",
                ppo_company=None,
                active_applications=[],
                restrictions=["Process count exceeds maximum permitted limit (6/5)"],
                restriction_explanation="Candidate has participated in 6 placement processes, exceeding the configured maximum of 5. Further participation is restricted under the demo placement policy."
            ),
            preferences=StudentPreferences(
                preferred_functions=["Banking", "Financial Services", "Business Development"],
                functions_to_avoid=["IT Infrastructure", "Manufacturing"],
                preferred_industries=["Banking", "Financial Services", "Insurance"],
                max_experience_requirement=3,
                skills_to_develop=["Investment Banking", "Equity Research", "Portfolio Management"]
            )
        ),
        Candidate(
            id=9,
            name="Deepak Joshi",
            mba_batch="2024-26",
            mba_year="Year 2",
            undergrad_degree="BBA",
            undergrad_specialization="Marketing",
            undergrad_institution="Symbiosis Pune",
            institution_type="University",
            current_city="Jaipur",
            academics=AcademicRecord(
                class_10_percentage=84.8,
                class_12_percentage=80.2,
                undergrad_percentage=70.0,
                undergrad_cgpa=7.0,
                undergrad_cgpa_scale=10.0,
                mba_cgpa=3.2,
                mba_cgpa_scale=4.0,
                certifications=["Google Analytics", "Facebook Blueprint"]
            ),
            work_experience=WorkExperience(
                is_fresher=False,
                total_months=24,
                employers=[
                    {
                        "company": "Dentsu",
                        "title": "Marketing Analyst",
                        "duration_months": 14,
                        "responsibilities": "Analyzed campaign performance across digital channels, created weekly reports, optimized ad spend allocation, conducted competitor analysis"
                    },
                    {
                        "company": "Nykaa",
                        "title": "Digital Marketing Executive",
                        "duration_months": 10,
                        "responsibilities": "Managed social media campaigns, tracked conversion funnels, coordinated with creative agencies, planned promotional calendars"
                    }
                ],
                skills=[
                    "Digital Marketing", "Google Analytics", "Social Media Marketing",
                    "Campaign Management", "Excel", "Market Research", "Content Strategy",
                    "Report Writing", "Communication", "Competitor Analysis"
                ],
                industry_exposure=["FMCG", "E-commerce", "Media & Entertainment"],
                internships=[],
                projects=[
                    {
                        "name": "Multi-Channel Attribution Modeling",
                        "description": "Evaluated first-click vs last-touch marketing attribution ROAS across paid search and social channels.",
                        "skills_used": ["Google Analytics", "Campaign Management", "Excel"]
                    }
                ]
            ),
            placement=PlacementInfo(
                current_process_count=3,
                max_permitted_processes=5,
                processes_completed=["Unilever", "Marico"],
                offers_received=1,
                offers_accepted=0,
                ppo_status="No PPO",
                ppo_company=None,
                active_applications=[],
                restrictions=[],
                restriction_explanation=""
            ),
            preferences=StudentPreferences(
                preferred_functions=["Marketing", "Brand Management", "Digital Strategy"],
                functions_to_avoid=["Supply Chain", "Manufacturing Operations"],
                preferred_industries=["FMCG", "E-commerce", "Media & Entertainment"],
                max_experience_requirement=4,
                skills_to_develop=["Advanced SQL", "Python for Analytics", "Marketing Automation (Salesforce/HubSpot Enterprise)"]
            )
        ),
        Candidate(
            id=10,
            name="Meera Kulkarni",
            mba_batch="2024-26",
            mba_year="Year 2",
            undergrad_degree="B.Sc Statistics",
            undergrad_specialization="Statistics",
            undergrad_institution="Fergusson College Pune",
            institution_type="University",
            current_city="Bangalore",
            academics=AcademicRecord(
                class_10_percentage=76.4,
                class_12_percentage=72.8,
                undergrad_percentage=65.0,
                undergrad_cgpa=6.5,
                undergrad_cgpa_scale=10.0,
                mba_cgpa=3.0,
                mba_cgpa_scale=4.0,
                certifications=["PMP Fundamentals (PMI)", "Advanced Excel & VBA"]
            ),
            work_experience=WorkExperience(
                is_fresher=False,
                total_months=36,
                employers=[
                    {
                        "company": "Infosys BPM",
                        "title": "Process Executive",
                        "duration_months": 18,
                        "responsibilities": "Streamlined client onboarding process reducing TAT by 20%, managed team of 8, built Excel-based tracking dashboards, handled client escalations"
                    },
                    {
                        "company": "Wipro",
                        "title": "Project Coordinator",
                        "duration_months": 18,
                        "responsibilities": "Coordinated delivery for 3 concurrent projects, managed stakeholder communications, tracked milestones and budgets, prepared status reports for senior leadership"
                    }
                ],
                skills=[
                    "Project Management", "Process Improvement", "Stakeholder Communication",
                    "Excel (Advanced)", "Team Leadership", "Client Management", "Reporting",
                    "Problem Solving", "Operations Management", "VBA Macros"
                ],
                industry_exposure=["Consulting", "IT Services", "Manufacturing"],
                internships=[],
                projects=[
                    {
                        "name": "Workflow Automation via VBA Macro",
                        "description": "Automated monthly SLA metric collation using VBA scripts, saving 15 staff hours per cycle.",
                        "skills_used": ["VBA Macros", "Excel (Advanced)", "Process Improvement"]
                    }
                ]
            ),
            placement=PlacementInfo(
                current_process_count=2,
                max_permitted_processes=5,
                processes_completed=["Genpact", "Cognizant"],
                offers_received=0,
                offers_accepted=0,
                ppo_status="No PPO",
                ppo_company=None,
                active_applications=[],
                restrictions=[],
                restriction_explanation=""
            ),
            preferences=StudentPreferences(
                preferred_functions=["Operations", "Project Management", "Consulting"],
                functions_to_avoid=["Software Development", "Data Engineering"],
                preferred_industries=["Consulting", "IT Services", "Manufacturing"],
                max_experience_requirement=5,
                skills_to_develop=["Six Sigma", "Data Visualization", "Business Strategy"]
            )
        )
]

_CUSTOM_CANDIDATES: List[Candidate] = []

def get_candidates() -> List[Candidate]:
    return list(_SEED_CANDIDATES) + list(_CUSTOM_CANDIDATES)

def add_candidate(candidate: Candidate) -> Candidate:
    existing_ids = {c.id for c in get_candidates()}
    if candidate.id in existing_ids or candidate.id <= 0:
        candidate.id = max(existing_ids or {0}) + 1
    _CUSTOM_CANDIDATES.append(candidate)
    return candidate

def reset_candidates() -> None:
    _CUSTOM_CANDIDATES.clear()

