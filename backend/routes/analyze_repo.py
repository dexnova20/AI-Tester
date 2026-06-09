import uuid
import traceback
from fastapi import APIRouter, BackgroundTasks
from models.schemas import RepoAnalyzeRequest, ScanResponse
from utils.in_memory_db import save_result, update_status
from agents.planner_agent import PlannerAgent
from agents.crawler_agent import log_message

router = APIRouter()

async def run_repo_analysis(scan_id: str, repo_url: str):
    # 1. Update status
    update_status(scan_id, "running")
    
    try:
        # 2. Run Master Planner Orchestration for repository scan
        await PlannerAgent.execute_repo_scan(repo_url, scan_id)
    except Exception as e:
        traceback.print_exc()
        log_message(scan_id, f"[ERROR] Repo master execution pipeline failed: {e}")
        # Save error state
        error_result = {
            "status": "error",
            "repo_url": repo_url,
            "logs": [f"[ERROR] Execution failed: {e}"],
            "error_detail": str(e)
        }
        save_result(scan_id, error_result)

@router.post("/analyze-repo", response_model=ScanResponse)
async def analyze_repo_endpoint(request: RepoAnalyzeRequest, background_tasks: BackgroundTasks):
    scan_id = str(uuid.uuid4())
    
    save_result(scan_id, {
        "status": "queued",
        "logs": ["Establishing telemetry sockets...", "Awaiting execution threads..."]
    })
    background_tasks.add_task(run_repo_analysis, scan_id, request.repo_url)
    
    return ScanResponse(scan_id=scan_id, status="running")

