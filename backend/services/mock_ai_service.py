import random

def get_dummy_website_analysis():
    """Simulates Gemini analyzing a website screenshot."""
    return {
        "bugs_found": random.randint(1, 5),
        "security_issues": random.randint(0, 2),
        "ui_issues": random.randint(1, 4),
        "summary": "AI detected potential alignment issues on mobile view and a missing CSRF token on the login form.",
        "details": [
            "Login button overlaps with the footer on small screens.",
            "Missing 'alt' tags on primary hero image.",
            "Form submission lacks rate limiting (potential DOS vulnerability)."
        ]
    }

def get_dummy_repo_analysis(project_type: str):
    """Simulates Gemini analyzing repository code and execution logs."""
    return {
        "summary": f"Potential dependency mismatch detected in {project_type} environment.",
        "suggested_fix": "Update the package versions in your dependency file to match the latest stable releases.",
        "predicted_risk_level": random.choice(["Low", "Medium", "High"]),
        "key_issues": [
            "Module not found: react-dom",
            "Build failed due to strict type checking."
        ]
    }
