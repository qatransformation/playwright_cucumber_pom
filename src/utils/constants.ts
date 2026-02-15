/**
 * Global project constants
 */

export const TIMEOUTS = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 30000,
  EXTRA_LONG: 60000,
};

export const URLS = {
  BASE: 'https://playwright.dev',
  DOCS: '/docs/intro',
  API: '/docs/api/class-playwright',
};

export const BROWSER_CONFIG = {
  HEADLESS: process.env.HEADLESS === 'true',
  SLOW_MO: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0,
  VIEWPORT: {
    width: 1280,
    height: 720,
  },
};

export const TEST_DATA = {
  SEARCH_QUERIES: {
    API: 'API',
    TESTING: 'testing',
    TYPESCRIPT: 'typescript',
  },
};
