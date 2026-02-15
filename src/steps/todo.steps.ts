import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

/**
 * Step Definitions for TodoMVC functionality
 */

// GIVEN - Initial setup steps

Given('the user navigates to the TodoMVC application', async function (this: CustomWorld) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  await this.todoPage.navigateToTodoApp();
});

// WHEN - User actions

When('the user adds the task {string}', async function (this: CustomWorld, taskText: string) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  await this.todoPage.addTodo(taskText);
});

When('the user adds the following tasks:', async function (this: CustomWorld, dataTable: DataTable) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  
  const tasks = dataTable.hashes();
  for (const row of tasks) {
    await this.todoPage.addTodo(row.task);
  }
});

When('the user adds {int} tasks', async function (this: CustomWorld, quantity: number) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  
  for (let i = 1; i <= quantity; i++) {
    await this.todoPage.addTodo(`Task ${i}`);
  }
});

When('the user marks as completed the task {string}', async function (this: CustomWorld, taskText: string) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  await this.todoPage.markTodoAsCompleted(taskText);
});

When('the user unmarks the task {string}', async function (this: CustomWorld, taskText: string) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  await this.todoPage.unmarkTodo(taskText);
});

When('the user deletes the task {string}', async function (this: CustomWorld, taskText: string) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  await this.todoPage.deleteTodo(taskText);
});

When('the user deletes all tasks', async function (this: CustomWorld) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  await this.todoPage.deleteAllTodos();
});

When('the user clears completed tasks', async function (this: CustomWorld) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  await this.todoPage.clearCompleted();
});

When('the user reloads the page', async function (this: CustomWorld) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  await this.todoPage.reloadPage();
});

When('the user filters by all tasks', async function (this: CustomWorld) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  await this.todoPage.filterAll();
});

When('the user filters by active tasks', async function (this: CustomWorld) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  await this.todoPage.filterActive();
});

When('the user filters by completed tasks', async function (this: CustomWorld) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  await this.todoPage.filterCompleted();
});

When('the user marks all tasks as completed', async function (this: CustomWorld) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  await this.todoPage.toggleAllTodos();
});

// THEN - Verifications

Then('the counter should show {string}', async function (this: CustomWorld, expectedText: string) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  
  const counterText = await this.todoPage.getTodoCount();
  expect(counterText, `Counter should show "${expectedText}" but shows "${counterText}"`).toContain(expectedText);
});

Then('the task list should be empty', async function (this: CustomWorld) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  
  const isEmpty = await this.todoPage.isTodoListEmpty();
  const itemCount = await this.todoPage.getTodoItemsCount();
  expect(isEmpty, `Task list should be empty but contains ${itemCount} task(s)`).toBeTruthy();
});

Then('the task {string} should be marked as completed', async function (this: CustomWorld, taskText: string) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  
  const isCompleted = await this.todoPage.isTodoCompleted(taskText);
  expect(isCompleted, `Task "${taskText}" should be marked as completed but it is not`).toBeTruthy();
});

Then('the task {string} should not be marked as completed', async function (this: CustomWorld, taskText: string) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  
  const isCompleted = await this.todoPage.isTodoCompleted(taskText);
  expect(isCompleted, `Task "${taskText}" should not be marked as completed but it is`).toBeFalsy();
});

Then('should see {int} task in the list', async function (this: CustomWorld, expectedCount: number) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  
  const actualCount = await this.todoPage.getTodoItemsCount();
  expect(actualCount, `Expected to see ${expectedCount} task in the list but found ${actualCount}`).toBe(expectedCount);
});

Then('should see {int} tasks in the list', async function (this: CustomWorld, expectedCount: number) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  
  const actualCount = await this.todoPage.getTodoItemsCount();
  expect(actualCount, `Expected to see ${expectedCount} tasks in the list but found ${actualCount}`).toBe(expectedCount);
});

Then('should see the task {string}', async function (this: CustomWorld, taskText: string) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  
  const exists = await this.todoPage.todoExists(taskText);
  expect(exists, `Task "${taskText}" should be visible in the list but was not found`).toBeTruthy();
});

Then('should not see the task {string}', async function (this: CustomWorld, taskText: string) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  
  const exists = await this.todoPage.todoExists(taskText);
  expect(exists, `Task "${taskText}" should not be visible in the list but was found`).toBeFalsy();
});

Then('should not see the counter', async function (this: CustomWorld) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  
  const isVisible = await this.todoPage.isCounterVisible();
  expect(isVisible, 'Task counter should not be visible when list is empty').toBeFalsy();
});

Then('should see only {int} task', async function (this: CustomWorld, expectedCount: number) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  
  const visibleTodos = await this.todoPage.getVisibleTodos();
  expect(visibleTodos.length, `Should see ${expectedCount} task(s) but found ${visibleTodos.length}`).toBe(expectedCount);
});

Then('should see the following tasks:', async function (this: CustomWorld, dataTable: DataTable) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  
  const expectedTasks = dataTable.hashes().map(row => row.task);
  const visibleTodos = await this.todoPage.getVisibleTodos();
  
  for (const expectedTask of expectedTasks) {
    expect(visibleTodos, `Task "${expectedTask}" should be visible. Current tasks: [${visibleTodos.join(', ')}]`).toContain(expectedTask);
  }
});
