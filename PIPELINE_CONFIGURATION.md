# Environment and Pipeline Configuration

## 📋 Description

The framework uses an external configuration file (`test.config.json`) to specify environments and browsers, allowing flexible configuration for CI/CD pipelines.

## 🎯 Configuration File

### `test.config.json`

```json
{
  "environments": {
    "local": {
      "name": "local",
      "baseUrl": "http://localhost:3000",
      "timeout": 30000,
      "slowMo": 100
    },
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
      "viewport": {
        "width": 1280,
        "height": 720
      }
    },
    "firefox": {
      "channel": null,
      "headless": true,
      "viewport": {
        "width": 1280,
        "height": 720
      }
    },
    "safari": {
      "channel": null,
      "headless": false,
      "viewport": {
        "width": 1280,
        "height": 720
      }
    },
    "edge": {
      "channel": "msedge",
      "headless": true,
      "viewport": {
        "width": 1280,
        "height": 720
      }
    }
  },
  "default": {
    "environment": "dev",
    "browser": "chrome"
  }
}
```

## 🚀 Local Usage

### Configure Environment

```bash
# Use default configuration (dev + chrome)
npm test

# Specify environment
TEST_ENV=staging npm test

# Specify browser
BROWSER=firefox npm test

# Specify both
TEST_ENV=production BROWSER=chrome npm test

# Headed mode (see browser)
HEADLESS=false TEST_ENV=local npm test
```

### Command Examples

```bash
# Tests on development with Chrome
TEST_ENV=dev BROWSER=chrome npm test

# Tests on staging with Firefox
TEST_ENV=staging BROWSER=firefox npm test

# Tests on production with Chrome headless
TEST_ENV=production BROWSER=chrome HEADLESS=true npm test

# Local tests with visible browser for debugging
TEST_ENV=local BROWSER=chrome HEADLESS=false npm test
```

## 🔧 CI/CD Pipeline Configuration

### GitHub Actions

```yaml
name: E2E Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test-chrome-dev:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium
      
      - name: Run tests on Dev with Chrome
        run: TEST_ENV=dev BROWSER=chrome npm test
        env:
          CI: true
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results-chrome-dev
          path: test-results/

  test-firefox-staging:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps firefox
      
      - name: Run tests on Staging with Firefox
        run: TEST_ENV=staging BROWSER=firefox npm test
        env:
          CI: true
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results-firefox-staging
          path: test-results/

  test-matrix:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        environment: [dev, staging]
        browser: [chrome, firefox]
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run tests
        run: TEST_ENV=${{ matrix.environment }} BROWSER=${{ matrix.browser }} npm test
        env:
          CI: true
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results-${{ matrix.browser }}-${{ matrix.environment }}
          path: test-results/
```

### GitLab CI

```yaml
stages:
  - test

variables:
  NODE_VERSION: "18"

.test_template: &test_template
  image: node:${NODE_VERSION}
  before_script:
    - npm ci
    - npx playwright install --with-deps
  artifacts:
    when: always
    paths:
      - test-results/
    expire_in: 1 week

test:chrome:dev:
  <<: *test_template
  stage: test
  script:
    - TEST_ENV=dev BROWSER=chrome npm test

test:firefox:dev:
  <<: *test_template
  stage: test
  script:
    - TEST_ENV=dev BROWSER=firefox npm test

test:chrome:staging:
  <<: *test_template
  stage: test
  script:
    - TEST_ENV=staging BROWSER=chrome npm test
  only:
    - develop
    - main

test:chrome:production:
  <<: *test_template
  stage: test
  script:
    - TEST_ENV=production BROWSER=chrome npm test
  only:
    - main
```

### Jenkins Pipeline

```groovy
pipeline {
    agent any
    
    parameters {
        choice(
            name: 'TEST_ENV',
            choices: ['dev', 'staging', 'production'],
            description: 'Test environment'
        )
        choice(
            name: 'BROWSER',
            choices: ['chrome', 'firefox', 'edge'],
            description: 'Browser to use'
        )
    }
    
    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install --with-deps'
            }
        }
        
        stage('Run Tests') {
            steps {
                sh """
                    TEST_ENV=${params.TEST_ENV} \
                    BROWSER=${params.BROWSER} \
                    npm test
                """
            }
        }
        
        stage('Publish Results') {
            steps {
                publishHTML([
                    reportDir: 'test-results',
                    reportFiles: 'index.html',
                    reportName: 'Test Report'
                ])
            }
        }
    }
    
    post {
        always {
            archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
        }
    }
}
```

### Azure DevOps

