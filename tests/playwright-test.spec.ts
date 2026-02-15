import  {test, expect} from '@playwright/test';

test('Add a task', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});