import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

/**
 * Common Step Definitions that can be reused
 */

// Generic navigation steps
Given('I navigate to {string}', async function (this: CustomWorld, url: string) {
  if (!this.page) {
    throw new Error('Page is not available');
  }
  await this.page.goto(url);
});

// Generic interaction steps using typed locators
When('I click on the element {string}', async function (this: CustomWorld, selector: string) {
  if (!this.page) {
    throw new Error('Page is not available');
  }
  await this.page.locator(selector).click();
});

When('I fill {string} with {string}', async function (this: CustomWorld, selector: string, text: string) {
  if (!this.page) {
    throw new Error('Page is not available');
  }
  await this.page.locator(selector).fill(text);
});

// Generic verification steps using typed locators
Then('the element {string} should be visible', async function (this: CustomWorld, selector: string) {
  if (!this.page) {
    throw new Error('Page is not available');
  }
  const isVisible = await this.page.locator(selector).isVisible();
  expect(isVisible, `Element "${selector}" should be visible on the page`).toBeTruthy();
});

Then('the element {string} should contain text {string}', async function (this: CustomWorld, selector: string, expectedText: string) {
  if (!this.page) {
    throw new Error('Page is not available');
  }
  const text = await this.page.locator(selector).textContent();
  expect(text, `Element "${selector}" should contain the text "${expectedText}"`).toContain(expectedText);
});

Then('the URL should contain {string}', async function (this: CustomWorld, urlPart: string) {
  if (!this.page) {
    throw new Error('Page is not available');
  }
  const url = this.page.url();
  expect(url, `Current URL "${url}" should contain "${urlPart}"`).toContain(urlPart);
});

Then('I wait for {int} seconds', async function (this: CustomWorld, seconds: number) {
  if (!this.page) {
    throw new Error('Page is not available');
  }
  await this.page.waitForTimeout(seconds * 1000);
});
