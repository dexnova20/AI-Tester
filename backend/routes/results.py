from fastapi import APIRouter, HTTPException
from services.storage_service import StorageService

router = APIRouter()

@router.get("/results/{scan_id}")
async def get_scan_result(scan_id: str):
    result = StorageService.get_scan_result(scan_id)
    if not result:
        raise HTTPException(status_code=404, detail="Scan not found")
    return result

@router.get("/logs/{scan_id}")
async def get_scan_logs(scan_id: str):
    result = StorageService.get_scan_result(scan_id)
    if not result:
        # Fallback to file search directly
        logs = StorageService.get_logs(scan_id)
        if not logs:
            raise HTTPException(status_code=404, detail="Scan logs not found")
        return {"scan_id": scan_id, "logs": logs}
    
    return {"scan_id": scan_id, "logs": result.get("logs", [])}

@router.get("/health-score/{scan_id}")
async def get_scan_health_score(scan_id: str):
    result = StorageService.get_scan_result(scan_id)
    if not result:
        raise HTTPException(status_code=404, detail="Scan not found")
        
    scores = result.get("scores", {})
    overall = scores.get("overall")
    if overall is None:
        # If scan is not complete, we might not have overall yet
        overall = scores.get("security", 80)
        
    return {
        "scan_id": scan_id,
        "overall_score": overall,
        "scores": scores,
        "executive_summary": result.get("executive_summary", {})
    }

