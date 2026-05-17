# Simple in-memory storage for MVP
# In a real app, this would be Redis or a database.

scan_results = {}

def save_result(scan_id: str, result: dict):
    scan_results[scan_id] = result

def get_result(scan_id: str):
    return scan_results.get(scan_id, None)

def update_status(scan_id: str, status: str):
    if scan_id in scan_results:
        scan_results[scan_id]["status"] = status
    else:
        scan_results[scan_id] = {"status": status}
