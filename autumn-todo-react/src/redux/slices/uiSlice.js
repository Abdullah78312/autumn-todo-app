import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    shortcutsModalOpen: false,
    notesModalOpen: false,
    currentEditingNotes: null,
    undoToastVisible: false
  },
  reducers: {
    openShortcutsModal: (state) => {
      state.shortcutsModalOpen = true;
    },
    
    closeShortcutsModal: (state) => {
      state.shortcutsModalOpen = false;
    },
    
    openNotesModal: (state, action) => {
      state.notesModalOpen = true;
      state.currentEditingNotes = action.payload;
    },
    
    closeNotesModal: (state) => {
      state.notesModalOpen = false;
      state.currentEditingNotes = null;
    },
    
    showUndoToast: (state) => {
      state.undoToastVisible = true;
    },
    
    hideUndoToast: (state) => {
      state.undoToastVisible = false;
    }
  }
});

export const {
  openShortcutsModal,
  closeShortcutsModal,
  openNotesModal,
  closeNotesModal,
  showUndoToast,
  hideUndoToast
} = uiSlice.actions;

export default uiSlice.reducer;