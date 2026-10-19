# PlacementIQ — Placement Screening & Role Fit Dashboard

> **MBA Placement Screening Dashboard** — A professional web application for screening MBA candidates against arbitrary job descriptions using configurable placement rules.

![Demo](https://img.shields.io/badge/status-demo-blue) ![Python](https://img.shields.io/badge/python-3.11+-green) ![React](https://img.shields.io/badge/react-18-blue) ![License](https://img.shields.io/badge/license-academic-orange)

> [!NOTE]
> All candidate data in this application is **synthetic and fictional**, created for academic demonstration purposes only. This does not represent any real institution's placement policy.

## 🌐 Live Demo

🔗 **Demo Application:** [https://frontend-bice-theta-4snkv1jq6x.vercel.app](https://frontend-bice-theta-4snkv1jq6x.vercel.app)

## Quick Start

### Prerequisites
- Python 3.11+ with pip
- Node.js 18+ with npm

### Step 1: Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Build the Frontend
```bash
cd frontend
npm install
npm run build
```

### Step 3: Start the Application
```bash
cd backend
python run.py
```

Open **http://localhost:8000** in your browser. The full application (React UI + API) is served from a single port.

### Alternative: Development Mode (hot-reload)
```bash
# Terminal 1: Backend
cd backend
python run.py

# Terminal 2: Frontend dev server
cd frontend
npm run dev
```
Then open **http://localhost:5173** (proxies API calls to backend on port 8000).

## Architecture

```
PlacementIQ/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI app with SPA serving
│   │   ├── routes.py          # REST API endpoints
│   │   ├── models.py          # Pydantic schemas
│   │   ├── candidates.py      # 10 seeded candidate profiles
│   │   ├── policy.py          # Placement policy configuration
│   │   ├── screening.py       # Core screening engine (5-stage pipeline)
│   │   ├── jd_parser.py       # Deterministic JD text parser
│   │   └── database.py        # SQLite persistence
│   ├── tests/                 # 26 automated tests
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── components/        # AssessmentReport, CandidateCard, ScoreGauge, etc.
│   │   ├── pages/             # Overview, CandidateDirectory, NewScreening, etc.
│   │   ├── services/          # API client
│   │   └── types/             # TypeScript type definitions
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Key Features

- **10 Complete Candidate Profiles** — Realistic fictional MBA students with academics, experience, skills, placement status
- **Arbitrary JD Screening** — Paste any job description and get an instant multi-dimensional assessment
- **Deterministic Engine** — No external AI/LLM required; rule-based with semantic skill matching
- **Configurable Policy** — 7 placement rules (process limits, PPO, offers, academics, experience, degree, preferences)
- **Assessment Persistence** — SQLite-backed history with full audit trails
- **Professional Dashboard** — Modern HR analytics UI with 7 navigable pages

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/candidates` | List all 10 candidates |
| GET | `/api/candidates/{id}` | Get candidate profile |
| GET | `/api/policy` | Get placement policy |
| POST | `/api/assessments` | Run a screening |
| GET | `/api/assessments` | List saved assessments |
| GET | `/api/assessments/{id}` | Get specific assessment |
| GET | `/api/stats` | Dashboard statistics |

## Screening Engine

5-stage pipeline:
1. **JD Parsing** — Deterministic extraction of requirements, skills, thresholds
2. **Policy Verification** — Process count, PPO, offer checks (hard blocks)
3. **JD Eligibility** — Education, experience, academic cutoff checks
4. **Role Fit Scoring** — Skills (40%), Experience (25%), Education (15%), Responsibilities (15%), Preferences (5%)
5. **Disposition** — Good Match / Needs Attention / Not Eligible

**Hard restrictions always override role-fit scores.**

## Testing
```bash
cd backend
python -m pytest tests/ -v
```

All 26 tests cover: candidate data integrity, screening logic (11 scenarios), and API endpoints.

## License

Academic project — for demonstration purposes only.
