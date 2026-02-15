# language: en
Feature: TodoMVC Task Management
  As a TodoMVC application user
  I want to be able to manage my tasks
  So I can organize my to-do items effectively

  Background:
    Given the user navigates to the TodoMVC application

  @todo @smoke
  Scenario: Add and manage complete tasks
    When the user adds the task "Buy milk"
    And the user adds the task "Do exercise"
    Then the counter should show "2 items left"
    When the user marks as completed the task "Buy milk"
    Then the counter should show "1 item left"
    When the user reloads the page
    Then the counter should show "1 item left"
    And the task "Buy milk" should be marked as completed
    When the user deletes all tasks
    Then the task list should be empty

  @todo
  Scenario: Add multiple tasks
    When the user adds the following tasks:
      | task          |
      | Buy milk      |
      | Do exercise   |
    Then the counter should show "2 items left"
    And should see 2 tasks in the list

  @todo
  Scenario: Mark task as completed
    When the user adds the task "Test task"
    And the user marks as completed the task "Test task"
    Then the counter should show "0 items left"
    And the task "Test task" should be marked as completed

  @todo
  Scenario: State persistence after reload
    When the user adds the task "Persistent task"
    And the user marks as completed the task "Persistent task"
    And the user reloads the page
    Then the task "Persistent task" should be marked as completed
    And the counter should show "0 items left"

  @todo
  Scenario: Delete tasks individually
    When the user adds the task "Task 1"
    And the user adds the task "Task 2"
    When the user deletes the task "Task 1"
    Then the counter should show "1 item left"
    And should see 1 task in the list

  @todo
  Scenario: Delete all tasks
    When the user adds the task "Temporary task 1"
    And the user adds the task "Temporary task 2"
    And the user adds the task "Temporary task 3"
    When the user deletes all tasks
    Then the task list should be empty
    And should not see the counter

  @todo
  Scenario: Filter active tasks
    When the user adds the task "Active task"
    And the user adds the task "Task to complete"
    And the user marks as completed the task "Task to complete"
    When the user filters by active tasks
    Then should see only 1 task
    And should see the task "Active task"

  @todo
  Scenario: Filter completed tasks
    When the user adds the task "Task 1"
    And the user adds the task "Task 2"
    And the user marks as completed the task "Task 1"
    When the user filters by completed tasks
    Then should see only 1 task
    And should see the task "Task 1"

  @todo
  Scenario Outline: Validate counter with different task quantities
    When the user adds <quantity> tasks
    Then the counter should show "<message>"

    Examples:
      | quantity | message       |
      | 1        | 1 item left   |
      | 2        | 2 items left  |
      | 5        | 5 items left  |
