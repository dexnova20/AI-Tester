import os
import asyncio
from typing import Dict, Any
from agents.crawler_agent import log_message
from services.github_mcp_service import GitHubMCPService
from analyzers.repo_analyzer import RepoAnalyzer

class RepoAgent:
    """
    Repository Agent.
    Utilizes GitHub MCP Service and RepoAnalyzer to perform structural audits,
    dependency health reviews, and codebase risk analyses.
    """
    
    @staticmethod
    async def audit(repo_url: str, scan_id: str) -> Dict[str, Any]:
        log_message(scan_id, f"[REPO_AGENT] Initializing GitHub MCP repository link for {repo_url}...")
        await asyncio.sleep(0.5)
        
        # 1. Determine scan target (use current workspace path if it matches or fallbacks to root)
        # The user's repo is locally at "c:/Users/mshas/OneDrive/Desktop/New folder/DRACULA"
        workspace_path = "."
        if os.path.exists("package.json") or os.path.exists("requirements.txt"):
            workspace_path = os.path.abspath(".")
            log_message(scan_id, f"[REPO_AGENT] Active local workspace detected at: {workspace_path}")
        
        log_message(scan_id, "[REPO_AGENT] Scanning files, folders, and directory blueprints...")
        await asyncio.sleep(0.8)
        
        # 2. Run structural walk and configuration parsing
        metrics = GitHubMCPService.inspect_local_repository(workspace_path)
        
        log_message(scan_id, f"[REPO_AGENT] Repository scan finished. Discovered {metrics['file_count']} files.")
        if metrics["detected_frameworks"]:
            log_message(scan_id, f"[REPO_AGENT] Codebase framework classification: {', '.join(metrics['detected_frameworks'])}")
        
        # 3. Call independent RepoAnalyzer
        results = RepoAnalyzer.analyze(metrics)
        
        for finding in results["findings"]:
            log_message(scan_id, f"[REPO_AGENT] Quality Warning: {finding['issue']} (Severity: {finding['severity']})")
            
        log_message(scan_id, f"[REPO_AGENT] Completed analysis. Weighted repository score calculated at {results['score']}%:")
        sub = results["sub_scores"]
        log_message(scan_id, f"  - Documentation (README) Score: {sub['readme']}/100")
        log_message(scan_id, f"  - Project Structure Score: {sub['structure']}/100")
        log_message(scan_id, f"  - Dependency Health Score: {sub['dependency_health']}/100")
        log_message(scan_id, f"  - Codebase Risk Score: {sub['risk']}/100")
        
        # Inject framework classifications and metrics for report compiling
        results["frameworks"] = metrics["detected_frameworks"]
        results["dependencies_count"] = len(metrics["dependencies"])
        results["file_count"] = metrics["file_count"]
        
        return results
