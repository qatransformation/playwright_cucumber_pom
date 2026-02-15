import { Browser, BrowserContext, Page, chromium, firefox, webkit } from '@playwright/test';
import { IWorldOptions, World, setWorldConstructor } from '@cucumber/cucumber';
import { TodoPage } from '../pages';
import { configLoader } from '../config/configLoader';

/**
 * CustomWorld - Shared context between all Cucumber steps
 * Handles browser and page lifecycle
 */
export class CustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  
  // Page Objects
  todoPage?: TodoPage;

  constructor(options: IWorldOptions) {
    super(options);
  }

  /**
   * Initialize browser using external configuration
   */
  async init(browserType?: 'chromium' | 'firefox' | 'webkit') {
    // Get configuration from test.config.json file
    const envConfig = configLoader.getEnvironment();
    const browserConfig = configLoader.getBrowser();
    
    // Determine which browser to use
    const browserToUse = browserType || (process.env.BROWSER as 'chromium' | 'firefox' | 'webkit') || 'chromium';
    const headless = process.env.HEADLESS !== 'false' && browserConfig.headless;
    
    // Chrome args configuration
    const chromeArgs = [
      '--disable-features=Translate',
      '--disable-translate',
      '--disable-blink-features=AutomationControlled',
    ];
    
    switch (browserToUse) {
      case 'firefox':
        this.browser = await firefox.launch({ 
          headless,
          slowMo: envConfig.slowMo
        });
        break;
      case 'webkit':
        this.browser = await webkit.launch({ 
          headless,
          slowMo: envConfig.slowMo
        });
        break;
      default:
        this.browser = await chromium.launch({ 
          headless, 
          channel: browserConfig.channel || 'chrome',
          args: chromeArgs,
          slowMo: envConfig.slowMo
        });
    }
    
    this.context = await this.browser.newContext({
      viewport: browserConfig.viewport,
      locale: 'en-US',
      baseURL: envConfig.baseUrl,  // Use baseURL from configuration
      recordVideo: process.env.RECORD_VIDEO === 'true' ? {
        dir: './test-results/videos',
        size: browserConfig.viewport
      } : undefined,
      // Chrome preferences to disable translations
      ...(browserToUse === 'chromium' && {
        permissions: [],
        extraHTTPHeaders: {
          'Accept-Language': 'en-US,en;q=0.9'
        }
      })
    });
    
    // Configure context timeout
    this.context.setDefaultTimeout(envConfig.timeout);
    
    this.page = await this.context.newPage();
    
    // Disable Chrome translation popup via CDP
    if (browserToUse === 'chromium' && this.page) {
      const client = await this.context.newCDPSession(this.page);
      await client.send('Network.setUserAgentOverride', {
        userAgent: await this.page.evaluate(() => navigator.userAgent),
        acceptLanguage: 'en-US,en'
      });
    }
    
    // Initialize Page Objects
    this.initializePages();
  }

  /**
   * Initialize all Page Objects
   */
  private initializePages() {
    if (this.page) {
      this.todoPage = new TodoPage(this.page);
      // Add more Page Objects here as needed
    }
  }

  /**
   * Close browser
   */
  async cleanup() {
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }
}

setWorldConstructor(CustomWorld);
