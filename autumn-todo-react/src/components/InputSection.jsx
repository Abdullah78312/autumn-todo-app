import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../redux/slices/tasksSlice';
import { CATEGORIES, PRIORITIES } from '../utils/constants';

function InputSection() {
  const dispatch = useDispatch();
  const [taskText, setTaskText] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  const handleAddTask = () => {
    const text = taskText.trim();
    
    if (!text) {
      return;
    }

    if (text.length > 200) {
      alert('Task is too long! Please keep it under 200 characters.');
      return;
    }

    dispatch(addTask({
      text,
      category,
      priority,
      dueDate,
      notes: ''
    }));

    // Reset form
    setTaskText('');
    setCategory('');
    setPriority('medium');
    setDueDate('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  return (
    <div className="input-section">
      <div className="input-wrapper">
        <input
          type="text"
          className="task-input"
          id="taskInput"
          placeholder="Enter your task..."
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="add-btn" onClick={handleAddTask}>+</button>
      </div>
      
      <div className="task-options">
        <div className="option-group">
          <label className="option-label">Category</label>
          <select
            className="select-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="option-group">
          <label className="option-label">Priority</label>
          <select
            className="select-input"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            {PRIORITIES.map(pri => (
              <option key={pri.value} value={pri.value}>
                {pri.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="option-group">
          <label className="option-label">Due Date</label>
          <input
            type="date"
            className="date-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default InputSection;
