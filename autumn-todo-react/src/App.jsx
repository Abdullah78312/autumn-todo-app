import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectTheme } from './redux/slices/themeSlice';
import { selectTaskStats, undoDelete, clearDeletedTask } from './redux/slices/tasksSlice';
import { hideUndoToast, showUndoToast } from './redux/slices/uiSlice';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import InputSection from './components/InputSection';
import FilterBar from './components/FilterBar';
import TasksList from './components/TasksList';
import ThemeToggle from './components/ThemeToggle';
import ShortcutsButton from './components/ShortcutsButton';
import UndoToast from './components/UndoToast';
import ShortcutsModal from './components/ShortcutsModal';
import NotesModal from './components/NotesModal';
import { LEAF_EMOJIS, SNOWFLAKE_EMOJIS } from './utils/constants';
import { randomRange, randomItem } from './utils/helpers';
import { Helmet } from 'react-helmet-async';
import './styles/App.css';
import './styles/themes.css';

function App() {
  const theme = useSelector(selectTheme);
  const dispatch = useDispatch();
  const deletedTask = useSelector(state => state.tasks.deletedTask);
  const taskStats = useSelector(selectTaskStats);

  // Apply theme to body
  useEffect(() => {
    document.body.className = theme === 'light' ? '' : `${theme}-mode`;
  }, [theme]);

  // Handle undo toast
  useEffect(() => {
    if (deletedTask) {
      dispatch(showUndoToast());
      const timeout = setTimeout(() => {
        dispatch(hideUndoToast());
        dispatch(clearDeletedTask());
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [deletedTask, dispatch]);

  // Create falling leaves/snowflakes
  useEffect(() => {
    const emojis = theme === 'winter' ? SNOWFLAKE_EMOJIS : LEAF_EMOJIS;
    const numberOfItems = 15;
    const container = document.getElementById('leaves-container');

    if (!container) return;

    container.innerHTML = '';

    for (let i = 0; i < numberOfItems; i++) {
      const item = document.createElement('div');
      item.className = 'leaf';
      item.textContent = randomItem(emojis);
      item.style.left = `${randomRange(0, 100)}%`;
      item.style.animationDelay = `${randomRange(0, 5)}s`;
      item.style.animationDuration = `${randomRange(10, 20)}s`;
      container.appendChild(item);
    }
  }, [theme]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e) => {
      // Ctrl + Z: Undo
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        dispatch(undoDelete());
      }

      // Ctrl + D: Toggle Theme
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        // Theme toggle is handled by ThemeToggle component
      }

      // Ctrl + F: Focus Search
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        document.getElementById('searchBox')?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, [dispatch]);

  return (
    <div className="app">
      {/* ✅ Fixed Helmet — ensures string-only content */}
      <Helmet>
        <title>{`Autumn Breeze Todo List - ${taskStats?.total ?? 0} Tasks`}</title>
        <meta
          name="description"
          content={`Manage your ${taskStats?.total ?? 0} tasks with beautiful themes and powerful features.`}
        />
      </Helmet>

      <div id="leaves-container"></div>

      <div className="container">
        <Header />
        <StatsBar />
        <InputSection />
        <FilterBar />
        <TasksList />
        <div className="footer">Abdullah's Creation 👨🏻‍💻</div>
      </div>

      <ThemeToggle />
      <ShortcutsButton />
      <UndoToast />
      <ShortcutsModal />
      <NotesModal />
    </div>
  );
}

export default App;
