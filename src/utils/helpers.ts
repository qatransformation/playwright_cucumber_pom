import { Page } from '@playwright/test';

/**
 * Utilities for interacting with page elements
 */

/**
 * Wait for an element to be visible and clickable
 */
export async function waitForClickable(page: Page, selector: string, timeout: number = 30000): Promise<void> {
  await page.waitForSelector(selector, { state: 'visible', timeout });
  await page.waitForSelector(selector, { state: 'attached', timeout });
}

/**
 * Scroll to a specific element
 */
export async function scrollToElement(page: Page, selector: string): Promise<void> {
  await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, selector);
}

/**
 * Wait for the page to be completely loaded
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('load');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {
    console.log('Network idle timeout - continuing...');
  });
}

/**
 * Gets text from multiple elements using typed locators
 */
export async function getTextFromElements(page: Page, selector: string): Promise<string[]> {
  const elements = await page.locator(selector).all();
  const texts: string[] = [];
  
  for (const element of elements) {
    const text = await element.textContent();
    if (text) {
      texts.push(text.trim());
    }
  }
  
  return texts;
}

/**
 * Verifica si un elemento contiene una clase CSS usando typed locator
 */
export async function hasClass(page: Page, selector: string, className: string): Promise<boolean> {
  const locator = page.locator(selector);
  if (await locator.count() === 0) return false;
  
  const classes = await locator.getAttribute('class');
  return classes ? classes.split(' ').includes(className) : false;
}

/**
 * Espera y hace click con retry usando typed locator
 */
export async function clickWithRetry(page: Page, selector: string, maxAttempts: number = 3): Promise<void> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await page.locator(selector).click({ timeout: 5000 });
      return;
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }
      await page.waitForTimeout(1000);
    }
  }
}

/**
 * Limpia y escribe texto en un campo usando typed locator
 */
export async function clearAndFill(page: Page, selector: string, text: string): Promise<void> {
  const locator = page.locator(selector);
  await locator.click();
  await locator.fill('');
  await locator.fill(text);
}

/**
 * Hover sobre un elemento y espera usando typed locator
 */
export async function hoverAndWait(page: Page, selector: string, waitTime: number = 500): Promise<void> {
  await page.locator(selector).hover();
  await page.waitForTimeout(waitTime);
}
