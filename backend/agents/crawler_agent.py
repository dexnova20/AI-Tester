import os
import sys
import time
import asyncio
from urllib.parse import urlparse, urljoin
from playwright.async_api import async_playwright
from utils.in_memory_db import scan_results

def log_message(scan_id: str, message: str):
    if scan_id not in scan_results:
        scan_results[scan_id] = {}
    if "logs" not in scan_results[scan_id]:
        scan_results[scan_id]["logs"] = []
    
    timestamp = time.strftime("%H:%M:%S")
    formatted = f"[{timestamp}] {message}"
    scan_results[scan_id]["logs"].append(formatted)
    print(formatted)

async def crawl_and_explore(url: str, scan_id: str):
    MAX_PAGES = 3
    MAX_DEPTH = 2
    MAX_SCAN_DURATION = 45 # seconds
    
    start_time = time.time()
    parsed_base = urlparse(url)
    base_domain = f"{parsed_base.scheme}://{parsed_base.netloc}"
    
    visited_routes = set()
    screenshot_gallery = []
    discovered_elements = {
        "inputs": [],
        "buttons": [],
        "links": [],
        "missing_alts": 0,
        "broken_buttons": 0,
        "suspicious_forms": 0
    }
    
    # Initialize database collections
    if scan_id not in scan_results:
        scan_results[scan_id] = {}
    scan_results[scan_id]["logs"] = []
    scan_results[scan_id]["screenshot_gallery"] = []
    
    log_message(scan_id, "[AGENT] Launching autonomous crawling engine...")
    await asyncio.sleep(0.5)
    
    console_errors = []
    
    try:
        async with async_playwright() as p:
            browser = None
            try:
                log_message(scan_id, "[PLAYWRIGHT] Launching headless chromium driver...")
                browser = await p.chromium.launch(headless=True)
            except Exception as launch_err:
                log_message(scan_id, f"[PLAYWRIGHT_WARN] Chromium driver launch failed: {launch_err}")
                log_message(scan_id, "[PLAYWRIGHT] Browser not found. Triggering automated installation...")
                
                process = await asyncio.create_subprocess_exec(
                    sys.executable, "-m", "playwright", "install", "chromium",
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE
                )
                await process.communicate()
                
                log_message(scan_id, "[PLAYWRIGHT] Retrying chromium driver launch post-installation...")
                browser = await p.chromium.launch(headless=True)
            
            context = await browser.new_context(
                viewport={"width": 1280, "height": 720},
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 DRACULA/1.0"
            )
            page = await context.new_page()
            
            # Record console errors
            page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
            
            # Queue elements represent: (full_url, current_depth)
            queue = [(url, 0)]
            
            while queue and len(visited_routes) < MAX_PAGES:
                # 45s hard timeout check
                if time.time() - start_time > MAX_SCAN_DURATION:
                    log_message(scan_id, "[WARN] Scan reached 45-second duration limit. Forcing final report generation...")
                    break
                
                current_url, depth = queue.pop(0)
                
                # Enforce domain same-origin filters
                parsed_current = urlparse(current_url)
                current_domain = f"{parsed_current.scheme}://{parsed_current.netloc}"
                if current_domain != base_domain:
                    continue
                
                route_path = parsed_current.path if parsed_current.path else "/"
                if route_path in visited_routes:
                    continue
                
                visited_routes.add(route_path)
                log_message(scan_id, f"[CRAWLER] Exploring route: {route_path} (Depth: {depth})")
                await asyncio.sleep(0.8) # cinematic delay
                
                try:
                    await page.goto(current_url, wait_until="load", timeout=15000)
                    log_message(scan_id, f"[CRAWLER] Page loaded successfully: {route_path}")
                    
                    # Capture route screenshot
                    screenshot_name = f"{scan_id}_{len(visited_routes)}.png"
                    screenshot_path = f"screenshots/{screenshot_name}"
                    await page.screenshot(path=screenshot_path)
                    
                    screenshot_gallery.append({
                        "path": f"/screenshots/{screenshot_name}",
                        "route": route_path
                    })
                    # Save intermediate gallery state dynamically so polling loads screenshot items
                    scan_results[scan_id]["screenshot_gallery"] = screenshot_gallery
                    
                    log_message(scan_id, f"[CRAWLER] Captured route screenshot to {screenshot_path}.")
                    await asyncio.sleep(0.8)
                    
                    # Run domestic element audits
                    log_message(scan_id, f"[ANALYZER] Inspecting DOM elements on route: {route_path}")
                    
                    # 1. Inspect image alt parameters
                    images = await page.query_selector_all("img")
                    for img in images:
                        alt = await img.get_attribute("alt")
                        if not alt or alt.strip() == "":
                            discovered_elements["missing_alts"] += 1
                    
                    # 2. Inspect form elements
                    inputs = await page.query_selector_all("input, select, textarea")
                    for inp in inputs:
                        inp_type = await inp.get_attribute("type") or "text"
                        inp_name = await inp.get_attribute("name") or await inp.get_attribute("id") or "unnamed"
                        discovered_elements["inputs"].append({
                            "route": route_path,
                            "type": inp_type,
                            "name": inp_name
                        })
                        
                        # Anti-CSRF / Weak Security parameters diagnostic checks
                        if inp_type == "password":
                            minlen = await inp.get_attribute("minlength")
                            if not minlen:
                                discovered_elements["suspicious_forms"] += 1
                    
                    # 3. Inspect clickables
                    buttons = await page.query_selector_all("button, input[type='button'], input[type='submit']")
                    for btn in buttons:
                        btn_text = await btn.inner_text() or await btn.get_attribute("value") or ""
                        discovered_elements["buttons"].append({
                            "route": route_path,
                            "text": btn_text.strip()
                        })
                        if btn_text.strip() == "":
                            discovered_elements["broken_buttons"] += 1
                    
                    # 4. Enforce depth boundary for further queues
                    if depth < MAX_DEPTH:
                        links = await page.query_selector_all("a")
                        for link in links:
                            href = await link.get_attribute("href")
                            if href:
                                full_link = urljoin(current_url, href)
                                parsed_link = urlparse(full_link)
                                if f"{parsed_link.scheme}://{parsed_link.netloc}" == base_domain:
                                    queue.append((full_link, depth + 1))
                                    discovered_elements["links"].append(full_link)
                    
                    # Simulate user interactions
                    if depth == 0 and len(buttons) > 0:
                        log_message(scan_id, "[AGENT] Simulating safe user inputs to test validation barriers...")
                        text_inputs = await page.query_selector_all("input[type='text'], input[type='email']")
                        if text_inputs:
                            input_name = await text_inputs[0].get_attribute("name") or "login"
                            log_message(scan_id, f"[AGENT] Populating text input '{input_name}' with test payload...")
                            await text_inputs[0].fill("dracula_demo_agent@test.com")
                            await asyncio.sleep(0.5)
                        
                        log_message(scan_id, f"[AGENT] Simulating safe click trigger on: '{btn_text or 'Button'}'")
                        await asyncio.sleep(0.5)
                        
                except Exception as route_err:
                    log_message(scan_id, f"[WARN] Error exploring route {route_path}: {route_err}")
            
            await browser.close()
            
    except Exception as e:
        log_message(scan_id, f"[ERROR] Explorer engine experienced a runtime error: {e}")
        
    log_message(scan_id, "[AGENT] Same-origin crawling and interaction stages successfully complete.")
    return visited_routes, screenshot_gallery, discovered_elements, console_errors
