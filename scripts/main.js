/**
 * main.js - Main entry point for the Campus Life Planner
 */

import Storage from './storage.js';
import State from './state.js';
import UI from './ui.js';

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize modules
  State.init();
  UI.init();
  
  // Check for edit task parameter in URL
  const urlParams = new URLSearchParams(window.location.search);
  const editTaskId = urlParams.get('edit');
  
  if (editTaskId) {
    // Handle edit task functionality
    const task = State.getTaskById(editTaskId);
    if (task && window.location.pathname.includes('index.html')) {
      // Populate form with task data
      document.getElementById('taskTitle').value = task.title;
      document.getElementById('taskDuration').value = task.duration;
      document.getElementById('taskDueDate').value = task.dueDate;
      document.getElementById('taskTag').value = task.tag || '';
      
      // Change submit button text
      const submitBtn = document.querySelector('#taskForm button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = 'Update Task';
        submitBtn.dataset.editId = editTaskId;
      }
    }
  }
});