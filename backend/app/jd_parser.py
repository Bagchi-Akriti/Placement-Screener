import re
from typing import Dict, List, Optional, Any, Tuple
from .models import ExtractedRequirement

# Comprehensive skill catalog for keyword identification
KNOWN_SKILLS = [
    # Technical & Data
    "Python", "R", "SQL", "Excel", "Tableau", "Power BI", "Data Analysis", "Machine Learning",
    "Statistical Modeling", "Statistical Analysis", "Data Visualization", "VBA", "Macros",
    "AWS", "Cloud Computing", "Web Development", "HTML", "CSS", "JavaScript",
    # Product & Agile
    "Product Management", "Agile", "Scrum", "JIRA", "Wireframing", "A/B Testing",
    "PRD Writing", "User Story Mapping", "Roadmapping", "Product Strategy", "User Research",
    "Growth Hacking", "Product Analytics", "Feature Prioritization",
    # Business & Consulting
    "Stakeholder Management", "Requirements Gathering", "Business Analysis", "Structured Problem Solving",
    "Case Analysis", "Management Consulting", "Client Management", "Presentation Skills",
    "Business Communication", "Report Writing", "Market Research", "Valuation",
    # Finance
    "Financial Analysis", "Accounting", "Valuation", "Equity Research", "Banking",
    "Financial Modeling", "Portfolio Management", "Investment Banking", "Pricing Strategy",
    # Marketing
    "Digital Marketing", "SEO", "SEM", "Google Analytics", "Social Media Marketing",
    "Campaign Management", "Content Strategy", "Brand Management", "Competitor Analysis",
    "Marketing Automation", "CRM Tools", "HubSpot", "Google Ads", "Facebook Blueprint",
    # Operations
    "Operations Management", "Process Improvement", "Six Sigma", "Lean Six Sigma",
    "Supply Chain", "Vendor Management", "Team Leadership", "Project Management",
    "Project Coordination", "Logistics", "Customer Escalation"
]

SYNONYM_MAP = {
    "ms excel": "Excel",
    "microsoft excel": "Excel",
    "advanced excel": "Excel",
    "excel (advanced)": "Excel",
    "powerpoint": "PowerPoint",
    "ms powerpoint": "PowerPoint",
    "ppt": "PowerPoint",
    "sql": "SQL",
    "structured query language": "SQL",
    "python": "Python",
    "python programming": "Python",
    "data analytics": "Data Analysis",
    "data analysis": "Data Analysis",
    "bi": "Business Analytics",
    "power bi": "Power BI",
    "tableau desktop": "Tableau",
    "tableau": "Tableau",
    "jira": "JIRA",
    "agile/scrum": "Agile",
    "scrum": "Agile",
    "six sigma green belt": "Six Sigma",
    "lean six sigma": "Six Sigma",
    "six sigma": "Six Sigma",
    "financial modeling": "Financial Analysis",
    "financial analysis": "Financial Analysis",
    "pmp": "Project Management",
    "project management": "Project Management",
    "google analytics": "Google Analytics"
}

# Known major enterprise employers
KNOWN_COMPANIES = [
    "Google", "Microsoft", "Amazon", "Swiggy", "Zomato", "Flipkart", "McKinsey", "McKinsey & Company",
    "BCG", "Boston Consulting Group", "Bain & Company", "Bain", "Deloitte", "PwC", "EY", "KPMG",
    "Goldman Sachs", "JP Morgan", "Morgan Stanley", "HDFC Bank", "ICICI Bank", "Standard Chartered",
    "Standard Chartered Bank", "Tata", "Reliance", "Unilever", "P&G", "Nykaa", "ZS Associates",
    "Kearney", "Mu Sigma", "Atlassian", "Uber", "Salesforce", "Cisco", "Infosys", "Wipro",
    "Freshworks", "Dentsu", "Genpact", "Cognizant", "Kotak Mahindra", "Axis Bank", "Bajaj Finserv"
]

# Common role keywords for title detection
KNOWN_ROLES = [
    "Product Manager", "Associate Product Manager", "Product Analyst", "Product Lead",
    "Business Analyst", "Data Analyst", "Analytics Specialist", "BI Analyst",
    "Associate Consultant", "Management Consultant", "Strategy Consultant", "Consultant",
    "Operations Manager", "Operations Lead", "Process Executive", "Supply Chain Analyst",
    "Marketing Manager", "Brand Manager", "Digital Marketing Executive", "Marketing Analyst",
    "Relationship Manager", "Wealth Management Specialist", "Investment Banking Analyst",
    "Financial Analyst", "Systems Analyst", "Software Engineer", "Management Trainee"
]

