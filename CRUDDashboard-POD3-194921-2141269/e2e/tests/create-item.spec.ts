import { test, expect } from '@playwright/test';

test.describe('Create Item', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('opens modal and creates a new item', async ({ page }) => {
    await page.getByRole('button', { name: /add item/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.getByLabel(/name/i).fill('Test Shirt');
    await page.getByLabel(/sku/i).fill(`TEST-${Date.now()}`);
    await page.getByLabel(/category/i).fill('Apparel');
    await page.getByLabel(/price/i).fill('29.99');
    await page.getByLabel(/quantity/i).fill('50');

    await page.getByRole('button', { name: /save|create/i }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByText('Test Shirt')).toBeVisible();
  });

  test('shows validation errors for empty form', async ({ page }) => {
    await page.getByRole('button', { name: /add item/i }).click();
    await page.getByRole('button', { name: /save|create/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });
});
