import React from 'react';
import { useDispatch } from 'react-redux';
import { openShortcutsModal } from '../redux/slices/uiSlice';

function ShortcutsButton() {
  const dispatch = useDispatch();

  return (
    <button 
      className="shortcuts-btn"     
      onClick={() => dispatch(openShortcutsModal())}
    >
      ⌨️
    </button>
  );
}

export default ShortcutsButton;