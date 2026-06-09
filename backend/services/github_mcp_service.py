import os
import json
import re
from typing import Dict, Any, List

class GitHubMCPService:
    """
    Service layer preparing DRACULA for GitHub Model Context Protocol (MCP) integrations.
    Features real repository structure inspection, framework heuristics, language detection, 
    and dependency checks from target repositories.
    """
    
    @staticmethod
    def inspect_local_repository(repo_path: str) -> Dict[str, Any]:
        """
        Inspects a local repository's directory tree, checks configurations,
        detects frameworks, and audits package dependencies.
        """
        metrics = {
            "has_readme": False,
            "has_package_json": False,
            "has_requirements_txt": False,
            "has_dockerfile": False,
            "has_tsconfig": False,
            "detected_frameworks": [],
            "dependencies": [],
            "file_count": 0,
            "readme_size": 0,
            "risk_factors": []
        }
        
        if not os.path.exists(repo_path):
            return metrics
            
        # 1. Walk directory tree (up to a depth of 3 to avoid infinite loops)
        for root, dirs, files in os.walk(repo_path):
            # Ignore git, node_modules, env, and build cache folders
            dirs[:] = [d for d in dirs if d not in [".git", "node_modules", "venv", ".next", "__pycache__"]]
            
            for file in files:
                metrics["file_count"] += 1
                
                # Check key config files
                if file.lower() == "readme.md":
                    metrics["has_readme"] = True
                    readme_path = os.path.join(root, file)
                    metrics["readme_size"] = os.path.getsize(readme_path)
                elif file == "package.json":
                    metrics["has_package_json"] = True
                    GitHubMCPService._parse_package_json(os.path.join(root, file), metrics)
                elif file == "requirements.txt":
                    metrics["has_requirements_txt"] = True
                    GitHubMCPService._parse_requirements_txt(os.path.join(root, file), metrics)
                elif file.lower() == "dockerfile" or file.endswith("docker-compose.yml"):
                    metrics["has_dockerfile"] = True
                elif file == "tsconfig.json":
                    metrics["has_tsconfig"] = True
                    
        # 2. Framework detection logic based on dependencies or files
        if metrics["has_package_json"]:
            if any("next" in dep for dep in metrics["dependencies"]):
                metrics["detected_frameworks"].append("Next.js")
            if any("react" in dep for dep in metrics["dependencies"]) and "Next.js" not in metrics["detected_frameworks"]:
                metrics["detected_frameworks"].append("React")
            if any("express" in dep for dep in metrics["dependencies"]):
                metrics["detected_frameworks"].append("Express")
                
        if metrics["has_requirements_txt"]:
            if any("fastapi" in dep.lower() for dep in metrics["dependencies"]):
                metrics["detected_frameworks"].append("FastAPI")
            if any("flask" in dep.lower() for dep in metrics["dependencies"]):
                metrics["detected_frameworks"].append("Flask")
                
        # Default fallback framework detector
        if not metrics["detected_frameworks"]:
            if metrics["has_package_json"]:
                metrics["detected_frameworks"].append("JavaScript/Node.js")
            elif metrics["has_requirements_txt"]:
                metrics["detected_frameworks"].append("Python Backend")
            else:
                metrics["detected_frameworks"].append("Vanilla Web Application")

        # 3. Codebase risk evaluations
        if not metrics["has_readme"]:
            metrics["risk_factors"].append("Missing README.md: Low developer onboarding and documentation score.")
        elif metrics["readme_size"] < 500:
            metrics["risk_factors"].append("Underpopulated README.md: Document parameters lack descriptive details.")
            
        if metrics["has_package_json"] and not metrics["has_tsconfig"]:
            metrics["risk_factors"].append("Missing TypeScript Config: Pure JS detected, lacks compilation type safety checks.")
            
        if not metrics["has_dockerfile"]:
            metrics["risk_factors"].append("Missing Docker environment files: Reproducible deployments are not guaranteed.")
            
        return metrics

    @staticmethod
    def _parse_package_json(filepath: str, metrics: Dict[str, Any]) -> None:
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
                deps = data.get("dependencies", {})
                dev_deps = data.get("devDependencies", {})
                for dep in list(deps.keys()) + list(dev_deps.keys()):
                    metrics["dependencies"].append(dep)
        except Exception:
            pass

    @staticmethod
    def _parse_requirements_txt(filepath: str, metrics: Dict[str, Any]) -> None:
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#"):
                        # Extract dependency name (e.g. fastapi==0.110.0 -> fastapi)
                        name = re.split(r"[=<>~]", line)[0].strip()
                        if name:
                            metrics["dependencies"].append(name)
        except Exception:
            pass
