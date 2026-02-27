import { test, expect } from '@playwright/test';

test.describe('Search and Filter', () => {
  test('filters table in real-time as user types', async ({ page }) => {
    await page.goto('/');
    const rows = page.locator('tbody tr');
    const initialCount = await rows.count();

    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill('zzznomatch999xyz');
    await expect(rows).toHaveCount(0);

    await searchInput.clear();
    await expect(rows).toHaveCount(initialCount);
  });

  test('search is case-insensitive', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.getByPlaceholder(/search/i);

    await searchInput.fill('APPAREL');
    const upperCount = await page.locator('tbody tr').count();

    await searchInput.clear();
    await searchInput.fill('apparel');
    const lowerCount = await page.locator('tbody tr').count();

    expect(upperCount).toEqual(lowerCount);
  });
});
