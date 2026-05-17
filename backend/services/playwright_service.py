import asyncio
from playwright.async_api import async_playwright
import os
import uuid
import time

SCREENSHOT_DIR = "screenshots"
# Ensure screenshot directory exists
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

async def capture_screenshot(url: str, scan_id: str) -> str:
    """Uses Playwright to open a URL and capture a screenshot."""
    screenshot_path = os.path.join(SCREENSHOT_DIR, f"{scan_id}.png")
    
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            
            # Simulate a real user waiting for network idle
            await page.goto(url, wait_until="networkidle", timeout=30000)
            
            # Capture screenshot
            await page.screenshot(path=screenshot_path, full_page=True)
            
            await browser.close()
            
            return f"/{screenshot_path}" # Return relative path for frontend to use via static mount
            
    except Exception as e:
        print(f"Error capturing screenshot: {e}")
        return None
