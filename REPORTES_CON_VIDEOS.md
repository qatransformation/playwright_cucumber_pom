# 📊 Reports with Embedded Videos

## 🎯 Description

The framework generates interactive HTML reports that include **embedded videos** of each scenario execution. This allows visual validation of what happened during tests.

## 🚀 Quick Usage

### Run Tests with Videos and Generate Report

```bash
# ⚡ RECOMMENDED OPTION: Run tests and open report automatically
npm run test:run

# Option 2: Using npm test (generates report automatically)
RECORD_VIDEO=true npm test

# Option 3: Run and generate report manually
RECORD_VIDEO=true npx cucumber-js
npm run report:generate

# View the report (without running tests)
npm run test:report
```

## 📋 Report Structure

```
test-results/
├── index.html                  # 📊 Main report (with embedded videos)
├── cucumber-report.html        # 📄 Basic Cucumber report
├── cucumber-report.json        # 📝 Data in JSON format
├── videos/                     # 🎥 Execution videos
│   └── Add_and_manage_complete_tasks_2026-02-15T16-48-37.webm
└── screenshots/                # 📸 Failure screenshots
    └── failure-*.png
```

## 🎬 Report Features

### 1. Main Dashboard

The `index.html` report includes:

- ✅ **Execution summary**: Passed/failed scenarios
- ✅ **Total duration**: Execution time
- ✅ **Metadata**: Browser, platform, date
- ✅ **Filters**: By status, feature, tags
- ✅ **Charts**: Results visualization

### 2. Embedded Videos

Each scenario shows:

- 🎥 **Full video** of the execution (playable in browser)
- ⏱️ **Duration** of the test
- ✅ **Status**: PASSED / FAILED
- 📝 **Steps**: Breakdown of each step with timings

### 3. Screenshots on Failures

If a test fails, the report shows:

- 📸 **Automatic screenshot** at moment of failure (inline visualization)
- ❌ **Complete error message** with details
- 📋 **Stack trace** to identify the exact line of failure
- 🔍 **Failure information**: Scenario, feature, tags, duration, date
- 🎥 **Complete video** of the execution (embedded and playable)
- 🖼️ **Zoom** on screenshot to see details
- 📊 **Complete context** for debugging

**Example of information attached in failures:**
```
❌ ERROR:
Error: expect(received).toContain(expected)
Expected substring: "999 items left"
Received string: "1 item left"

📋 STACK TRACE:
at Proxy.<anonymous> (/path/to/file.ts:126:23)
at CustomWorld.<anonymous> (/path/to/steps.ts:120:5)

🔍 FAILURE INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Scenario: My failed scenario
📂 Feature: features/my-test.feature
🏷️  Tags: @smoke, @regression
⏱️  Duration: 5.23s
📅 Date: 2/15/2026, 5:59:07 PM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 📋 Complete Flow Example

```bash
# ⚡ Option 1: ALL IN ONE (Recommended)
npm run test:run
# This command:
#   1. Cleans previous results (pretest hook)
#   2. Runs tests with video recording
#   3. Generates report automatically (posttest hook)
#   4. Opens report in browser

# Option 2: Step by step
# 1. Clean previous results
npm run clean

# 2. Run tests with video recording
RECORD_VIDEO=true npm test

# 3. Report is generated automatically (posttest hook)
# Output: "📊 HTML Report generated at: test-results/index.html"

# 4. Open report
npm run test:report
```

## 🔧 Configuration

### Available NPM Scripts

```json
{
  "test": "cucumber-js",                              // Run tests
  "test:run": "RECORD_VIDEO=true npm test && npm run test:report",  // ⚡ ALL IN ONE
  "test:video": "RECORD_VIDEO=true cucumber-js",      // Tests with video
  "report:generate": "node generate-report.js",       // Generate report
  "test:report": "open test-results/index.html",      // View report
  "posttest": "npm run report:generate"               // Auto-generate after test
}
```

### Customize Report Metadata

Edit `generate-report.js`:

```javascript
metadata: {
  browser: {
    name: 'chrome',
    version: 'latest'
  },
  device: 'Local Machine',
  platform: {
    name: process.platform,
    version: process.version
  }
},
customData: {
  title: 'Execution Information',
  data: [
    { label: 'Project', value: 'TodoMVC Automation Framework' },
    { label: 'Framework', value: 'Playwright + Cucumber + POM' },
    { label: 'Date', value: new Date().toLocaleString('en-US') },
    { label: 'Environment', value: 'Test' }
  ]
}
```

## 🎨 How Videos Are Embedded

### In the After Hook

```typescript
// src/support/hooks.ts
After(async function (this: CustomWorld, { pickle, result }) {
  // ... close context and rename video ...
  
  // Attach video to report
  const videoBuffer = fs.readFileSync(newVideoPath);
  this.attach(videoBuffer, 'video/webm');
  
  // Also attach path as text
  const relativeVideoPath = path.relative('test-results', newVideoPath);
  this.attach(`Video: ${relativeVideoPath}`, 'text/plain');
});
```

### In the JSON Report

Videos are saved in `cucumber-report.json` as:

```json
{
  "embeddings": [
    {
      "data": "base64_encoded_video_data...",
      "mime_type": "video/webm"
    },
    {
      "data": "Video: videos/Scenario_2026-02-15T16-48-37.webm",
      "mime_type": "text/plain"
    }
  ]
}
```

### In the HTML Report

The `multiple-cucumber-html-reporter` generator processes embeddings and creates:

- ✅ `<video>` tags with playback controls
- ✅ Download links
- ✅ File path information

## 📊 Report Types

### 1. Multiple-Cucumber-HTML Report (Recommended)

**File:** `test-results/index.html`

**Advantages:**
- ✅ Videos embedded in report
- ✅ Inline screenshots
- ✅ Interactive dashboard
- ✅ Filters and search
- ✅ Charts and statistics

**Usage:** Visual navigation and debugging

### 2. Basic Cucumber HTML Report

**File:** `test-results/cucumber-report.html`

**Advantages:**
- ✅ Simpler and faster
- ✅ Automatically generated by Cucumber

**Disadvantage:**
- ❌ Doesn't show embedded videos (only links)

### 3. JSON Report

**File:** `test-results/cucumber-report.json`

**Usage:**
- 📊 CI/CD integration
- 📈 Data analysis
- 🔄 Custom report generation

## 🎯 Use Cases

### For Developers (Debugging)

```bash
# Run tests locally with videos
RECORD_VIDEO=true npm test

