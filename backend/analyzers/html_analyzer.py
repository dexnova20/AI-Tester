from typing import Dict, Any, List

class HTMLAnalyzer:
    """
    Independent HTML Analyzer.
    Examines DOM structures, form shapes, button definitions, and navigation elements.
    """
    
    @staticmethod
    def analyze(elements: Dict[str, Any], console_errors: List[str]) -> Dict[str, Any]:
        findings = []
        recommendations = []
        
        inputs = elements.get("inputs", [])
        buttons = elements.get("buttons", [])
        links = elements.get("links", [])
        broken_buttons = elements.get("broken_buttons", 0)
        
        # 1. Audits
        if len(inputs) == 0 and len(buttons) == 0:
            findings.append({
                "category": "HTML Structure",
                "issue": "Extremely light structural layout detected. No form inputs or button elements found.",
                "severity": "Low",
                "suggested_fix": "Incorporate interactive semantic components (buttons, links, textboxes) if this is an interactive app."
            })
            recommendations.append("Enhance UI engagement by adding standard input blocks.")
            
        if broken_buttons > 0:
            findings.append({
                "category": "UI Stability",
                "issue": f"Detected {broken_buttons} action button elements lacking any text label.",
                "severity": "Medium",
                "suggested_fix": "Add descriptive inner-text or assign an 'aria-label' attribute to empty buttons."
            })
            recommendations.append("Inject descriptive textual labels into all UI button triggers.")
            
        if len(console_errors) > 0:
            findings.append({
                "category": "UI Stability",
                "issue": f"Uncaught script exceptions: Recorded {len(console_errors)} browser console console.error calls.",
                "severity": "High",
                "suggested_fix": "Fix javascript syntax issues, trace unhandled promise rejections, and review client stack traces."
            })
            recommendations.append("Perform JavaScript error boundary scans and resolve script exceptions.")
            
        # Deduct score based on issues
        base_score = 100
        base_score -= (broken_buttons * 10)
        base_score -= (len(console_errors) * 15)
        score = max(50, min(100, base_score))
        
        return {
            "score": score,
            "findings": findings,
            "recommendations": recommendations
        }
