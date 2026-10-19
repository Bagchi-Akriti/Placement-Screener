import pytest
import os
import tempfile
from fastapi.testclient import TestClient
from app.main import app
from app.database import init_db

@pytest.fixture(autouse=True)
def setup_test_db(monkeypatch, tmp_path):
    test_db_file = str(tmp_path / "test_placementiq.db")
    monkeypatch.setenv("DATABASE_PATH", test_db_file)
    import app.database
    monkeypatch.setattr(app.database, "DB_PATH", test_db_file)
    
    # Run database initialization
    import asyncio
    asyncio.run(init_db())
    yield

@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client

def test_api_health(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["candidates"] == 10
    assert data["policy_version"] == "1.0.0-demo"

def test_api_candidates_list(client):
    response = client.get("/api/candidates")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 10
    assert data[0]["name"] == "Aarav Sharma"
    assert data[9]["name"] == "Meera Kulkarni"

def test_api_candidate_by_id(client):
    response = client.get("/api/candidates/1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert data["name"] == "Aarav Sharma"
    assert "academics" in data
    assert "work_experience" in data
    assert "placement" in data
    assert "preferences" in data

def test_api_candidate_not_found(client):
    response = client.get("/api/candidates/999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()

def test_api_policy(client):
    response = client.get("/api/policy")
    assert response.status_code == 200
    data = response.json()
    assert data["version"] == "1.0.0-demo"
    assert data["max_process_count"] == 5
    assert len(data["rules"]) >= 7

def test_api_create_and_get_assessment(client):
    payload = {
        "candidate_id": 1,
        "job_title": "Product Analyst",
        "company": "Swiggy",
        "jd_text": """
        Position: Product Analyst
        Company: Swiggy
        We require:
        - SQL
        - Python
        - Excel
        - Wireframing
        """
    }
    create_resp = client.post("/api/assessments", json=payload)
    assert create_resp.status_code == 201
    assessment = create_resp.json()
    assert "assessment_id" in assessment
    assessment_id = assessment["assessment_id"]
    assert assessment["candidate_name"] == "Aarav Sharma"
    assert assessment["job_title"] == "Product Analyst"
    assert assessment["company"] == "Swiggy"
    assert assessment["disposition"] in ["Good Match", "Needs Attention", "Not Eligible"]
    
    # Retrieve all assessments
    list_resp = client.get("/api/assessments")
    assert list_resp.status_code == 200
    all_assessments = list_resp.json()
    assert len(all_assessments) >= 1
    assert any(a["assessment_id"] == assessment_id for a in all_assessments)
    
    # Retrieve by ID
    single_resp = client.get(f"/api/assessments/{assessment_id}")
    assert single_resp.status_code == 200
    single_data = single_resp.json()
    assert single_data["assessment_id"] == assessment_id
    assert single_data["candidate_id"] == 1

def test_api_create_assessment_invalid_candidate(client):
    payload = {
        "candidate_id": 9999,
        "jd_text": "Sample JD"
    }
    response = client.post("/api/assessments", json=payload)
    assert response.status_code == 404

def test_api_assessment_not_found(client):
    response = client.get("/api/assessments/non-existent-uuid-12345")
    assert response.status_code == 404

def test_api_stats(client):
    # Ensure stats endpoint returns valid counts
    response = client.get("/api/stats")
    assert response.status_code == 200
    stats = response.json()
    assert stats["total_candidates"] == 10
    assert "total_assessments" in stats
    assert "good_match_count" in stats
    assert "needs_attention_count" in stats
    assert "not_eligible_count" in stats
    assert isinstance(stats["recent_assessments"], list)
