// ==================== STATE MANAGEMENT ====================
let todoList = [];
let draggedElement = null;
let draggedIndex = null;

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

/**
 * Shows custom confirmation dialog
 * @param {string} message - Message to display
 * @returns {Promise<boolean>} True if confirmed, false otherwise
 */
const customConfirm = (message) => {
    return new Promise((resolve) => {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'custom-confirm-overlay';
        
        // Create dialog
        const dialog = document.createElement('div');
        dialog.className = 'custom-confirm-dialog';
        dialog.innerHTML = `
            <div class="custom-confirm-header">
                <span class="custom-confirm-icon">⚠️</span>
                <h3>Confirm Action</h3>
            </div>
            <p class="custom-confirm-message">${escapeHtml(message)}</p>
            <div class="custom-confirm-buttons">
                <button class="custom-confirm-btn cancel-btn" id="confirmCancel">Cancel</button>
                <button class="custom-confirm-btn ok-btn" id="confirmOk">Delete</button>
            </div>
        `;
        
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        
        // Animate in
        setTimeout(() => {
            overlay.classList.add('show');
        }, 10);
        
        // Handle buttons
        const handleClose = (result) => {
            overlay.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(overlay);
                resolve(result);
            }, 300);
        };
        
        document.getElementById('confirmOk').addEventListener('click', () => handleClose(true));
        document.getElementById('confirmCancel').addEventListener('click', () => handleClose(false));
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) handleClose(false);
        });
    });
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
        leaf.style.top = `${randomRange(-20, -10)}%`;
        leaf.style.animationDelay = `${randomRange(0, 5)}s`;
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
    <div class="task-item ${item.completed ? 'completed' : ''}" 
         data-index="${index}"
         draggable="true"
         role="listitem">
        <div class="task-content">
            <input type="checkbox" 
                   class="checkbox" 
                   ${item.completed ? 'checked' : ''} 
                   data-action="toggle"
                   data-index="${index}"
                   aria-label="Mark task as ${item.completed ? 'incomplete' : 'complete'}">
            <span class="task-number">${index + 1}.</span>
            <span class="task-text" data-index="${index}">${escapeHtml(item.text)}</span>
        </div>
        <div class="task-actions">
            <button class="action-btn edit-btn" 
                    data-action="edit" 
                    data-index="${index}"
                    aria-label="Edit task">
                Edit
            </button>
            <button class="action-btn delete-btn" 
                    data-action="delete" 
                    data-index="${index}"
                    aria-label="Delete task">
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
    attachDragListeners();
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
const deleteTask = async (index) => {
    const confirmed = await customConfirm('Are you sure you want to delete this task? This action cannot be undone.');
    if (confirmed) {
        todoList.splice(index, 1);
        render();
        saveToLocalStorage();
    }
};

/**
 * Enables inline editing for a task
 * @param {number} index - Index of task to edit
 */
const editTask = (index) => {
    const taskItem = document.querySelector(`.task-item[data-index="${index}"]`);
    if (!taskItem) return;

    const taskTextSpan = taskItem.querySelector('.task-text');
    const currentText = todoList[index].text;
    
    // Disable dragging during edit
    taskItem.setAttribute('draggable', 'false');
    taskItem.style.cursor = 'default';
    
    // Replace span with input
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'task-text task-text-editable';
    input.value = currentText;
    input.maxLength = 200;
    input.dataset.index = index;
    
    taskTextSpan.replaceWith(input);
    input.focus();
    input.select();
    
    // Update buttons
    const actionsDiv = taskItem.querySelector('.task-actions');
    actionsDiv.innerHTML = `
        <button class="action-btn save-btn" data-action="save" data-index="${index}" aria-label="Save task">
            Save
        </button>
        <button class="action-btn cancel-btn" data-action="cancel" data-index="${index}" aria-label="Cancel editing">
            Cancel
        </button>
    `;
    
    // Handle Enter key
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveTask(index);
        }
    });
    
    // Handle Escape key
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            cancelEdit(index);
        }
    });
};

/**
 * Saves the edited task
 * @param {number} index - Index of task to save
 */
