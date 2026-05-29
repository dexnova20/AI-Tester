import time
import httpx
import asyncio

API_URL = "http://127.0.0.1:8000"

async def test_backend():
    print("[TEST] Establishing HTTP client link...")
    async with httpx.AsyncClient() as client:
        # 1. Health check
        try:
            res = await client.get(f"{API_URL}/health")
            print(f"[TEST] Health status: {res.status_code} -> {res.json()}")
        except Exception as e:
            print(f"[TEST] Health check failed: {e}. Make sure backend is running first!")
            return

        # 2. Trigger website scan
        print("\n[TEST] Launching website test scan on: https://example.com")
        payload = {"url": "https://example.com"}
        res = await client.post(f"{API_URL}/test-website", json=payload)
        print(f"[TEST] Scan request response: {res.status_code} -> {res.json()}")
        
        scan_id = res.json().get("scan_id")
        if not scan_id:
            print("[TEST_FAIL] No scan_id received.")
            return

        # 3. Poll for results & telemetry
        print(f"\n[TEST] Polling telemetry progress for scan: {scan_id}")
        for i in range(12):
            await asyncio.sleep(3)
            
            # Fetch logs
            logs_res = await client.get(f"{API_URL}/logs/{scan_id}")
            logs = logs_res.json().get("logs", [])
            print(f"--- TELEMETRY LOGS (Poll #{i+1}, {len(logs)} lines) ---")
            if logs:
                print("\n".join(logs[-3:])) # Print last 3 log lines
                
            # Fetch results
            res_val = await client.get(f"{API_URL}/results/{scan_id}")
            data = res_val.json()
            status = data.get("status")
            print(f"Current Status: {status}")
            
            if status == "completed":
                print("\n[TEST_SUCCESS] Scan completed successfully!")
                print(f"Overall Health Score: {data.get('scores', {}).get('overall')}/100")
                print(f"Executive Summary: {data.get('executive_summary')}")
                print(f"What Will Break First: {data.get('analysis', {}).get('what_will_break_first')}")
                print(f"Security Benchmark: {data.get('benchmarks', {}).get('security')}")
                print(f"Historical Trends: {data.get('trends')}")
                break
            elif status == "error":
                print(f"\n[TEST_FAIL] Scan failed with error: {data.get('error_detail')}")
                break
        else:
            print("\n[TEST_TIMEOUT] Polling limit reached before scan completed.")

if __name__ == "__main__":
    asyncio.run(test_backend())
