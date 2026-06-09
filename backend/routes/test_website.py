import uuid
import traceback
from fastapi import APIRouter, BackgroundTasks
from models.schemas import WebsiteTestRequest, ScanResponse
from utils.in_memory_db import save_result, update_status
from agents.planner_agent import PlannerAgent
from agents.crawler_agent import log_message

router = APIRouter()

async def run_website_test(scan_id: str, url: str):
    # 1. Set initial status
    update_status(scan_id, "running")
    
    try:
        # 2. Run Master Planner Orchestration
        await PlannerAgent.execute_website_scan(url, scan_id)
    except Exception as e:
        traceback.print_exc()
        log_message(scan_id, f"[ERROR] Master execution pipeline failed: {e}")
        # Save error state
        error_result = {
            "status": "error",
            "url": url,
            "logs": [f"[ERROR] Execution failed: {e}"],
            "error_detail": str(e)
        }
        save_result(scan_id, error_result)

@router.post("/test-website", response_model=ScanResponse)
async def test_website_endpoint(request: WebsiteTestRequest, background_tasks: BackgroundTasks):
    scan_id = str(uuid.uuid4())
    
    # Initialize in database
    save_result(scan_id, {
        "status": "queued",
        "logs": ["Establishing telemetry sockets...", "Awaiting execution threads..."]
    })
    
    # Delegate to planner background task
    background_tasks.add_task(run_website_test, scan_id, request.url)
    
    return ScanResponse(scan_id=scan_id, status="running")
