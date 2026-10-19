import aiosqlite
import json
import os
from typing import List, Optional, Dict, Any

DEFAULT_DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "placementiq.db")
DB_PATH = os.environ.get("DATABASE_PATH", DEFAULT_DB_PATH)

async def init_db():
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute('''
            CREATE TABLE IF NOT EXISTS assessments (
                assessment_id TEXT PRIMARY KEY,
                timestamp TEXT NOT NULL,
                candidate_id INTEGER NOT NULL,
                candidate_name TEXT NOT NULL,
                job_title TEXT,
                company TEXT,
                disposition TEXT NOT NULL,
                role_fit_score REAL,
                jd_eligibility TEXT,
                policy_eligibility TEXT,
                policy_flags TEXT,
                full_result TEXT NOT NULL
            )
        ''')
        await db.commit()

async def save_assessment(result: Dict[str, Any]) -> None:
    flags_data = result.get("policy_flags", [])
    if isinstance(flags_data, list):
        flags_str = json.dumps(flags_data)
    else:
        flags_str = str(flags_data)

    full_result_str = json.dumps(result)
    
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute('''
            INSERT OR REPLACE INTO assessments (
                assessment_id,
                timestamp,
                candidate_id,
                candidate_name,
                job_title,
                company,
                disposition,
                role_fit_score,
                jd_eligibility,
                policy_eligibility,
                policy_flags,
                full_result
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            result["assessment_id"],
            result["timestamp"],
            result["candidate_id"],
            result["candidate_name"],
            result.get("job_title", ""),
            result.get("company", ""),
            result["disposition"],
            float(result.get("role_fit_score", 0.0)),
            result.get("jd_eligibility_status", ""),
            result.get("policy_eligibility_status", ""),
            flags_str,
            full_result_str
        ))
        await db.commit()

async def get_assessments() -> List[Dict[str, Any]]:
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute('SELECT full_result FROM assessments ORDER BY timestamp DESC') as cursor:
            rows = await cursor.fetchall()
            return [json.loads(row["full_result"]) for row in rows]

async def get_assessment(assessment_id: str) -> Optional[Dict[str, Any]]:
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute('SELECT full_result FROM assessments WHERE assessment_id = ?', (assessment_id,)) as cursor:
            row = await cursor.fetchone()
            if row:
                return json.loads(row["full_result"])
            return None
