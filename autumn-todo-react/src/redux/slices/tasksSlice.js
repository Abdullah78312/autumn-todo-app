import { createSlice, createSelector } from '@reduxjs/toolkit';

const loadTasksFromStorage = () => {
  try {
    const stored = localStorage.getItem('autumnTodoList');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load tasks:', error);
    return [];
  }
};

const saveTasksToStorage = (tasks) => {
  try {
    localStorage.setItem('autumnTodoList', JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks:', error);
  }
};

const initialState = {
  tasks: loadTasksFromStorage(),
  filter: 'all',
  searchQuery: '',
  deletedTask: null
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      const newTask = {
        ...action.payload,
        id: Date.now(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      state.tasks.push(newTask);
      saveTasksToStorage(state.tasks);
    },

    deleteTask: (state, action) => {
      const index = action.payload;
      state.deletedTask = {
        task: state.tasks[index],
        index
      };
      state.tasks.splice(index, 1);
      saveTasksToStorage(state.tasks);
    },

    undoDelete: (state) => {
      if (state.deletedTask) {
        state.tasks.splice(state.deletedTask.index, 0, state.deletedTask.task);
        state.deletedTask = null;
        saveTasksToStorage(state.tasks);
      }
    },

    clearDeletedTask: (state) => {
      state.deletedTask = null;
    },

    editTask: (state, action) => {
      const { index, text } = action.payload;
      if (state.tasks[index]) {
        state.tasks[index].text = text;
        saveTasksToStorage(state.tasks);
      }
    },

    toggleComplete: (state, action) => {
      const index = action.payload;
      if (state.tasks[index]) {
        state.tasks[index].completed = !state.tasks[index].completed;
        saveTasksToStorage(state.tasks);
      }
    },

    updateTaskNotes: (state, action) => {
      const { index, notes } = action.payload;
      if (state.tasks[index]) {
        state.tasks[index].notes = notes;
        saveTasksToStorage(state.tasks);
      }
    },

    reorderTasks: (state, action) => {
      const { dragIndex, dropIndex } = action.payload;
      const draggedItem = state.tasks[dragIndex];
      state.tasks.splice(dragIndex, 1);
      state.tasks.splice(dropIndex, 0, draggedItem);
      saveTasksToStorage(state.tasks);
    },

    completeAll: (state) => {
      state.tasks.forEach(task => (task.completed = true));
      saveTasksToStorage(state.tasks);
    },

    deleteAll: (state) => {
      state.tasks = [];
      saveTasksToStorage(state.tasks);
    },

    setFilter: (state, action) => {
      state.filter = action.payload;
    },

    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    }
  }
});

export const {
  addTask,
  deleteTask,
  undoDelete,
  clearDeletedTask,
  editTask,
  toggleComplete,
  updateTaskNotes,
  reorderTasks,
  completeAll,
  deleteAll,
  setFilter,
  setSearchQuery
} = tasksSlice.actions;

// Selectors
export const selectAllTasks = (state) => state.tasks.tasks;

export const selectFilteredTasks = createSelector(
  (state) => state.tasks.tasks,
  (state) => state.tasks.filter,
  (state) => state.tasks.searchQuery,
  (tasks, filter, searchQuery) => {
    let filtered = tasks;

    if (filter === 'active') {
      filtered = filtered.filter((t) => !t.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter((t) => t.completed);
    }

    if (searchQuery) {
      filtered = filtered.filter((t) =>
        t.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }
);

// ✅ Memoized task statistics
export const selectTaskStats = createSelector(
  (state) => state.tasks.tasks,
  (tasks) => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, rate };
  }
);

export default tasksSlice.reducer;
