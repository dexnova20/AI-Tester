import asyncio
from typing import Dict, Any
from agents.crawler_agent import log_message
from analyzers.accessibility_analyzer import AccessibilityAnalyzer

class AccessibilityAgent:
    """
    Accessibility Agent.
    Audits website elements against WCAG compliance (alt tags, ARIA roles, input labels).
    """
    
    @staticmethod
    async def audit(elements: Dict[str, Any], scan_id: str) -> Dict[str, Any]:
        log_message(scan_id, "[ACCESSIBILITY_AGENT] Starting WCAG compliance and page landmarks audits...")
        await asyncio.sleep(0.3)
        
        # Call independent AccessibilityAnalyzer
        results = AccessibilityAnalyzer.analyze(elements)
        
        for finding in results["findings"]:
            log_message(scan_id, f"[ACCESSIBILITY_AGENT] Violation detected: {finding['issue']} (Severity: {finding['severity']})")
            
        log_message(scan_id, f"[ACCESSIBILITY_AGENT] Audits complete. Accessibility score set at {results['score']}%.")
        return results
