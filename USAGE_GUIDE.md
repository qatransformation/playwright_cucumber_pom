# Quick Usage Guide

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run example tests
npm test

# 3. View report
npm run test:report

# 4. Run tests with video recording
npm run test:video
```

## 📝 Useful Commands

### Test Execution

```bash
# Run all tests
npm test

# Run tests with specific tag
npm run test:smoke

# Run tests in parallel (2 workers)
npm run test:parallel

# Run tests in headed mode (with visible browser)
npm run test:headed

# Run tests with video recording
npm run test:video
RECORD_VIDEO=true npm test

# Run a specific feature
npx cucumber-js features/homepage.feature

# Run a specific scenario by line
npx cucumber-js features/homepage.feature:10

# Run tests with multiple tags
npx cucumber-js --tags "@smoke and @regression"
npx cucumber-js --tags "@smoke or @regression"
npx cucumber-js --tags "not @skip"
```

### Development

```bash
# Clean previous results
npm run clean

# Compile TypeScript (if necessary)
npx tsc --noEmit

# Validate feature syntax
npx cucumber-js --dry-run

# List unimplemented steps
npx cucumber-js --dry-run --format progress
```

### Debugging

```bash
# Run in debug mode with Playwright Inspector
PWDEBUG=1 npm test

# Run with detailed logs
DEBUG=pw:api npm test

# Run a single scenario for debugging
npx cucumber-js features/homepage.feature:5

# View Playwright traces
npx playwright show-trace trace.zip

# Run with video recording for debugging
RECORD_VIDEO=true npm test

# View generated videos
open test-results/videos/
```

## 📚 Usage Examples

### Create a New Page Object

```typescript
// src/pages/LoginPage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly selectors = {
    emailInput: '#email',
    passwordInput: '#password',
    loginButton: 'button[type="submit"]',
    errorMessage: '.error-message',
  };

  constructor(page: Page) {
    super(page, 'https://your-app.com');
  }

  async login(email: string, password: string) {
    await this.fill(this.selectors.emailInput, email);
    await this.fill(this.selectors.passwordInput, password);
    await this.click(this.selectors.loginButton);
  }

  async getErrorMessage(): Promise<string> {
    return await this.getText(this.selectors.errorMessage);
  }
}
```

### Add to World

```typescript
// src/support/world.ts
import { TodoPage } from '../pages/TodoPage';

export class CustomWorld extends World {
  // ... existing code ...
  todoPage?: TodoPage;

  private initializePages() {
    if (this.page) {
      this.todoPage = new TodoPage(this.page); // ← Add here
    }
  }
}
```

### Create Step Definitions

```typescript
// src/steps/login.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Given('the user is on the login page', async function (this: CustomWorld) {
  await this.loginPage!.navigate('/login');
});

When('enters email {string} and password {string}', async function (
  this: CustomWorld,
  email: string,
  password: string
) {
  await this.loginPage!.login(email, password);
});

Then('should see an error message {string}', async function (
  this: CustomWorld,
  expectedMessage: string
) {
  const errorMessage = await this.loginPage!.getErrorMessage();
  expect(errorMessage).toContain(expectedMessage);
});
```

### Create Feature File

```gherkin
# features/login.feature
# language: en
Feature: User authentication
  As a system user
  I want to be able to log in
  To access my account

  Background:
    Given the user is on the login page

  Scenario: Successful login with valid credentials
    When enters email "user@example.com" and password "ValidPass123"
    Then the URL should contain "/dashboard"

  Scenario: Failed login with invalid credentials
    When enters email "wrong@example.com" and password "WrongPass"
    Then should see an error message "Invalid credentials"

  @smoke
  Scenario Outline: Required field validation
    When enters email "<email>" and password "<password>"
    Then should see an error message "<message>"

    Examples:
      | email           | password    | message               |
      |                 | pass123     | Email is required     |
      | test@email.com  |             | Password is required  |
      | invalid-email   | pass123     | Invalid email         |
