import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Custom logger for tests
 */
export class Logger {
  private static logFile = path.join(process.cwd(), 'test-results', 'test.log');

  static log(message: string, level: 'INFO' | 'ERROR' | 'WARN' | 'DEBUG' = 'INFO') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}\n`;
    
    console.log(logMessage.trim());
    
    // Ensure directory exists
    const dir = path.dirname(this.logFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.appendFileSync(this.logFile, logMessage);
  }

  static info(message: string) {
    this.log(message, 'INFO');
  }

  static error(message: string) {
    this.log(message, 'ERROR');
  }

  static warn(message: string) {
    this.log(message, 'WARN');
  }

  static debug(message: string) {
    this.log(message, 'DEBUG');
  }

  static clearLog() {
    if (fs.existsSync(this.logFile)) {
      fs.unlinkSync(this.logFile);
    }
  }
}

/**
 * Generates a unique filename for screenshots
 */
export function generateScreenshotName(prefix: string = 'screenshot'): string {
  const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\./g, '-');
  return `${prefix}-${timestamp}.png`;
}

/**
 * Generates random data for tests
 */
export class TestDataGenerator {
  static randomString(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static randomEmail(): string {
    return `test-${this.randomString(8)}@example.com`;
  }

  static randomNumber(min: number = 0, max: number = 100): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static randomPhone(): string {
    return `+1${this.randomNumber(1000000000, 9999999999)}`;
  }
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt === maxAttempts) {
        throw lastError;
      }
      
      const delay = initialDelay * Math.pow(2, attempt - 1);
      Logger.warn(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}
