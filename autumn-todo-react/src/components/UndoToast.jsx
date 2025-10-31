import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { undoDelete } from '../redux/slices/tasksSlice';

function UndoToast() {
  const dispatch = useDispatch();
  const isVisible = useSelector(state => state.ui.undoToastVisible);

  if (!isVisible) return null;

  return (
    <div className="undo-toast show">
      <span>Task deleted</span>
      <button 
        className="undo-btn" 
        onClick={() => dispatch(undoDelete())}
      >
        Undo
      </button>
    </div>
  );
}

export default UndoToast;
