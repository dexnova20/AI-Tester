from typing import Dict, Any, List

class SecurityAnalyzer:
    """
    Independent Security Analyzer.
    Conducts passive, defensive vulnerability auditing without executing offensive scans.
    """
    
    @staticmethod
    def analyze(url: str, elements: Dict[str, Any]) -> Dict[str, Any]:
        findings = []
        recommendations = []
        
        inputs = elements.get("inputs", [])
        suspicious_forms = elements.get("suspicious_forms", 0)
        is_http = url.lower().startswith("http://")
        
        # Deductions accumulator
        deductions = 0
        
        # 1. Check Transport Security (SSL/TLS)
        if is_http:
            deductions += 25
            findings.append({
                "category": "Security",
                "issue": "Insecure Transport Channel: The target website communicates over plain HTTP.",
                "severity": "High",
                "suggested_fix": "Obtain SSL/TLS credentials and implement an automated HTTPS redirect at the network gateway."
            })
            recommendations.append("Deploy SSL/TLS certificates and force all routing over HTTPS (Port 443).")
            
        # 2. Check Password Input Validation Constraints
        has_password = any(inp.get("type") == "password" for inp in inputs)
        if has_password and suspicious_forms > 0:
            deductions += 15
            findings.append({
                "category": "Security",
                "issue": f"Exposed Passwords: Detected {suspicious_forms} password inputs missing custom 'minlength' rules.",
                "severity": "Medium",
                "suggested_fix": "Update form inputs with 'minlength=\"8\"' and incorporate complexity pattern validation tags."
            })
            recommendations.append("Enforce strict password criteria directly inside client-side form configurations.")
            
        # 3. Check for Anti-CSRF verification fields
        if len(inputs) > 0:
            # Check if any input is labeled token or csrf
            has_csrf = any("csrf" in str(inp.get("name", "")).lower() or "token" in str(inp.get("name", "")).lower() for inp in inputs)
            if not has_csrf:
                deductions += 15
                findings.append({
                    "category": "Security",
                    "issue": "CSRF Vulnerability: Form lacks an explicit anti-CSRF token verification parameter.",
                    "severity": "High",
                    "suggested_fix": "Inject hidden anti-CSRF validation inputs into all active HTML form tags."
                })
                recommendations.append("Implement state token middleware validators on all post requests.")
                
        # 4. Check for sensitive inputs that could leak auto-completion info
        has_exposed_sensitive = any(inp.get("type") in ["card", "ssn", "cvv"] for inp in inputs)
        if has_exposed_sensitive:
            deductions += 10
            findings.append({
                "category": "Security",
                "issue": "Sensitive inputs are configured with default autocomplete rules.",
                "severity": "Medium",
                "suggested_fix": "Assign 'autocomplete=\"off\"' to highly sensitive inputs like credit card and identity fields."
            })
            recommendations.append("Override automatic caching behaviors on sensitive inputs.")

        score = max(40, 100 - deductions)
        
        return {
            "score": score,
            "findings": findings,
            "recommendations": recommendations
        }
