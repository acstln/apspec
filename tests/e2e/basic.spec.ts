import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  
  // Check title
  await expect(page).toHaveTitle(/Catalogue AP Wifi/);
  
  // Check main heading
  await expect(page.locator('h1')).toContainText('Catalogue AP Wifi');
  
  // Check navigation
  await expect(page.locator('text=Table')).toBeVisible();
  await expect(page.locator('text=Compare')).toBeVisible();
});

test('search functionality', async ({ page }) => {
  await page.goto('/');
  
  // Wait for data to load
  await page.waitForSelector('.ap-table');
  
  // Enter search query
  await page.fill('.search-input', 'Aruba');
  
  // Check that table is filtered
  await expect(page.locator('.ap-table tbody tr')).not.toHaveCount(0);
});

test('comparison workflow', async ({ page }) => {
  await page.goto('/');
  
  // Wait for table to load
  await page.waitForSelector('.ap-table');
  
  // Select first AP
  await page.locator('.select-btn').first().click();
  
  // Navigate to compare
  await page.locator('text=Compare').click();
  
  // Check compare view
  await expect(page.locator('.compare-view')).toBeVisible();
});
