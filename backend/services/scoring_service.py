from typing import Dict, Any, Optional
from services.storage_service import StorageService

# Industry Averages for Benchmarking
INDUSTRY_AVERAGES = {
    "security": 72,
    "accessibility": 78,
    "ui_stability": 82,
    "performance": 75,
    "repository": 80
}

class ScoringService:
    """
    Centralized Scoring Engine that generates dynamic, weighted reliability scores,
    benchmarks them against industry standards, and tracks changes over time.
    """
    
    @staticmethod
    def calculate_overall_score(scores: Dict[str, int], is_repo: bool = False) -> int:
        """Calculates a weighted average score based on scan type."""
        if is_repo:
            # Repo scan weights: Repository (40%), Security (35%), Accessibility/Docs (25%)
            repo_w = scores.get("repository", 80) * 0.40
            sec_w = scores.get("security", 80) * 0.35
            acc_w = scores.get("accessibility", 80) * 0.25
            overall = repo_w + sec_w + acc_w
        else:
            # Website scan weights: Security (35%), Accessibility (25%), UI (25%), Performance (15%)
            sec_w = scores.get("security", 80) * 0.35
            acc_w = scores.get("accessibility", 80) * 0.25
            ui_w = scores.get("ui_stability", 80) * 0.25
            perf_w = scores.get("performance", 80) * 0.15
            overall = sec_w + acc_w + ui_w + perf_w
            
        return max(0, min(100, int(overall)))

    @staticmethod
    def generate_benchmarks(scores: Dict[str, int]) -> Dict[str, Dict[str, Any]]:
        """Compares scores against industry standards to compute comparative values."""
        benchmarks = {}
        for metric, score in scores.items():
            if metric in INDUSTRY_AVERAGES:
                avg = INDUSTRY_AVERAGES[metric]
                diff = score - avg
                benchmarks[metric] = {
                    "score": score,
                    "industry_average": avg,
                    "difference": diff,
                    "formatted_diff": f"+{diff}" if diff > 0 else str(diff)
                }
        return benchmarks

    @staticmethod
    def calculate_historical_trends(
        target_identifier: str, 
        current_scan_id: str, 
        current_overall_score: int,
        current_scores: Dict[str, int]
    ) -> Dict[str, Any]:
        """
        Computes progress or regression trends compared to the most recent previous scan
        for this target website or repository.
        """
        prev_scan = StorageService.get_previous_scan(target_identifier, current_scan_id)
        if not prev_scan:
            return {
                "has_history": False,
                "overall_change": 0,
                "previous_overall_score": None,
                "score_deltas": {}
            }
            
        prev_scores = prev_scan.get("scores", {})
        prev_overall = prev_scores.get("overall", 80)
        
        overall_change = current_overall_score - prev_overall
        score_deltas = {}
        
        for k, v in current_scores.items():
            prev_val = prev_scores.get(k)
            if prev_val is not None:
                delta = v - prev_val
                score_deltas[k] = {
                    "current": v,
                    "previous": prev_val,
                    "change": delta,
                    "formatted_change": f"+{delta}" if delta > 0 else str(delta)
                }
                
        return {
            "has_history": True,
            "overall_change": overall_change,
            "formatted_change": f"+{overall_change}" if overall_change > 0 else str(overall_change),
            "previous_overall_score": prev_overall,
            "score_deltas": score_deltas
        }
