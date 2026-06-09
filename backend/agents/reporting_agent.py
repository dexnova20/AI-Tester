import asyncio
from typing import Dict, Any, List
from agents.crawler_agent import log_message
from services.report_service import ReportService
from services.storage_service import StorageService

class ReportingAgent:
    """
    Reporting Agent.
    Aggregates findings, scores, and AI diagnostic summaries to build the final unified report.
    """
    
    @staticmethod
    async def compile(
        scan_id: str,
        target: str,
        status: str,
        logs: List[str],
        scores: Dict[str, int],
        findings: List[Dict[str, Any]],
        ai_analysis: Dict[str, Any],
        screenshot_gallery: List[Dict[str, str]],
        is_repo: bool = False
    ) -> Dict[str, Any]:
        log_message(scan_id, "[REPORTING_AGENT] Gathering diagnostic reports and packaging metrics...")
        await asyncio.sleep(0.3)
        
        # Compile report via service layer
        report = ReportService.compile_report(
            scan_id=scan_id,
            target=target,
            status=status,
            logs=logs,
            scores=scores,
            findings=findings,
            ai_analysis=ai_analysis,
            screenshot_gallery=screenshot_gallery,
            is_repo=is_repo
        )
        
        # Save final report through StorageService
        StorageService.save_scan_result(scan_id, report)
        
        # Save log file separately to disk
        StorageService.save_log(scan_id, logs)
        
        log_message(scan_id, f"[REPORTING_AGENT] Unified DRACULA reliability report successfully generated. Scan ID: {scan_id}")
        return report
