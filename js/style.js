// ==================== STATE MANAGEMENT ====================
let todoList = [];
let dragState = {
    isDragging: false,
    draggedElement: null,
    draggedIndex: null,
    placeholder: null,
    originalPosition: null,
    offsetX: 0,
    offsetY: 0,
    doubleClickTimer: null,
    clickCount: 0
};

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
    initDragAndDrop();
};

// ==================== DRAG AND DROP FUNCTIONALITY ====================

/**
 * Handles double click detection to start dragging
 * @param {Event} e - Click event
 * @param {HTMLElement} taskItem - Task element
 */
const handleDoubleClick = (e, taskItem) => {
    dragState.clickCount++;
    
    if (dragState.clickCount === 1) {
        dragState.doubleClickTimer = setTimeout(() => {
            dragState.clickCount = 0;
        }, 300);
    } else if (dragState.clickCount === 2) {
        clearTimeout(dragState.doubleClickTimer);
        dragState.clickCount = 0;
        startDragging(e, taskItem);
    }
};

/**
 * Starts the dragging operation
 * @param {Event} e - Mouse event
 * @param {HTMLElement} taskItem - Task element to drag
 */
const startDragging = (e, taskItem) => {
    if (e.target.closest('.action-btn') || e.target.closest('.checkbox')) return;
    
    dragState.isDragging = true;
    dragState.draggedElement = taskItem;
    dragState.draggedIndex = parseInt(taskItem.dataset.index);
    
    const rect = taskItem.getBoundingClientRect();
    dragState.offsetX = e.clientX - rect.left;
    dragState.offsetY = e.clientY - rect.top;
    dragState.originalPosition = {
        index: dragState.draggedIndex,
        top: rect.top,
        left: rect.left
    };
    
    // Create placeholder
    dragState.placeholder = taskItem.cloneNode(true);
    dragState.placeholder.classList.add('placeholder');
    taskItem.parentNode.insertBefore(dragState.placeholder, taskItem);
    
    // Style dragged element
    taskItem.classList.add('dragging');
    taskItem.style.position = 'fixed';
    taskItem.style.zIndex = '1000';
    taskItem.style.width = rect.width + 'px';
    taskItem.style.left = (e.clientX - dragState.offsetX) + 'px';
    taskItem.style.top = (e.clientY - dragState.offsetY) + 'px';
    taskItem.style.pointerEvents = 'none';
    
    document.body.style.cursor = 'grabbing';
};

/**
 * Handles mouse move during dragging
 * @param {Event} e - Mouse move event
 */
const handleDragMove = (e) => {
    if (!dragState.isDragging || !dragState.draggedElement) return;
    
    const x = e.clientX - dragState.offsetX;
    const y = e.clientY - dragState.offsetY;
    
    dragState.draggedElement.style.left = x + 'px';
    dragState.draggedElement.style.top = y + 'px';
    
    // Find the element we're hovering over
    const afterElement = getDragAfterElement(e.clientY);
    const placeholder = dragState.placeholder;
    
    if (afterElement == null) {
        DOM.tasksList.appendChild(placeholder);
    } else {
        DOM.tasksList.insertBefore(placeholder, afterElement);
    }
};

/**
 * Gets the element that should be after the dragged element
 * @param {number} y - Y position of mouse
 * @returns {HTMLElement|null} Element after dragged position
 */
const getDragAfterElement = (y) => {
    const draggableElements = [...DOM.tasksList.querySelectorAll('.task-item:not(.dragging):not(.placeholder)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
};

/**
 * Checks if the element is inside the tasks list container
 * @param {number} x - X position
 * @param {number} y - Y position
 * @returns {boolean} True if inside container
 */
const isInsideContainer = (x, y) => {
    const rect = DOM.tasksList.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
};

/**
 * Handles the end of dragging operation
 * @param {Event} e - Mouse up event
 */
const handleDragEnd = (e) => {
    if (!dragState.isDragging || !dragState.draggedElement) return;
    
    const isInside = isInsideContainer(e.clientX, e.clientY);
    
    if (!isInside) {
        // Return to original position with animation
        returnToOriginalPosition();
    } else {
        // Drop at new position
        completeDrop();
    }
    
    document.body.style.cursor = 'default';
};

/**
 * Returns the dragged element to its original position
 */
const returnToOriginalPosition = () => {
    const element = dragState.draggedElement;
    const original = dragState.originalPosition;
    
    // Animate back
    element.style.transition = 'all 0.3s ease';
    element.style.left = original.left + 'px';
    element.style.top = original.top + 'px';
    element.style.opacity = '0.5';
    
    setTimeout(() => {
        cleanupDrag();
        render();
    }, 300);
};

/**
 * Completes the drop at new position
 */
const completeDrop = () => {
    const placeholder = dragState.placeholder;
    const newIndex = [...DOM.tasksList.children].indexOf(placeholder);
    const oldIndex = dragState.draggedIndex;
    
    // Reorder array
    const [movedItem] = todoList.splice(oldIndex, 1);
    todoList.splice(newIndex, 0, movedItem);
    
    cleanupDrag();
    render();
    saveToLocalStorage();
};

/**
 * Cleans up drag state and elements
 */
const cleanupDrag = () => {
    if (dragState.draggedElement) {
        dragState.draggedElement.classList.remove('dragging');
        dragState.draggedElement.style.position = '';
        dragState.draggedElement.style.zIndex = '';
        dragState.draggedElement.style.width = '';
        dragState.draggedElement.style.left = '';
        dragState.draggedElement.style.top = '';
        dragState.draggedElement.style.pointerEvents = '';
        dragState.draggedElement.style.transition = '';
        dragState.draggedElement.style.opacity = '';
    }
    
    if (dragState.placeholder && dragState.placeholder.parentNode) {
        dragState.placeholder.remove();
    }
    
    dragState.isDragging = false;
    dragState.draggedElement = null;
    dragState.draggedIndex = null;
    dragState.placeholder = null;
    dragState.originalPosition = null;
};

/**
 * Initializes drag and drop for all task items
 */
const initDragAndDrop = () => {
    const taskItems = DOM.tasksList.querySelectorAll('.task-item');
    
    taskItems.forEach(taskItem => {
        taskItem.addEventListener('mousedown', (e) => {
            handleDoubleClick(e, taskItem);
        });
    });
    
    // Global mouse move and mouse up listeners
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
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
    
    if (newText === null) return;
    
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
    DOM.addBtn.addEventListener('click', addTask);

    DOM.taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    DOM.themeToggle.addEventListener('click', toggleTheme);

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