```

## 🎯 Common Patterns

### Interact with Dropdowns

```typescript
// In the Page Object
async selectOption(value: string) {
  await this.page.selectOption(this.selectors.dropdown, value);
}

// In the step
When('selects {string} from dropdown', async function (this: CustomWorld, value: string) {
  await this.myPage!.selectOption(value);
});
```

### Handle Modals/Dialogs

```typescript
// In the Page Object
async acceptAlert() {
  this.page.on('dialog', dialog => dialog.accept());
}

async getAlertText(): Promise<string> {
  return new Promise((resolve) => {
    this.page.once('dialog', dialog => {
      resolve(dialog.message());
      dialog.accept();
    });
  });
}
```

### Upload Files

```typescript
// In the Page Object
async uploadFile(filePath: string) {
  await this.page.setInputFiles(this.selectors.fileInput, filePath);
}

// In the step
When('uploads file {string}', async function (this: CustomWorld, fileName: string) {
  const filePath = path.join(__dirname, '../../test-data', fileName);
  await this.myPage!.uploadFile(filePath);
});
```

### Work with Tables

```typescript
// In the Page Object
async getTableData(): Promise<string[][]> {
  const rows = await this.page.$$('table tbody tr');
  const data: string[][] = [];
  
  for (const row of rows) {
    const cells = await row.$$('td');
    const rowData: string[] = [];
    
    for (const cell of cells) {
      const text = await cell.textContent();
      rowData.push(text?.trim() || '');
    }
    
    data.push(rowData);
  }
  
  return data;
}
```

### Wait for Dynamic Elements

```typescript
// In the Page Object
async waitForLoadingToFinish() {
  await this.page.waitForSelector('.loading', { state: 'hidden' });
}

async waitForDataLoad() {
  await this.page.waitForResponse(
    response => response.url().includes('/api/data') && response.status() === 200
  );
}
```

## 🔍 Data Tables in Cucumber

```gherkin
Scenario: Create multiple users
  When I create the following users:
    | name   | email              | role    |
    | Juan   | juan@example.com   | admin   |
    | María  | maria@example.com  | user    |
    | Pedro  | pedro@example.com  | user    |
  Then the users should be created
```

```typescript
// Step definition
When('I create the following users:', async function (this: CustomWorld, dataTable) {
  const users = dataTable.hashes(); // Converts to array of objects
  
  for (const user of users) {
    await this.userPage!.createUser(user.name, user.email, user.role);
  }
});
```

## 📊 Custom Reports

### Generate HTML Report

The report is automatically generated in `test-results/cucumber-report.html`

```bash
# View report
npm run test:report
# or
open test-results/cucumber-report.html
```

### Configure Multiple Reports

```javascript
// cucumber.js
format: [
  'progress-bar',                              // Console
  'html:test-results/cucumber-report.html',    // HTML
  'json:test-results/cucumber-report.json',    // JSON
  'junit:test-results/junit-report.xml',       // JUnit (for CI)
]
```

## 🎬 Video Recording

### Enable Video Recording

```bash
# Run tests with video recording
npm run test:video

# Or using the environment variable directly
RECORD_VIDEO=true npm test

# Record only smoke tests
RECORD_VIDEO=true npm run test:smoke
```

### Video Configuration

Videos are automatically recorded in `test-results/videos/` when recording is enabled.

**Features:**
- ✅ One video per scenario
- ✅ Resolution: 1280x720 (configurable in world.ts)
- ✅ Only recorded when `RECORD_VIDEO=true`
- ✅ Videos are saved even if the test passes

### View Generated Videos

```bash
# Open videos folder
open test-results/videos/

# List generated videos
ls -lh test-results/videos/

