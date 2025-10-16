/**
 * storage.js - Handles all localStorage operations for the Campus Life Planner
 */

const Storage = {
  /**
   * Save tasks to localStorage
   * @param {Array} tasks - Array of task objects
   */
  saveTasks: function(tasks) {
    localStorage.setItem("campusTasks", JSON.stringify(tasks));
  },

  /**
   * Load tasks from localStorage
   * @returns {Array} Array of task objects or empty array if none found
   */
  loadTasks: function() {
    return JSON.parse(localStorage.getItem("campusTasks")) || [];
  },

  /**
   * Save settings to localStorage
   * @param {Object} settings - Settings object
   */
  saveSettings: function(settings) {
    localStorage.setItem("campusSettings", JSON.stringify(settings));
  },

  /**
   * Load settings from localStorage
   * @returns {Object} Settings object or default settings if none found
   */
  loadSettings: function() {
    return JSON.parse(localStorage.getItem("campusSettings")) || {
      defaultUnit: "minutes",
      dailyTarget: 120
    };
  },

  /**
   * Save theme preference to localStorage
   * @param {boolean} isDarkMode - Whether dark mode is enabled
   */
  saveTheme: function(isDarkMode) {
    localStorage.setItem("darkMode", isDarkMode);
  },

  /**
   * Load theme preference from localStorage
   * @returns {boolean} Whether dark mode is enabled
   */
  loadTheme: function() {
    return localStorage.getItem("darkMode") === "true";
  },

  /**
   * Export tasks as JSON string
   * @returns {string} JSON string of tasks
   */
  exportTasks: function() {
    return localStorage.getItem("campusTasks") || "[]";
  },

  /**
   * Import tasks from JSON string
   * @param {string} jsonString - JSON string of tasks
   * @returns {boolean} Whether import was successful
   */
  importTasks: function(jsonString) {
    try {
      const tasks = JSON.parse(jsonString);
      if (!Array.isArray(tasks)) {
        return false;
      }
      localStorage.setItem("campusTasks", jsonString);
      return true;
    } catch (e) {
      return false;
    }
  }
};

export default Storage;