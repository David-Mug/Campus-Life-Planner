/**
 * ui.js - UI module for the Campus Life Planner
 */

import State from './state.js';
import Validators from './validators.js';
import Search from './search.js';

const UI = {
  // DOM element references
  elements: {},
  
  /**
   * Initialize UI elements and event listeners
   */
  init: function() {
    this.cacheElements();
    this.initPageFunctions();
    this.applyTheme();
    this.setupEventListeners();
    
    // Initialize search functionality
    if (this.elements.searchInput) {
      this.elements.searchInput.addEventListener('input', e => this.handleSearch(e));
    }
    
    // Add event listener for storage changes to update dashboard in real-time
    window.addEventListener('storage', e => {
      if (e.key === 'campusTasks') {
        // Reload tasks from storage
        State.init();
        
        // Update UI based on current page
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'index.html' || currentPage === '') {
          this.updateDashboard();
          this.renderWeekTrend();
          this.checkDailyTarget();
          this.renderTasks();
        } else if (currentPage === 'mytasks.html') {
          this.updateTaskStats();
          this.populateTagFilter();
          this.renderTasks();
        }
      }
    });
  },
  
  /**
   * Cache DOM elements for better performance
   */
  cacheElements: function() {
    // Common elements across pages
    this.elements.themeToggle = document.getElementById('themeToggle');
    this.elements.navLinks = document.querySelectorAll('nav a');
    
    // Page-specific elements
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'index.html' || currentPage === '') {
      // Dashboard elements
      this.elements.taskForm = document.getElementById('taskForm');
      this.elements.taskList = document.getElementById('taskList');
      this.elements.taskTitle = document.getElementById('taskTitle');
      this.elements.taskDuration = document.getElementById('taskDuration');
      this.elements.taskDueDate = document.getElementById('taskDueDate');
      this.elements.taskTag = document.getElementById('taskTag');
      this.elements.errorContainer = document.getElementById('errorContainer');
      
      // Stats Dashboard elements
      this.elements.totalTasks = document.getElementById('totalTasks');
      this.elements.totalDuration = document.getElementById('totalDuration');
      this.elements.topTag = document.getElementById('topTag');
      this.elements.avgDuration = document.getElementById('avgDuration');
      this.elements.dailyTarget = document.getElementById('dailyTarget');
      this.elements.weekTrend = document.getElementById('weekTrend');
      this.elements.targetProgress = document.getElementById('targetProgress');
      this.elements.targetStatus = document.getElementById('targetStatus');
    } 
    else if (currentPage === 'mytasks.html') {
      // My Tasks elements
      this.elements.taskList = document.getElementById('taskList');
      this.elements.filterTag = document.getElementById('filterTag');
      this.elements.filterDate = document.getElementById('filterDate');
      this.elements.clearFilters = document.getElementById('clearFilters');
      this.elements.searchInput = document.getElementById('searchInput');
      this.elements.taskCount = document.getElementById('taskCount');
      this.elements.taskDuration = document.getElementById('taskDuration');
      this.elements.completionRate = document.getElementById('completionRate');
    }
    else if (currentPage === 'settings.html') {
      // Settings elements
      this.elements.settingsForm = document.getElementById('settingsForm');
      this.elements.defaultUnit = document.getElementById('defaultUnit');
      this.elements.dailyTargetInput = document.getElementById('dailyTarget');
      this.elements.exportBtn = document.getElementById('exportBtn');
      this.elements.importBtn = document.getElementById('importBtn');
      this.elements.importFile = document.getElementById('importFile');
    }
  },
  
  /**
   * Initialize page-specific functions
   */
  initPageFunctions: function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Set active navigation link
    this.setActiveNavLink(currentPage);
    
    if (currentPage === 'index.html' || currentPage === '') {
      this.renderTasks();
      this.updateDashboard();
      this.renderWeekTrend();
      this.checkDailyTarget();
    } 
    else if (currentPage === 'mytasks.html') {
      this.renderTasks();
      this.updateTaskStats();
      this.populateTagFilter();
    }
    else if (currentPage === 'settings.html') {
      this.loadSettings();
    }
  },
  
  /**
   * Set up event listeners for the current page
   */
  setupEventListeners: function() {
    // Common event listeners
    if (this.elements.themeToggle) {
      this.elements.themeToggle.addEventListener('click', () => {
        State.toggleDarkMode();
        this.applyTheme();
      });
    }
    
    // Page-specific event listeners
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'index.html' || currentPage === '') {
      // Dashboard event listeners
      if (this.elements.taskForm) {
        this.elements.taskForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleTaskFormSubmit();
        });
      }
    } 
    else if (currentPage === 'mytasks.html') {
      // My Tasks event listeners
      if (this.elements.filterTag) {
        this.elements.filterTag.addEventListener('change', () => this.applyFilters());
      }
      
      if (this.elements.filterDate) {
        this.elements.filterDate.addEventListener('change', () => this.applyFilters());
      }
      
      if (this.elements.clearFilters) {
        this.elements.clearFilters.addEventListener('click', () => this.clearFilters());
      }
      
      if (this.elements.searchInput) {
        this.elements.searchInput.addEventListener('input', (e) => this.handleSearch(e));
      }
      
      // Add sort controls for better task organization
      if (this.elements.sortBy) {
        this.elements.sortBy.addEventListener('change', () => this.sortTasks());
      }
      
      if (this.elements.sortDirection) {
        this.elements.sortDirection.addEventListener('click', () => this.toggleSortDirection());
      }
    }
    else if (currentPage === 'settings.html') {
      // Settings event listeners
      if (this.elements.settingsForm) {
        this.elements.settingsForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.saveSettings();
        });
      }
      
      if (this.elements.exportBtn) {
        this.elements.exportBtn.addEventListener('click', () => this.exportTasks());
      }
      
      if (this.elements.importBtn) {
        this.elements.importBtn.addEventListener('click', () => {
          this.elements.importFile.click();
        });
      }
      
      if (this.elements.importFile) {
        this.elements.importFile.addEventListener('change', (e) => this.importTasks(e));
      }
    }
  },
  
  /**
   * Set the active navigation link based on current page
   * @param {string} currentPage - Current page filename
   */
  setActiveNavLink: function(currentPage) {
    if (!this.elements.navLinks) return;
    
    this.elements.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      
      if ((currentPage === '' || currentPage === 'index.html') && (href === 'index.html' || href === './')) {
        link.setAttribute('aria-current', 'page');
      } else if (href === currentPage) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  },
  
  /**
   * Apply the current theme (dark/light mode)
   */
  applyTheme: function() {
    const isDarkMode = State.isDarkMode();
    document.body.classList.toggle('dark', isDarkMode);
    
    if (this.elements.themeToggle) {
      this.elements.themeToggle.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
    }
  },
  
  /**
   * Render tasks in the task list
   * @param {Array} filteredTasks - Optional filtered tasks to render
   */
  renderTasks: function(filteredTasks) {
    if (!this.elements.taskList) return;
    
    const tasks = filteredTasks || State.getTasks();
    const currentPage = window.location.pathname.split('/').pop();
    const searchQuery = currentPage === 'mytasks.html' && this.elements.searchInput ? 
                        this.elements.searchInput.value : '';
    
    this.elements.taskList.innerHTML = '';
    
    if (tasks.length === 0) {
      const emptyMessage = document.createElement('li');
      emptyMessage.className = 'empty-list';
      emptyMessage.textContent = 'No tasks found';
      this.elements.taskList.appendChild(emptyMessage);
      return;
    }
    
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task-item';
      li.dataset.id = task.id;
      
      // Create task content with highlighted search matches if needed
      const titleText = searchQuery ? 
                       Search.highlightMatches(task.title, searchQuery) : 
                       task.title;
      
      const tagText = task.tag && searchQuery ? 
                     Search.highlightMatches(task.tag, searchQuery) : 
                     task.tag || '';
      
      const dueDateText = searchQuery ? 
                         Search.highlightMatches(task.dueDate, searchQuery) : 
                         task.dueDate;
      
      // Create task HTML structure
      li.innerHTML = `
        <div class="task-content">
          <h3>${titleText}</h3>
          <div class="task-details">
            <span class="task-due-date">
              <img src="assets/icons/calendar.svg" alt="Due date" class="icon">
              ${dueDateText}
            </span>
            <span class="task-duration">
              <img src="assets/icons/clock.svg" alt="Duration" class="icon">
              ${task.duration} ${task.duration === 1 ? 'hour' : 'hours'}
            </span>
            ${task.tag ? `<span class="task-tag">${tagText}</span>` : ''}
          </div>
        </div>
        <div class="task-actions">
          <button class="edit-btn" aria-label="Edit task">
            <img src="assets/icons/edit.svg" alt="Edit" class="icon">
          </button>
          <button class="delete-btn" aria-label="Delete task">
            <img src="assets/icons/delete.svg" alt="Delete" class="icon">
          </button>
        </div>
      `;
      
      // Add event listeners for edit and delete buttons
      const editBtn = li.querySelector('.edit-btn');
      const deleteBtn = li.querySelector('.delete-btn');
      
      editBtn.addEventListener('click', () => this.editTask(task.id));
      deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
      
      this.elements.taskList.appendChild(li);
    });
    
    // Update task statistics if on My Tasks page
    if (currentPage === 'mytasks.html') {
      this.updateTaskStats(tasks);
    }
  },
  
  /**
   * Handle task form submission
   */
  handleTaskFormSubmit: function() {
    const title = this.elements.taskTitle.value.trim();
    const duration = this.elements.taskDuration.value.trim();
    const dueDate = this.elements.taskDueDate.value.trim();
    const tag = this.elements.taskTag.value.trim();
    
    // Validate form inputs
    const validation = Validators.validateTaskForm(title, duration, dueDate, tag);
    
    if (!validation.isValid) {
      this.showFormErrors(validation.errors);
      return;
    }
    
    // Clear any previous errors
    this.clearFormErrors();
    
    // Add task to state
    State.addTask({
      title,
      duration: parseFloat(duration),
      dueDate,
      tag: tag || null
    });
    
    // Reset form
    this.elements.taskForm.reset();
    
    // Update UI
    this.renderTasks();
    this.updateDashboard();
    this.renderWeekTrend();
    this.checkDailyTarget();
  },
  
  /**
   * Show form validation errors
   * @param {Object} errors - Validation errors
   */
  showFormErrors: function(errors) {
    this.clearFormErrors();
    
    const errorList = document.createElement('ul');
    errorList.className = 'error-list';
    
    Object.entries(errors).forEach(([field, message]) => {
      const errorItem = document.createElement('li');
      errorItem.textContent = message;
      errorList.appendChild(errorItem);
      
      // Add error class to the input field
      const inputField = this.elements[`task${field.charAt(0).toUpperCase() + field.slice(1)}`];
      if (inputField) {
        inputField.classList.add('error');
      }
    });
    
    this.elements.errorContainer.appendChild(errorList);
  },
  
  /**
   * Clear form validation errors
   */
  clearFormErrors: function() {
    if (!this.elements.errorContainer) return;
    
    this.elements.errorContainer.innerHTML = '';
    
    // Remove error class from all input fields
    ['taskTitle', 'taskDuration', 'taskDueDate', 'taskTag'].forEach(field => {
      if (this.elements[field]) {
        this.elements[field].classList.remove('error');
      }
    });
  },
  
  /**
   * Update dashboard statistics
   */
  updateDashboard: function() {
    if (!this.elements.totalTasks || !this.elements.totalDuration) return;
    
    const tasks = State.getTasks();
    const totalDuration = tasks.reduce((sum, task) => sum + parseFloat(task.duration), 0);
    
    // Calculate average duration
    const avgDuration = tasks.length > 0 ? totalDuration / tasks.length : 0;
    
    // Find the most common tag
    const tagCounts = {};
    let topTag = 'None';
    let maxCount = 0;
    
    tasks.forEach(task => {
      if (task.tag) {
        tagCounts[task.tag] = (tagCounts[task.tag] || 0) + 1;
        if (tagCounts[task.tag] > maxCount) {
          maxCount = tagCounts[task.tag];
          topTag = task.tag;
        }
      }
    });
    
    // Update UI elements
    this.elements.totalTasks.textContent = tasks.length;
    this.elements.totalDuration.textContent = `${totalDuration.toFixed(1)} minutes`;
    
    if (this.elements.topTag) {
      this.elements.topTag.textContent = topTag;
    }
    
    if (this.elements.avgDuration) {
      this.elements.avgDuration.textContent = `${avgDuration.toFixed(1)} minutes`;
    }
  },
  
  /**
   * Update task statistics on My Tasks page
   * @param {Array} tasks - Tasks to calculate statistics for
   */
  updateTaskStats: function(tasks) {
    if (!this.elements.taskCount || !this.elements.taskDuration || !this.elements.completionRate) return;
    
    const tasksToUse = tasks || State.getTasks();
    const totalDuration = tasksToUse.reduce((sum, task) => sum + parseFloat(task.duration), 0);
    
    this.elements.taskCount.textContent = tasksToUse.length;
    this.elements.taskDuration.textContent = totalDuration.toFixed(1);
    this.elements.completionRate.textContent = '0%'; // Placeholder for future implementation
  },
  
  /**
   * Render the week trend chart
   */
  renderWeekTrend: function() {
    if (!this.elements.weekTrend) return;
    
    const tasks = State.getTasks();
    const chartContainer = this.elements.weekTrend;
    chartContainer.innerHTML = '';
    
    // Get the last 7 days
    const days = [];
    const taskCountsByDay = [];
    const durationsByDay = [];
    
    // Generate the last 7 days (including today)
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      days.push({
        date: dateStr,
        day: dayName
      });
      
      // Count tasks and durations for this day
      const dayTasks = tasks.filter(task => task.dueDate === dateStr);
      taskCountsByDay.push(dayTasks.length);
      
      const dayDuration = dayTasks.reduce((sum, task) => sum + parseFloat(task.duration), 0);
      durationsByDay.push(dayDuration);
    }
    
    // Find the maximum values for scaling
    const maxTaskCount = Math.max(...taskCountsByDay, 1); // Ensure at least 1 to avoid division by zero
    const maxDuration = Math.max(...durationsByDay, 1);
    
    // Create the chart bars
    days.forEach((day, index) => {
      const taskCount = taskCountsByDay[index];
      const duration = durationsByDay[index];
      
      // Calculate the height percentage based on the maximum values
      const heightPercentage = Math.max((taskCount / maxTaskCount) * 100, 5); // Minimum 5% height for visibility
      
      // Create the bar element
      const barContainer = document.createElement('div');
      barContainer.className = 'chart-bar';
      
      // Create the value label
      const valueLabel = document.createElement('div');
      valueLabel.className = 'bar-label';
      valueLabel.textContent = `${taskCount} (${duration.toFixed(0)}m)`;
      barContainer.appendChild(valueLabel);
      
      // Create the actual bar
      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.style.height = `${heightPercentage}%`;
      bar.title = `${day.day}: ${taskCount} tasks, ${duration.toFixed(1)} minutes`;
      barContainer.appendChild(bar);
      
      // Create the day label
      const dayLabel = document.createElement('div');
      dayLabel.className = 'day-label';
      dayLabel.textContent = day.day;
      barContainer.appendChild(dayLabel);
      
      // Add the bar to the chart
      chartContainer.appendChild(barContainer);
    });
  },
  
  /**
   * Check if daily target is met
   */
  checkDailyTarget: function() {
    if (!this.elements.dailyTarget) return;
    
    const settings = State.getSettings();
    const dailyTarget = settings.dailyTarget || 0;
    
    // Get today's tasks
    const today = new Date().toISOString().split('T')[0];
    const tasks = State.getTasks();
    const todayTasks = tasks.filter(task => task.dueDate === today);
    const todayDuration = todayTasks.reduce((sum, task) => sum + parseFloat(task.duration), 0);
    
    // Calculate percentage of target met
    const percentComplete = dailyTarget > 0 ? Math.min((todayDuration / dailyTarget) * 100, 100) : 0;
    
    // Update UI
    const targetElement = this.elements.dailyTarget;
    targetElement.textContent = `${todayDuration.toFixed(1)} / ${dailyTarget}`;
    
    // Update progress bar
    if (this.elements.targetProgress) {
      this.elements.targetProgress.style.width = `${percentComplete}%`;
    }
    
    // Update status text
    if (this.elements.targetStatus) {
      if (todayDuration >= dailyTarget) {
        this.elements.targetStatus.textContent = 'Daily target achieved! 🎉';
      } else {
        const remaining = dailyTarget - todayDuration;
        this.elements.targetStatus.textContent = `${remaining.toFixed(1)} minutes remaining to reach target`;
      }
    }
    
    // Add visual indicator
    targetElement.classList.remove('target-met', 'target-close', 'target-far');
    
    if (todayDuration >= dailyTarget) {
      targetElement.classList.add('target-met');
    } else if (todayDuration >= dailyTarget * 0.7) {
      targetElement.classList.add('target-close');
    } else {
      targetElement.classList.add('target-far');
    }
  },
  
  /**
   * Populate tag filter dropdown
   */
  populateTagFilter: function() {
    if (!this.elements.filterTag) return;
    
    const tasks = State.getTasks();
    const tags = new Set();
    
    // Collect unique tags
    tasks.forEach(task => {
      if (task.tag) tags.add(task.tag);
    });
    
    // Clear existing options except the first one
    while (this.elements.filterTag.options.length > 1) {
      this.elements.filterTag.remove(1);
    }
    
    // Add tag options
    tags.forEach(tag => {
      const option = document.createElement('option');
      option.value = tag;
      option.textContent = tag;
      this.elements.filterTag.appendChild(option);
    });
  },
  
  /**
   * Apply filters to tasks
   */
  applyFilters: function() {
    if (!this.elements.filterTag || !this.elements.filterDate) return;
    
    const selectedTag = this.elements.filterTag.value;
    const selectedDate = this.elements.filterDate.value;
    const searchQuery = this.elements.searchInput ? this.elements.searchInput.value : '';
    
    let filteredTasks = State.getTasks();
    
    // Filter by tag
    if (selectedTag) {
      filteredTasks = filteredTasks.filter(task => task.tag === selectedTag);
    }
    
    // Filter by date
    if (selectedDate) {
      filteredTasks = filteredTasks.filter(task => task.dueDate === selectedDate);
    }
    
    // Filter by search query
    if (searchQuery) {
      filteredTasks = Search.searchTasks(filteredTasks, searchQuery);
    }
    
    // Render filtered tasks
    this.renderTasks(filteredTasks);
  },
  
  /**
   * Clear all filters
   */
  clearFilters: function() {
    if (!this.elements.filterTag || !this.elements.filterDate || !this.elements.searchInput) return;
    
    this.elements.filterTag.value = '';
    this.elements.filterDate.value = '';
    this.elements.searchInput.value = '';
    
    this.renderTasks();
    
    // Clear search results count
    if (this.elements.searchResultsCount) {
      this.elements.searchResultsCount.textContent = '';
    }
    
    // Update task statistics
    this.updateTaskStats();
  },
  
  /**
   * Sort tasks based on selected criteria
   */
  sortTasks: function() {
    if (!this.elements.sortBy) return;
    
    const sortBy = this.elements.sortBy.value;
    const isAscending = this.elements.sortDirection ? 
      this.elements.sortDirection.textContent === '↑' : true;
    
    let tasks = State.getTasks();
    
    // Apply current filters before sorting
    const searchQuery = this.elements.searchInput ? this.elements.searchInput.value.trim() : '';
    const selectedTag = this.elements.filterTag ? this.elements.filterTag.value : '';
    const selectedDate = this.elements.filterDate ? this.elements.filterDate.value : '';
    
    // Apply tag filter
    if (selectedTag) {
      tasks = tasks.filter(task => task.tag === selectedTag);
    }
    
    // Apply date filter
    if (selectedDate && selectedDate !== 'all') {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      if (selectedDate === 'today') {
        tasks = tasks.filter(task => task.dueDate === todayStr);
      } else if (selectedDate === 'tomorrow') {
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        tasks = tasks.filter(task => task.dueDate === tomorrowStr);
      } else if (selectedDate === 'week') {
        const weekStart = new Date(today);
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + 7);
        const weekStartStr = weekStart.toISOString().split('T')[0];
        const weekEndStr = weekEnd.toISOString().split('T')[0];
        tasks = tasks.filter(task => 
          task.dueDate >= weekStartStr && task.dueDate <= weekEndStr);
      } else if (selectedDate === 'month') {
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        tasks = tasks.filter(task => {
          const taskDate = new Date(task.dueDate);
          return taskDate.getMonth() === currentMonth && 
                 taskDate.getFullYear() === currentYear;
        });
      }
    }
    
    // Apply search filter
    if (searchQuery) {
      try {
        tasks = Search.regexSearch(tasks, searchQuery);
      } catch (e) {
        tasks = Search.searchTasks(tasks, searchQuery);
      }
    }
    
    // Sort tasks
    tasks.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'duration':
          comparison = parseFloat(a.duration) - parseFloat(b.duration);
          break;
        case 'dueDate':
          comparison = a.dueDate.localeCompare(b.dueDate);
          break;
        default:
          comparison = 0;
      }
      
      return isAscending ? comparison : -comparison;
    });
    
    this.renderTasks(tasks);
    this.updateTaskStats(tasks);
  },
  
  /**
   * Toggle sort direction
   */
  toggleSortDirection: function() {
    if (!this.elements.sortDirection) return;
    
    // Toggle direction
    this.elements.sortDirection.textContent = 
      this.elements.sortDirection.textContent === '↓' ? '↑' : '↓';
    
    // Re-sort tasks
    this.sortTasks();
  },
  
  /**
   * Handle search input
   * @param {Event} e - Input event
   */
  handleSearch: function(e) {
    const query = e.target.value.trim();
    let filteredTasks = State.getTasks();
    
    // Apply existing filters
    const selectedTag = this.elements.filterTag ? this.elements.filterTag.value : '';
    const selectedDate = this.elements.filterDate ? this.elements.filterDate.value : '';
    
    if (selectedTag) {
      filteredTasks = filteredTasks.filter(task => task.tag === selectedTag);
    }
    
    if (selectedDate && selectedDate !== 'all') {
      // Handle different date filter options
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      if (selectedDate === 'today') {
        filteredTasks = filteredTasks.filter(task => task.dueDate === todayStr);
      } else if (selectedDate === 'tomorrow') {
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        filteredTasks = filteredTasks.filter(task => task.dueDate === tomorrowStr);
      } else if (selectedDate === 'week') {
        const weekStart = new Date(today);
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + 7);
        const weekStartStr = weekStart.toISOString().split('T')[0];
        const weekEndStr = weekEnd.toISOString().split('T')[0];
        filteredTasks = filteredTasks.filter(task => 
          task.dueDate >= weekStartStr && task.dueDate <= weekEndStr);
      } else if (selectedDate === 'month') {
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        filteredTasks = filteredTasks.filter(task => {
          const taskDate = new Date(task.dueDate);
          return taskDate.getMonth() === currentMonth && 
                 taskDate.getFullYear() === currentYear;
        });
      }
    }
    
    // Apply search
    if (query) {
      try {
        // Try to use regex search if the query is a valid regex
        filteredTasks = Search.regexSearch(filteredTasks, query);
      } catch (e) {
        // Fall back to regular search if regex is invalid
        filteredTasks = Search.searchTasks(filteredTasks, query);
      }
      
      // Update search results count
      if (this.elements.searchResultsCount) {
        this.elements.searchResultsCount.textContent = 
          `Found ${filteredTasks.length} matching task${filteredTasks.length !== 1 ? 's' : ''}`;
      }
    } else if (this.elements.searchResultsCount) {
      this.elements.searchResultsCount.textContent = '';
    }
    
    this.renderTasks(filteredTasks);
    
    // Always update task statistics when search changes
    if (this.elements.taskCount && this.elements.taskDuration) {
      this.updateTaskStats(filteredTasks);
    }
  },
  
  /**
   * Edit a task
   * @param {string} taskId - ID of the task to edit
   */
  editTask: function(taskId) {
    const task = State.getTaskById(taskId);
    if (!task) return;
    
    // For now, just redirect to index page with task ID in URL
    window.location.href = `index.html?edit=${taskId}`;
  },
  
  /**
   * Delete a task
   * @param {string} taskId - ID of the task to delete
   */
  deleteTask: function(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
      State.deleteTask(taskId);
      this.renderTasks();
      
      const currentPage = window.location.pathname.split('/').pop();
      
      if (currentPage === 'index.html' || currentPage === '') {
        this.updateDashboard();
        this.renderWeekTrend();
        this.checkDailyTarget();
      }
    }
  },
  
  /**
   * Load settings into the settings form
   */
  loadSettings: function() {
    if (!this.elements.defaultUnit || !this.elements.dailyTargetInput) return;
    
    const settings = State.getSettings();
    
    this.elements.defaultUnit.value = settings.defaultUnit || 'hours';
    this.elements.dailyTargetInput.value = settings.dailyTarget || '';
  },
  
  /**
   * Save settings from the settings form
   */
  saveSettings: function() {
    if (!this.elements.defaultUnit || !this.elements.dailyTargetInput) return;
    
    const defaultUnit = this.elements.defaultUnit.value;
    const dailyTarget = this.elements.dailyTargetInput.value;
    
    const settings = {
      defaultUnit,
      dailyTarget: dailyTarget ? parseFloat(dailyTarget) : 0
    };
    
    // Validate settings
    if (Validators.validateSettings(settings)) {
      State.saveSettings(settings);
      alert('Settings saved successfully!');
    } else {
      alert('Invalid settings. Please check your inputs.');
    }
  },
  
  /**
   * Export tasks to JSON file
   */
  exportTasks: function() {
    const tasks = State.getTasks();
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'tasks.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  },
  
  /**
   * Import tasks from JSON file
   * @param {Event} e - Change event from file input
   */
  importTasks: function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const tasks = JSON.parse(event.target.result);
        
        // Validate tasks
        const validTasks = tasks.filter(task => Validators.validateTaskObject(task));
        
        if (validTasks.length === 0) {
          alert('No valid tasks found in the file.');
          return;
        }
        
        if (validTasks.length < tasks.length) {
          alert(`Warning: Only ${validTasks.length} out of ${tasks.length} tasks were valid and imported.`);
        }
        
        // Import tasks
        State.importTasks(validTasks);
        alert(`Successfully imported ${validTasks.length} tasks!`);
        
      } catch (error) {
        alert('Error importing tasks: ' + error.message);
      }
    };
    
    reader.readAsText(file);
  }
};

export default UI;