import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv

# Load env configurations
load_dotenv()

from routes import analyze_repo, test_website, results

app = FastAPI(title="DRACULA API", description="Autonomous AI QA and Debugging Platform MVP")

# Ensure directories exist
os.makedirs("storage/screenshots", exist_ok=True)
os.makedirs("storage/logs", exist_ok=True)
os.makedirs("storage/reports", exist_ok=True)

# Mount static directories inside storage
app.mount("/screenshots", StaticFiles(directory="storage/screenshots"), name="screenshots")
app.mount("/static-logs", StaticFiles(directory="storage/logs"), name="static-logs")



# Read CORS origins from env
raw_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000")
origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

print(f"[DRACULA BACKEND] Initializing CORS with allowed origins: {origins}")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
