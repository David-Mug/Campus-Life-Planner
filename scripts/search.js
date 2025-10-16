/**
 * search.js - Search functionality for the Campus Life Planner
 */

const Search = {
  /**
   * Search tasks based on a query string
   * @param {Array} tasks - Array of task objects to search through
   * @param {string} query - Search query
   * @returns {Array} Filtered tasks that match the query
   */
  searchTasks: function(tasks, query) {
    if (!query || query.trim() === '') {
      return tasks;
    }
    
    const searchTerm = query.toLowerCase().trim();
    
    return tasks.filter(task => {
      // Search in title
      if (task.title.toLowerCase().includes(searchTerm)) {
        return true;
      }
      
      // Search in tag
      if (task.tag && task.tag.toLowerCase().includes(searchTerm)) {
        return true;
      }
      
      // Search in due date
      if (task.dueDate.includes(searchTerm)) {
        return true;
      }
      
      return false;
    });
  },
  
  /**
   * Highlight search matches in text
   * @param {string} text - Text to highlight matches in
   * @param {string} query - Search query
   * @returns {string} HTML with highlighted matches
   */
  highlightMatches: function(text, query) {
    if (!query || query.trim() === '' || !text) {
      return text;
    }
    
    const searchTerm = query.trim();
    const regex = new RegExp(`(${this.escapeRegExp(searchTerm)})`, 'gi');
    
    return text.replace(regex, '<mark>$1</mark>');
  },
  
  /**
   * Escape special characters in a string for use in a regular expression
   * @param {string} string - String to escape
   * @returns {string} Escaped string
   */
  escapeRegExp: function(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  },
  
  /**
   * Advanced search with regex support
   * @param {Array} tasks - Array of task objects to search through
   * @param {string} pattern - Regex pattern string
   * @returns {Array} Filtered tasks that match the pattern
   */
  regexSearch: function(tasks, pattern) {
    if (!pattern || pattern.trim() === '') {
      return tasks;
    }
    
    try {
      const regex = new RegExp(pattern, 'i');
      
      return tasks.filter(task => {
        // Search in title
        if (regex.test(task.title)) {
          return true;
        }
        
        // Search in tag
        if (task.tag && regex.test(task.tag)) {
          return true;
        }
        
        // Search in due date
        if (regex.test(task.dueDate)) {
          return true;
        }
        
        return false;
      });
    } catch (e) {
      console.error('Invalid regex pattern:', e);
      return tasks;
    }
  }
};

export default Search;