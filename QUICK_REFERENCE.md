# 🚀 Quick Reference - Essential Commands

## ⚡ Main Commands

```bash
# ⭐ ALL IN ONE: Run tests with video and open report
npm run test:run

# Run ALL tests
npm test

# Run only @smoke tests
npm run test:smoke

# Run in parallel (faster)
npm run test:parallel

# View browser while running
npm run test:headed

# Run with video recording
npm run test:video

# View HTML report (with embedded videos)
npm run test:report

# Run with video and view report (manual)
RECORD_VIDEO=true npm test && npm run test:report

# Generate report manually
npm run report:generate

# Clean previous results
npm run clean
```

## 📝 Development Commands

```bash
# Validate features without running
npx cucumber-js --dry-run

# Run a specific feature
npx cucumber-js features/todomvc.feature

# Run a specific scenario (by line)
npx cucumber-js features/todomvc.feature:11

# View project structure
./show-structure.sh

# Validate TypeScript
npx tsc --noEmit
```

## 🐛 Debugging

```bash
# Debug mode with Playwright Inspector
PWDEBUG=1 npm test

# Run with detailed logs
DEBUG=pw:api npm test

# Slow motion (view actions slowly)
SLOW_MO=1000 npm test

# Record test video
RECORD_VIDEO=true npm test

# View generated videos
open test-results/videos/
```

## 📊 Quick Structure

```
features/          → .feature files (Gherkin)
src/pages/         → Page Objects (POM)
src/steps/         → Step Definitions
src/support/       → World & Hooks
src/utils/         → Helpers & Constants
test-results/      → Reports, Screenshots & Videos
```

## 📚 Documentation

- `README.md` → Getting started and setup
- `ARCHITECTURE.md` → Detailed architecture
- `USAGE_GUIDE.md` → Examples and patterns
- `PIPELINE_CONFIGURATION.md` → CI/CD setup (Jenkins, GitHub Actions, etc.)
- `PROJECT_SUMMARY.md` → Complete summary
- `VALIDATION.md` → Validation checklist
- `Jenkinsfile` → Jenkins pipeline with video recording

## 🔄 CI/CD Quick Start

```bash
# Jenkins - Use included Jenkinsfile
# Features: video recording, HTML reports, artifact archiving

# GitHub Actions - Use .github/workflows/e2e-tests.yml
# Matrix testing across environments and browsers

# Any CI/CD platform
TEST_ENV=staging BROWSER=chrome RECORD_VIDEO=true npm test
```

## 🎯 Create New Test (3 Steps)

### 1️⃣ Create Page Object (using typed locators)
```typescript
// src/pages/MyPage.ts
export class MyPage extends BasePage {
  private selectors = { button: '#btn' };
  
  async clickButton() {
    // ✅ CORRECT: Use page.locator() (typed locator)
    await this.page.locator(this.selectors.button).click();
    
    // ❌ INCORRECT: Don't use page.click() directly
    // await this.page.click(this.selectors.button);
  }
}
```

### 2️⃣ Create Steps
```typescript
// src/steps/my.steps.ts
Given('I am on my page', async function() {
  await this.myPage.navigate();
});
```

### 3️⃣ Create Feature
```gherkin
# features/my-test.feature
Feature: My functionality
  Scenario: My test
    Given I am on my page
```

## ✅ Pre-Commit Checklist

- [ ] `npx tsc --noEmit` → No errors
- [ ] `npx cucumber-js --dry-run` → Valid features
- [ ] `npm test` → Tests pass
- [ ] Use **typed locators** (`page.locator()`) instead of legacy methods
- [ ] Documentation updated

## 🔗 Quick Links

- [Playwright Docs](https://playwright.dev/)
- [Cucumber Docs](https://cucumber.io/docs/cucumber/)
- [Gherkin Syntax](https://cucumber.io/docs/gherkin/)

## 💡 Tips

- Use `@smoke` for critical tests
- Run in parallel for faster execution
- Check screenshots in `test-results/screenshots/`
- Use `Logger.info()` for debugging
- Refer to `USAGE_GUIDE.md` for common patterns
