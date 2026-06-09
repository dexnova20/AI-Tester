from typing import Dict, Any, List
from services.scoring_service import ScoringService
from services.storage_service import StorageService

class ReportService:
    """
    Modular Report Engine that compiles findings, logs, screenshots, scoring benchmarks, 
    and Gemini failure analysis into a structured, production-ready unified report.
    """
    
    @staticmethod
    def compile_report(
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
        """
        Assembles all scan data, scores, benchmarks, and AI verdicts
        into the official DRACULA Unified Report.
        """
        # 1. Compute overall health score
        overall_score = ScoringService.calculate_overall_score(scores, is_repo=is_repo)
        scores["overall"] = overall_score
        
        # 2. Generate comparison benchmarks against industry standards
        benchmarks = ScoringService.generate_benchmarks(scores)
        
        # 3. Calculate historical trends if a previous scan exists
        trends = ScoringService.calculate_historical_trends(target, scan_id, overall_score, scores)
        
        # 4. Count severity metrics
        bugs_found = len([f for f in findings if f.get("category") in ["Accessibility", "UI Stability", "Bugs"]])
        security_issues = len([f for f in findings if f.get("category") == "Security"])
        ui_issues = len([f for f in findings if f.get("category") in ["UI Stability", "Console Exceptions"]])
        
        # Ensure screenshot gallery has proper static path mounts
        final_gallery = []
        for item in screenshot_gallery:
            stored_path = StorageService.save_screenshot_file(scan_id, item.get("path", "").lstrip("/"))
            final_gallery.append({
                "path": stored_path,
                "route": item.get("route", "/")
            })
            
        main_screenshot = final_gallery[0]["path"] if final_gallery else "/screenshots/default.png"
        
        # 5. Compile Executive Dashboard Summary (High-visibility glance values)
        executive_summary = {
            "risk_level": ai_analysis.get("predicted_risk_level", "Medium"),
            "most_critical_issue": ai_analysis.get("most_critical_issue", findings[0].get("issue") if findings else "None detected"),
            "health_score": f"{overall_score}/100",
            "what_will_break_first": ai_analysis.get("what_will_break_first", {}).get("most_likely_failure_point", "Authentication Module"),
            "comparative_health": "Above Industry Average" if overall_score > 75 else "Below Industry Average"
        }
        
        # 6. Structure unified report
        report = {
            "scan_id": scan_id,
            "status": status,
            "url" if not is_repo else "repo_url": target,
            "is_repository": is_repo,
            "screenshot": main_screenshot,
            "screenshot_gallery": final_gallery,
            "logs": logs,
            "scores": scores,
            "findings": findings,
            "bugs_found": bugs_found,
            "security_issues": security_issues,
            "ui_issues": ui_issues,
            "benchmarks": benchmarks,
            "trends": trends,
            "executive_summary": executive_summary,
            "analysis": {
                "summary": ai_analysis.get("summary", ""),
                "suggested_fix": ai_analysis.get("suggested_fix", ""),
                "details": ai_analysis.get("details", []),
                "predicted_risk_level": ai_analysis.get("predicted_risk_level", "Medium"),
                "what_will_break_first": ai_analysis.get("what_will_break_first", {}),
                "root_cause_analysis": ai_analysis.get("root_cause_analysis", ""),
                "severity_analysis": ai_analysis.get("severity_analysis", "")
            }
        }
        
        return report
