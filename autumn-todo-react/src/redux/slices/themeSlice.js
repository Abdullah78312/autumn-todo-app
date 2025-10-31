import { createSlice } from '@reduxjs/toolkit';
import { THEMES } from '../../utils/constants';

const loadThemeFromStorage = () => {
  try {
    const saved = localStorage.getItem('theme');
    return saved || THEMES.LIGHT;
  } catch (error) {
    return THEMES.LIGHT;
  }
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    current: loadThemeFromStorage()
  },
  reducers: {
    cycleTheme: (state) => {
      const themes = [THEMES.LIGHT, THEMES.DARK, THEMES.WINTER];
      const currentIndex = themes.indexOf(state.current);
      state.current = themes[(currentIndex + 1) % themes.length];
      localStorage.setItem('theme', state.current);
    },
    
    setTheme: (state, action) => {
      state.current = action.payload;
      localStorage.setItem('theme', state.current);
    }
  }
});

export const { cycleTheme, setTheme } = themeSlice.actions;
export const selectTheme = (state) => state.theme.current;
export default themeSlice.reducer;