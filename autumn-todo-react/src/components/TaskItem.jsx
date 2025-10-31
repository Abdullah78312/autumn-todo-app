import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  deleteTask, 
  editTask, 
  toggleComplete, 
  reorderTasks,
  selectAllTasks 
} from '../redux/slices/tasksSlice';
import { openNotesModal } from '../redux/slices/uiSlice';
import { formatDate, createConfetti } from '../utils/helpers';

function TaskItem({ task, displayIndex }) {
  const dispatch = useDispatch();
  const allTasks = useSelector(selectAllTasks);
  const actualIndex = allTasks.findIndex(t => t.id === task.id);
  
  const [isDragging, setIsDragging] = useState(false);

  const handleDelete = () => {
    dispatch(deleteTask(actualIndex));
  };

  const handleEdit = () => {
    const newText = prompt('Edit task:', task.text);
    if (newText !== null && newText.trim()) {
      dispatch(editTask({ index: actualIndex, text: newText.trim() }));
    }
  };

  const handleToggle = () => {
    const wasCompleted = task.completed;
    dispatch(toggleComplete(actualIndex));
    
    // Show confetti when completing a task
    if (!wasCompleted) {
      createConfetti(['#d68c45', '#f0b27a', '#8b4513', '#f5d5a8']);
    }
  };

  const handleNotes = () => {
    dispatch(openNotesModal(actualIndex));
  };

  // Drag and Drop handlers
  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    // Store the actual index in dataTransfer
    e.dataTransfer.setData('text/plain', actualIndex.toString());
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const dropIndex = actualIndex;
    
    if (draggedIndex !== dropIndex && !isNaN(draggedIndex)) {
      dispatch(reorderTasks({ 
        dragIndex: draggedIndex, 
        dropIndex: dropIndex 
      }));
    }
    
    setIsDragging(false);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
  };

  const categoryTag = task.category ? (
    <span className={`task-tag tag-${task.category}`}>
      {task.category}
    </span>
  ) : null;

  const priorityBadge = (
    <span className={`priority-badge priority-${task.priority}`}>
      {task.priority}
    </span>
  );

  const dateInfo = task.dueDate ? formatDate(task.dueDate) : null;
  const dueDateElement = dateInfo ? (
    <span className={`due-date ${dateInfo.isOverdue ? 'overdue' : ''}`}>
      📅 {dateInfo.formattedDate}
      {dateInfo.isOverdue ? ' (Overdue)' : ''}
    </span>
  ) : null;

  const notesElement = task.notes ? (
    <div className="task-notes">📝 {task.notes}</div>
  ) : null;

  return (
    <div
      className={`task-item ${task.completed ? 'completed' : ''} priority-${task.priority} ${isDragging ? 'dragging' : ''}`}
      data-index={actualIndex}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
    >
      <div className="task-main">
        <input
          type="checkbox"
          className="checkbox"
          checked={task.completed}
          onChange={handleToggle}
        />
        <div className="task-content-wrapper">
          <div className="task-title-row">
            <span className="task-number">{displayIndex + 1}.</span>
            <span className="task-text">{task.text}</span>
          </div>
          <div className="task-tags">
            {categoryTag}
            {priorityBadge}
            {dueDateElement}
          </div>
          {notesElement}
        </div>
      </div>
      <div className="task-actions">
        <button className="action-btn edit-btn" onClick={handleEdit}>
          Edit
        </button>
        <button className="action-btn notes-btn" onClick={handleNotes}>
          Notes
        </button>
        <button className="action-btn delete-btn" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskItem;