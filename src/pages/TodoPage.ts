import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * TodoPage - Page Object for TodoMVC application
 * Handles all interactions with the task list
 */
export class TodoPage extends BasePage {
  // Selectors (using modern CSS, no XPath)
  private readonly selectors = {
    newTodoInput: '.new-todo',
    todoList: '.todo-list',
    todoItem: '.todo-list li',
    completedTodo: '.completed',
    todoCount: '.todo-count',
    clearCompletedButton: '.clear-completed',
    filterAll: 'a[href="#/"]',
    filterActive: 'a[href="#/active"]',
    filterCompleted: 'a[href="#/completed"]',
    toggleAll: '.toggle-all',
  };

  constructor(page: Page) {
    super(page, 'https://demo.playwright.dev/todomvc');
  }

  /**
   * Navigate to TodoMVC application
   */
  async navigateToTodoApp() {
    await this.navigate('/');
    await this.waitForSelector(this.selectors.newTodoInput);
  }

  /**
   * Add a new task
   */
  async addTodo(taskText: string) {
    await this.fill(this.selectors.newTodoInput, taskText);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(500); // Wait for task to be added
  }

  /**
   * Add multiple tasks
   */
  async addMultipleTodos(tasks: string[]) {
    for (const task of tasks) {
      await this.addTodo(task);
    }
  }

  /**
   * Mark a task as completed
   */
  async markTodoAsCompleted(taskText: string) {
    // Find the label with the task text
    const labelLocator = this.page.locator('.todo-list li label').filter({ hasText: taskText });
    
    // Find the sibling checkbox within the same li
    const todoItem = labelLocator.locator('..').first();
    const checkbox = todoItem.locator('input[type="checkbox"]');
    
    // Click the checkbox
    await checkbox.check();
    
    // Wait for change to be applied
    await this.page.waitForTimeout(300);
  }

  /**
   * Unmark a completed task
   */
  async unmarkTodo(taskText: string) {
    // Find the label with the task text
    const labelLocator = this.page.locator('.todo-list li label').filter({ hasText: taskText });
    
    // Find the sibling checkbox within the same li
    const todoItem = labelLocator.locator('..').first();
    const checkbox = todoItem.locator('input[type="checkbox"]');
    
    // Uncheck the checkbox
    await checkbox.uncheck();
    
    // Small wait for change to be applied
    await this.page.waitForTimeout(200);
  }

  /**
   * Check if a task is completed
   */
  async isTodoCompleted(taskText: string): Promise<boolean> {
    try {
      // Wait for list to be loaded
      await this.waitForSelector(this.selectors.todoList);
      
      // Get all list items
      const items = await this.page.locator('.todo-list li').all();
      
      for (const item of items) {
        const label = item.locator('label');
        const labelText = await label.textContent();
        
        // If we found the text we're looking for
        if (labelText?.trim() === taskText) {
          const className = await item.getAttribute('class');
          return className?.includes('completed') || false;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error checking if task is completed:', error);
      return false;
    }
  }

  /**
   * Get task counter text using typed locator
   */
  async getTodoCount(): Promise<string> {
    const countLocator = this.page.locator(this.selectors.todoCount);
    
    // Check if element exists
    if (await countLocator.count() === 0) {
      return '';
    }
    
    const text = await countLocator.textContent();
    return text?.trim() || '';
  }

  /**
   * Check if counter is visible
   */
  async isCounterVisible(): Promise<boolean> {
    return await this.isVisible(this.selectors.todoCount);
  }

  /**
   * Get number of tasks in list using typed locator
   */
  async getTodoItemsCount(): Promise<number> {
    return await this.page.locator(this.selectors.todoItem).count();
  }

  /**
   * Check if task list is empty
   */
  async isTodoListEmpty(): Promise<boolean> {
    const count = await this.getTodoItemsCount();
    return count === 0;
  }

  /**
   * Delete a specific task (hover and click X button)
   */
  async deleteTodo(taskText: string) {
    // Find the label with the task text
    const labelLocator = this.page.locator('.todo-list li label').filter({ hasText: taskText });
    
    // Get the parent li
    const todoItem = labelLocator.locator('..').first();
    
    // Hover over the item to show delete button
    await todoItem.hover();
    await this.page.waitForTimeout(200);
    
    // Click the delete button (button.destroy)
    const deleteButton = todoItem.locator('button.destroy');
    await deleteButton.click();
    
    // Wait for deletion
    await this.page.waitForTimeout(300);
  }

  /**
   * Delete all tasks one by one using typed locator
   */
  async deleteAllTodos() {
    let count = await this.getTodoItemsCount();
    
    while (count > 0) {
      // Get the first element and delete it using typed locator
      const firstTodoLabel = this.page.locator(`${this.selectors.todoItem} label`).first();
      
      if (await firstTodoLabel.count() > 0) {
        const text = await firstTodoLabel.textContent();
        if (text) {
          await this.deleteTodo(text.trim());
        }
      }
      
      // Update count
      count = await this.getTodoItemsCount();
    }
  }

  /**
   * Clear completed tasks using typed locator
   */
  async clearCompleted() {
    const clearButton = this.page.locator(this.selectors.clearCompletedButton);
    
    if (await clearButton.count() > 0) {
      await clearButton.click();
      await this.page.waitForTimeout(300);
    }
  }

  /**
   * Reload the page
   */
  async reloadPage() {
    await this.page.reload();
    await this.waitForSelector(this.selectors.newTodoInput);
  }

  /**
   * Filter by all tasks
   */
  async filterAll() {
    await this.click(this.selectors.filterAll);
    await this.page.waitForTimeout(300);
  }

  /**
   * Filter by active tasks
   */
  async filterActive() {
    await this.click(this.selectors.filterActive);
    await this.page.waitForTimeout(300);
  }

  /**
   * Filter by completed tasks
   */
  async filterCompleted() {
    await this.click(this.selectors.filterCompleted);
    await this.page.waitForTimeout(300);
  }

  /**
   * Check if a task exists in the list (visible)
   */
  async todoExists(taskText: string): Promise<boolean> {
    try {
      // Search only in visible items (not hidden)
      const items = await this.page.locator('.todo-list li').all();
      
      for (const item of items) {
        // Check if item is visible (doesn't have display: none)
        const isVisible = await item.isVisible();
        if (!isVisible) continue;
        
        const label = item.locator('label');
        const labelText = await label.textContent();
        
        if (labelText?.trim() === taskText) {
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error checking if task exists:', error);
      return false;
    }
  }

  /**
   * Get all visible tasks
   */
  async getVisibleTodos(): Promise<string[]> {
    const todos: string[] = [];
    
    // Get only visible items
    const items = await this.page.locator('.todo-list li').all();
    
    for (const item of items) {
      const isVisible = await item.isVisible();
      if (!isVisible) continue;
      
      const label = item.locator('label');
      const text = await label.textContent();
      if (text) {
        todos.push(text.trim());
      }
    }
    
    return todos;
  }

  /**
   * Mark all tasks as completed
   */
  async toggleAllTodos() {
    await this.click(this.selectors.toggleAll);
    await this.page.waitForTimeout(300);
  }
}
