import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeShortcutsModal } from '../redux/slices/uiSlice';
import { SHORTCUTS } from '../utils/constants';

function ShortcutsModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector(state => state.ui.shortcutsModalOpen);

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(closeShortcutsModal());
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
          <h3>⌨️ Keyboard Shortcuts</h3>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>
        {SHORTCUTS.map((shortcut, index) => (
          <div key={index} className="shortcut-item">
            <span>{shortcut.label}</span>
            <span className="shortcut-key">{shortcut.key}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShortcutsModal;