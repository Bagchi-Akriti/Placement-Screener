import pytest
from app.candidates import get_candidates
from app.models import Candidate

def test_candidates_count_and_unique_ids():
    candidates = get_candidates()
    assert len(candidates) == 10, f"Expected 10 candidates, found {len(candidates)}"
    
    ids = [c.id for c in candidates]
    assert len(ids) == len(set(ids)), "Candidate IDs must be unique"
    assert sorted(ids) == list(range(1, 11)), "Candidate IDs must be exactly 1 to 10"

def test_candidates_all_fields_populated():
    candidates = get_candidates()
    for c in candidates:
        assert isinstance(c, Candidate)
        assert c.name and len(c.name.strip()) > 0
        assert c.mba_batch and len(c.mba_batch.strip()) > 0
        assert c.mba_year and len(c.mba_year.strip()) > 0
        assert c.undergrad_degree and len(c.undergrad_degree.strip()) > 0
        assert c.undergrad_specialization and len(c.undergrad_specialization.strip()) > 0
        assert c.undergrad_institution and len(c.undergrad_institution.strip()) > 0
        assert c.institution_type and len(c.institution_type.strip()) > 0
        assert c.current_city and len(c.current_city.strip()) > 0
        
        # Academics
        acad = c.academics
        assert 0.0 <= acad.class_10_percentage <= 100.0
        assert 0.0 <= acad.class_12_percentage <= 100.0
        assert 0.0 <= acad.undergrad_percentage <= 100.0
        assert 0.0 <= acad.undergrad_cgpa <= acad.undergrad_cgpa_scale
        assert 0.0 <= acad.mba_cgpa <= acad.mba_cgpa_scale
        assert isinstance(acad.certifications, list)
        
        # Work Experience
        work = c.work_experience
        assert isinstance(work.is_fresher, bool)
        assert work.total_months >= 0
        if work.is_fresher:
            assert work.total_months == 0
        else:
            assert work.total_months > 0
            assert len(work.employers) > 0
        assert len(work.skills) > 0
        assert len(work.industry_exposure) > 0
        
        # Placement
        place = c.placement
        assert place.current_process_count >= 0
        assert place.max_permitted_processes == 5
        assert place.offers_received >= 0
        assert place.offers_accepted >= 0
        assert place.ppo_status in ["No PPO", "PPO Received", "PPO Accepted"]
        
        # Preferences
        pref = c.preferences
        assert len(pref.preferred_functions) > 0
        assert len(pref.functions_to_avoid) > 0
        assert len(pref.preferred_industries) > 0
        assert pref.max_experience_requirement > 0
        assert len(pref.skills_to_develop) > 0

def test_specific_candidate_profiles():
    candidates_by_id = {c.id: c for c in get_candidates()}
    
    # Candidate 1: Aarav Sharma - Engineering Fresher
    aarav = candidates_by_id[1]
    assert aarav.name == "Aarav Sharma"
    assert aarav.work_experience.is_fresher is True
    assert "NIT Trichy" in aarav.undergrad_institution
    assert aarav.academics.class_10_percentage == 95.4
    
    # Candidate 2: Priya Deshmukh - Non-Engineering Fresher
    priya = candidates_by_id[2]
    assert priya.name == "Priya Deshmukh"
    assert "B.Com" in priya.undergrad_degree
    assert priya.work_experience.is_fresher is True
    assert "CFA Level 1" in priya.academics.certifications
    
    # Candidate 3: Rohan Mehta - Experienced Product Professional
    rohan = candidates_by_id[3]
    assert rohan.name == "Rohan Mehta"
    assert rohan.work_experience.total_months == 36
    assert len(rohan.work_experience.employers) == 2
    
    # Candidate 4: Sneha Iyer - Academic Inconsistency
    sneha = candidates_by_id[4]
    assert sneha.name == "Sneha Iyer"
    assert sneha.academics.class_12_percentage == 61.4
    
    # Candidate 5: Arjun Nair - Experienced Non-Technical
    arjun = candidates_by_id[5]
    assert arjun.name == "Arjun Nair"
    assert arjun.work_experience.total_months == 60
    assert "Christ University" in arjun.undergrad_institution
    
    # Candidate 6: Kavya Reddy - IIT Madras, Accepted Offer
    kavya = candidates_by_id[6]
    assert kavya.name == "Kavya Reddy"
    assert kavya.placement.offers_accepted == 1
    assert "IIT Madras" in kavya.undergrad_institution
    
    # Candidate 7: Vikram Singh - PPO Accepted
    vikram = candidates_by_id[7]
    assert vikram.name == "Vikram Singh"
    assert vikram.placement.ppo_status == "PPO Accepted"
    assert vikram.placement.ppo_company == "Deloitte"
    
    # Candidate 8: Ananya Chatterjee - Process Limit Crossed
    ananya = candidates_by_id[8]
    assert ananya.name == "Ananya Chatterjee"
    assert ananya.placement.current_process_count == 6
    assert ananya.placement.current_process_count > ananya.placement.max_permitted_processes
    
    # Candidate 9: Deepak Joshi
    deepak = candidates_by_id[9]
    assert deepak.name == "Deepak Joshi"
    assert deepak.work_experience.total_months == 24
    
    # Candidate 10: Meera Kulkarni
    meera = candidates_by_id[10]
    assert meera.name == "Meera Kulkarni"
    assert meera.work_experience.total_months == 36
