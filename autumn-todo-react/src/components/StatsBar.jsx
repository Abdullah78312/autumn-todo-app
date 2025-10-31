import React from 'react';
import { useSelector } from 'react-redux';
import { selectTaskStats } from '../redux/slices/tasksSlice';

function StatsBar() {
  const { total, completed, pending, rate } = useSelector(selectTaskStats);

  return (
    <div className="stats-bar">
      <div className="stat-item">
        <span className="stat-value">{total}</span>
        <span className="stat-label">Total Tasks</span>
      </div>
      <div className="stat-item">
        <span className="stat-value">{completed}</span>
        <span className="stat-label">Completed</span>
      </div>
      <div className="stat-item">
        <span className="stat-value">{pending}</span>
        <span className="stat-label">Pending</span>
      </div>
      <div className="stat-item">
        <span className="stat-value">{rate}%</span>
        <span className="stat-label">Completion Rate</span>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${rate}%` }}
        ></div>
      </div>
    </div>
  );
}

export default StatsBar;