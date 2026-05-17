import uuid
import asyncio
from fastapi import APIRouter, BackgroundTasks
from models.schemas import WebsiteTestRequest, ScanResponse
from utils.in_memory_db import save_result, update_status
from services.playwright_service import capture_screenshot
from services.mock_ai_service import get_dummy_website_analysis

router = APIRouter()

async def run_website_test(scan_id: str, url: str):
    # 1. Update status to running
    update_status(scan_id, "running")
    
    # 2. Capture screenshot
    screenshot_path = await capture_screenshot(url, scan_id)
    
    # 3. Simulate AI Analysis
    await asyncio.sleep(2) # simulate AI thinking time
    analysis = get_dummy_website_analysis()
    
    # 4. Save final result
    final_result = {
        "status": "completed",
        "url": url,
        "screenshot": screenshot_path,
        "analysis": analysis
    }
    save_result(scan_id, final_result)

@router.post("/test-website", response_model=ScanResponse)
async def test_website_endpoint(request: WebsiteTestRequest, background_tasks: BackgroundTasks):
    scan_id = str(uuid.uuid4())
    
    # Initialize in DB
    save_result(scan_id, {"status": "queued"})
    
    # Start background task
    background_tasks.add_task(run_website_test, scan_id, request.url)
    
    return ScanResponse(scan_id=scan_id, status="running")
