import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeNotesModal } from '../redux/slices/uiSlice';
import { updateTaskNotes, selectAllTasks } from '../redux/slices/tasksSlice';

function NotesModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector(state => state.ui.notesModalOpen);
  const editingIndex = useSelector(state => state.ui.currentEditingNotes);
  const tasks = useSelector(selectAllTasks);
  
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen && editingIndex !== null && tasks[editingIndex]) {
      setNotes(tasks[editingIndex].notes || '');
    }
  }, [isOpen, editingIndex, tasks]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (editingIndex !== null) {
      dispatch(updateTaskNotes({ 
        index: editingIndex, 
        notes: notes.trim() 
      }));
    }
    handleClose();
  };

  const handleClose = () => {
    dispatch(closeNotesModal());
    setNotes('');
  };

  const handleOverlayClick = (e) => {
    if (e.target.className.includes('modal-overlay')) {
      handleClose();
    }
  };

  return (
    <div 
      className="modal-overlay show" 
      onClick={handleOverlayClick}
    >
      <div className="modal">
        <div className="modal-header">
          <h3>📝 Add Notes</h3>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{
            width: '100%',
            minHeight: '120px',
            padding: '12px',
            border: '2px solid #d68c45',
            borderRadius: '10px',
            fontSize: '0.95rem',
            resize: 'vertical',
            outline: 'none',
            fontFamily: 'inherit'
          }}
          placeholder="Add detailed notes for this task..."
        />
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginTop: '15px', 
          justifyContent: 'flex-end' 
        }}>
          <button 
            className="action-btn" 
            onClick={handleClose}
            style={{ background: '#95a5a6' }}
          >
            Cancel
          </button>
          <button 
            className="action-btn" 
            onClick={handleSave}
            style={{ background: '#27ae60' }}
          >
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotesModal;