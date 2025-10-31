export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  WINTER: 'winter'
};

export const CATEGORIES = [
  { value: '', label: 'None' },
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'health', label: 'Health' },
  { value: 'finance', label: 'Finance' }
];

export const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

export const FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed'
};

export const LEAF_EMOJIS = ['🍂', '🍁', '🍃'];
export const SNOWFLAKE_EMOJIS = ['❄️', '⛄', '🌨️'];

export const SHORTCUTS = [
  { label: 'Add Task', key: 'Enter' },
  { label: 'Undo Delete', key: 'Ctrl + Z' },
  { label: 'Search Tasks', key: 'Ctrl + F' },
  { label: 'Toggle Theme', key: 'Ctrl + D' },
  { label: 'Complete All', key: 'Ctrl + Shift + C' },
  { label: 'Export Tasks', key: 'Ctrl + E' }
];