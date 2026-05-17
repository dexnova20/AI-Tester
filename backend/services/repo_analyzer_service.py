import asyncio
import os
import random
import time

LOGS_DIR = "logs"
os.makedirs(LOGS_DIR, exist_ok=True)

async def simulate_repo_analysis(repo_url: str, scan_id: str) -> dict:
    """Simulates cloning a repo, detecting framework, and running containerized tests."""
    
    # 1. Simulate cloning
    await asyncio.sleep(2)
    
    # 2. Simulate framework detection
    frameworks = ["React", "Next.js", "FastAPI", "Express", "Streamlit"]
    project_type = random.choice(frameworks)
    
    # 3. Simulate execution and log generation
    await asyncio.sleep(3)
    
    fake_logs = [
        f"Cloning repository {repo_url}...",
        f"Detected project type: {project_type}",
        "Building container environment...",
        "Installing dependencies...",
        "WARN: peer dependency mismatch detected",
        "Running tests...",
        "FAIL: tests/test_main.py - 2 tests failed",
        "Container execution finished with exit code 1"
    ]
    
    log_path = os.path.join(LOGS_DIR, f"{scan_id}.log")
    with open(log_path, "w") as f:
        f.write("\n".join(fake_logs))
        
    return {
        "project_type": project_type,
        "logs": fake_logs,
        "errors_detected": 2,
        "log_file": f"/{log_path}"
    }
