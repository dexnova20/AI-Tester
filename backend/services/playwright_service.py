import asyncio
import os
import sys
import uuid
import time
from playwright.async_api import async_playwright

SCREENSHOT_DIR = "screenshots"
# Ensure screenshot directory exists
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

async def capture_screenshot(url: str, scan_id: str) -> str:
    """Uses Playwright to open a URL and capture a screenshot, with automatic browser installation if needed."""
    screenshot_path = os.path.join(SCREENSHOT_DIR, f"{scan_id}.png")
    
    try:
        async with async_playwright() as p:
            browser = None
            try:
                print(f"[PLAYWRIGHT] Attempting headless chromium launch for scan: {scan_id}")
                browser = await p.chromium.launch(headless=True)
            except Exception as launch_err:
                err_msg = str(launch_err)
                print(f"[PLAYWRIGHT_WARN] Chromium launch failed: {err_msg}")
                if "executable" in err_msg.lower() or "playwright install" in err_msg.lower() or "not installed" in err_msg.lower():
                    print("[PLAYWRIGHT] Browser not found. Triggering automated installation of chromium browser binary...")
                    
                    # Run: python -m playwright install chromium
                    process = await asyncio.create_subprocess_exec(
                        sys.executable, "-m", "playwright", "install", "chromium",
                        stdout=asyncio.subprocess.PIPE,
                        stderr=asyncio.subprocess.PIPE
                    )
                    stdout, stderr = await process.communicate()
                    print(f"[PLAYWRIGHT INSTALL OUTPUT]:\n{stdout.decode()}")
                    if stderr:
                        print(f"[PLAYWRIGHT INSTALL ERROR]:\n{stderr.decode()}")
                    
                    # Retry launching
                    print("[PLAYWRIGHT] Retrying chromium launch post-installation...")
                    browser = await p.chromium.launch(headless=True)
                else:
                    # Reraise other errors (e.g. sandboxing issues)
                    raise launch_err
            
            page = await browser.new_page()
            
            # Simulate a real user waiting for network idle
            print(f"[PLAYWRIGHT] Navigating to: {url}")
            await page.goto(url, wait_until="networkidle", timeout=30000)
            
            # Capture screenshot
            print(f"[PLAYWRIGHT] Capturing full-page screenshot to: {screenshot_path}")
            await page.screenshot(path=screenshot_path, full_page=True)
            
            await browser.close()
            return f"/{screenshot_path}" # Return relative path for frontend to use via static mount
            
    except Exception as e:
        print(f"[PLAYWRIGHT_ERROR] Error capturing screenshot for {url}: {e}")
        return None

