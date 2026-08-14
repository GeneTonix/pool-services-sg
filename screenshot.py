import asyncio
from playwright.async_api import async_playwright
import os

async def screenshot():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 800})
        
        # Go to shop page with cache busting
        await page.goto("https://oriontaquatic.com/shop.html?cb=999", wait_until="networkidle")
        
        # Find the lifeguard chair card and scroll to it
        chair_card = await page.query_selector('.product-lifeguard-chair')
        if chair_card:
            await chair_card.scroll_into_view_if_needed()
            await asyncio.sleep(1)
            
            # Take screenshot of just the lifeguard chair card
            screenshot_path = os.path.join(os.getcwd(), "screenshot-lifeguard-chair.png")
            await chair_card.screenshot(path=screenshot_path)
            print("Saved:", screenshot_path, "(" + str(os.path.getsize(screenshot_path)//1024) + "KB)")
        
        # Also take a full page screenshot
        full_path = os.path.join(os.getcwd(), "screenshot-shop-full.png")
        await page.screenshot(path=full_path, full_page=True)
        print("Saved:", full_path, "(" + str(os.path.getsize(full_path)//1024) + "KB)")
        
        await browser.close()

asyncio.run(screenshot())