def normalize_skill(skill: str) -> str:
    cleaned = skill.strip()
    lower = cleaned.lower()
    return SYNONYM_MAP.get(lower, cleaned)

NON_COMPANY_NOISE_WORDS = {
    "wide", "committee", "facilitation", "participation", "management", "developing",
    "regulations", "compliance", "experience", "responsibilities", "qualifications",
    "duties", "requirements", "process", "processes", "system", "systems", "skills",
    "practices", "confidentiality", "communication", "level", "levels", "seminars",
    "meetings", "professionals", "governmental", "practices", "proficient", "knowledge",
    "engagement", "engaging", "procedures", "guidelines", "operations", "policies",
    "department", "division", "description", "summary", "overview", "location"
}

def is_valid_company_name(name: str) -> bool:
    cleaned = name.strip(" \t\r\n-*•#:,")
    if not cleaned or len(cleaned) < 2 or len(cleaned) > 45:
        return False
        
    words = cleaned.split()
    if len(words) > 5:
        return False
        
    lower_words = {w.lower().strip(".,;:()") for w in words}
    if any(nw in lower_words for nw in NON_COMPANY_NOISE_WORDS):
        return False
        
    if words[0].lower() in {"and", "with", "for", "to", "at", "in", "by", "from", "the", "a", "an", "how", "gain", "application", "wide"}:
        return False

    return True

def is_valid_role_title(title: str) -> bool:
    cleaned = title.strip(" \t\r\n-*•#:,")
    if not cleaned or len(cleaned) < 3 or len(cleaned) > 50:
        return False
        
    words = cleaned.split()
    if len(words) > 6:
        return False
        
    lower_words = {w.lower().strip(".,;:()") for w in words}
    if any(nw in lower_words for nw in {"participate", "facilitation", "compliance", "governmental", "confidentiality", "seminars"}):
        return False

    return True

def extract_role_title(jd_text: str, default_title: Optional[str] = None) -> Tuple[str, bool]:
    """
    Extracts role title.
    RULE: If default_title is provided by the user (non-empty), it takes ABSOLUTE PRECEDENCE
    over any text autodetection.
    Returns: (title, is_inferred)
    """
    # 1. USER EXPLICIT OVERRIDE: Always top priority!
    if default_title and default_title.strip() and default_title.strip().lower() not in ["", "management trainee / general associate"]:
        return default_title.strip(), False

    # 2. Explicit labeled formats: Requires colon (:) or spaced dash ( - ) to avoid hyphenated words like role-based
    explicit_match = re.search(r'\b(?:role|title|job\s*title|position|designation|profile)(?:\s*:\s*|\s+[-–—]\s+)([^\n\r]+)', jd_text, re.IGNORECASE)
    if explicit_match:
        val = explicit_match.group(1).strip(" \t\r\n-*•#")
        if is_valid_role_title(val):
            return val, False

    # 3. Known role pattern match in first 5 lines (to avoid picking up past roles mentioned in body)
    first_5_lines = "\n".join(jd_text.splitlines()[:5])
    for role in sorted(KNOWN_ROLES, key=len, reverse=True):
        if re.search(r'\b' + re.escape(role) + r'\b', first_5_lines, re.IGNORECASE):
            return role, False

    # 4. Hiring conversational phrasing: "Looking for a Product Manager to join...", "We are hiring Associate Consultant"
    hiring_match = re.search(
        r'(?:looking\s*for|seeking|hiring(?:\s*for)?|opening\s*for|urgent\s*opening\s*for|wanted)\s*(?:an?|the\s*role\s*of)?\s*([A-Za-z0-9\s\-\/\(\)]{3,60}?)(?:[\.\n\r,]|at\s|in\s|with\s|for\s|\bto\b|\bexperience\b|\brequirements\b)',
        jd_text, re.IGNORECASE
    )
    if hiring_match:
        val = hiring_match.group(1).strip(" \t\r\n-*•#")
        if is_valid_role_title(val):
            return val, False

    # 5. Check first few lines for short header
    for line in jd_text.splitlines()[:3]:
        line = line.strip(" \t\r\n-*•#")
        if is_valid_role_title(line) and not line.lower().startswith(('about', 'company', 'hiring', 'job description', 'overview', 'location', 'experience', 'we are', 'urgent', 'hey', 'dear', 'hello')):
            return line, True

    return "General Management / Associate", True

def extract_company(jd_text: str, default_company: Optional[str] = None) -> Tuple[str, bool]:
    """
    Extracts company name.
    RULE: If default_company is provided by the user (non-empty), it takes ABSOLUTE PRECEDENCE
    over any text autodetection.
    Returns: (company, is_inferred)
    """
    # 1. USER EXPLICIT OVERRIDE: Always top priority!
    if default_company and default_company.strip() and default_company.strip().lower() not in ["", "hiring organization"]:
        return default_company.strip(), False

    # 2. Explicit labeled formats: Requires colon (:) or spaced dash ( - )
    # Crucial: NEVER match compound adjectives like organization-wide or company-wide!
    explicit_match = re.search(r'\b(?:company|organization|firm|employer|client|hiring\s*entity)(?:\s*:\s*|\s+[-–—]\s+)([^\n\r]+)', jd_text, re.IGNORECASE)
    if explicit_match:
        val = explicit_match.group(1).strip(" \t\r\n-*•#")
        if is_valid_company_name(val):
            return val, False

    # 3. Contextual employer patterns (About <Company>, <Company> is hiring, Join <Company>)
    about_match = re.search(r'About\s+([A-Za-z0-9&\'\.\s]{2,40}?)(?:[:\n\r\-]|is\s+a|is\s+an|\s+is\s+the|\s+team\b)', jd_text, re.IGNORECASE)
    if about_match:
        val = about_match.group(1).strip(" \t\r\n-*•#")
        if is_valid_company_name(val):
            return val, False

    hiring_co_match = re.search(r'([A-Z][A-Za-z0-9&\'\.]{1,30}(?:\s+[A-Z][A-Za-z0-9&\'\.]+)?)\s+is\s+(?:hiring|looking for|seeking|recruiting|inviting)', jd_text)
    if hiring_co_match:
        val = hiring_co_match.group(1).strip()
        if is_valid_company_name(val):
            return val, False

    join_match = re.search(r'(?:join|careers\s*at|welcome\s*to)\s+([A-Z][A-Za-z0-9&\'\.]{1,30}(?:\s+[A-Z][A-Za-z0-9&\'\.]+)?)(?:\s*,|\s+as\b|\s+team\b|\s+family\b|\.|\n)', jd_text, re.IGNORECASE)
    if join_match:
        val = join_match.group(1).strip()
        if is_valid_company_name(val):
            return val, False

    # 4. Check first 3 lines only for known enterprise employers (prevents matching tools/clients in body)
    first_3_lines = "\n".join(jd_text.splitlines()[:3])
    for comp in sorted(KNOWN_COMPANIES, key=len, reverse=True):
        if re.search(r'\b' + re.escape(comp) + r'\b', first_3_lines, re.IGNORECASE):
            return comp, False

    return "Hiring Organization (Unspecified in JD)", True

def classify_function(jd_text: str, job_title: str) -> str:
    combined = f"{job_title} {jd_text}".lower()
    
    # Priority checks on job title first
    if any(k in job_title.lower() for k in ["product manager", "product analyst", "apm", "associate product", "product lead"]):
        return "Product Management"
    if any(k in job_title.lower() for k in ["consultant", "associate consultant", "management consultant", "strategy consultant"]):
        return "Consulting"
    if any(k in job_title.lower() for k in ["analytics", "data analyst", "business analyst", "bi analyst", "analytics specialist"]):
        return "Business Analytics"
    if any(k in job_title.lower() for k in ["marketing", "brand", "digital marketing", "seo", "campaign"]):
        return "Marketing"
    if any(k in job_title.lower() for k in ["finance", "financial", "investment", "valuation", "equity", "wealth management"]):
        return "Finance"
    if any(k in job_title.lower() for k in ["operations", "supply chain", "logistics", "procurement"]):
        return "Operations"
    if any(k in job_title.lower() for k in ["sales", "business development", "bdm", "bdr", "account executive"]):
        return "Sales"
    if any(k in job_title.lower() for k in ["strategy", "strategic planning"]):
        return "Strategy"
    if any(k in job_title.lower() for k in ["hr", "human resources", "talent"]):
        return "HR"
    if any(k in job_title.lower() for k in ["software", "developer", "engineer", "backend", "frontend"]):
        return "Technology"
    if any(k in job_title.lower() for k in ["general management", "management trainee", "leadership program"]):
        return "General Management"

    # Search in full text with weighted frequencies
    scores = {
        "Product Management": sum(combined.count(w) for w in ["product management", "product manager", "prd", "wireframe", "user stories", "roadmap", "backlog"]),
        "Business Analytics": sum(combined.count(w) for w in ["business analyst", "data analytics", "data analyst", "bi", "tableau", "power bi", "statistical"]),
        "Consulting": sum(combined.count(w) for w in ["consulting", "advisory", "client facing", "case analysis", "consultant"]),
        "Finance": sum(combined.count(w) for w in ["financial", "investment", "valuation", "equity research", "accounting", "portfolio", "banking"]),
        "Marketing": sum(combined.count(w) for w in ["marketing", "brand", "digital marketing", "campaign", "social media", "market research"]),
        "Operations": sum(combined.count(w) for w in ["operations", "supply chain", "logistics", "warehouse", "sla", "process improvement"]),
        "Sales": sum(combined.count(w) for w in ["sales", "revenue", "leads", "business development", "inside sales"]),
        "Strategy": sum(combined.count(w) for w in ["corporate strategy", "strategic planning", "growth strategy"]),
        "Technology": sum(combined.count(w) for w in ["software", "engineering", "coding", "python developer", "full stack"]),
        "HR": sum(combined.count(w) for w in ["human resources", "talent acquisition", "recruitment", "payroll"]),
        "General Management": sum(combined.count(w) for w in ["general management", "management trainee", "cross-functional leadership"])
    }
    
    top_function = max(scores, key=scores.get)
    if scores[top_function] > 0:
        return top_function
    return "Other"

