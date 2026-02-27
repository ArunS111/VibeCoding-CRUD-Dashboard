import { test, expect } from '@playwright/test';

test.describe('Delete Item', () => {
  test('shows confirmation dialog before deleting', async ({ page }) => {
    await page.goto('/');
    const deleteBtn = page.getByRole('button', { name: /delete/i }).first();
    await deleteBtn.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/are you sure/i)).toBeVisible();
  });

  test('cancels deletion when dismissed', async ({ page }) => {
    await page.goto('/');
    const rows = page.locator('tbody tr');
    const initialCount = await rows.count();

    await page.getByRole('button', { name: /delete/i }).first().click();
    await page.getByRole('button', { name: /cancel|no/i }).click();

    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(rows).toHaveCount(initialCount);
  });

  test('confirms deletion removes the item', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /delete/i }).first().click();
    await page.getByRole('button', { name: /confirm|yes/i }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});