# View specific video (example)
open test-results/videos/Add_and_manage_complete_tasks_2026-02-15T16-44-10.webm
```

**Filename format:** Videos are automatically named as:
```
[Scenario_name]_[YYYY-MM-DDTHH-MM-SS].webm
```

Example: `Filter_active_tasks_2026-02-15T16-45-23.webm`

### Customize Video Configuration

You can modify the configuration in `src/support/world.ts`:

```typescript
recordVideo: process.env.RECORD_VIDEO === 'true' ? {
  dir: './test-results/videos',
  size: { width: 1920, height: 1080 }  // Full HD
} : undefined,
```

### Recording Tips

1. **Record only on failure**: Modify the `After` hook in `hooks.ts` to save video only on failures
2. **Reduce size**: Use lower resolution (1024x768) to save space
3. **CI/CD**: Enable automatic recording in CI for post-mortem debugging

### Record Only on Failures (Optional)

To save space, you can configure to only save videos of failed tests. Modify `src/support/hooks.ts`:

```typescript
After(async function (this: CustomWorld, { pickle, result }) {
  // Save video only if test fails
  if (result?.status === Status.FAILED && this.page) {
    const videoPath = await this.page.video()?.path();
    if (videoPath) {
      console.log(`🎬 Video of failure saved: ${videoPath}`);
    }
  } else if (result?.status === Status.PASSED && this.page) {
    // Delete video if test passed
    await this.page.video()?.delete();
  }

  await this.cleanup();
});
```

And in `src/support/world.ts`, always enable recording:

```typescript
recordVideo: {
  dir: './test-results/videos',
  size: { width: 1280, height: 720 }
}
```

## 🐛 Debugging Tips

### 1. Use page.pause()

```typescript
When('something complex happens', async function (this: CustomWorld) {
  await this.page!.pause(); // ← Pauses here
  // You can inspect in the browser
});
```

### 2. Screenshots on Demand

```typescript
Then('I take a screenshot', async function (this: CustomWorld) {
  await this.page!.screenshot({ 
    path: `debug-${Date.now()}.png`,
    fullPage: true 
  });
});
```

### 3. Browser Console Logs

```typescript
// In hooks.ts or in a step
this.page!.on('console', msg => console.log('Browser log:', msg.text()));
```

## 🌐 Working with Multiple Browsers

```bash
# Run on Firefox
npx cucumber-js --profile firefox

# Run on WebKit (Safari)
npx cucumber-js --profile webkit

# Run on all browsers
npm run test:all-browsers
```

```javascript
// cucumber.js - Add profiles
module.exports = {
  default: { /* ... */ },
  firefox: {
    require: ['src/steps/**/*.ts', 'src/support/**/*.ts'],
    requireModule: ['ts-node/register'],
    worldParameters: {
      browser: 'firefox'
    }
  }
};
```

## 📱 Mobile Testing

```typescript
// In world.ts
const iPhone = devices['iPhone 12'];

this.context = await this.browser.newContext({
  ...iPhone,
  locale: 'es-ES',
  geolocation: { longitude: -3.7038, latitude: 40.4168 },
  permissions: ['geolocation'],
});
```

## 🔐 Handle Authentication

### Save Authentication State

```typescript
// In a setup step
await this.context!.storageState({ path: 'auth.json' });

// Reuse in other tests
this.context = await this.browser!.newContext({
  storageState: 'auth.json'
});
```

## ⚡ Performance Tips

1. **Reuse browser context** when possible
2. **Disable unnecessary resources**:
   ```typescript
   await context.route('**/*.{png,jpg,jpeg}', route => route.abort());
   ```
3. **Run in parallel**: `npm run test:parallel`
4. **Use tags** to run only necessary tests

## 🎓 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Cucumber Documentation](https://cucumber.io/docs/cucumber/)
- [BDD Best Practices](https://cucumber.io/docs/bdd/)
- See [ARCHITECTURE.md](./ARCHITECTURE.md) for architecture details

## ❓ Troubleshooting

### Error: "Page is not available"
**Solution**: Make sure the `Before` hook executed correctly

### Flaky tests
**Solution**: 
- Increase timeouts
- Use `waitForLoadState('networkidle')`
- Wait for specific elements instead of fixed timeouts

### Selectors not found
**Solution**:
- Use Playwright Inspector: `PWDEBUG=1 npm test`
- Verify the page is fully loaded
- Review selectors in browser DevTools
