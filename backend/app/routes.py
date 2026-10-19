from fastapi import APIRouter, HTTPException, status
from typing import List, Dict, Any, Optional
from .models import (
    Candidate,
    AssessmentRequest,
    AssessmentResult,
    PolicyConfig,
    DashboardStats,
    Disposition
)
from .candidates import get_candidates, add_candidate
from .policy import PLACEMENT_POLICY, get_policy
from .screening import run_screening
from .database import save_assessment, get_assessments, get_assessment

router = APIRouter(prefix="/api", tags=["screening"])

@router.get("/health")
async def health_check() -> Dict[str, Any]:
    candidates = get_candidates()
    return {
        "status": "healthy",
        "candidates": len(candidates),
        "policy_version": PLACEMENT_POLICY["version"]
    }

@router.get("/candidates", response_model=List[Candidate])
async def list_candidates() -> List[Candidate]:
    return get_candidates()

@router.get("/candidates/{candidate_id}", response_model=Candidate)
async def get_candidate_by_id(candidate_id: int) -> Candidate:
    for candidate in get_candidates():
        if candidate.id == candidate_id:
            return candidate
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Candidate with ID {candidate_id} not found"
    )

@router.post("/candidates", response_model=Candidate, status_code=status.HTTP_201_CREATED)
async def create_candidate(candidate: Candidate) -> Candidate:
    return add_candidate(candidate)


@router.get("/policy", response_model=PolicyConfig)
async def get_placement_policy() -> PolicyConfig:
    return get_policy()

@router.post("/assessments", response_model=AssessmentResult, status_code=status.HTTP_201_CREATED)
async def create_assessment(request: AssessmentRequest) -> AssessmentResult:
    candidate = None
    for c in get_candidates():
        if c.id == request.candidate_id:
            candidate = c
            break
            
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Candidate with ID {request.candidate_id} not found"
        )
        
    result = run_screening(
        candidate=candidate,
        jd_text=request.jd_text,
        job_title=request.job_title or "",
        company=request.company or ""
    )
    
    await save_assessment(result.model_dump())
    return result

@router.get("/assessments", response_model=List[Dict[str, Any]])
async def list_assessments() -> List[Dict[str, Any]]:
    return await get_assessments()

@router.get("/assessments/{assessment_id}", response_model=Dict[str, Any])
async def get_assessment_by_id(assessment_id: str) -> Dict[str, Any]:
    assessment = await get_assessment(assessment_id)
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assessment with ID {assessment_id} not found"
        )
    return assessment

@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats() -> DashboardStats:
    candidates = get_candidates()
    assessments = await get_assessments()
    
    good_match_count = sum(1 for a in assessments if a.get("disposition") == Disposition.GOOD_MATCH.value)
    needs_attention_count = sum(1 for a in assessments if a.get("disposition") == Disposition.NEEDS_ATTENTION.value)
    not_eligible_count = sum(1 for a in assessments if a.get("disposition") == Disposition.NOT_ELIGIBLE.value)
    
    return DashboardStats(
        total_candidates=len(candidates),
        total_assessments=len(assessments),
        good_match_count=good_match_count,
        needs_attention_count=needs_attention_count,
        not_eligible_count=not_eligible_count,
        recent_assessments=assessments[:5]
    )
