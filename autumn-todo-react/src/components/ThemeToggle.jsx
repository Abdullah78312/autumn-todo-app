import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { cycleTheme, selectTheme } from '../redux/slices/themeSlice';
import { THEMES } from '../utils/constants';

function ThemeToggle() {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  const getThemeLabel = () => {
    switch (theme) {
      case THEMES.LIGHT:
        return '🌙 Dark Mode';
      case THEMES.DARK:
        return '❄️ Winter Mode';
      case THEMES.WINTER:
        return '☀️ Light Mode';
      default:
        return '🌙 Dark Mode';
    }
  };

  return (
    <button 
      className="theme-toggle" 
      onClick={() => dispatch(cycleTheme())}
    >
      {getThemeLabel()}
    </button>
  );
}

export default ThemeToggle;