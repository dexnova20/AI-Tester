const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorDetail = "Server error occurred";
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errorDetail;
    } catch (_) {}
    throw new Error(errorDetail);
  }
  return response.json();
};

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const response = await fetch(`${API_URL}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) return false;
    const data = await response.json();
    return data.status === "healthy";
  } catch (error) {
    return false;
  }
};

export const testWebsite = async (url: string) => {
  try {
    const response = await fetch(`${API_URL}/test-website`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    return await handleResponse(response);
  } catch (e: any) {
    throw new Error(e.message || "Failed to connect to backend server");
  }
};

export const analyzeRepo = async (repoUrl: string) => {
  try {
    const response = await fetch(`${API_URL}/analyze-repo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repo_url: repoUrl }),
    });
    return await handleResponse(response);
  } catch (e: any) {
    throw new Error(e.message || "Failed to connect to backend server");
  }
};

export const getScanResult = async (scanId: string) => {
  try {
    const response = await fetch(`${API_URL}/results/${scanId}`);
    return await handleResponse(response);
  } catch (e: any) {
    throw new Error(e.message || "Result not found or API connection issue");
  }
};

