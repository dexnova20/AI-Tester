from typing import Dict, Any, List

class RepoAnalyzer:
    """
    Independent Repository Analyzer.
    Examines repository file setups, documentation depth, environment structures, and packaging safety.
    """
    
    @staticmethod
    def analyze(repo_metrics: Dict[str, Any]) -> Dict[str, Any]:
        findings = []
        recommendations = []
        
        # Calculate sub-scores out of 100
        readme_score = 100 if repo_metrics["has_readme"] and repo_metrics["readme_size"] > 1000 else (60 if repo_metrics["has_readme"] else 30)
        structure_score = 100 if repo_metrics["has_dockerfile"] and repo_metrics["has_tsconfig"] else (75 if repo_metrics["has_tsconfig"] or repo_metrics["has_dockerfile"] else 50)
        dependency_score = 95 if len(repo_metrics["dependencies"]) < 30 else (80 if len(repo_metrics["dependencies"]) < 60 else 65)
        
        # Risk factors deductions
        risk_deductions = len(repo_metrics["risk_factors"]) * 12
        risk_score = max(40, 100 - risk_deductions)
        
        # 1. Structure findings
        if not repo_metrics["has_readme"]:
            findings.append({
                "category": "Repository Structure",
                "issue": "Missing documentation README.md: The project lacks onboarding and startup guidelines.",
                "severity": "Medium",
                "suggested_fix": "Create a README.md file at the repository root and document features and deployment guides."
            })
            recommendations.append("Establish a descriptive root-level README file.")
        elif repo_metrics["readme_size"] < 500:
            findings.append({
                "category": "Repository Structure",
                "issue": f"Underpopulated README.md ({repo_metrics['readme_size']} bytes): Lacks startup details.",
                "severity": "Low",
                "suggested_fix": "Expand the README file by documenting build commands, configuration parameters, and endpoints."
            })
            recommendations.append("Flesh out project startup guidelines inside the README.")

        if not repo_metrics["has_dockerfile"]:
            findings.append({
                "category": "Repository Structure",
                "issue": "Lacks isolated build parameters: Missing Dockerfile or docker-compose setup.",
                "severity": "Medium",
                "suggested_fix": "Create a multi-stage Dockerfile to guarantee clean containerized execution builds."
            })
            recommendations.append("Containerize codebase execution with standard Docker files.")

        if repo_metrics["has_package_json"] and not repo_metrics["has_tsconfig"]:
            findings.append({
                "category": "Repository Structure",
                "issue": "Lack of typing validations: Node project lacks a TypeScript configuration tsconfig.json.",
                "severity": "Low",
                "suggested_fix": "Upgrade project scripts to TypeScript and inject a root-level tsconfig.json configuration."
            })
            recommendations.append("Adopt TypeScript configurations to guarantee build-time type security.")

        # Calculate average overall repository health score
        avg_score = int((readme_score + structure_score + dependency_score + risk_score) / 4)
        
        return {
            "score": avg_score,
            "sub_scores": {
                "readme": readme_score,
                "structure": structure_score,
                "dependency_health": dependency_score,
                "risk": risk_score
            },
            "findings": findings,
            "recommendations": recommendations
        }
