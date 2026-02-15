import { Page } from '@playwright/test';

/**
 * BasePage - Base class for all Page Objects
 * Provides common functionality for all pages
 */
export class BasePage {
  protected page: Page;
  protected baseURL: string;

  constructor(page: Page, baseURL: string = '') {
    this.page = page;
    this.baseURL = baseURL;
  }

  /**
   * Navigate to a specific URL
   */
  async navigate(path: string = '') {
    await this.page.goto(`${this.baseURL}${path}`);
  }

  /**
   * Wait for an element to be visible
   */
  async waitForSelector(selector: string, timeout: number = 30000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Click an element using typed locator
   */
  async click(selector: string) {
    await this.page.locator(selector).click();
  }

  /**
   * Type text in a field using typed locator
   */
  async fill(selector: string, text: string) {
    await this.page.locator(selector).fill(text);
  }

  /**
   * Get text from an element using typed locator
   */
  async getText(selector: string): Promise<string> {
    return await this.page.locator(selector).textContent() || '';
  }

  /**
   * Check if an element is visible using typed locator
   */
  async isVisible(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isVisible();
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Wait for a specific time
   */
  async wait(milliseconds: number) {
    await this.page.waitForTimeout(milliseconds);
  }

  /**
   * Take a screenshot
   */
  async screenshot(path: string) {
    await this.page.screenshot({ path });
  }
}
