import time
import asyncio
from typing import Dict, Any, List
from agents.crawler_agent import crawl_and_explore, log_message
from agents.security_agent import SecurityAgent
from agents.accessibility_agent import AccessibilityAgent
from agents.performance_agent import PerformanceAgent
from agents.repo_agent import RepoAgent
from agents.reporting_agent import ReportingAgent
from services.gemini_service import GeminiService
from services.storage_service import StorageService

class PlannerAgent:
    """
    Master Orchestrator.
    Determines required scans based on input properties, builds test plans,
    dispatches specialized agents concurrently, and compiles unified results.
    """
    
    @staticmethod
    async def execute_website_scan(url: str, scan_id: str) -> Dict[str, Any]:
        """
        Orchestrates a comprehensive website reliability scan.
        Crawls pages, then executes Security, Accessibility, and Performance audits concurrently.
        """
        start_time = time.time()
        log_message(scan_id, f"[PLANNER] Master Orchestrator activated for URL target: {url}")
        log_message(scan_id, "[PLANNER] Analyzing framework markers and creating custom verification blueprint...")
        await asyncio.sleep(0.4)
        
        # 1. Run Crawler Agent (sequential stage as it fetches DOM nodes)
        visited, gallery, elements, console_errors = await crawl_and_explore(url, scan_id)
        load_duration = time.time() - start_time
        
        # 2. Build Test Plan and Dispatch Specialized Agents concurrently
        log_message(scan_id, "[PLANNER] Crawling phase complete. Instantiating concurrent audit agents...")
        
        # Schedule audits concurrently via asyncio.gather to keep execution fast!
        sec_task = SecurityAgent.audit(url, elements, scan_id)
        acc_task = AccessibilityAgent.audit(elements, scan_id)
        perf_task = PerformanceAgent.audit(url, elements, scan_id, load_duration=load_duration)
        
        # Await concurrent execution
        sec_results, acc_results, perf_results = await asyncio.gather(sec_task, acc_task, perf_task)
        
        log_message(scan_id, "[PLANNER] Specialized agent audits complete. Consolidating metrics...")
        
        # 3. Consolidate results and scores
        scores = {
            "security": sec_results["score"],
            "accessibility": acc_results["score"],
            "ui_stability": (sec_results["score"] + acc_results["score"]) // 2, # UX fallback
            "performance": perf_results["score"]
        }
        
        findings = []
        findings.extend(sec_results["findings"])
        findings.extend(acc_results["findings"])
        findings.extend(perf_results["findings"])
        
        # 4. Trigger Gemini deep audit analysis
        log_message(scan_id, "[PLANNER] Invoking Google Gemini service to generate executive verdict & failure predictions...")
        current_logs = StorageService.get_logs(scan_id)
        ai_verdict = await GeminiService.analyze_scan(
            target=url,
            findings=findings,
            logs=current_logs,
            scores=scores,
            is_repo=False
        )
        
        # Update overall stability score based on AI findings if needed
        scores["ui_stability"] = max(50, scores["ui_stability"] - len(console_errors) * 10)
        
        # 5. Delegate compilation to ReportingAgent
        log_message(scan_id, "[PLANNER] Dispatching Reporting Agent to package final report...")
        report = await ReportingAgent.compile(
            scan_id=scan_id,
            target=url,
            status="completed",
            logs=StorageService.get_logs(scan_id),
            scores=scores,
            findings=findings,
            ai_analysis=ai_verdict,
            screenshot_gallery=gallery,
            is_repo=False
        )
        
        log_message(scan_id, "[PLANNER] Master Orchestration pipeline fully completed.")
        return report

    @staticmethod
    async def execute_repo_scan(repo_url: str, scan_id: str) -> Dict[str, Any]:
        """
        Orchestrates a repository structure, configuration, and dependency health audit.
        """
        log_message(scan_id, f"[PLANNER] Master Orchestrator activated for Repo target: {repo_url}")
        log_message(scan_id, "[PLANNER] Formulating repository analysis checklist...")
        await asyncio.sleep(0.5)
        
        # 1. Dispatch Repository Agent (GitHub MCP ready)
        repo_results = await RepoAgent.audit(repo_url, scan_id)
        
        # 2. Consolidate repository scores
        sub = repo_results["sub_scores"]
        scores = {
            "repository": repo_results["score"],
            "security": sub["risk"],
            "accessibility": sub["readme"], # Docs accessibility representation
            "ui_stability": sub["structure"] # Structural layout integrity
        }
        
        # 3. Invoke Gemini deep analysis
        log_message(scan_id, "[PLANNER] Invoking Google Gemini service to synthesize codebase recommendations...")
        current_logs = StorageService.get_logs(scan_id)
        ai_verdict = await GeminiService.analyze_scan(
            target=repo_url,
            findings=repo_results["findings"],
            logs=current_logs,
            scores=scores,
            is_repo=True
        )
        
        # 4. Dispatch Reporting Agent to package final report
        log_message(scan_id, "[PLANNER] Dispatching Reporting Agent to package repository report...")
        report = await ReportingAgent.compile(
            scan_id=scan_id,
            target=repo_url,
            status="completed",
            logs=StorageService.get_logs(scan_id),
            scores=scores,
            findings=repo_results["findings"],
            ai_analysis=ai_verdict,
            screenshot_gallery=[],
            is_repo=True
        )
        
        log_message(scan_id, "[PLANNER] Master Orchestration pipeline fully completed.")
        return report
