import { expect, test } from '@playwright/test';

test('project files, document tabs, and dock windows are interactive', async ({ page }) => {
  await page.goto('/');
  const portfolioWindow = page.locator('#portfolio-os');

  await page.getByRole('button', { name: /matching-engine/i }).click();
  await expect(portfolioWindow.getByRole('heading', { name: 'Investor & Attendee Matching Engine' })).toBeVisible();
  await expect(portfolioWindow.getByText('origin: Synexis')).toBeVisible();

  await page.getByRole('button', { name: 'architecture' }).click();
  await expect(portfolioWindow.getByText('Normalized investment thesis')).toBeVisible();

  await page.getByRole('button', { name: /^Resume$/ }).click();
  await expect(page.getByRole('heading', { name: /Founder & CTO @ Synexis/i })).toBeVisible();

  await page.getByRole('button', { name: /^Stack$/ }).click();
  await expect(page.getByRole('heading', { name: 'Application Engineering' })).toBeVisible();

  await page.getByRole('button', { name: /^Cloud$/ }).click();
  await expect(page.getByRole('heading', { name: 'Application and cloud engineering scope' })).toBeVisible();
});

test('geosat project exposes Vimeo player and slideshow artifacts', async ({ page }) => {
  await page.goto('/');
  const portfolioWindow = page.locator('#portfolio-os');

  await page.getByRole('button', { name: /geosat-aiops/i }).click();
  await expect(portfolioWindow.getByRole('heading', { name: 'GeoSat AIOps Inference Systems' })).toBeVisible();
  await expect(portfolioWindow.getByTitle('Larus Technologies GeoSat AIOps overview')).toBeVisible();
  await expect(portfolioWindow.getByRole('button', { name: 'Expand' })).toHaveCount(0);

  await portfolioWindow.getByRole('button', { name: 'Slideshow' }).click();
  await expect(portfolioWindow.getByAltText(/Real-time Threat Intelligence|Maritime Threat Intent Recognition|Predictive Naval Track Modelling|Historical Track Analysis/i).first()).toBeVisible();

  await portfolioWindow.getByRole('button', { name: 'Expand' }).click();
  await expect(page.getByRole('dialog', { name: /GeoSat AIOps Inference Systems expanded media/i })).toBeVisible();
});

test('enterprise mlops project shows RBC application context and NOMI video', async ({ page }) => {
  await page.goto('/');
  const portfolioWindow = page.locator('#portfolio-os');

  await page.getByRole('button', { name: /enterprise-mlops/i }).click();
  await expect(portfolioWindow.getByRole('heading', { name: 'Enterprise AI Platform & MLOps' })).toBeVisible();
  await expect(portfolioWindow.getByRole('link', { name: /NOMI Forecast/i })).toBeVisible();
  await expect(portfolioWindow.getByRole('link', { name: /Lumina/i })).toBeVisible();
  await expect(portfolioWindow.getByRole('link', { name: /Aiden/i })).toBeVisible();
  await expect(portfolioWindow.getByText('Did not own the quantitative forecasting mathematics')).toBeVisible();
  await expect(portfolioWindow.locator('video[title="NOMI Forecast customer experience award video"]')).toBeVisible();
  await expect(portfolioWindow.getByRole('button', { name: 'Expand' })).toHaveCount(0);
});

test('projects without media do not show artifact placeholder text', async ({ page }) => {
  await page.goto('/');
  const portfolioWindow = page.locator('#portfolio-os');

  await page.getByRole('button', { name: /investment-graph/i }).click();
  await expect(portfolioWindow.getByRole('heading', { name: 'Investment Intelligence Graph' })).toBeVisible();
  await expect(portfolioWindow.getByText('Project artifact view')).toHaveCount(0);
  await expect(portfolioWindow.getByText('Add graph projection diagrams')).toHaveCount(0);
});
