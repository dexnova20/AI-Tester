import uuid
import asyncio
from fastapi import APIRouter, BackgroundTasks
from models.schemas import WebsiteTestRequest, ScanResponse
from utils.in_memory_db import save_result, update_status, scan_results
from agents.crawler_agent import crawl_and_explore, log_message
from analyzers.issue_detector import run_diagnostics
from services.mock_ai_service import generate_ai_analysis

router = APIRouter()

async def run_website_test(scan_id: str, url: str):
    # 1. Set initial status
    update_status(scan_id, "running")
    
    # 2. Run Crawler Agent (crawls max 3 pages, caps at 45s, saves screenshots, emits real-time logs)
    visited_routes, screenshot_gallery, elements, console_errors = await crawl_and_explore(url, scan_id)
    
    # 3. Process DOM metrics and calculate scores
    log_message(scan_id, "[ANALYZER] Computing UX, Accessibility, and Security scores...")
    await asyncio.sleep(0.6)
    diagnostics = run_diagnostics(url, elements, console_errors)
    
    # 4. Generate AI summaries and recommendations
    log_message(scan_id, "[AI_SERVICE] Initializing deep audit and root-cause analysis...")
    await asyncio.sleep(0.8)
    ai_analysis = generate_ai_analysis(url, elements, diagnostics["findings"], diagnostics["scores"])
    
    # 5. Compile and save results
    log_message(scan_id, "[REPORT] Finalizing and packaging structural audit report...")
    await asyncio.sleep(0.5)
    
    final_result = {
        "status": "completed",
        "url": url,
        "screenshot": screenshot_gallery[0]["path"] if screenshot_gallery else "/screenshots/default.png",
        "screenshot_gallery": screenshot_gallery,
        "logs": scan_results[scan_id].get("logs", []),
        "scores": diagnostics["scores"],
        "findings": diagnostics["findings"],
        "bugs_found": diagnostics["bugs_found"],
        "security_issues": diagnostics["security_issues"],
        "ui_issues": diagnostics["ui_issues"],
        "analysis": {
            "summary": ai_analysis["summary"],
            "suggested_fix": ai_analysis["suggested_fix"],
            "details": ai_analysis["details"],
            "predicted_risk_level": ai_analysis["predicted_risk_level"],
            "bugs_found": diagnostics["bugs_found"],
            "ui_issues": diagnostics["ui_issues"]
        }
    }
    
    save_result(scan_id, final_result)
    log_message(scan_id, "[SYSTEM] Scan process fully complete. Secure socket closed.")

@router.post("/test-website", response_model=ScanResponse)
async def test_website_endpoint(request: WebsiteTestRequest, background_tasks: BackgroundTasks):
    scan_id = str(uuid.uuid4())
    
    # Initialize in database
    save_result(scan_id, {
        "status": "queued",
        "logs": ["Establishing telemetry sockets...", "Awaiting execution threads..."]
    })
    
    # Delegate to worker task
    background_tasks.add_task(run_website_test, scan_id, request.url)
    
    return ScanResponse(scan_id=scan_id, status="running")