const saveTask = (index) => {
    const taskItem = document.querySelector(`.task-item[data-index="${index}"]`);
    if (!taskItem) return;
    
    const input = taskItem.querySelector('.task-text-editable');
    if (!input) return;
    
    const newText = input.value.trim();
    
    if (!newText) {
        alert('Task cannot be empty!');
        input.focus();
        return;
    }

    if (newText.length > 200) {
        alert('Task is too long! Please keep it under 200 characters.');
        input.focus();
        return;
    }

    todoList[index].text = newText;
    render();
    saveToLocalStorage();
};

/**
 * Cancels editing and restores original task
 * @param {number} index - Index of task to cancel
 */
const cancelEdit = (index) => {
    render();
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

// ==================== DRAG AND DROP ====================

/**
 * Attaches drag event listeners to all task items
 */
const attachDragListeners = () => {
    const taskItems = document.querySelectorAll('.task-item');
    
    taskItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragenter', handleDragEnter);
        item.addEventListener('dragleave', handleDragLeave);
    });
};

/**
 * Handles drag start event
 */
const handleDragStart = (e) => {
    // Prevent dragging if editing
    if (e.target.querySelector('.task-text-editable')) {
        e.preventDefault();
        return;
    }

    draggedElement = e.currentTarget;
    draggedIndex = parseInt(e.currentTarget.dataset.index);
    
    e.currentTarget.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
    
    // For Firefox
    e.dataTransfer.setData('text/plain', '');
};

/**
 * Handles drag over event
 */
const handleDragOver = (e) => {
    if (e.preventDefault) {
        e.preventDefault();
    }
    
    e.dataTransfer.dropEffect = 'move';
    return false;
};

/**
 * Handles drag enter event
 */
const handleDragEnter = (e) => {
    const item = e.currentTarget;
    if (item !== draggedElement && item.classList.contains('task-item')) {
        const allItems = [...DOM.tasksList.querySelectorAll('.task-item')];
        const draggedIdx = allItems.indexOf(draggedElement);
        const targetIdx = allItems.indexOf(item);
        
        if (draggedIdx < targetIdx) {
            item.style.borderBottom = '3px solid #d68c45';
            item.style.borderTop = '';
        } else {
            item.style.borderTop = '3px solid #d68c45';
            item.style.borderBottom = '';
        }
    }
};

/**
 * Handles drag leave event
 */
const handleDragLeave = (e) => {
    e.currentTarget.style.borderTop = '';
    e.currentTarget.style.borderBottom = '';
};

/**
 * Handles drop event
 */
const handleDrop = (e) => {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    e.preventDefault();
    
    const dropTarget = e.currentTarget;
    dropTarget.style.borderTop = '';
    dropTarget.style.borderBottom = '';
    
    if (draggedElement !== dropTarget && dropTarget.classList.contains('task-item')) {
        const allItems = [...DOM.tasksList.querySelectorAll('.task-item')];
        const draggedIdx = allItems.indexOf(draggedElement);
        const targetIdx = allItems.indexOf(dropTarget);
        
        // Reorder the array
        const draggedItem = todoList[draggedIndex];
        todoList.splice(draggedIndex, 1);
        
        // Calculate new position
        const newIndex = targetIdx > draggedIdx ? targetIdx : targetIdx;
        todoList.splice(newIndex, 0, draggedItem);
        
        render();
        saveToLocalStorage();
    }
    
    return false;
};

/**
 * Handles drag end event
 */
const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
    
    // Clean up all borders
    document.querySelectorAll('.task-item').forEach(item => {
        item.style.borderTop = '';
        item.style.borderBottom = '';
    });
    
    // Check if dropped outside the list
    const rect = DOM.tasksList.getBoundingClientRect();
    const isOutside = e.clientX < rect.left || 
                     e.clientX > rect.right || 
                     e.clientY < rect.top || 
                     e.clientY > rect.bottom;
    
    if (isOutside) {
        // Just render again to reset everything
        render();
    }
    
    draggedElement = null;
    draggedIndex = null;
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
        delete: () => deleteTask(index),
        save: () => saveTask(index),
        cancel: () => cancelEdit(index)
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