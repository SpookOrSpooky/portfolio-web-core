import { expect, test } from '@playwright/test';

test('project files, document tabs, and dock windows are interactive', async ({ page }) => {
  await page.goto('/');
  const heroWindow = page.locator('#home');

  await page.getByRole('button', { name: /matching-engine/i }).click();
  await expect(heroWindow.getByRole('heading', { name: 'Recommendation & Matching Engine' })).toBeVisible();

  await page.getByRole('button', { name: 'architecture' }).click();
  await expect(heroWindow.getByText('Profile compactors normalize investment thesis')).toBeVisible();

  await page.getByRole('button', { name: /^Resume$/ }).click();
  await expect(page.getByRole('heading', { name: /Founder & CTO @ Synexis/i })).toBeVisible();

  await page.getByRole('button', { name: /^Blog$/ }).click();
  await expect(page.getByRole('heading', { name: /Designing source-scoped GraphRAG/i })).toBeVisible();
});
