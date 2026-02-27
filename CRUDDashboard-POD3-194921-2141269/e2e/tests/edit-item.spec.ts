import { test, expect } from '@playwright/test';

test.describe('Edit Item', () => {
  test('edits an existing item quantity', async ({ page }) => {
    await page.goto('/');
    const editBtn = page.getByRole('button', { name: /edit/i }).first();
    await editBtn.click();
    await expect(page.getByRole('dialog')).toBeVisible();

    const quantityInput = page.getByLabel(/quantity/i);
    await quantityInput.clear();
    await quantityInput.fill('99');

    await page.getByRole('button', { name: /save|update/i }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByText('99')).toBeVisible();
  });
});
