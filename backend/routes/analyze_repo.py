import uuid
import asyncio
from fastapi import APIRouter, BackgroundTasks
from models.schemas import RepoAnalyzeRequest, ScanResponse
from utils.in_memory_db import save_result, update_status
from services.repo_analyzer_service import simulate_repo_analysis
from services.mock_ai_service import get_dummy_repo_analysis

router = APIRouter()

async def run_repo_analysis(scan_id: str, repo_url: str):
    # 1. Update status
    update_status(scan_id, "running")
    
    # 2. Simulate repo execution
    repo_data = await simulate_repo_analysis(repo_url, scan_id)
    
    # 3. Simulate AI Analysis based on project type
    await asyncio.sleep(2)
    analysis = get_dummy_repo_analysis(repo_data["project_type"])
    
    # 4. Save final result
    final_result = {
        "status": "completed",
        "repo_url": repo_url,
        "project_type": repo_data["project_type"],
        "logs": repo_data["logs"],
        "log_file": repo_data["log_file"],
        "analysis": analysis
    }
    save_result(scan_id, final_result)

@router.post("/analyze-repo", response_model=ScanResponse)
async def analyze_repo_endpoint(request: RepoAnalyzeRequest, background_tasks: BackgroundTasks):
    scan_id = str(uuid.uuid4())
    
    save_result(scan_id, {"status": "queued"})
    background_tasks.add_task(run_repo_analysis, scan_id, request.repo_url)
    
    return ScanResponse(scan_id=scan_id, status="running")
