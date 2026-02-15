# Automation Framework Architecture

## Overview

This framework implements a three-layer architecture pattern for UI test automation:

```
┌─────────────────────────────────────────┐
│         Features (Gherkin)              │
│  Business specifications in natural     │
│         language (BDD)                   │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Step Definitions (Cucumber)        │
│  Implementation of feature steps        │
│         in code                          │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│       Page Objects (POM)                │
│  Object-oriented representation         │
│      of web pages                        │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Playwright API                  │
│    Direct interaction with browser      │
└─────────────────────────────────────────┘
```

## Main Components

### 1. Features (`features/`)
- **Purpose**: Define expected behavior in Gherkin language
- **Responsibility**: Human-readable business specifications
- **Example**:
  ```gherkin
  Feature: User login
    Scenario: Successful login
      Given the user is on the login page
      When enters valid credentials
      Then should see the dashboard
  ```

### 2. Step Definitions (`src/steps/`)
- **Purpose**: Translate Gherkin steps to executable code
- **Responsibility**: 
  - Orchestrate interaction between features and Page Objects
  - Contain assertions
  - Handle data flow between steps
- **Pattern**:
  ```typescript
  Given('the user is on the login page', async function() {
    await this.loginPage.navigate();
  });
  ```

### 3. Page Objects (`src/pages/`)
- **Purpose**: Encapsulate structure and behavior of web pages
- **Responsibility**:
  - Define element selectors
  - Expose high-level methods to interact with page
  - Hide implementation details
- **Principles**:
  - One Page Object per page or significant component
  - Methods represent user actions
  - Don't contain assertions
  - Inherit from `BasePage`

### 4. Base Page (`src/pages/BasePage.ts`)
- **Purpose**: Provide common functionality to all Page Objects
- **Responsibility**:
  - Reusable utility methods
  - Timeout and wait management
  - Basic operations (click, fill, getText, etc.)

### 5. Custom World (`src/support/world.ts`)
- **Purpose**: Shared context between steps of a scenario
- **Responsibility**:
  - Manage browser lifecycle
  - Initialize Page Objects
  - Share data between steps
  - Provide access to browser, context and page

### 6. Hooks (`src/support/hooks.ts`)
- **Purpose**: Execute code before/after scenarios
- **Responsibility**:
  - Setup: Initialize browser and context
  - Teardown: Close browser and cleanup
  - Capture screenshots on failures
  - Test start/end logging

### 7. Utils (`src/utils/`)
- **constants.ts**: Global constants (URLs, timeouts, configurations)
- **helpers.ts**: Utility functions for common interactions
- **logger.ts**: Logging system and test data generation

## Execution Flow

```
1. Cucumber starts
   ↓
2. BeforeAll Hook
   ↓
3. For each Scenario:
   ├─→ Before Hook
   │   ├─→ Initialize browser
   │   ├─→ Create context
   │   └─→ Initialize Page Objects
   │
   ├─→ Execute Steps
   │   ├─→ Given: Setup initial state
   │   ├─→ When: Execute actions
   │   └─→ Then: Verify results (assertions)
   │
   └─→ After Hook
       ├─→ If failed: Capture screenshot
       └─→ Close browser and cleanup
   ↓
4. AfterAll Hook
```

## Design Principles

### Separation of Concerns
- **Features**: WHAT to test (specification)
- **Steps**: HOW to translate specifications to code
- **Page Objects**: HOW to interact with the UI
- **Utils**: Reusable helper functions

### DRY (Don't Repeat Yourself)
- Common steps in `common.steps.ts`
- Base functionality in `BasePage`
- Shared utilities in `utils/`

### Single Responsibility Principle
- Each Page Object represents ONE page or component
- Each method does ONE thing
- Each step implements ONE Gherkin step

### Open/Closed Principle
- Easy to add new Page Objects without modifying existing ones
- Easy to add new steps without modifying infrastructure
- Extensible through inheritance (BasePage)

## Code Conventions

### Naming
- **Page Objects**: `[Name]Page.ts` (e.g: `TodoPage.ts`)
- **Steps**: `[domain].steps.ts` (e.g: `todo.steps.ts`)
- **Features**: `[functionality].feature` (e.g: `todomvc.feature`)

### Page Object Structure
```typescript
export class HomePage extends BasePage {
  // 1. Selectors (private)
  private readonly selectors = { ... };
  
  // 2. Constructor
  constructor(page: Page) { ... }
  
  // 3. Public methods (user actions)
  async clickButton() { ... }
  
  // 4. Private methods (internal helpers)
  private async internalHelper() { ... }
}
```

### Step Structure
```typescript
// 1. Imports
import { Given, When, Then } from '@cucumber/cucumber';

// 2. Given steps (setup)
Given('...', async function() { ... });

// 3. When steps (actions)
When('...', async function() { ... });

// 4. Then steps (verifications)
Then('...', async function() { ... });
```

## Extensibility

### Add a New Page
1. Create `src/pages/NewPage.ts`
2. Extend `BasePage`
3. Define selectors and methods
4. Export in `src/pages/index.ts`
5. Add to `CustomWorld` in `world.ts`

### Add New Steps
1. Create file in `src/steps/`
2. Import `CustomWorld` and Cucumber decorators
3. Implement steps using Page Objects
4. Use Playwright assertions (`expect`)

### Add New Features
1. Create `.feature` in `features/`
2. Write scenarios in Gherkin
3. Run to see missing steps
4. Implement necessary steps

## Best Practices

### Page Objects
✅ **Do**:
- Methods with descriptive names of user actions
- Selectors as private constants
- Return values when needed for verifications
- Use `async/await` consistently

❌ **Don't**:
- Include assertions in Page Objects
- Make Page Objects too granular
- Expose selectors directly
- Mix business logic with UI interaction

### Steps
✅ **Do**:
- Keep steps simple and focused
- Use Page Objects for all UI interaction
- Include clear assertions
- Reuse common steps

❌ **Don't**:
- Interact directly with selectors in steps
- Duplicate logic between steps
- Very long steps with multiple responsibilities
- Hard-code test data

### Features
✅ **Do**:
- Write in business language
- Keep scenarios independent
- Use Background for common setup
- Use tags to organize tests

❌ **Don't**:
- Include technical details (selectors, IDs)
- Create dependencies between scenarios
- Very long scenarios
- Mix different functionalities

## Maintenance

### When to change Page Objects
- UI changes (new selectors)
- New page functionalities
- Refactoring repetitive interactions

### When to change Steps
- New scenarios require new steps
- Changes in business flow
- Optimization of common steps

### When to change Features
- New business requirements
- Changes in expected behavior
- Removal of obsolete functionalities

## Debugging

### Strategies
1. **Headed Mode**: See the browser in action
   ```bash
   npm run test:headed
   ```

2. **Screenshots**: Automatic on failures

3. **Logs**: Use `Logger` for debugging
   ```typescript
   Logger.info('Navigating to page');
   ```

4. **Playwright Inspector**:
   ```bash
   PWDEBUG=1 npm test
   ```

5. **Step by Step**: Add `await page.pause()` in code

## Performance

### Optimizations
- Run tests in parallel (`test:parallel`)
- Reuse browser context when possible
- Minimize explicit waits
- Use efficient selectors
- Disable unnecessary resources (images, videos in CI)

## CI/CD

### Environment Variables
```bash
CI=true
HEADLESS=true
RETRIES=2
WORKERS=2
```

### CI Execution
```bash
npm run clean
npm test
```

## Conclusion

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Maintainable and scalable code
- ✅ Readable and understandable tests
- ✅ Code reusability
- ✅ Easy extension and modification