```yaml
trigger:
  - main
  - develop

pool:
  vmImage: 'ubuntu-latest'

strategy:
  matrix:
    ChromeDev:
      TEST_ENV: 'dev'
      BROWSER: 'chrome'
    FirefoxDev:
      TEST_ENV: 'dev'
      BROWSER: 'firefox'
    ChromeStaging:
      TEST_ENV: 'staging'
      BROWSER: 'chrome'

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '18.x'
    displayName: 'Install Node.js'

  - script: npm ci
    displayName: 'Install dependencies'

  - script: npx playwright install --with-deps
    displayName: 'Install Playwright browsers'

  - script: |
      TEST_ENV=$(TEST_ENV) BROWSER=$(BROWSER) npm test
    displayName: 'Run E2E tests'

  - task: PublishTestResults@2
    condition: always()
    inputs:
      testResultsFiles: 'test-results/cucumber-report.json'
      testRunTitle: 'E2E Tests - $(BROWSER) - $(TEST_ENV)'

  - task: PublishPipelineArtifact@1
    condition: always()
    inputs:
      targetPath: 'test-results'
      artifactName: 'test-results-$(BROWSER)-$(TEST_ENV)'
```

## 📊 Environment Variables

### Available Variables

| Variable | Possible Values | Default | Description |
|----------|------------------|-------------|-------------|
| `TEST_ENV` | local, dev, staging, production | dev | Test environment |
| `BROWSER` | chrome, firefox, safari, edge | chrome | Browser to use |
| `HEADLESS` | true, false | true | Run in headless mode |
| `RECORD_VIDEO` | true, false | false | Record execution videos |
| `SLOW_MO` | number (ms) | 0 | Slow down execution (debugging) |

### Usage Examples

```bash
# Run on staging with Firefox headless
TEST_ENV=staging BROWSER=firefox HEADLESS=true npm test

# Run locally with Chrome visible and video recording
TEST_ENV=local BROWSER=chrome HEADLESS=false RECORD_VIDEO=true npm test

# Run on production with Chrome and slow motion for debugging
TEST_ENV=production BROWSER=chrome SLOW_MO=500 npm test

# Smoke tests on dev
TEST_ENV=dev BROWSER=chrome npm run test:smoke

# Specific tests
TEST_ENV=staging BROWSER=firefox npm test -- --tags "@critical"
```

## 🔧 Customization

### Add New Environment

Edit `test.config.json`:

```json
{
  "environments": {
    // ... existing environments
    "qa": {
      "name": "qa",
      "baseUrl": "https://qa.example.com",
      "timeout": 40000,
      "slowMo": 0
    }
  }
}
```

Uso:
```bash
TEST_ENV=qa npm test
```

### Add New Browser

Edit `test.config.json`:

```json
{
  "browsers": {
    // ... existing browsers
    "chromium-arm": {
      "channel": null,
      "headless": true,
      "viewport": {
        "width": 1920,
        "height": 1080
      }
    }
  }
}
```

Uso:
```bash
BROWSER=chromium-arm npm test
```

### Change Default Configuration

Edit `test.config.json`:

```json
{
  "default": {
    "environment": "local",  // Change to local
    "browser": "firefox"     // Change to firefox
  }
}
```

## 🎯 Best Practices for Pipelines

### 1. Test Matrix

Run tests in multiple combinations:

```yaml
# GitHub Actions
strategy:
  matrix:
    environment: [dev, staging, production]
    browser: [chrome, firefox]
    exclude:
      - environment: production
        browser: firefox
```

### 2. Scheduled Tests

```yaml
# GitHub Actions - Run daily
on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM every day
```

### 3. Tests on Pull Requests

```yaml
# Only dev and staging on PRs
on:
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        environment: [dev, staging]
```

### 4. Retry Failed Tests

```yaml
# GitHub Actions con retry
- name: Run tests with retry
  uses: nick-invision/retry@v2
  with:
    timeout_minutes: 10
    max_attempts: 3
    command: TEST_ENV=staging BROWSER=chrome npm test
```

### 5. Notifications

```yaml
# Notify in Slack when tests fail
- name: Notify Slack
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Tests failed on ${{ matrix.environment }} with ${{ matrix.browser }}'
```

## 📚 References

- [test.config.json](../test.config.json) - Configuration file
- [src/config/configLoader.ts](../src/config/configLoader.ts) - Configuration loader
- [src/support/world.ts](../src/support/world.ts) - Implementation in World

## 🎉 Advantages

✅ **Centralized configuration** - One file for all environments  
✅ **Easy to maintain** - Changes in one place  
✅ **Pipeline-friendly** - Simple environment variables  
✅ **Flexible** - Add environments/browsers easily  
✅ **Reproducible** - Same configuration in local and CI/CD  
✅ **Documented** - Self-documented JSON  
