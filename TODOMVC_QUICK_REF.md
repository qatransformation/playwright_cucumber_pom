# 🚀 TodoMVC - Quick Reference

## Run Tests

```bash
# All TodoMVC tests
npx cucumber-js features/todomvc.feature

# Only main test (@smoke)
npx cucumber-js --tags "@todo and @smoke"

# View browser while running
HEADLESS=false npx cucumber-js features/todomvc.feature

# Slow mode to see better
SLOW_MO=500 npx cucumber-js features/todomvc.feature

# With Playwright Inspector for debugging
PWDEBUG=1 npx cucumber-js features/todomvc.feature
```

## 📝 Available Scenarios

| # | Scenario | Tag | Steps |
|---|----------|-----|-------|
| 1 | Add and manage complete tasks | @smoke | 11 |
| 2 | Add multiple tasks | @todo | 4 |
| 3 | Mark task as completed | @todo | 5 |
| 4 | Persistence after reload | @todo | 6 |
| 5 | Delete tasks individually | @todo | 6 |
| 6 | Delete all tasks | @todo | 7 |
| 7 | Filter active tasks | @todo | 7 |
| 8 | Filter completed tasks | @todo | 7 |
| 9-11 | Validate counter (3 variations) | @todo | 9 |

**Total**: 11 escenarios, 62 steps

## 🎯 Main Test Case (Requirement)

The main scenario covers exactly the requested requirements:

```gherkin
Scenario: Add and manage complete tasks
  Given the user navigates to the TodoMVC application
  When the user adds the task "Buy milk"
  And the user adds the task "Exercise"
  Then the counter should show "2 items left"
  When the user marks task "Buy milk" as completed
  Then the counter should show "1 item left"
  When the user reloads the page
  Then the counter should show "1 item left"
  And the task "Buy milk" should be marked as completed
  When the user deletes all tasks
  Then the task list should be empty
```

✅ Meets all requirements:
1. ✓ Navigate to: https://demo.playwright.dev/todomvc/
2. ✓ Add two tasks
3. ✓ Mark one as completed
4. ✓ Validate the counter shows "1 item left"
5. ✓ Refresh the page and verify the state is preserved
6. ✓ Delete all tasks and validate the list is empty

## 📚 Related Files

- **Feature**: [features/todomvc.feature](../features/todomvc.feature)
- **Page Object**: [src/pages/TodoPage.ts](../src/pages/TodoPage.ts)
- **Steps**: [src/steps/todo.steps.ts](../src/steps/todo.steps.ts)

## 🔍 Useful Page Object Methods

```typescript
// Add task
await todoPage.addTodo('My task');

// Mark as completed
await todoPage.markTodoAsCompleted('My task');

// Check status
const isCompleted = await todoPage.isTodoCompleted('My task');

// Get counter
const count = await todoPage.getTodoCount(); // "1 item left"

// Delete all
await todoPage.deleteAllTodos();

// Reload
await todoPage.reloadPage();
```

## 🐛 Debugging

### View step by step
```bash
SLOW_MO=1000 HEADLESS=false npx cucumber-js features/todomvc.feature:11
```

### Pause at specific point
Add in the step:
```typescript
await this.page!.pause();
```

### View browser logs
```bash
DEBUG=pw:api npx cucumber-js features/todomvc.feature
```

## ✅ Validation

```bash
# Dry run (without executing)
npx cucumber-js --dry-run features/todomvc.feature

# TypeScript
npx tsc --noEmit
```

## 📊 Expected Results

- ✅ 11 scenarios executed
- ✅ 62 steps completed
- ✅ 100% successful steps
- ✅ Estimated time: ~2-3 minutes
- ✅ Screenshots on failures: `test-results/screenshots/`
- ✅ HTML Report: `test-results/cucumber-report.html`
