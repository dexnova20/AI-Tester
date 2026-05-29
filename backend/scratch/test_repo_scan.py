import time
import httpx
import asyncio

API_URL = "http://127.0.0.1:8000"

async def test_repo():
    print("[TEST] Establishing HTTP client link...")
    async with httpx.AsyncClient() as client:
        # 1. Health check
        try:
            res = await client.get(f"{API_URL}/health")
            print(f"[TEST] Health status: {res.status_code} -> {res.json()}")
        except Exception as e:
            print(f"[TEST] Health check failed: {e}. Make sure backend is running first!")
            return

        # 2. Trigger repo scan (pointing to the DRACULA repository itself)
        repo_target = "https://github.com/dexnova20/DRACULA"
        print(f"\n[TEST] Launching repository intelligence scan on: {repo_target}")
        payload = {"repo_url": repo_target}
        res = await client.post(f"{API_URL}/analyze-repo", json=payload)
        print(f"[TEST] Scan request response: {res.status_code} -> {res.json()}")
        
        scan_id = res.json().get("scan_id")
        if not scan_id:
            print("[TEST_FAIL] No scan_id received.")
            return

        # 3. Poll for results
        print(f"\n[TEST] Polling progress for repository scan: {scan_id}")
        for i in range(10):
            await asyncio.sleep(2)
            
            res_val = await client.get(f"{API_URL}/results/{scan_id}")
            data = res_val.json()
            status = data.get("status")
            print(f"Current Status: {status}")
            
            if status == "completed":
                print("\n[TEST_SUCCESS] Repository scan completed successfully!")
                print(f"Overall Health Score: {data.get('scores', {}).get('overall')}/100")
                print(f"Sub-Scores: {data.get('scores')}")
                print(f"Executive Summary: {data.get('executive_summary')}")
                print(f"What Will Break First: {data.get('analysis', {}).get('what_will_break_first')}")
                print(f"Repository Benchmarks: {data.get('benchmarks', {}).get('repository')}")
                print(f"Historical Trends: {data.get('trends')}")
                break
            elif status == "error":
                print(f"\n[TEST_FAIL] Repository scan failed with error: {data.get('error_detail')}")
                break
        else:
            print("\n[TEST_TIMEOUT] Polling limit reached before scan completed.")

if __name__ == "__main__":
    asyncio.run(test_repo())