# View report with videos for debugging
npm run test:report
```

**When a test fails, the report shows:**
1. ❌ **Exact error message**
2. 📋 **Stack trace** with line and file of failure
3. 📸 **Screenshot** at moment of failure
4. 🎥 **Complete video** of execution
5. 🔍 **Context**: Scenario, feature, tags, duration
6. ⏱️ **Timeline** of each step with durations

**Advantages for debugging:**
- ✅ See exactly what happened visually
- ✅ Replay failure frame by frame in video
- ✅ Identify exact line of code that failed
- ✅ Compare expected vs actual state with screenshot
- ✅ Analyze timing of each step

### For QA

```bash
# Run complete suite with videos
RECORD_VIDEO=true npm test

# Share report
# Send test-results/index.html + videos/ folder
```

### For CI/CD

```bash
# In pipeline (GitHub Actions, GitLab CI)
RECORD_VIDEO=true npm test

# Archive artifacts
- test-results/index.html
- test-results/videos/
- test-results/cucumber-report.json
```

## 🐛 Troubleshooting

### Videos don't appear in report

**Cause:** Not executed with `RECORD_VIDEO=true`

**Solution:**
```bash
RECORD_VIDEO=true npm test
```

### I don't see "+Show Info" or details in failed scenarios

**Cause:** Report may have embeddings collapsed by default

**Solution:**
Attachments (error, stack trace, video, screenshot) are automatically attached on failures. In the HTML report:

1. **Find the failed scenario** (marked in red ❌)
2. **Click on the scenario** to expand details
3. **Attachments appear at the end** of the scenario:
   - 📄 **Text attachments**: Error message, stack trace, failure info
   - 📸 **Image attachments**: Failure screenshot
   - 🎥 **Video attachments**: Complete execution video

**Verify in JSON:**
```bash
cat test-results/cucumber-report.json | grep -A 5 "embeddings"
```

If you see embeddings in JSON but not in HTML, regenerate the report:
```bash
npm run report:generate
```

### Report is not generated automatically

**Cause:** `posttest` hook not configured

**Solution:**
```bash
# Generate manually
npm run report:generate
```

### Videos are very large

**Cause:** Very high resolution or very long tests

**Solution:**
- Reduce resolution in `src/support/world.ts`
- Split long tests into smaller scenarios

### Browser cannot play the video

**Cause:** WebM format not supported (rare in modern browsers)

**Solution:**
- Use Chrome/Firefox/Edge (all support WebM)
- Download video and play with VLC

## 📚 References

- [multiple-cucumber-html-reporter](https://github.com/wswebcreation/multiple-cucumber-html-reporter)
- [Cucumber JSON Format](https://cucumber.io/docs/cucumber/reporting/)
- [Cucumber Attachments](https://cucumber.io/docs/cucumber/api/#attachments)

## 💡 Tips

1. **Run only with videos when necessary**: Videos consume space and time
2. **Share complete report**: Include `index.html` + `videos/` folder
3. **CI/CD**: Configure to archive `test-results/` as artifact
4. **Debugging**: Embedded video allows you to see exactly what happened
5. **Screenshots + Videos**: Perfect combination for post-mortem analysis

## ✨ Conclusion

The report with embedded videos provides:

- 🎥 **Complete visual validation** of execution
- 🐛 **Efficient debugging** with frame-by-frame replay
- 📊 **Automatic documentation** of test cases
- 🤝 **Clear communication** with stakeholders
- 🔍 **Detailed post-mortem** analysis

Now you can see exactly what happened in each test without running it again!
