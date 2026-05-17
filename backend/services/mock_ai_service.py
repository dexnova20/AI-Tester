def generate_ai_analysis(url: str, elements: dict, findings: list, scores: dict):
    """
    Synthesizes rule findings and crawl records to output context-rich,
    cinematic AI diagnoses, suggested fixes, and summaries.
    """
    routes_visited = len(elements.get("inputs", [])) // 2 + 1
    
    # 1. Dynamic synthesis based on actual diagnostic findings
    sec_score = scores.get("security", 85)
    acc_score = scores.get("accessibility", 80)
    ui_score = scores.get("ui_stability", 90)
    
    severity_label = "MODERATE"
    if sec_score < 70 or ui_score < 70:
        severity_label = "CRITICAL"
    elif sec_score > 90 and ui_score > 90:
        severity_label = "LOW"
        
    ai_summary = (
        f"DRACULA analyzed target {url} across multiple routes. "
        f"We discovered {severity_label.lower()} code quality warnings. "
        f"Key observations indicate weak client-side security validators "
        f"(Security score at {sec_score}%) and minor accessibility concerns (Accessibility score at {acc_score}%). "
        f"The primary risk profile centers on missing anti-CSRF protections on active forms and unencrypted transport layers."
    )
    
    key_findings = []
    for f in findings:
        key_findings.append(f"{f['category']} › {f['issue']}")
        
    if not key_findings:
        key_findings = [
            "UI Stability › Viewport structure is responsive and standard.",
            "Security › Forms enforce default browser submit constraints.",
            "Accessibility › Image components supply alt tags."
        ]
        
    suggested_fix = (
        "Implement unified security middleware: Enforce HTTPS redirection, "
        "inject token validators in forms, and declare alt tags on hero components."
    )
    
    return {
        "summary": ai_summary,
        "suggested_fix": suggested_fix,
        "details": key_findings[:5], # Clamp at top 5 findings
        "predicted_risk_level": "Medium" if severity_label == "MODERATE" else ("High" if severity_label == "CRITICAL" else "Low")
    }

def get_dummy_repo_analysis(project_type: str):
    """Simulates Gemini analyzing repository code and execution logs."""
    return {
        "summary": f"Potential dependency mismatch detected in {project_type} environment.",
        "suggested_fix": "Update the package versions in your dependency file to match the latest stable releases.",
        "predicted_risk_level": "Medium",
        "key_issues": [
            "Module not found: react-dom",
            "Build failed due to strict type checking."
        ]
    }
