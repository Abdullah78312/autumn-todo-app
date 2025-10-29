// ==================== STATE MANAGEMENT ====================
let todoList = [];

// ==================== DOM ELEMENTS ====================
const DOM = {
    taskInput: document.getElementById('taskInput'),
    addBtn: document.getElementById('addBtn'),
    tasksList: document.getElementById('tasksList'),
    themeToggle: document.getElementById('themeToggle'),
    body: document.body,
    leavesContainer: document.getElementById('leaves-container')
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Generates a random number between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
const randomRange = (min, max) => Math.random() * (max - min) + min;

/**
 * Gets a random item from an array
 * @param {Array} array - Source array
 * @returns {*} Random item
 */
const randomItem = (array) => array[Math.floor(Math.random() * array.length)];

/**
 * Sanitizes HTML to prevent XSS attacks
 * @param {string} str - Input string
 * @returns {string} Sanitized string
 */
const escapeHtml = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
};

// ==================== ANIMATION FUNCTIONS ====================

/**
 * Creates falling leaves animation in the background
 */
const createFallingLeaves = () => {
    const leafEmojis = ['🍂', '🍁', '🍃'];
    const numberOfLeaves = 15;
    
    const createLeaf = () => {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.textContent = randomItem(leafEmojis);
        leaf.style.left = `${randomRange(0, 100)}%`;
        leaf.style.animationDelay = `${randomRange(0, 15)}s`;
        leaf.style.animationDuration = `${randomRange(10, 20)}s`;
        return leaf;
    };

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < numberOfLeaves; i++) {
        fragment.appendChild(createLeaf());
    }
    DOM.leavesContainer.appendChild(fragment);
};

// ==================== RENDER FUNCTIONS ====================

/**
 * Renders the empty state when no tasks exist
 * @returns {string} HTML for empty state
 */
const renderEmptyState = () => `
    <div class="empty-state">
        <div class="empty-icon">🍂</div>
        <div>No tasks yet. Add one to get started!</div>
    </div>
`;

/**
 * Renders a single task item
 * @param {Object} item - Task object
 * @param {number} index - Task index
 * @returns {string} HTML for task item
 */
const renderTaskItem = (item, index) => `
    <div class="task-item ${item.completed ? 'completed' : ''}" data-index="${index}">
        <div class="task-content">
            <input type="checkbox" 
                   class="checkbox" 
                   ${item.completed ? 'checked' : ''} 
                   data-action="toggle"
                   data-index="${index}">
            <span class="task-number">${index + 1}.</span>
            <span class="task-text">${escapeHtml(item.text)}</span>
        </div>
        <div class="task-actions">
            <button class="action-btn edit-btn" 
                    data-action="edit" 
                    data-index="${index}">
                Edit
            </button>
            <button class="action-btn delete-btn" 
                    data-action="delete" 
                    data-index="${index}">
                Delete
            </button>
        </div>
    </div>
`;

/**
 * Main render function - updates the task list display
 */
const render = () => {
    if (todoList.length === 0) {
        DOM.tasksList.innerHTML = renderEmptyState();
        return;
    }

    const tasksHtml = todoList.map(renderTaskItem).join('');
    DOM.tasksList.innerHTML = tasksHtml;
};

// ==================== TASK MANAGEMENT ====================

/**
 * Adds a new task to the list
 */
const addTask = () => {
    const text = DOM.taskInput.value.trim();
    
    if (!text) {
        DOM.taskInput.focus();
        return;
    }

    if (text.length > 200) {
        alert('Task is too long! Please keep it under 200 characters.');
        return;
    }

    todoList.push({ text, completed: false, id: Date.now() });
    DOM.taskInput.value = '';
    DOM.taskInput.focus();
    render();
    saveToLocalStorage();
};

/**
 * Deletes a task from the list
 * @param {number} index - Index of task to delete
 */
const deleteTask = (index) => {
    if (confirm('Are you sure you want to delete this task?')) {
        todoList.splice(index, 1);
        render();
        saveToLocalStorage();
    }
};

/**
 * Edits an existing task
 * @param {number} index - Index of task to edit
 */
const editTask = (index) => {
    const currentText = todoList[index].text;
    const newText = prompt('Edit your task:', currentText);
    
    if (newText === null) return; // User cancelled
    
    const trimmedText = newText.trim();
    
    if (!trimmedText) {
        alert('Task cannot be empty!');
        return;
    }

    if (trimmedText.length > 200) {
        alert('Task is too long! Please keep it under 200 characters.');
        return;
    }

    todoList[index].text = trimmedText;
    render();
    saveToLocalStorage();
};

/**
 * Toggles task completion status
 * @param {number} index - Index of task to toggle
 */
const toggleComplete = (index) => {
    todoList[index].completed = !todoList[index].completed;
    render();
    saveToLocalStorage();
};

// ==================== LOCAL STORAGE ====================

/**
 * Saves tasks to localStorage
 */
const saveToLocalStorage = () => {
    try {
        localStorage.setItem('autumnTodoList', JSON.stringify(todoList));
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
    }
};

/**
 * Loads tasks from localStorage
 */
const loadFromLocalStorage = () => {
    try {
        const stored = localStorage.getItem('autumnTodoList');
        if (stored) {
            todoList = JSON.parse(stored);
        }
    } catch (error) {
        console.error('Failed to load from localStorage:', error);
        todoList = [];
    }
};

// ==================== THEME MANAGEMENT ====================

/**
 * Toggles between dark and light mode
 */
const toggleTheme = () => {
    DOM.body.classList.toggle('dark-mode');
    const isDarkMode = DOM.body.classList.contains('dark-mode');
    DOM.themeToggle.textContent = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
};

/**
 * Loads saved theme preference
 */
const loadTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        DOM.body.classList.add('dark-mode');
        DOM.themeToggle.textContent = '☀️ Light Mode';
    }
};

// ==================== EVENT DELEGATION ====================

/**
 * Handles all task-related clicks using event delegation
 * @param {Event} e - Click event
 */
const handleTaskClick = (e) => {
    const action = e.target.dataset.action;
    const index = parseInt(e.target.dataset.index);

    if (isNaN(index)) return;

    const actions = {
        toggle: () => toggleComplete(index),
        edit: () => editTask(index),
        delete: () => deleteTask(index)
    };

    actions[action]?.();
};

// ==================== EVENT LISTENERS ====================

/**
 * Sets up all event listeners
 */
const initEventListeners = () => {
    // Add task button click
    DOM.addBtn.addEventListener('click', addTask);

    // Enter key to add task
    DOM.taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // Theme toggle
    DOM.themeToggle.addEventListener('click', toggleTheme);

    // Event delegation for task actions
    DOM.tasksList.addEventListener('click', handleTaskClick);
    DOM.tasksList.addEventListener('change', handleTaskClick);
};

// ==================== INITIALIZATION ====================

/**
 * Initializes the application
 */
const init = () => {
    loadFromLocalStorage();
    loadTheme();
    createFallingLeaves();
    render();
    initEventListeners();
    DOM.taskInput.focus();
};

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ==================== EXPORTS (for potential future use) ====================
// Uncomment if using modules
// export { addTask, deleteTask, editTask, toggleComplete, render };