// State
let todoList = [];

// DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const tasksList = document.getElementById('tasksList');
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Create falling leaves animation
function createFallingLeaves() {
    const leavesContainer = document.getElementById('leaves-container');
    const leafEmojis = ['🍂', '🍁', '🍃'];
    
    for (let i = 0; i < 15; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.textContent = leafEmojis[Math.floor(Math.random() * leafEmojis.length)];
        leaf.style.left = Math.random() * 100 + '%';
        leaf.style.animationDelay = Math.random() * 15 + 's';
        leaf.style.animationDuration = (Math.random() * 10 + 10) + 's';
        leavesContainer.appendChild(leaf);
    }
}

// Render tasks
function render() {
    if (todoList.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🍂</div>
                <div>No tasks yet. Add one to get started!</div>
            </div>
        `;
        return;
    }

    let html = '';
    todoList.forEach((item, index) => {
        html += `
            <div class="task-item ${item.completed ? 'completed' : ''}">
                <div class="task-content">
                    <input type="checkbox" class="checkbox" 
                           ${item.completed ? 'checked' : ''} 
                           onchange="toggleComplete(${index})">
                    <span class="task-number">${index + 1}.</span>
                    <span class="task-text">${item.text}</span>
                </div>
                <div class="task-actions">
                    <button class="action-btn edit-btn" onclick="editTask(${index})">Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteTask(${index})">Delete</button>
                </div>
            </div>
        `;
    });
    tasksList.innerHTML = html;
}

// Add task
function addTask() {
    const text = taskInput.value.trim();
    if (text !== '') {
        todoList.push({ text, completed: false });
        taskInput.value = '';
        render();
    }
}

// Delete task
function deleteTask(index) {
    todoList.splice(index, 1);
    render();
}

// Edit task
function editTask(index) {
    const newText = prompt('Edit your task:', todoList[index].text);
    if (newText !== null && newText.trim() !== '') {
        todoList[index].text = newText.trim();
        render();
    }
}

// Toggle complete
function toggleComplete(index) {
    todoList[index].completed = !todoList[index].completed;
    render();
}

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        themeToggle.textContent = '☀️ Light Mode';
    } else {
        themeToggle.textContent = '🌙 Dark Mode';
    }
});

// Event listeners for adding tasks
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Initialize the app
createFallingLeaves();
render();