def extract_experience(jd_text: str) -> Dict[str, Any]:
    # 1. Check for fresher friendly phrases first across any wording
    fresher_match = re.search(
        r'\b(freshers?(?:\s*(?:welcome|eligible|can apply|only|encouraged))?|0\s*[-–to]\s*[01]\s*(?:years?|yrs?|y)|no\s*(?:prior\s*)?experience\s*(?:required|needed)|campus\s*hiring|campus\s*recruitment|entry\s*level|batch\s*of\s*20\d\d)\b',
        jd_text, re.IGNORECASE
    )
    if fresher_match:
        return {
            "min_years": 0.0,
            "max_years": 1.0,
            "evidence": fresher_match.group(0),
            "specified": True,
            "is_fresher_eligible": True
        }
    
    # 2. Check for explicit "Experience: None / Nil / 0"
    zero_exp_match = re.search(r'(?:experience|exp)\s*[:\-]\s*(?:nil|none|na|n/a|0|zero|fresher)', jd_text, re.IGNORECASE)
    if zero_exp_match:
        return {
            "min_years": 0.0,
            "max_years": 1.0,
            "evidence": zero_exp_match.group(0),
            "specified": True,
            "is_fresher_eligible": True
        }

    # 3. Pattern: X to Y years / X-Y years / X-Y yrs / X-Y y
    range_match = re.search(r'(\d+(?:\.\d+)?)\s*[-–to]+\s*(\d+(?:\.\d+)?)\s*(?:years?|yrs?|y)(?:\s*(?:of)?\s*(?:relevant|work|full[- ]time)?\s*exp(?:erience)?)?', jd_text, re.IGNORECASE)
    if range_match:
        min_y = float(range_match.group(1))
        max_y = float(range_match.group(2))
        return {
            "min_years": min_y,
            "max_years": max_y,
            "evidence": range_match.group(0),
            "specified": True,
            "is_fresher_eligible": min_y == 0
        }
    
    # 4. Pattern: minimum X years / at least X years / X+ years
    min_match = re.search(r'(?:minimum|at\s*least|min\.?)\s*(\d+(?:\.\d+)?)\s*(?:years?|yrs?|y)(?:\s*(?:of)?\s*exp)?', jd_text, re.IGNORECASE)
    if min_match:
        min_y = float(min_match.group(1))
        return {
            "min_years": min_y,
            "max_years": None,
            "evidence": min_match.group(0),
            "specified": True,
            "is_fresher_eligible": min_y == 0
        }

    plus_match = re.search(r'(\d+(?:\.\d+)?)\s*\+\s*(?:years?|yrs?|y)(?:\s*(?:of)?\s*(?:relevant|work)?\s*exp(?:erience)?)?', jd_text, re.IGNORECASE)
    if plus_match:
        min_y = float(plus_match.group(1))
        return {
            "min_years": min_y,
            "max_years": None,
            "evidence": plus_match.group(0),
            "specified": True,
            "is_fresher_eligible": min_y == 0
        }

    # 5. Month ranges (e.g. 18-24 months)
    month_match = re.search(r'(\d+)\s*[-–to]+\s*(\d+)\s*months?(?:\s*exp(?:erience)?)?', jd_text, re.IGNORECASE)
    if month_match:
        min_y = round(float(month_match.group(1)) / 12.0, 1)
        max_y = round(float(month_match.group(2)) / 12.0, 1)
        return {
            "min_years": min_y,
            "max_years": max_y,
            "evidence": month_match.group(0),
            "specified": True,
            "is_fresher_eligible": min_y == 0
        }

    # 6. Single month mention (e.g. 24+ months)
    single_month = re.search(r'(\d+)\s*\+?\s*months?(?:\s*(?:of)?\s*exp(?:erience)?)?', jd_text, re.IGNORECASE)
    if single_month:
        min_y = round(float(single_month.group(1)) / 12.0, 1)
        return {
            "min_years": min_y,
            "max_years": None,
            "evidence": single_month.group(0),
            "specified": True,
            "is_fresher_eligible": min_y == 0
        }

    # 7. Unspecified experience
    return {
        "min_years": None,
        "max_years": None,
        "evidence": "No explicit experience requirement specified in JD",
        "specified": False,
        "is_fresher_eligible": True
    }

def extract_education(jd_text: str) -> Dict[str, Any]:
    text_lower = jd_text.lower()
    degrees_mentioned = []
    
    if any(term in text_lower for term in ["b.tech", "btech", "b.e.", "b.e", "bachelor of technology", "bachelor of engineering"]):
        degrees_mentioned.append("B.Tech / B.E.")
    if "engineering" in text_lower or "engineer" in text_lower:
        degrees_mentioned.append("Engineering")
    if any(term in text_lower for term in ["mba", "pgdm", "master of business administration"]):
        degrees_mentioned.append("MBA / PGDM")
    if any(term in text_lower for term in ["b.com", "bcom", "bachelor of commerce"]):
        degrees_mentioned.append("B.Com")
    if any(term in text_lower for term in ["bba", "bms", "bachelor of business administration"]):
        degrees_mentioned.append("BBA")
    if any(term in text_lower for term in ["b.sc", "bsc", "bachelor of science", "statistics", "mathematics", "economics"]):
        degrees_mentioned.append("B.Sc / Statistics / Economics")
    if any(term in text_lower for term in ["any graduate", "any graduation", "any degree", "graduate in any"]):
        degrees_mentioned.append("Any Graduate")
    
    # Check if engineering is strictly mandatory across any conversational wording
    is_engg_mandatory = bool(re.search(
        r'(?:mandatory|strictly|must\s*have|required|only|compulsory)\s*[:\-\s]?\s*(?:b\.?tech|b\.?e\.?|engineering|bachelor\s*of\s*engineering)',
        jd_text, re.IGNORECASE
    ) or re.search(
        r'(?:b\.?tech|b\.?e\.?|engineering|bachelor\s*of\s*engineering)(?:\s*degree)?\s*(?:mandatory|strictly\s*required|is\s*mandatory|only|required|compulsory)',
        jd_text, re.IGNORECASE
    ) or re.search(
        r'\b(?:engineers\s+only|only\s+engineers)\b',
        jd_text, re.IGNORECASE
    ))

    # General evidence
    evidence = "Not specified"
    edu_match = re.search(r'(?:qualification|education|eligibility|degree)\s*[:\-]\s*([^\n\r]+)', jd_text, re.IGNORECASE)
    if edu_match:
        evidence = edu_match.group(0).strip()
    elif degrees_mentioned:
        evidence = f"Mentions: {', '.join(set(degrees_mentioned))}"
        
    return {
        "degrees": list(set(degrees_mentioned)),
        "is_engineering_mandatory": is_engg_mandatory,
        "evidence": evidence,
        "specified": len(degrees_mentioned) > 0
    }

