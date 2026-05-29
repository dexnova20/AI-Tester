import os
import json
import shutil
from typing import Dict, Any, List, Optional
from utils.in_memory_db import scan_results, save_result as save_in_memory

STORAGE_DIR = "storage"
REPORTS_DIR = os.path.join(STORAGE_DIR, "reports")
SCREENSHOTS_DIR = os.path.join(STORAGE_DIR, "screenshots")
LOGS_DIR = os.path.join(STORAGE_DIR, "logs")

# Ensure storage directories exist
os.makedirs(REPORTS_DIR, exist_ok=True)
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)
os.makedirs(LOGS_DIR, exist_ok=True)

class StorageService:
    """
    Modular, cloud-ready Storage Service that handles persistence of 
    telemetry logs, visual screenshots, and final structured reports.
    """
    
    @staticmethod
    def save_scan_result(scan_id: str, result: Dict[str, Any]) -> None:
        # Save in memory for fast retrieval & backward compatibility
        save_in_memory(scan_id, result)
        
        # Persist to disk as a JSON report
        report_path = os.path.join(REPORTS_DIR, f"{scan_id}.json")
        try:
            with open(report_path, "w", encoding="utf-8") as f:
                json.dump(result, f, indent=2, default=str)
        except Exception as e:
            print(f"[STORAGE_ERROR] Failed to persist report {scan_id}: {e}")

    @staticmethod
    def get_scan_result(scan_id: str) -> Optional[Dict[str, Any]]:
        # Check memory first
        if scan_id in scan_results:
            return scan_results[scan_id]
            
        # Try loading from disk
        report_path = os.path.join(REPORTS_DIR, f"{scan_id}.json")
        if os.path.exists(report_path):
            try:
                with open(report_path, "r", encoding="utf-8") as f:
                    result = json.load(f)
                    # Restore to memory cache
                    scan_results[scan_id] = result
                    return result
            except Exception as e:
                print(f"[STORAGE_ERROR] Failed to read report {scan_id}: {e}")
        return None

    @staticmethod
    def save_log(scan_id: str, log_lines: List[str]) -> None:
        log_path = os.path.join(LOGS_DIR, f"{scan_id}.log")
        try:
            with open(log_path, "w", encoding="utf-8") as f:
                f.write("\n".join(log_lines))
        except Exception as e:
            print(f"[STORAGE_ERROR] Failed to write logs for {scan_id}: {e}")

    @staticmethod
    def get_logs(scan_id: str) -> List[str]:
        # Check memory cache first
        if scan_id in scan_results and "logs" in scan_results[scan_id]:
            return scan_results[scan_id]["logs"]
            
        log_path = os.path.join(LOGS_DIR, f"{scan_id}.log")
        if os.path.exists(log_path):
            try:
                with open(log_path, "r", encoding="utf-8") as f:
                    return [line.strip() for line in f.readlines()]
            except Exception as e:
                print(f"[STORAGE_ERROR] Failed to read log file {scan_id}: {e}")
        return []

    @staticmethod
    def save_screenshot_file(scan_id: str, source_path: str) -> str:
        """Copies a captured screenshot file into the storage screenshots directory."""
        if not os.path.exists(source_path):
            return "/screenshots/default.png"
            
        filename = os.path.basename(source_path)
        dest_path = os.path.join(SCREENSHOTS_DIR, filename)
        try:
            shutil.copy2(source_path, dest_path)
            return f"/screenshots/{filename}"
        except Exception as e:
            print(f"[STORAGE_ERROR] Failed to copy screenshot: {e}")
            return f"/{source_path}"

    @staticmethod
    def get_all_scans() -> List[Dict[str, Any]]:
        """Loads all persisted reports to allow comparative metrics and historical trends."""
        scans = []
        if not os.path.exists(REPORTS_DIR):
            return scans
            
        for filename in os.listdir(REPORTS_DIR):
            if filename.endswith(".json"):
                scan_id = filename[:-5]
                try:
                    with open(os.path.join(REPORTS_DIR, filename), "r", encoding="utf-8") as f:
                        scans.append(json.load(f))
                except Exception:
                    pass
        return scans

    @staticmethod
    def get_previous_scan(target_identifier: str, current_scan_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieves the most recent completed scan for the same URL or Repo URL 
        that occurred prior to the current scan ID.
        """
        all_scans = StorageService.get_all_scans()
        # Filter for same target URL/repo and status == completed
        matching = []
        for s in all_scans:
            # Check either website url or repo url matches
            s_target = s.get("url") or s.get("repo_url")
            s_id = s.get("scan_id") or ""
            if s_target == target_identifier and s_id != current_scan_id and s.get("status") == "completed":
                matching.append(s)
                
        if not matching:
            return None
            
        # Since we use uuid, let's sort by files' last modified time to find the latest
        matching.sort(key=lambda s: os.path.getmtime(os.path.join(REPORTS_DIR, f"{s.get('scan_id', '')}.json")), reverse=True)
        return matching[0]
