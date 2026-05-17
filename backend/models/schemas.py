from pydantic import BaseModel

class WebsiteTestRequest(BaseModel):
    url: str

class RepoAnalyzeRequest(BaseModel):
    repo_url: str

class ScanResponse(BaseModel):
    scan_id: str
    status: str