def extract_academic_cutoffs(jd_text: str) -> Dict[str, Any]:
    cutoffs = {
        "class_10": None,
        "class_12": None,
        "undergrad": None,
        "mba": None,
        "cgpa": None,
        "generic_percentage": None,
        "evidence_list": []
    }
    
    # Class 10 cutoff
    c10 = re.search(r'(?:class\s*10(?:th)?|10th|ssc|matric)\s*[:\-]?\s*(?:minimum|min|aggregate)?\s*(\d{2}(?:\.\d+)?)\s*%', jd_text, re.IGNORECASE)
    if c10:
        cutoffs["class_10"] = float(c10.group(1))
        cutoffs["evidence_list"].append(f"Class 10 minimum: {c10.group(1)}% (found: '{c10.group(0)}')")
        
    # Class 12 cutoff
    c12 = re.search(r'(?:class\s*12(?:th)?|12th|hsc|inter(?:mediate)?)\s*[:\-]?\s*(?:minimum|min|aggregate)?\s*(\d{2}(?:\.\d+)?)\s*%', jd_text, re.IGNORECASE)
    if c12:
        cutoffs["class_12"] = float(c12.group(1))
        cutoffs["evidence_list"].append(f"Class 12 minimum: {c12.group(1)}% (found: '{c12.group(0)}')")
        
    # Undergrad cutoff
    ug = re.search(r'(?:ug|undergrad(?:uation)?|b\.?tech|b\.?e\.?|graduation)\s*[:\-]?\s*(?:minimum|min|aggregate)?\s*(\d{2}(?:\.\d+)?)\s*%', jd_text, re.IGNORECASE)
    if ug:
        cutoffs["undergrad"] = float(ug.group(1))
        cutoffs["evidence_list"].append(f"Undergraduate minimum: {ug.group(1)}% (found: '{ug.group(0)}')")
        
    # CGPA cutoff
    cgpa_m = re.search(r'(?:cgpa|gpa)\s*(?:of|min|minimum|>=|>)?\s*(\d+(?:\.\d+)?)\s*(?:/|out of)?\s*(10|4)?', jd_text, re.IGNORECASE)
    if cgpa_m:
        cutoffs["cgpa"] = float(cgpa_m.group(1))
        cutoffs["evidence_list"].append(f"CGPA minimum: {cgpa_m.group(1)} (found: '{cgpa_m.group(0)}')")

    # Generic percentage throughout (e.g. "60% throughout", "minimum 65% aggregate in 10th, 12th, graduation")
    throughout = re.search(r'(?:minimum|min\.?)\s*(\d{2}(?:\.\d+)?)\s*%\s*(?:in|throughout|across|aggregate|all)', jd_text, re.IGNORECASE)
    if not throughout:
        throughout = re.search(r'(\d{2}(?:\.\d+)?)\s*%\s*(?:plus|\+)?\s*(?:across|throughout|in\s*academics)', jd_text, re.IGNORECASE)

    if throughout:
        val = float(throughout.group(1))
        cutoffs["generic_percentage"] = val
        cutoffs["evidence_list"].append(f"Minimum academic cutoff throughout: {val}% (found: '{throughout.group(0)}')")
        if cutoffs["class_10"] is None:
            cutoffs["class_10"] = val
        if cutoffs["class_12"] is None:
            cutoffs["class_12"] = val
        if cutoffs["undergrad"] is None:
            cutoffs["undergrad"] = val

    return cutoffs

def extract_skills(jd_text: str) -> Dict[str, Any]:
    required_skills = set()
    preferred_skills = set()
    
    # Try section based splitting
    req_section = ""
    pref_section = ""
    
    req_match = re.search(r'(?:required\s*(?:skills|qualifications)|must\s*have|mandatory\s*skills|key\s*requirements|qualifications)([\s\S]*?)(?:preferred|nice\s*to\s*have|good\s*to\s*have|responsibilities|what\s*you\s*will\s*do|$)', jd_text, re.IGNORECASE)
    if req_match:
        req_section = req_match.group(1)
        
    pref_match = re.search(r'(?:preferred\s*(?:skills|qualifications)|good\s*to\s*have|nice\s*to\s*have|desirable|bonus)([\s\S]*?)(?:responsibilities|requirements|what\s*we\s*offer|$)', jd_text, re.IGNORECASE)
    if pref_match:
        pref_section = pref_match.group(1)

    for skill in KNOWN_SKILLS:
        pattern = r'\b' + re.escape(skill) + r'\b'
        
        # Check in preferred section first
        if pref_section and re.search(pattern, pref_section, re.IGNORECASE):
            preferred_skills.add(skill)
        elif req_section and re.search(pattern, req_section, re.IGNORECASE):
            required_skills.add(skill)
        elif re.search(pattern, jd_text, re.IGNORECASE):
            # Proximity check for "preferred" or "good to have" within 60 chars preceding the skill
            ctx = re.search(r'(?:preferred|good to have|bonus|nice to have|plus).{0,60}\b' + re.escape(skill) + r'\b', jd_text, re.IGNORECASE)
            if ctx:
                preferred_skills.add(skill)
            else:
                required_skills.add(skill)
                
    has_segmentation = bool(req_section or pref_section)
    return {
        "required_skills": sorted(list(required_skills)),
        "preferred_skills": sorted(list(preferred_skills)),
        "all_skills": sorted(list(required_skills.union(preferred_skills))),
        "has_segmentation": has_segmentation
    }

