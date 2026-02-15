# 🎭 Automation Framework: Playwright + Cucumber + Page Object Model

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![Cucumber](https://img.shields.io/badge/Cucumber-23D96C?style=for-the-badge&logo=cucumber&logoColor=white)](https://cucumber.io/)

This project implements a complete and professional UI test automation framework using:
- **🎭 Playwright** - Modern cross-platform browser testing framework
- **🥒 Cucumber** - BDD (Behavior Driven Development) with Gherkin
- **📄 Page Object Model** - Design pattern for maintainable and scalable code
- **📘 TypeScript** - Strong typing for greater robustness

## 🏗️ Architecture

```
repo/
├── src/
│   ├── pages/              # Page Objects
│   │   ├── BasePage.ts     # Base class for all pages
│   │   ├── TodoPage.ts     # Page Object for TodoMVC
│   │   └── index.ts        # Exports
│   ├── steps/              # Cucumber Step Definitions
│   │   ├── todo.steps.ts   # Steps for TodoMVC
│   │   └── common.steps.ts # Reusable steps
│   └── support/            # Configuration and utilities
│       ├── world.ts        # Cucumber Custom World
│       └── hooks.ts        # Hooks (Before/After)
├── features/               # Feature files (Gherkin)
│   └── todomvc.feature     # ✨ TodoMVC tests (11 scenarios)
├── test-results/          # Reports, screenshots and videos
├── cucumber.js            # Cucumber configuration
├── playwright.config.ts   # Playwright configuration
├── tsconfig.json          # TypeScript configuration
└── package.json
```

## 📦 Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## 🚀 Running Tests

### Basic Execution

```bash
# Run all tests (uses default configuration: dev + chrome)
npm test

# Run only tests with @smoke tag
npm run test:smoke

# Run tests in parallel
npm run test:parallel

# View results report (with embedded videos)
npm run test:report
```

### Environment and Browser Configuration

The framework uses an external configuration file (`test.config.json`) to specify environments and browsers:

```bash
# Specify environment
TEST_ENV=staging npm test

# Specify browser
BROWSER=firefox npm test

# Specify both
TEST_ENV=production BROWSER=chrome npm test

# Headed mode (show browser)
HEADLESS=false TEST_ENV=local npm test

# With video recording
TEST_ENV=dev BROWSER=chrome RECORD_VIDEO=true npm test
```

**Available environments:** `local`, `dev`, `staging`, `production`  
**Available browsers:** `chrome`, `firefox`, `safari`, `edge`

See **[PIPELINE_CONFIGURATION.md](./PIPELINE_CONFIGURATION.md)** for complete CI/CD pipeline configuration.

## 📊 Reports with Videos

The framework generates HTML reports with **embedded videos** of each scenario:

```bash
# Run with video and generate report
RECORD_VIDEO=true npm test

# View interactive report
npm run test:report
```

**Report features:**
- 🎥 Embedded execution videos
- 📸 Failure screenshots
- 📊 Dashboard with statistics
- ⏱️ Duration of each step
- 🎯 Filters by status/feature/tags

See [REPORTES_CON_VIDEOS.md](./REPORTES_CON_VIDEOS.md) for more details.

## 📝 Writing Tests

### 1. Create a Feature File

Create a `.feature` file in the `features/` folder:

```gherkin
# language: en
Feature: User Login
  As a user
  I want to be able to log in
  To access my account

  Scenario: Successful login
    Given the user navigates to the login page
    When they enter valid credentials
    Then they should see the dashboard
```

### 2. Create a Page Object

Create a class in `src/pages/`:

```typescript
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly selectors = {
    emailInput: '#email',
    passwordInput: '#password',
    loginButton: 'button[type="submit"]',
  };

  constructor(page: Page) {
    super(page, 'https://your-site.com');
  }

  async login(email: string, password: string) {
    await this.fill(this.selectors.emailInput, email);
    await this.fill(this.selectors.passwordInput, password);
    await this.click(this.selectors.loginButton);
  }
}
```

### 3. Create Step Definitions

Create a file in `src/steps/`:

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Given('the user navigates to the login page', async function (this: CustomWorld) {
  await this.loginPage.navigate('/login');
});

When('they enter valid credentials', async function (this: CustomWorld) {
  await this.loginPage.login('user@example.com', 'password123');
});

Then('they should see the dashboard', async function (this: CustomWorld) {
  expect(this.page.url()).toContain('/dashboard');
});
```

## 🎯 Patterns and Best Practices

### Page Object Model
- Each page has its own class that inherits from `BasePage`
- Selectors are defined as private properties
- Methods represent actions a user can perform
- Do not include assertions in Page Objects

### Step Definitions
- Keep steps simple and reusable
- Use Page Objects to interact with UI
- Assertions go in steps, not in Page Objects
- Use `CustomWorld` to share context between steps

### Features (Gherkin)
- Write scenarios from the user's perspective
- Use business language, not technical
- Keep scenarios independent of each other
- Use tags (@smoke, @regression) to organize tests

## 🔧 Configuration

### Browser Configuration

The framework includes specific configurations to optimize the testing experience:

#### Chrome/Chromium
- **Automatic translation disabled**: Google Translate popup is completely disabled
- **Language configured**: `en-US` for test consistency
- **CDP (Chrome DevTools Protocol)**: Advanced preference configuration

**Applied configurations:**
```typescript
// Chrome arguments
--disable-features=Translate
--disable-translate
--disable-blink-features=AutomationControlled

// Context preferences
locale: 'en-US'
extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' }
```

See [src/support/world.ts](src/support/world.ts) for implementation details.

## ⚙️ Environment Setup

### Configuration File (`test.config.json`)

The framework uses an external configuration file to define environments and browsers:

```json
{
  "environments": {
    "dev": {
      "name": "dev",
      "baseUrl": "https://demo.playwright.dev/todomvc",
      "timeout": 30000,
      "slowMo": 0
    },
    "staging": {
      "name": "staging",
      "baseUrl": "https://staging.example.com",
      "timeout": 45000,
      "slowMo": 0
    },
    "production": {
      "name": "production",
      "baseUrl": "https://production.example.com",
      "timeout": 60000,
      "slowMo": 0
    }
  },
  "browsers": {
    "chrome": {
      "channel": "chrome",
      "headless": true,
      "viewport": { "width": 1280, "height": 720 }
    },
    "firefox": {
      "channel": null,
      "headless": true,
      "viewport": { "width": 1280, "height": 720 }
    }
  },
  "default": {
    "environment": "dev",
    "browser": "chrome"
  }
}
```

### Using the Configuration File

#### **Default Values**
Without specifying variables, the framework uses:
- **Environment:** `dev` (defined in `default.environment`)
- **Browser:** `chrome` (defined in `default.browser`)

```bash
npm test  # Uses dev + chrome automatically
```

#### **Parameterization with Environment Variables**

| Variable | Values | Default | Description |
|----------|---------|---------|-------------|
| `TEST_ENV` | local, dev, staging, production | dev | Environment where tests run |
| `BROWSER` | chrome, firefox, safari, edge | chrome | Browser to use |
| `HEADLESS` | true, false | true | Run without graphical interface |
| `RECORD_VIDEO` | true, false | false | Record test videos |

#### **Usage Examples**

```bash
# Specify environment
TEST_ENV=staging npm test

# Specify browser
BROWSER=firefox npm test

# Headed mode (show browser)
HEADLESS=false npm test

# Video recording
RECORD_VIDEO=true npm test

# Combinations
TEST_ENV=production BROWSER=chrome HEADLESS=false npm test

# Parallel tests with video on staging
TEST_ENV=staging RECORD_VIDEO=true npm run test:parallel:video
```

#### **How Parameterization Works**

1. The framework reads `test.config.json` on startup
2. Looks for the `TEST_ENV` environment variable or uses the default
3. Loads the corresponding configuration (baseUrl, timeout, slowMo)
4. Looks for the `BROWSER` environment variable or uses the default
5. Applies the browser configuration (headless, viewport, channel)

**Practical example:**
```bash
TEST_ENV=staging BROWSER=firefox npm test
```

↓ The framework loads:
- **baseUrl:** `https://staging.example.com`
- **timeout:** `45000ms`
- **browser:** Firefox
- **viewport:** 1280x720

#### **Adding New Environments**

Edit `test.config.json`:
```json
{
  "environments": {
    "qa": {
      "name": "qa",
      "baseUrl": "https://qa.myapp.com",
      "timeout": 35000,
      "slowMo": 0
    }
  }
}
```

Use:
```bash
TEST_ENV=qa npm test
```

#### **Adding New Browsers**

Edit `test.config.json`:
```json
{
  "browsers": {
    "chromium-mobile": {
      "channel": null,
      "headless": true,
      "viewport": { "width": 375, "height": 667 }
    }
  }
}
```

Use:
```bash
BROWSER=chromium-mobile npm test
```

### For CI/CD Pipelines

```yaml
# GitHub Actions example
- name: Run tests on staging with Firefox
  run: TEST_ENV=staging BROWSER=firefox npm test

# Jenkins example
sh 'TEST_ENV=production BROWSER=chrome npm test'
```

See **[PIPELINE_CONFIGURATION.md](./PIPELINE_CONFIGURATION.md)** for complete examples of GitHub Actions, GitLab CI, Jenkins, and Azure DevOps.

### Custom Fixtures (Environment Configuration)

The framework includes a **custom fixtures** system to configure the testing environment:

```typescript
// Access fixture in any step
Given('my step', function (this: CustomWorld) {
  // Get environment configuration
  const env = this.fixture.getEnvironment();
  console.log(env.baseUrl);  // https://demo.playwright.dev/todomvc
  
  // Get test users
  const admin = this.fixture.getUser('admin');
  
  // Get test data
  const todos = this.fixture.getTodos('sample');
});
```

### Cucumber (`cucumber.js`)
- Report configuration
- Number of parallel workers
- Output format

### Playwright (`playwright.config.ts`)
- Browsers to use
- Timeouts
- Video/screenshots configuration
- Base URL

### TypeScript (`tsconfig.json`)
- Compiler configuration
- Module resolution
- Included types

## 📊 Reports

Reports are generated in `test-results/`:
- `cucumber-report.html` - Visual HTML report
- `cucumber-report.json` - JSON format report
- `screenshots/` - Failure screenshots
- `videos/` - Execution videos (if enabled)

## 🛠️ Utilities

### Available Hooks
- `Before` - Runs before each scenario
- `After` - Runs after each scenario (captures screenshots on failures)
- `BeforeAll` - Runs once at the beginning
- `AfterAll` - Runs once at the end

### Custom World
The `CustomWorld` provides:
- Browser instance
- Current page
- All initialized Page Objects
- **Fixture Manager** for environment configuration
- Setup and cleanup methods

## 🎯 Meaningful Assertions

All validations using `expect()` include **descriptive messages** to improve report comprehension:

```typescript
// Instead of:
expect(actualCount).toBe(expectedCount);

// Now with meaningful context:
expect(
  actualCount, 
  `Expected to see ${expectedCount} tasks in the list but found ${actualCount}`
).toBe(expectedCount);
```

**Benefits:**
- ✅ Clear and contextual error messages
- ✅ Faster debugging
- ✅ More understandable reports
- ✅ Better failure communication to the team

**Error message example:**
```
Error: Expected to see 5 tasks in the list but found 3
Expected: 5
Received: 3
```

## 📚 Recursos

- **[README.md](./README.md)** - 👋 Project start and overview
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - 🏗️ Detailed architecture and patterns
- **[PIPELINE_CONFIGURATION.md](./PIPELINE_CONFIGURATION.md)** - ⚙️ Environment configuration and CI/CD pipelines
- **[USAGE_GUIDE.md](./USAGE_GUIDE.md)** - 📖 Complete guide with examples
- **[VIDEO_RECORDING.md](./VIDEO_RECORDING.md)** - 🎥 Video recording guide
- **[REPORTES_CON_VIDEOS.md](./REPORTES_CON_VIDEOS.md)** - 📊 Reports with embedded videos
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - ⚡ Essential commands
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - 📋 Project summary
- [Playwright Docs](https://playwright.dev/)
- [Cucumber Docs](https://cucumber.io/docs/cucumber/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Create a new branch for your feature
2. Follow the established patterns
3. Write tests for your code
4. Commit with descriptive messages
5. Create a Pull Request

## ⚡ Test Parallelization Configuration

### Parallel Execution with Cucumber + Playwright

This framework supports multiple parallelization strategies to optimize execution time.

### 🌐 Parallelization by Browsers

#### Configuration in `cucumber.js`

**File to modify:** `cucumber.js`

```javascript
module.exports = {
  default: {
    parallel: 3, // 3 workers in parallel
    format: ['progress-bar', 'json:test-results/cucumber-report.json']
  }
};
```

#### Usage with environment variables
```bash
# Run same suite on different browsers (requires separate scripts)
npm run test:chrome & npm run test:firefox & npm run test:safari
```

#### CI/CD Pipeline - Browser matrix

**File to create:** `.github/workflows/tests.yml`

```yaml
# GitHub Actions
strategy:
  matrix:
    browser: [chrome, firefox, edge]
steps:
  - run: BROWSER=${{ matrix.browser }} npm test
```

**Scripts in package.json:**
```json
{
  "scripts": {
    "test:chrome": "BROWSER=chrome npm test",
    "test:firefox": "BROWSER=firefox npm test",
    "test:safari": "BROWSER=safari npm test",
    "test:all-browsers": "npm run test:chrome && npm run test:firefox && npm run test:safari"
  }
}
```

---

### 🏷️ Parallelization by Tags

#### Configuration in `cucumber.js`

**File to modify:** `cucumber.js`

```javascript
module.exports = {
  smoke: {
    require: ['src/steps/**/*.ts', 'src/support/**/*.ts'],
    parallel: 2,
    tags: '@smoke'
  },
  regression: {
    require: ['src/steps/**/*.ts', 'src/support/**/*.ts'],
    parallel: 4,
    tags: '@regression and not @slow'
  },
  critical: {
    require: ['src/steps/**/*.ts', 'src/support/**/*.ts'],
    parallel: 2,
    tags: '@critical'
  }
};
```

#### Usage
```bash
# Run only smoke tests in parallel
npm test -- --profile smoke

# Run regression tests in parallel
npm test -- --profile regression

# Run multiple profiles simultaneously
npm test -- --profile smoke & npm test -- --profile regression
```

#### CI/CD Pipeline - Tag matrix

**File to create:** `.github/workflows/tests-by-tags.yml`

```yaml
# GitHub Actions
strategy:
  matrix:
    tag: [smoke, regression, critical]
steps:
  - run: npm test -- --tags @${{ matrix.tag }} --parallel 2
```

**File to modify:** `package.json`

```json
{
  "scripts": {
    "test:smoke": "cucumber-js --tags @smoke --parallel 2",
    "test:regression": "cucumber-js --tags @regression --parallel 4",
    "test:critical": "cucumber-js --tags @critical --parallel 2"
  }
}
```

---

### 📁 Parallelization by Folders/Features

#### Run specific features in parallel
```bash
# Run features from different folders in parallel
cucumber-js features/authentication/ --parallel 2 &
cucumber-js features/dashboard/ --parallel 2 &
cucumber-js features/checkout/ --parallel 2 &
wait
```

#### Advanced configuration by folder

**File to modify:** `cucumber.js`

```javascript
module.exports = {
  auth: {
    paths: ['features/authentication/**/*.feature'],
    parallel: 2
  },
  dashboard: {
    paths: ['features/dashboard/**/*.feature'],
    parallel: 3
  },
  checkout: {
    paths: ['features/checkout/**/*.feature'],
    parallel: 2
  }
};
```

#### CI/CD Pipeline - Folder matrix

**File to create:** `.github/workflows/tests-by-folder.yml`

```yaml
# GitHub Actions
strategy:
  matrix:
    suite: [authentication, dashboard, checkout]
steps:
  - run: npm test -- --profile ${{ matrix.suite }}
```

**File to modify:** `package.json`

```json
{
  "scripts": {
    "test:auth": "cucumber-js features/authentication/ --parallel 2",
    "test:dashboard": "cucumber-js features/dashboard/ --parallel 3",
    "test:checkout": "cucumber-js features/checkout/ --parallel 2"
  }
}
```

---

### 👷 Parallelization with CI Workers

#### GitHub Actions

**File to create:** `.github/workflows/e2e-parallel.yml`

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3, 4]  # 4 workers
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: |
          TOTAL_SHARDS=4
          SHARD=${{ matrix.shard }}
          npm test -- --parallel 2
        env:
          TEST_ENV: staging
          BROWSER: chrome
```

#### GitLab CI

**File to create:** `.gitlab-ci.yml`

```yaml
test:
  parallel: 4  # 4 workers
  script:
    - npm ci
    - TEST_ENV=staging npm test -- --parallel 2
```

#### Jenkins Pipeline

**File to create:** `Jenkinsfile`

```groovy
pipeline {
  agent any
  stages {
    stage('Test') {
      parallel {
        stage('Worker 1') {
          steps {
            sh 'TEST_ENV=staging npm test -- --parallel 2'
          }
        }
        stage('Worker 2') {
          steps {
            sh 'TEST_ENV=staging BROWSER=firefox npm test -- --parallel 2'
          }
        }
        stage('Worker 3') {
          steps {
            sh 'TEST_ENV=production npm test -- --parallel 2'
          }
        }
      }
    }
  }
}
```

#### Azure DevOps

**File to create:** `azure-pipelines.yml`

```yaml
strategy:
  parallel: 4
pool:
  vmImage: 'ubuntu-latest'
steps:
  - script: npm ci
  - script: TEST_ENV=staging npm test -- --parallel 2
```

---

### 🎯 Optimal Worker Configuration

#### Calculate number of workers

**File to modify:** `cucumber.js`

```javascript
const os = require('os');
const cpuCount = os.cpus().length;

module.exports = {
  default: {
    // Use 50-75% of available CPUs
    parallel: Math.max(1, Math.floor(cpuCount * 0.75)),
    // Or use environment variable
    parallel: process.env.WORKERS || 2
  }
};
```

#### Dynamic scripts

**File to modify:** `package.json`

```json
{
  "scripts": {
    "test:parallel": "cucumber-js --parallel 2",
    "test:parallel:max": "cucumber-js --parallel $(node -e 'console.log(require(\"os\").cpus().length)')"
  }
}
```

---

### ⚠️ When NOT to Parallelize Tests

#### ❌ DO NOT parallelize in these cases:

1. **Tests with shared state dependencies**
   ```gherkin
   # ❌ BAD - Dependent tests
   Scenario: Create user
     When I create a user "test@example.com"
   
   Scenario: Login with created user
     When I log in with "test@example.com"
     # ⚠️ Depends on previous scenario
   ```

2. **Tests that modify global data**
   ```typescript
   // ❌ BAD - Modifies global configuration
   test('change configuration', async () => {
     await setGlobalConfig({ theme: 'dark' });
     // Other tests may fail if they expect theme: 'light'
   });
   ```

3. **Tests with external resource limits**
   - APIs with strict rate limiting
   - Databases with limited connections
   - Third-party services with quotas
   ```bash
   # Run sequentially if there's an API limit
   npm test -- --parallel 1
   ```

4. **Integration tests with shared services**
   ```gherkin
   # ❌ Risky in parallel
   Scenario: Process message queue
     When I send a message to the queue
     And I process the queue
     # ⚠️ Multiple workers may process the same message
   ```

5. **Tests that use specific ports**
   ```typescript
   // ❌ Port conflict in parallel
   test('local server', async () => {
     const server = startServer(3000); // Fixed port
     // Fails if another test uses port 3000
   });
   ```

6. **Performance/load tests**
   ```bash
   # ❌ Invalid results in parallel
   cucumber-js --tags @performance --parallel 1
   ```

7. **Tests with very short execution time**
   ```bash
   # Parallelization overhead > benefit
   # If each test takes < 1 second, may be slower in parallel
   ```

8. **Debugging tests**
   ```bash
   # Debug mode - sequential
   HEADLESS=false npm test -- --parallel 1
   PWDEBUG=1 npm test -- --parallel 1
   ```

---

### ✅ Best Practices for Parallelization

1. **Design independent tests**
   ```gherkin
   # ✅ GOOD - Each scenario is independent
   Scenario: Successful login
     Given I have a unique generated user
     When I log in
     Then I see the dashboard
   ```

2. **Use unique data per test**
   ```typescript
   // ✅ GOOD - Unique email per execution
   const uniqueEmail = `test-${Date.now()}@example.com`;
   ```

3. **Clean up state after each test**
   ```typescript
   After(async function() {
     await this.cleanup(); // Cleans browser, data, etc.
   });
   ```

4. **Monitor system resources**
   ```bash
   # Don't exceed machine capacity
   # Machine with 4 CPUs → use 2-3 workers
   npm test -- --parallel 3
   ```

5. **Balance test distribution**
   ```javascript
   // Distribute evenly by duration, not by quantity
   // Fast tests in one worker, slow tests distributed
   ```

---

### 📊 Complete Configuration Example

**File to modify:** `cucumber.js`

```javascript
const os = require('os');

module.exports = {
  // Default configuration
  default: {
    require: ['src/steps/**/*.ts', 'src/support/**/*.ts'],
    parallel: process.env.CI ? 4 : 2,
    format: [
      'progress-bar',
      'html:test-results/cucumber-report.html',
      'json:test-results/cucumber-report.json'
    ]
  },
  
  // Smoke tests - fast and critical
  smoke: {
    require: ['src/steps/**/*.ts', 'src/support/**/*.ts'],
    parallel: 2,
    tags: '@smoke',
    retry: 1
  },
  
  // Regression tests - aggressive parallelization
  regression: {
    require: ['src/steps/**/*.ts', 'src/support/**/*.ts'],
    parallel: Math.max(1, Math.floor(os.cpus().length * 0.75)),
    tags: '@regression and not @slow'
  },
  
  // Slow tests - sequential
  slow: {
    require: ['src/steps/**/*.ts', 'src/support/**/*.ts'],
    parallel: 1,
    tags: '@slow',
    timeout: 120000
  }
};
```

See **[PIPELINE_CONFIGURATION.md](./PIPELINE_CONFIGURATION.md)** for complete CI/CD configurations.

## 📄 License

ISC
