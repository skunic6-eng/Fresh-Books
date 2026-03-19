
import asyncio
import os
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # 1. Clean Books - Edit Modal
        await page.goto(f'file://{os.getcwd()}/index.html')
        # Add an entry first
        await page.fill('#amount', '50.00')
        await page.fill('#description', 'Test Entry')
        await page.click('button:has-text("Log Expense")')
        # Click Edit
        await page.click('.edit-btn')
        await page.wait_for_selector('#editModal', state='visible')
        await page.screenshot(path='/home/jules/verification/clean_books_edit_modal.png')
        await page.click('.close-modal')

        # 2. Clean Books - Undo Toast
        await page.click('.delete-btn')
        # Handle confirmation dialog if any - it's a window.confirm
        page.on("dialog", lambda dialog: dialog.accept())
        await page.screenshot(path='/home/jules/verification/clean_books_undo_toast.png')

        # 3. Book & Shine - Admin Day View
        await page.goto(f'file://{os.getcwd()}/book-and-shine.html')
        # Add a booking
        await page.fill('#clientName', 'John Doe')
        await page.fill('#bookingAddress', '123 Test St')
        await page.click('button:has-text("Book It")')

        # Click Calendar tab
        await page.click('nav a:has-text("Calendar")')
        # Wait for the day view to show the booking
        await page.wait_for_selector('.booking-item')
        await page.screenshot(path='/home/jules/verification/book_and_shine_admin.png')

        # 4. Book & Shine - Edit Modal
        await page.click('.edit-btn')
        await page.wait_for_selector('#editModal', state='visible')
        await page.screenshot(path='/home/jules/verification/book_and_shine_edit_modal.png')

        await browser.close()

if __name__ == '__main__':
    asyncio.run(run())