def extract_responsibilities(jd_text: str) -> List[str]:
    resp_match = re.search(r'(?:responsibilities|key\s*responsibilities|what\s*you(?:[\'\’]ll|\s*will)\s*do|roles?\s*and\s*responsibilities|duties)([\s\S]*?)(?:requirements|skills|qualifications|about\s*you|who\s*you\s*are|$)', jd_text, re.IGNORECASE)
    responsibilities = []
    if resp_match:
        chunk = resp_match.group(1)
        for line in chunk.splitlines():
            line = line.strip(" -*•\t")
            if len(line) > 15:
                responsibilities.append(line)
    return responsibilities[:10]

def generate_data_quality_flags(
    experience: Dict[str, Any],
    education: Dict[str, Any],
    cutoffs: Dict[str, Any],
    skills: Dict[str, Any],
    responsibilities: List[str],
    is_title_inferred: bool,
    is_company_inferred: bool,
    job_title: str,
    company: str
) -> List[Dict[str, str]]:
    """
    Generates plain-language completeness and data-quality flags for missing or unstructured HR input.
    """
    flags: List[Dict[str, str]] = []

    # 1. Experience requirement flag
    if not experience["specified"]:
        flags.append({
            "field": "Work Experience",
            "flag": "Unspecified Experience Requirement",
            "status": "Missing",
            "severity": "Info",
            "description": "The JD does not specify minimum or maximum years of experience.",
            "interpretation": "Screening assumes open eligibility; both freshers and experienced candidates are permitted to participate."
        })

    # 2. Academic cutoff flag
    if not cutoffs["evidence_list"]:
        flags.append({
            "field": "Academic Cutoffs",
            "flag": "No Academic Percentage / CGPA Cutoff",
            "status": "Missing",
            "severity": "Info",
            "description": "HR did not specify minimum percentage marks for Class 10, 12, or Undergraduate degree.",
            "interpretation": "No mandatory academic screening cutoff is enforced. Candidate evaluation relies on role fit scoring."
        })

    # 3. Education / Degree requirement flag
    if not education["specified"]:
        flags.append({
            "field": "Educational Qualification",
            "flag": "Open Undergraduate Discipline",
            "status": "Missing",
            "severity": "Info",
            "description": "No specific undergraduate degree (B.Tech, B.Com, BBA, B.Sc) was mandated in the JD.",
            "interpretation": "All MBA candidates regardless of undergraduate stream are eligible for consideration."
        })
    elif not education["is_engineering_mandatory"] and "Engineering" not in education["degrees"] and "B.Tech / B.E." not in education["degrees"]:
        flags.append({
            "field": "Educational Qualification",
            "flag": "Non-Engineering Friendly Role",
            "status": "Complete",
            "severity": "Info",
            "description": f"Role welcomes candidates with degrees in {', '.join(education['degrees'])}.",
            "interpretation": "Non-engineering candidates will not face technical degree disqualification."
        })

    # 4. Hiring Organization flag
    if is_company_inferred:
        flags.append({
            "field": "Hiring Organization",
            "flag": "Company Name Inferred / Unspecified",
            "status": "Inferred",
            "severity": "Warning",
            "description": f"Hiring company was not explicitly specified with a clear 'Company:' label; resolved as '{company}'.",
            "interpretation": "Verify employer identity with placement cell coordinator if NDA/blind hiring is active."
        })

    # 5. Job Title flag
    if is_title_inferred:
        flags.append({
            "field": "Role Title",
            "flag": "Job Title Inferred from Context",
            "status": "Inferred",
            "severity": "Warning",
            "description": f"Role title was not formatted with a clear 'Role:' label; resolved as '{job_title}'.",
            "interpretation": "Functional role fit was classified based on extracted keyword frequency."
        })

    # 6. Skills segmentation flag
    if not skills["has_segmentation"] and len(skills["all_skills"]) > 0:
        flags.append({
            "field": "Skills Demarcation",
            "flag": "Unsegmented Skills List",
            "status": "Inferred",
            "severity": "Info",
            "description": "JD did not separate 'Must Have' from 'Good to Have' skills.",
            "interpretation": "Extracted skills were categorized contextually. Candidate alignment score evaluated across all detected competencies."
        })
    elif len(skills["all_skills"]) == 0:
        flags.append({
            "field": "Skills Specification",
            "flag": "No Standard Competencies Extracted",
            "status": "Missing",
            "severity": "Warning",
            "description": "HR JD did not include recognizable standard technical or analytical skills.",
            "interpretation": "Role fit scoring utilizes general educational strength and past experience background."
        })

    # 7. Responsibilities flag
    if len(responsibilities) == 0:
        flags.append({
            "field": "Job Responsibilities",
            "flag": "No Detailed Responsibilities Enumerated",
            "status": "Missing",
            "severity": "Info",
            "description": "JD did not outline day-to-day deliverables or task responsibilities.",
            "interpretation": "Responsibilities alignment dimension defaults to standard baseline scoring."
        })

    return flags

