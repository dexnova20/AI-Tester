import asyncio
from typing import Dict, Any, List
from agents.crawler_agent import log_message
from analyzers.security_analyzer import SecurityAnalyzer

class SecurityAgent:
    """
    Security Agent.
    Runs passive defensive inspections on crawled website elements.
    """
    
    @staticmethod
    async def audit(url: str, elements: Dict[str, Any], scan_id: str) -> Dict[str, Any]:
        log_message(scan_id, "[SECURITY_AGENT] Commencing security compliance checks...")
        await asyncio.sleep(0.3)
        
        # Call independent SecurityAnalyzer
        results = SecurityAnalyzer.analyze(url, elements)
        
        for finding in results["findings"]:
            log_message(scan_id, f"[SECURITY_AGENT] Issue identified: {finding['issue']} (Severity: {finding['severity']})")
            
        log_message(scan_id, f"[SECURITY_AGENT] Audits complete. Raw security grade computed at {results['score']}%.")
        return results
