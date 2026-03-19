const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Clean Books Features', () => {
  test('should add, edit, and delete an entry with undo', async ({ page }) => {
    const filePath = 'file://' + path.resolve(__dirname, '../index.html');
    await page.goto(filePath);

    // Add entry
    await page.fill('#inputAmount', '100');
    await page.fill('#inputDesc', 'Test Expense');
    await page.click('.cat-btn:has-text("Supplies & Equipment")');
    await page.click('#submitBtn');

    // Switch to Entries tab
    await page.click('.nav-btn:has-text("Entries")');

    await expect(page.locator('#entriesList')).toContainText('Test Expense');
    await expect(page.locator('#entriesList')).toContainText('$100.00');

    // Edit entry
    await page.click('.btn-edit');
    await expect(page.locator('#editModal')).toHaveClass(/active/);
    await page.fill('#editAmount', '150');
    await page.fill('#editDesc', 'Updated Expense');
    await page.click('#saveEditBtn');
    await expect(page.locator('#editModal')).not.toHaveClass(/active/);

    await expect(page.locator('#entriesList')).toContainText('Updated Expense');
    await expect(page.locator('#entriesList')).toContainText('$150.00');

    // Delete entry with undo
    await page.click('.btn-delete');
    await expect(page.locator('#toast')).toContainText('Entry deleted...');
    await page.click('#toast button:has-text("Undo")');
    await expect(page.locator('#entriesList')).toContainText('Updated Expense');

    // Delete again and let it finalize
    await page.click('.btn-delete');
    await page.waitForTimeout(3500);
    await expect(page.locator('#entriesList')).not.toContainText('Updated Expense');
  });
});

test.describe('Book & Shine Features', () => {
  test('should add, edit, delete, and change status of a booking', async ({ page }) => {
    const filePath = 'file://' + path.resolve(__dirname, '../book-and-shine.html');
    await page.goto(filePath);

    // Switch to Admin view (default)

    // Add booking
    await page.click('.nav-btn:has-text("New Booking")');
    await page.fill('#addBkClient', 'John Doe');
    await page.fill('#addBkAddress', '123 Test St');
    await page.click('button:has-text("Book It ✦")');

    // Go to Calendar tab
    await page.click('.nav-btn:has-text("Calendar")');
    await expect(page.locator('#dayBookings')).toContainText('John Doe');

    // Edit booking
    await page.click('.btn-edit-sm');
    await expect(page.locator('#editBookingModal')).toHaveClass(/active/);
    await page.fill('#editBkClient', 'John Smith');
    await page.click('button:has-text("Save Changes ✦")');
    await expect(page.locator('#editBookingModal')).not.toHaveClass(/active/);
    await expect(page.locator('#dayBookings')).toContainText('John Smith');

    // Change status
    await page.selectOption('.status-select', 'completed');
    await expect(page.locator('.booking-status.completed')).toBeVisible();

    // Delete booking
    page.on('dialog', dialog => dialog.accept());
    await page.click('.btn-delete-sm');
    await expect(page.locator('#dayBookings')).not.toContainText('John Smith');
  });
});
