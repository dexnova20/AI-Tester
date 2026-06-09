import asyncio
from typing import Dict, Any
from agents.crawler_agent import log_message
from analyzers.performance_analyzer import PerformanceAnalyzer

class PerformanceAgent:
    """
    Performance Agent.
    Evaluates resource sizes, image overheads, and page speed weights.
    """
    
    @staticmethod
    async def audit(url: str, elements: Dict[str, Any], scan_id: str, load_duration: float = None) -> Dict[str, Any]:
        log_message(scan_id, "[PERFORMANCE_AGENT] Analyzing loading times and resource transfer payloads...")
        await asyncio.sleep(0.3)
        
        # Call independent PerformanceAnalyzer
        results = PerformanceAnalyzer.analyze(url, elements, load_duration)
        
        for finding in results["findings"]:
            log_message(scan_id, f"[PERFORMANCE_AGENT] Finding: {finding['issue']}")
            
        log_message(scan_id, f"[PERFORMANCE_AGENT] Performance score compiled at {results['score']}%.")
        return results
