import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routes import analyze_repo, test_website, results

app = FastAPI(title="DRACULA API", description="Autonomous AI QA and Debugging Platform MVP")

# Ensure directories exist
os.makedirs("screenshots", exist_ok=True)
os.makedirs("logs", exist_ok=True)

# Mount static directories
app.mount("/screenshots", StaticFiles(directory="screenshots"), name="screenshots")
app.mount("/logs", StaticFiles(directory="logs"), name="logs")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(test_website.router)
app.include_router(analyze_repo.router)
app.include_router(results.router)

@app.get("/health")
def health_check():
    return {"status": "healthy"}
