import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './slices/tasksSlice';
import themeReducer from './slices/themeSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    theme: themeReducer,
    ui: uiReducer
  }
});