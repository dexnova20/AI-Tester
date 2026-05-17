const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const testWebsite = async (url: string) => {
  const response = await fetch(`${API_URL}/test-website`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  return response.json();
};

export const analyzeRepo = async (repoUrl: string) => {
  const response = await fetch(`${API_URL}/analyze-repo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repo_url: repoUrl }),
  });
  return response.json();
};

export const getScanResult = async (scanId: string) => {
  const response = await fetch(`${API_URL}/results/${scanId}`);
  if (!response.ok) {
    throw new Error("Result not found or API error");
  }
  return response.json();
};
