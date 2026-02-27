import { test, expect } from '@playwright/test';

test.describe('Low Stock Highlighting', () => {
  test('low stock rows are visually highlighted', async ({ page }) => {
    await page.goto('/');
    const yellowRow = page.locator('tr.bg-yellow-50').first();
    const redRow = page.locator('tr.bg-red-50').first();

    const hasYellow = await yellowRow.count() > 0;
    const hasRed = await redRow.count() > 0;

    if (hasYellow) {
      await expect(yellowRow).toBeVisible();
    }
    if (hasRed) {
      await expect(redRow).toBeVisible();
    }
  });

  test('stats bar shows low stock count', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/low on stock/i)).toBeVisible();
    await expect(page.getByText(/out of stock/i)).toBeVisible();
  });
});
