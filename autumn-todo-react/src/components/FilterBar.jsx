import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  setFilter, 
  setSearchQuery, 
  completeAll, 
  deleteAll 
} from '../redux/slices/tasksSlice';
import { FILTERS } from '../utils/constants';
import { exportToJSON, createConfetti } from '../utils/helpers';

function FilterBar() {
  const dispatch = useDispatch();
  const filter = useSelector(state => state.tasks.filter);
  const searchQuery = useSelector(state => state.tasks.searchQuery);
  const tasks = useSelector(state => state.tasks.tasks);

  const handleCompleteAll = () => {
    if (window.confirm('Mark all tasks as completed?')) {
      dispatch(completeAll());
      createConfetti(['#d68c45', '#f0b27a', '#8b4513', '#f5d5a8']);
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm('Delete all tasks? This cannot be undone.')) {
      dispatch(deleteAll());
    }
  };

  const handleExport = () => {
    const filename = `autumn-tasks-${new Date().toISOString().split('T')[0]}.json`;
    exportToJSON(tasks, filename);
  };

  return (
    <div className="filter-bar">
      <input
        type="text"
        className="search-box"
        id="searchBox"
        placeholder="🔍 Search tasks..."
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
      />
      
      <button
        className={`filter-btn ${filter === FILTERS.ALL ? 'active' : ''}`}
        onClick={() => dispatch(setFilter(FILTERS.ALL))}
      >
        All
      </button>
      
      <button
        className={`filter-btn ${filter === FILTERS.ACTIVE ? 'active' : ''}`}
        onClick={() => dispatch(setFilter(FILTERS.ACTIVE))}
      >
        Active
      </button>
      
      <button
        className={`filter-btn ${filter === FILTERS.COMPLETED ? 'active' : ''}`}
        onClick={() => dispatch(setFilter(FILTERS.COMPLETED))}
      >
        Completed
      </button>
      
      <div className="bulk-actions">
        <button className="bulk-btn" onClick={handleCompleteAll}>
          ✓ Complete All
        </button>
        <button className="bulk-btn" onClick={handleDeleteAll}>
          ✗ Delete All
        </button>
        <button className="bulk-btn" onClick={handleExport}>
          📥 Export
        </button>
      </div>
    </div>
  );
}

export default FilterBar;