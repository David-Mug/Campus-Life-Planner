/**
 * state.js - Manages application state for the Campus Life Planner
 */

import Storage from './storage.js';

const State = {
  // Application state
  tasks: [],
  settings: {},
  darkMode: false,
  editingTaskId: null,
  sortDirection: "asc",
  
  /**
   * Get all tasks
   * @returns {Array} All tasks
   */
  getTasks: function() {
    return this.tasks;
  },
  
  /**
   * Get settings
   * @returns {Object} Application settings
   */
  getSettings: function() {
    return this.settings;
  },
  
  /**
   * Get a task by ID
   * @param {string} taskId - ID of the task to retrieve
   * @returns {Object|null} The task or null if not found
   */
  getTaskById: function(taskId) {
    return this.tasks.find(task => task.id === taskId) || null;
  },
  
  /**
   * Initialize application state
   */
  init: function() {
    this.tasks = Storage.loadTasks();
    this.settings = Storage.loadSettings();
    this.darkMode = Storage.loadTheme();
    this.editingTaskId = null;
    this.sortDirection = "asc";
    
    // Apply theme
    this.applyTheme();
    
    return this;
  },
  
  /**
   * Apply current theme to the document
   */
  applyTheme: function() {
    if (this.darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  },
  
  /**
   * Check if dark mode is enabled
   * @returns {boolean} True if dark mode is enabled
   */
  isDarkMode: function() {
    return this.darkMode;
  },
  
  /**
   * Toggle dark mode
   */
  toggleDarkMode: function() {
    this.darkMode = !this.darkMode;
    Storage.saveTheme(this.darkMode);
    this.applyTheme();
    return this.darkMode;
  },
  
  /**
   * Add a new task
   * @param {Object} taskData - Task data
   * @returns {Object} The new task
   */
  addTask: function(taskData) {
    const now = new Date().toISOString();
    const newTask = {
      id: `task_${Date.now()}`,
      title: taskData.title,
      duration: parseFloat(taskData.duration),
      dueDate: taskData.dueDate,
      tag: taskData.tag,
      createdAt: now,
      updatedAt: now
    };
    
    this.tasks.push(newTask);
    Storage.saveTasks(this.tasks);
    return newTask;
  },
  
  /**
   * Update an existing task
   * @param {string} taskId - ID of the task to update
   * @param {Object} taskData - New task data
   * @returns {Object|null} The updated task or null if not found
   */
  updateTask: function(taskId, taskData) {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return null;
    
    const now = new Date().toISOString();
    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      title: taskData.title,
      duration: parseFloat(taskData.duration),
      dueDate: taskData.dueDate,
      tag: taskData.tag,
      updatedAt: now
    };
    
    Storage.saveTasks(this.tasks);
    return this.tasks[taskIndex];
  },
  
  /**
   * Delete a task
   * @param {string} taskId - ID of the task to delete
   * @returns {boolean} Whether the task was deleted
   */
  deleteTask: function(taskId) {
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    Storage.saveTasks(this.tasks);
  },
  
  /**
   * Get a task by ID
   * @param {string} taskId - ID of the task to get
   * @returns {Object|null} The task or null if not found
   */
  getTask: function(taskId) {
    return this.tasks.find(task => task.id === taskId) || null;
  },
  
  /**
   * Update settings
   * @param {Object} newSettings - New settings
   */
  updateSettings: function(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    Storage.saveSettings(this.settings);
  },
  
  /**
   * Import tasks from JSON
   * @param {string} jsonString - JSON string of tasks
   * @returns {boolean} Whether import was successful
   */
  importTasks: function(jsonString) {
    const success = Storage.importTasks(jsonString);
    if (success) {
      this.tasks = Storage.loadTasks();
    }
    return success;
  },
  
  /**
   * Export tasks as JSON
   * @returns {string} JSON string of tasks
   */
  exportTasks: function() {
    return Storage.exportTasks();
  }
};

export default State;