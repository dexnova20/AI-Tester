from fastapi import APIRouter, HTTPException
from utils.in_memory_db import get_result

router = APIRouter()

@router.get("/results/{scan_id}")
async def get_scan_result(scan_id: str):
    result = get_result(scan_id)
    if not result:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    return result
