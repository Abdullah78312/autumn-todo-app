import React from 'react';
import { useSelector } from 'react-redux';
import { selectFilteredTasks } from '../redux/slices/tasksSlice';
import TaskItem from './TaskItem';

function TasksList() {
  const filteredTasks = useSelector(selectFilteredTasks);
  const searchQuery = useSelector(state => state.tasks.searchQuery);

  if (filteredTasks.length === 0) {
    return (
      <div className="tasks-section">
        <div className="tasks-header">🍃 Your Tasks are here 🍃</div>
        <div className="empty-state">
          <div className="empty-icon">🍂</div>
          <div>
            No tasks found. {searchQuery ? 'Try a different search.' : 'Add one to get started!'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-section">
      <div className="tasks-header">🍃 Your Tasks are here 🍃</div>
      <div id="tasksList">
        {filteredTasks.map((task, displayIndex) => (
          <TaskItem 
            key={task.id} 
            task={task} 
            displayIndex={displayIndex}
          />
        ))}
      </div>
    </div>
  );
}

export default TasksList;
