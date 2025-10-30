// ==================== STATE MANAGEMENT ====================
        let todoList = [];
        let draggedElement = null;
        let draggedIndex = null;
        let currentFilter = 'all';
        let searchQuery = '';
        let deletedTask = null;
        let undoTimeout = null;
        let currentEditingNotes = null;

        // ==================== DOM ELEMENTS ====================
        const DOM = {
            taskInput: document.getElementById('taskInput'),
            addBtn: document.getElementById('addBtn'),
            tasksList: document.getElementById('tasksList'),
            themeToggle: document.getElementById('themeToggle'),
            categorySelect: document.getElementById('categorySelect'),
            prioritySelect: document.getElementById('prioritySelect'),
            dueDateInput: document.getElementById('dueDateInput'),
            searchBox: document.getElementById('searchBox'),
            leavesContainer: document.getElementById('leaves-container'),
            totalTasks: document.getElementById('totalTasks'),
            completedTasks: document.getElementById('completedTasks'),
            pendingTasks: document.getElementById('pendingTasks'),
            completionRate: document.getElementById('completionRate'),
            progressFill: document.getElementById('progressFill'),
            completeAllBtn: document.getElementById('completeAllBtn'),
            deleteAllBtn: document.getElementById('deleteAllBtn'),
            exportBtn: document.getElementById('exportBtn'),
            undoToast: document.getElementById('undoToast'),
            undoBtn: document.getElementById('undoBtn'),
            shortcutsBtn: document.getElementById('shortcutsBtn'),
            shortcutsModal: document.getElementById('shortcutsModal'),
            closeModal: document.getElementById('closeModal'),
            notesModal: document.getElementById('notesModal'),
            closeNotesModal: document.getElementById('closeNotesModal'),
            notesTextarea: document.getElementById('notesTextarea'),
            saveNotesBtn: document.getElementById('saveNotesBtn'),
            cancelNotesBtn: document.getElementById('cancelNotesBtn')
        };

        // ==================== UTILITY FUNCTIONS ====================
        const randomRange = (min, max) => Math.random() * (max - min) + min;
        const randomItem = (array) => array[Math.floor(Math.random() * array.length)];
        const escapeHtml = (str) => {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        };

        // ==================== CONFETTI ANIMATION ====================
        const createConfetti = () => {
            const colors = ['#d68c45', '#f0b27a', '#8b4513', '#f5d5a8'];
            for (let i = 0; i < 50; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.background = randomItem(colors);
                confetti.style.animationDelay = Math.random() * 0.5 + 's';
                confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 3000);
            }
        };

        // ==================== FALLING LEAVES ====================
        const createFallingLeaves = () => {
            const leafEmojis = ['🍂', '🍁', '🍃'];
            const numberOfLeaves = 15;
            
            const createLeaf = () => {
                const leaf = document.createElement('div');
                leaf.className = 'leaf';
                leaf.textContent = randomItem(leafEmojis);
                leaf.style.left = `${randomRange(0, 100)}%`;
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

        // ==================== STATISTICS ====================
        const updateStats = () => {
            const total = todoList.length;
            const completed = todoList.filter(t => t.completed).length;
            const pending = total - completed;
            const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

            DOM.totalTasks.textContent = total;
            DOM.completedTasks.textContent = completed;
            DOM.pendingTasks.textContent = pending;
            DOM.completionRate.textContent = rate + '%';
            DOM.progressFill.style.width = rate + '%';
        };

        // ==================== FILTER & SEARCH ====================
        const getFilteredTasks = () => {
            let filtered = todoList;

            // Apply status filter
            if (currentFilter === 'active') {
                filtered = filtered.filter(t => !t.completed);
            } else if (currentFilter === 'completed') {
                filtered = filtered.filter(t => t.completed);
            }

            // Apply search
            if (searchQuery) {
                filtered = filtered.filter(t => 
                    t.text.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            return filtered;
        };

        // ==================== RENDER FUNCTIONS ====================
        const renderEmptyState = () => `
            <div class="empty-state">
                <div class="empty-icon">🍂</div>
                <div>No tasks found. ${searchQuery ? 'Try a different search.' : 'Add one to get started!'}</div>
            </div>
        `;

        const formatDate = (dateStr) => {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const taskDate = new Date(date);
            taskDate.setHours(0, 0, 0, 0);
            
            const isOverdue = taskDate < today;
            const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            
            return `<span class="due-date ${isOverdue ? 'overdue' : ''}">📅 ${formattedDate}${isOverdue ? ' (Overdue)' : ''}</span>`;
        };

        const renderTaskItem = (item, index) => {
            const actualIndex = todoList.indexOf(item);
            const categoryTag = item.category ? `<span class="task-tag tag-${item.category}">${item.category}</span>` : '';
            const priorityBadge = `<span class="priority-badge priority-${item.priority}">${item.priority}</span>`;
            const dueDate = item.dueDate ? formatDate(item.dueDate) : '';
            const notes = item.notes ? `<div class="task-notes">📝 ${escapeHtml(item.notes)}</div>` : '';

            return `
                <div class="task-item ${item.completed ? 'completed' : ''} priority-${item.priority}" 
                     data-index="${actualIndex}"
                     draggable="true">
                    <div class="task-main">
                        <input type="checkbox" 
                               class="checkbox" 
                               ${item.completed ? 'checked' : ''} 
                               data-action="toggle"
                               data-index="${actualIndex}">
                        <div class="task-content-wrapper">
                            <div class="task-title-row">
                                <span class="task-number">${actualIndex + 1}.</span>
                                <span class="task-text">${escapeHtml(item.text)}</span>
                            </div>
                            <div class="task-tags">
                                ${categoryTag}
                                ${priorityBadge}
                                ${dueDate}
                            </div>
                            ${notes}
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="action-btn edit-btn" data-action="edit" data-index="${actualIndex}">Edit</button>
                        <button class="action-btn notes-btn" data-action="notes" data-index="${actualIndex}">Notes</button>
                        <button class="action-btn delete-btn" data-action="delete" data-index="${actualIndex}">Delete</button>
                    </div>
                </div>
            `;
        };

        const render = () => {
            const filtered = getFilteredTasks();
            
            if (filtered.length === 0) {
                DOM.tasksList.innerHTML = renderEmptyState();
                updateStats();
                return;
            }

            const tasksHtml = filtered.map(renderTaskItem).join('');
            DOM.tasksList.innerHTML = tasksHtml;
            attachDragListeners();
            updateStats();
        };

        // ==================== TASK MANAGEMENT ====================
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

            const newTask = {
                text,
                completed: false,
                id: Date.now(),
                category: DOM.categorySelect.value,
                priority: DOM.prioritySelect.value,
                dueDate: DOM.dueDateInput.value,
                notes: '',
                createdAt: new Date().toISOString()
            };

            todoList.push(newTask);
            DOM.taskInput.value = '';
            DOM.categorySelect.value = '';
            DOM.prioritySelect.value = 'medium';
            DOM.dueDateInput.value = '';
            DOM.taskInput.focus();
            
            render();
            saveToStorage();
        };

        const deleteTask = (index) => {
            deletedTask = { task: todoList[index], index };
            todoList.splice(index, 1);
            
            // Show undo toast
            DOM.undoToast.classList.add('show');
            clearTimeout(undoTimeout);
            undoTimeout = setTimeout(() => {
                DOM.undoToast.classList.remove('show');
                deletedTask = null;
            }, 5000);
            
            render();
            saveToStorage();
        };

        const undoDelete = () => {
            if (deletedTask) {
                todoList.splice(deletedTask.index, 0, deletedTask.task);
                deletedTask = null;
                DOM.undoToast.classList.remove('show');
                clearTimeout(undoTimeout);
                render();
                saveToStorage();
            }
        };

        const editTask = (index) => {
            const newText = prompt('Edit task:', todoList[index].text);
            if (newText !== null && newText.trim()) {
                todoList[index].text = newText.trim();
                render();
                saveToStorage();
            }
        };

        const toggleComplete = (index) => {
            todoList[index].completed = !todoList[index].completed;
            
            if (todoList[index].completed) {
                createConfetti();
            }
            
            render();
            saveToStorage();
        };

        const openNotesModal = (index) => {
            currentEditingNotes = index;
            DOM.notesTextarea.value = todoList[index].notes || '';
            DOM.notesModal.classList.add('show');
            DOM.notesTextarea.focus();
        };

        const saveNotes = () => {
            if (currentEditingNotes !== null) {
                todoList[currentEditingNotes].notes = DOM.notesTextarea.value.trim();
                DOM.notesModal.classList.remove('show');
                currentEditingNotes = null;
                render();
                saveToStorage();
            }
        };

        const cancelNotes = () => {
            DOM.notesModal.classList.remove('show');
            currentEditingNotes = null;
        };

        // ==================== BULK ACTIONS ====================
        const completeAll = () => {
            if (confirm('Mark all tasks as completed?')) {
                todoList.forEach(task => task.completed = true);
                createConfetti();
                render();
                saveToStorage();
            }
        };

        const deleteAll = () => {
            if (confirm('Delete all tasks? This cannot be undone.')) {
                todoList = [];
                render();
                saveToStorage();
            }
        };

        const exportTasks = () => {
            const dataStr = JSON.stringify(todoList, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `autumn-tasks-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);
        };

        // ==================== DRAG AND DROP ====================
        const attachDragListeners = () => {
            const taskItems = document.querySelectorAll('.task-item');
            taskItems.forEach(item => {
                item.addEventListener('dragstart', handleDragStart);
                item.addEventListener('dragend', handleDragEnd);
                item.addEventListener('dragover', handleDragOver);
                item.addEventListener('drop', handleDrop);
            });
        };

        const handleDragStart = (e) => {
            draggedElement = e.currentTarget;
            draggedIndex = parseInt(e.currentTarget.dataset.index);
            e.currentTarget.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        };

        const handleDragOver = (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        };

        const handleDrop = (e) => {
            e.preventDefault();
            const dropTarget = e.currentTarget;
            
            if (draggedElement !== dropTarget) {
                const dropIndex = parseInt(dropTarget.dataset.index);
                const draggedItem = todoList[draggedIndex];
                
                todoList.splice(draggedIndex, 1);
                todoList.splice(dropIndex, 0, draggedItem);
                
                render();
                saveToStorage();
            }
        };

        const handleDragEnd = (e) => {
            e.currentTarget.classList.remove('dragging');
            draggedElement = null;
            draggedIndex = null;
        };

        // ==================== LOCAL STORAGE ====================
        const saveToStorage = () => {
            try {
                localStorage.setItem('autumnTodoList', JSON.stringify(todoList));
            } catch (error) {
                console.error('Failed to save:', error);
            }
        };

        const loadFromStorage = () => {
            try {
                const stored = localStorage.getItem('autumnTodoList');
                if (stored) {
                    todoList = JSON.parse(stored);
                }
            } catch (error) {
                console.error('Failed to load:', error);
                todoList = [];
            }
        };

        // ==================== THEME ====================
        const toggleTheme = () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            DOM.themeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        };

        const loadTheme = () => {
            const saved = localStorage.getItem('theme');
            if (saved === 'dark') {
                document.body.classList.add('dark-mode');
                DOM.themeToggle.textContent = '☀️ Light Mode';
            }
        };

        // ==================== EVENT HANDLERS ====================
        const handleTaskClick = (e) => {
            const action = e.target.dataset.action;
            const index = parseInt(e.target.dataset.index);

            if (isNaN(index)) return;

            const actions = {
                toggle: () => toggleComplete(index),
                edit: () => editTask(index),
                delete: () => deleteTask(index),
                notes: () => openNotesModal(index)
            };

            actions[action]?.();
        };

        const handleFilterClick = (e) => {
            if (e.target.classList.contains('filter-btn')) {
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
                currentFilter = e.target.dataset.filter;
                render();
            }
        };

        const handleSearch = (e) => {
            searchQuery = e.target.value;
            render();
        };

        // ==================== KEYBOARD SHORTCUTS ====================
        const handleKeyboard = (e) => {
            // Ctrl + Z: Undo
            if (e.ctrlKey && e.key === 'z') {
                e.preventDefault();
                undoDelete();
            }
            
            // Ctrl + D: Toggle Theme
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                toggleTheme();
            }
            
            // Ctrl + F: Focus Search
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                DOM.searchBox.focus();
            }
            
            // Ctrl + Shift + C: Complete All
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                completeAll();
            }
            
            // Ctrl + E: Export
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                exportTasks();
            }
        };

        // ==================== INITIALIZATION ====================
        const initEventListeners = () => {
            DOM.addBtn.addEventListener('click', addTask);
            DOM.taskInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') addTask();
            });
            DOM.themeToggle.addEventListener('click', toggleTheme);
            DOM.tasksList.addEventListener('click', handleTaskClick);
            DOM.tasksList.addEventListener('change', handleTaskClick);
            DOM.searchBox.addEventListener('input', handleSearch);
            document.querySelector('.filter-bar').addEventListener('click', handleFilterClick);
            DOM.completeAllBtn.addEventListener('click', completeAll);
            DOM.deleteAllBtn.addEventListener('click', deleteAll);
            DOM.exportBtn.addEventListener('click', exportTasks);
            DOM.undoBtn.addEventListener('click', undoDelete);
            DOM.shortcutsBtn.addEventListener('click', () => {
                DOM.shortcutsModal.classList.add('show');
            });
            DOM.closeModal.addEventListener('click', () => {
                DOM.shortcutsModal.classList.remove('show');
            });
            DOM.shortcutsModal.addEventListener('click', (e) => {
                if (e.target === DOM.shortcutsModal) {
                    DOM.shortcutsModal.classList.remove('show');
                }
            });
            DOM.saveNotesBtn.addEventListener('click', saveNotes);
            DOM.cancelNotesBtn.addEventListener('click', cancelNotes);
            DOM.closeNotesModal.addEventListener('click', cancelNotes);
            DOM.notesModal.addEventListener('click', (e) => {
                if (e.target === DOM.notesModal) cancelNotes();
            });
            document.addEventListener('keydown', handleKeyboard);
        };

        const init = () => {
            loadFromStorage();
            loadTheme();
            createFallingLeaves();
            render();
            initEventListeners();
            DOM.taskInput.focus();
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }