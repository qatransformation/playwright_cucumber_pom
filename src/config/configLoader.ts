import * as fs from 'fs';
import * as path from 'path';

/**
 * Interface for environment configuration
 */
export interface EnvironmentConfig {
  name: string;
  baseUrl: string;
  timeout: number;
  slowMo?: number;
}

/**
 * Interface for browser configuration
 */
export interface BrowserConfig {
  channel?: string | null;
  headless: boolean;
  viewport: {
    width: number;
    height: number;
  };
}

/**
 * Interface for complete configuration
 */
export interface TestConfiguration {
  environments: Record<string, EnvironmentConfig>;
  browsers: Record<string, BrowserConfig>;
  default: {
    environment: string;
    browser: string;
  };
}

/**
 * Class to load and manage test configuration
 */
export class ConfigLoader {
  private config: TestConfiguration;
  private configPath: string;

  constructor(configPath?: string) {
    this.configPath = configPath || path.join(process.cwd(), 'test.config.json');
    this.config = this.loadConfig();
  }

  /**
   * Load configuration from JSON file
   */
  private loadConfig(): TestConfiguration {
    try {
      const configFile = fs.readFileSync(this.configPath, 'utf-8');
      return JSON.parse(configFile);
    } catch (error) {
      console.error(`Error loading configuration from ${this.configPath}:`, error);
      throw new Error(`Could not load configuration file: ${this.configPath}`);
    }
  }

  /**
   * Get configuration for specified environment
   * @param envName - Environment name (if not specified, uses default value or environment variable)
   */
  getEnvironment(envName?: string): EnvironmentConfig {
    const environmentName = envName || process.env.TEST_ENV || this.config.default.environment;
    
    if (!this.config.environments[environmentName]) {
      throw new Error(
        `Environment "${environmentName}" not found. Available environments: ${Object.keys(this.config.environments).join(', ')}`
      );
    }

    return this.config.environments[environmentName];
  }

  /**
   * Get configuration for specified browser
   * @param browserName - Browser name (if not specified, uses default value or environment variable)
   */
  getBrowser(browserName?: string): BrowserConfig {
    const browser = browserName || process.env.BROWSER || this.config.default.browser;
    
    if (!this.config.browsers[browser]) {
      throw new Error(
        `Browser "${browser}" not found. Available browsers: ${Object.keys(this.config.browsers).join(', ')}`
      );
    }

    return this.config.browsers[browser];
  }

  /**
   * Get all available environments
   */
  getAvailableEnvironments(): string[] {
    return Object.keys(this.config.environments);
  }

  /**
   * Get all available browsers
   */
  getAvailableBrowsers(): string[] {
    return Object.keys(this.config.browsers);
  }

  /**
   * Get complete configuration
   */
  getFullConfig(): TestConfiguration {
    return this.config;
  }

  /**
   * Display current configuration in console
   */
  printCurrentConfig(): void {
    const env = this.getEnvironment();
    const browser = this.getBrowser();
    
    console.log('\n📋 Test Configuration');
    console.log('========================');
    console.log(`🌍 Environment: ${env.name}`);
    console.log(`   Base URL: ${env.baseUrl}`);
    console.log(`   Timeout: ${env.timeout}ms`);
    if (env.slowMo) console.log(`   Slow Motion: ${env.slowMo}ms`);
    console.log(`🌐 Browser: ${process.env.BROWSER || this.config.default.browser}`);
    console.log(`   Headless: ${browser.headless}`);
    console.log(`   Viewport: ${browser.viewport.width}x${browser.viewport.height}`);
    console.log('========================\n');
  }
}

// Export a singleton instance
export const configLoader = new ConfigLoader();
