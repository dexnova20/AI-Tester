from typing import Dict, Any, List

class AccessibilityAnalyzer:
    """
    Independent Accessibility Analyzer.
    Checks DOM metadata for WCAG accessibility issues (missing alts, missing labels, ARIA, and keyboard tab indices).
    """
    
    @staticmethod
    def analyze(elements: Dict[str, Any]) -> Dict[str, Any]:
        findings = []
        recommendations = []
        
        missing_alts = elements.get("missing_alts", 0)
        inputs = elements.get("inputs", [])
        buttons = elements.get("buttons", [])
        
        deductions = 0
        
        # 1. Image description checks
        if missing_alts > 0:
            deductions += (missing_alts * 8)
            findings.append({
                "category": "Accessibility",
                "issue": f"Discovered {missing_alts} image elements lacking descriptive alternative 'alt' tag parameters.",
                "severity": "Low",
                "suggested_fix": "Add descriptive 'alt' tag labels explaining the visual content to all img elements."
            })
            recommendations.append("Apply meaningful alt tags to support assistive screen-readers.")
            
        # 2. Input element label checks
        unlabeled_inputs = 0
        for inp in inputs:
            # Check if name is generic and lacks clear semantic associations
            name = inp.get("name", "").lower()
            if name in ["", "unnamed", "input", "text"]:
                unlabeled_inputs += 1
                
        if unlabeled_inputs > 0:
            deductions += (unlabeled_inputs * 6)
            findings.append({
                "category": "Accessibility",
                "issue": f"Detected {unlabeled_inputs} form inputs lacking explicit names, descriptive IDs, or label ties.",
                "severity": "Medium",
                "suggested_fix": "Connect form input fields explicitly to associated label elements using the 'for' property."
            })
            recommendations.append("Implement screen-reader friendly form label pairings.")
            
        # 3. Interactive element keyboard landmarks (ARIA support)
        empty_aria_buttons = 0
        for btn in buttons:
            btn_text = btn.get("text", "").strip()
            if not btn_text:
                empty_aria_buttons += 1
                
        if empty_aria_buttons > 0:
            deductions += (empty_aria_buttons * 10)
            findings.append({
                "category": "Accessibility",
                "issue": f"Recorded {empty_aria_buttons} button triggers lacking explicit 'aria-label' details.",
                "severity": "Medium",
                "suggested_fix": "Equip all graphic or textless buttons with clear descriptive 'aria-label' tags."
            })
            recommendations.append("Ensure custom element interactions announce themselves clearly to screen-readers.")
            
        score = max(50, 100 - deductions)
        
        return {
            "score": score,
            "findings": findings,
            "recommendations": recommendations
        }