def parse_job_description(jd_text: str, default_title: Optional[str] = None, default_company: Optional[str] = None) -> Dict[str, Any]:
    job_title, is_title_inferred = extract_role_title(jd_text, default_title)
    company, is_company_inferred = extract_company(jd_text, default_company)
    function = classify_function(jd_text, job_title)
    experience = extract_experience(jd_text)
    education = extract_education(jd_text)
    cutoffs = extract_academic_cutoffs(jd_text)
    skills = extract_skills(jd_text)
    responsibilities = extract_responsibilities(jd_text)
    
    # Generate data quality flags for missing or unstructured HR JD data
    data_quality_flags = generate_data_quality_flags(
        experience=experience,
        education=education,
        cutoffs=cutoffs,
        skills=skills,
        responsibilities=responsibilities,
        is_title_inferred=is_title_inferred,
        is_company_inferred=is_company_inferred,
        job_title=job_title,
        company=company
    )

    extracted_requirements: List[ExtractedRequirement] = []
    
    # 1. Experience
    if experience["specified"]:
        exp_val = f"{experience['min_years']} - {experience['max_years']} years" if experience["max_years"] else f"Min {experience['min_years']} years"
        extracted_requirements.append(ExtractedRequirement(
            name="Work Experience",
            is_mandatory=True,
            extracted_value=exp_val,
            evidence_text=experience["evidence"],
            confidence="High"
        ))
    else:
        extracted_requirements.append(ExtractedRequirement(
            name="Work Experience",
            is_mandatory=False,
            extracted_value="Not Specified / Open to Freshers",
            evidence_text="No explicit experience requirement found in JD text (Flagged: Missing Info)",
            confidence="Medium"
        ))

    # 2. Education
    if education["specified"]:
        val = ", ".join(education["degrees"])
        extracted_requirements.append(ExtractedRequirement(
            name="Education / Degree",
            is_mandatory=education["is_engineering_mandatory"],
            extracted_value=val,
            evidence_text=education["evidence"],
            confidence="High" if education["is_engineering_mandatory"] else "Medium"
        ))
    else:
        extracted_requirements.append(ExtractedRequirement(
            name="Education / Degree",
            is_mandatory=False,
            extracted_value="Open to Any Graduate / MBA",
            evidence_text="No specific degree mandated in JD text (Flagged: Missing Info)",
            confidence="Medium"
        ))

    # 3. Academic Cutoffs
    if cutoffs["evidence_list"]:
        for ev in cutoffs["evidence_list"]:
            extracted_requirements.append(ExtractedRequirement(
                name="Academic Threshold",
                is_mandatory=True,
                extracted_value=ev,
                evidence_text=ev,
                confidence="High"
            ))
    else:
        extracted_requirements.append(ExtractedRequirement(
            name="Academic Threshold",
            is_mandatory=False,
            extracted_value="No cut-off specified",
            evidence_text="No minimum percentage or CGPA cutoff identified in JD text (Flagged: Open Academic Eligibility)",
            confidence="High"
        ))

    # 4. Required Skills
    if skills["required_skills"]:
        extracted_requirements.append(ExtractedRequirement(
            name="Required Skills",
            is_mandatory=True,
            extracted_value=", ".join(skills["required_skills"]),
            evidence_text=f"Extracted {len(skills['required_skills'])} core skills from JD text",
            confidence="High" if skills["has_segmentation"] else "Medium"
        ))

    # 5. Preferred Skills
    if skills["preferred_skills"]:
        extracted_requirements.append(ExtractedRequirement(
            name="Preferred Skills",
            is_mandatory=False,
            extracted_value=", ".join(skills["preferred_skills"]),
            evidence_text=f"Extracted {len(skills['preferred_skills'])} desirable skills from JD text",
            confidence="High" if skills["has_segmentation"] else "Medium"
        ))

    return {
        "job_title": job_title,
        "company": company,
        "function": function,
        "experience": experience,
        "education": education,
        "cutoffs": cutoffs,
        "skills": skills,
        "responsibilities": responsibilities,
        "extracted_requirements": extracted_requirements,
        "data_quality_flags": data_quality_flags
    }
