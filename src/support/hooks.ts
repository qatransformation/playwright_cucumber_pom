import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { CustomWorld } from './world';
import { configLoader } from '../config/configLoader';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Global hooks for test configuration
 */

BeforeAll(async function () {
  console.log('🚀 Starting test suite...');
  // Show current configuration
  configLoader.printCurrentConfig();
});

Before(async function (this: CustomWorld, { pickle }) {
  console.log(`\n📝 Running: ${pickle.name}`);
  await this.init('chromium'); // You can change the browser here
});

After(async function (this: CustomWorld, { pickle, result }) {
  let videoPath: string | undefined;
  
  // If test fails, attach error information
  if (result?.status === Status.FAILED) {
    // Attach error message
    if (result.message) {
      this.attach(`❌ ERROR:\n${result.message}`, 'text/plain');
      console.log(`\n❌ ERROR in "${pickle.name}":\n${result.message}`);
    }
    
    // Attach stack trace if exists
    if (result.message && result.message.includes('at ')) {
      const stackTrace = result.message.split('\n').filter(line => line.includes('at ')).join('\n');
      if (stackTrace) {
        this.attach(`📋 STACK TRACE:\n${stackTrace}`, 'text/plain');
      }
    }
    
    // Take screenshot if test fails
    if (this.page) {
      try {
        const timestamp = new Date().getTime();
        const screenshotPath = `./test-results/screenshots/failure-${timestamp}.png`;
        await this.page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`📸 Screenshot saved: ${screenshotPath}`);
        
        // Attach screenshot to report
        const screenshot = fs.readFileSync(screenshotPath);
        this.attach(screenshot, 'image/png');
      } catch (error) {
        console.error('Error capturing screenshot:', error);
      }
    }
    
    // Attach scenario information
    const failureInfo = `
🔍 FAILURE INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Scenario: ${pickle.name}
📂 Feature: ${pickle.uri}
🏷️  Tags: ${pickle.tags.map(t => t.name).join(', ') || 'No tags'}
⏱️  Duration: ${result.duration ? (Number(result.duration) / 1000000000).toFixed(2) + 's' : 'N/A'}
📅 Date: ${new Date().toLocaleString('en-US')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();
    
    this.attach(failureInfo, 'text/plain');
  }

  // Rename and attach video if enabled
  if (this.context && process.env.RECORD_VIDEO === 'true' && this.page) {
    try {
      // Get original video path
      const originalVideoPath = await this.page.video()?.path();
      
      if (originalVideoPath) {
        // Close context first to finish video
        await this.cleanup();
        
        // Create custom name
        const timestamp = new Date();
        const dateStr = timestamp.toISOString().replace(/:/g, '-').replace(/\..+/, '');
        
        // Clean scenario name (remove non-allowed characters)
        const scenarioName = pickle.name
          .replace(/[^a-zA-Z0-9\s-]/g, '')
          .replace(/\s+/g, '_')
          .substring(0, 50); // Limit length
        
        const newVideoName = `${scenarioName}_${dateStr}.webm`;
        const newVideoPath = path.join(path.dirname(originalVideoPath), newVideoName);
        
        // Rename file if exists
        if (fs.existsSync(originalVideoPath)) {
          fs.renameSync(originalVideoPath, newVideoPath);
          videoPath = newVideoPath;
          console.log(`🎥 Video saved: ${newVideoPath}`);
          
          // Attach video to report
          const videoBuffer = fs.readFileSync(newVideoPath);
          this.attach(videoBuffer, 'video/webm');
          
          // Also attach as relative link
          const relativeVideoPath = path.relative('test-results', newVideoPath);
          this.attach(`🎬 Video: ${relativeVideoPath}`, 'text/plain');
        }
      } else {
        await this.cleanup();
      }
    } catch (error) {
      console.error('Error processing video:', error);
      await this.cleanup();
    }
  } else {
    await this.cleanup();
  }
  
  // Final status message
  const statusEmoji = result?.status === Status.PASSED ? '✅' : '❌';
  const statusText = result?.status === Status.PASSED ? 'Test completed' : 'Test FAILED';
  console.log(`${statusEmoji} ${statusText}: ${pickle.name}`);
  
  // If failed, show summary
  if (result?.status === Status.FAILED) {
    console.log(`📊 Report available at: test-results/index.html`);
    if (videoPath) {
      console.log(`🎥 Failure video: ${videoPath}`);
    }
  }
});

AfterAll(async function () {
  console.log('\n🏁 Test suite completed');
});
