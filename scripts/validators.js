/**
 * validators.js - Form validation functions for the Campus Life Planner
 */

const Validators = {
  // Regex patterns
  patterns: {
    title: /^\S(?:.*\S)?$/, // No leading/trailing spaces
    duration: /^(0|[1-9]\d*)(\.[0-9]{1,2})?$/, // Numbers with optional decimal
    date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, // YYYY-MM-DD
    tag: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/, // Letters, spaces, hyphens
    duplicateWords: /\b(\w+)\s+\1\b/ // Advanced regex: finds duplicate words
  },
  
  /**
   * Validate task form inputs
   * @param {string} title - Task title
   * @param {string} duration - Task duration
   * @param {string} dueDate - Task due date
   * @param {string} tag - Task tag
   * @returns {Object} Validation result with isValid and errors
   */
  validateTaskForm: function(title, duration, dueDate, tag) {
    const errors = {};
    
    // Validate title
    if (!title) {
      errors.title = "Title is required";
    } else if (!this.patterns.title.test(title)) {
      errors.title = "Title cannot have leading or trailing spaces";
    } else if (this.patterns.duplicateWords.test(title)) {
      errors.title = "Title contains duplicate words";
    }
    
    // Validate duration
    if (!duration) {
      errors.duration = "Duration is required";
    } else if (!this.patterns.duration.test(duration)) {
      errors.duration = "Duration must be a valid number";
    }
    
    // Validate due date
    if (!dueDate) {
      errors.dueDate = "Due date is required";
    } else if (!this.patterns.date.test(dueDate)) {
      errors.dueDate = "Due date must be in YYYY-MM-DD format";
    }
    
    // Validate tag (optional)
    if (tag && !this.patterns.tag.test(tag)) {
      errors.tag = "Tag must contain only letters, spaces, and hyphens";
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },
  
  /**
   * Validate a task object
   * @param {Object} task - Task object to validate
   * @returns {boolean} Whether the task is valid
   */
  validateTaskObject: function(task) {
    if (!task || typeof task !== 'object') return false;
    
    // Check required fields
    if (!task.id || !task.title || task.duration === undefined || !task.dueDate) {
      return false;
    }
    
    // Validate field formats
    if (!this.patterns.title.test(task.title)) return false;
    if (!this.patterns.duration.test(String(task.duration))) return false;
    if (!this.patterns.date.test(task.dueDate)) return false;
    if (task.tag && !this.patterns.tag.test(task.tag)) return false;
    
    return true;
  },
  
  /**
   * Validate settings object
   * @param {Object} settings - Settings object to validate
   * @returns {boolean} Whether the settings are valid
   */
  validateSettings: function(settings) {
    if (!settings || typeof settings !== 'object') return false;
    
    // Validate defaultUnit
    if (settings.defaultUnit && !['minutes', 'hours'].includes(settings.defaultUnit)) {
      return false;
    }
    
    // Validate dailyTarget
    if (settings.dailyTarget !== undefined) {
      const dailyTarget = Number(settings.dailyTarget);
      if (isNaN(dailyTarget) || dailyTarget < 0) {
        return false;
      }
    }
    
    return true;
  }
};

export default Validators;