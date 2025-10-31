# 🍂 Autumn Breeze - TodoList Pro

A beautiful, feature-rich todo list application built with React and Redux Toolkit. Manage your tasks with style across three stunning themes: Autumn Light, Dark Mode, and Winter Wonderland.

## ✨ Features

### 🎯 Core Functionality
- ✅ Create, edit, and delete tasks
- 📝 Add detailed notes to tasks
- ✔️ Mark tasks as complete/incomplete
- 🔄 Drag and drop to reorder tasks
- 💾 Auto-save to localStorage

### 🎨 Organization
- 🏷️ 5 color-coded categories (Work, Personal, Urgent, Health, Finance)
- 🎯 3 priority levels (High, Medium, Low)
- 📅 Due dates with overdue indicators
- 🔍 Real-time search
- 🎛️ Filter by status (All, Active, Completed)

### 📊 Statistics & Insights
- 📈 Live progress tracking
- 📊 Completion rate
- 📉 Task counters (Total, Completed, Pending)
- 🎨 Visual progress bar

### 🎭 Themes
- ☀️ **Light Mode** - Warm autumn colors
- 🌙 **Dark Mode** - Cozy evening vibes
- ❄️ **Winter Mode** - Cool winter wonderland

### 🚀 Advanced Features
- ⌨️ Keyboard shortcuts
- ↩️ Undo delete (Ctrl+Z)
- 📥 Export tasks to JSON
- ✅ Bulk complete all tasks
- 🗑️ Bulk delete all tasks
- 🎉 Confetti celebration on completion
- 🍂 Animated falling leaves/snowflakes

### ⌨️ Keyboard Shortcuts
- `Enter` - Add task
- `Ctrl + Z` - Undo delete
- `Ctrl + D` - Cycle theme
- `Ctrl + F` - Focus search
- `Ctrl + Shift + C` - Complete all tasks
- `Ctrl + E` - Export tasks

## 🛠️ Technologies

- **React 18** - UI library
- **Redux Toolkit** - State management
- **CSS3** - Styling with animations
- **localStorage** - Data persistence

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Steps

1. **Clone or create the project**
```bash
npx create-react-app autumn-todo-react
cd autumn-todo-react
```

2. **Install dependencies**
```bash
npm install @reduxjs/toolkit react-redux
```

3. **Copy all the source files** to their respective directories as shown in the project structure.

4. **Start the development server**
```bash
npm start
```

5. **Open your browser**
Navigate to `http://localhost:3000`

## 📁 Project Structure
```
autumn-todo-react/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── StatsBar.jsx
│   │   ├── InputSection.jsx
│   │   ├── FilterBar.jsx
│   │   ├── TasksList.jsx
│   │   ├── TaskItem.jsx
│   │   ├── ThemeToggle.jsx
│   │   ├── ShortcutsButton.jsx
│   │   ├── UndoToast.jsx
│   │   ├── ShortcutsModal.jsx
│   │   └── NotesModal.jsx
│   ├── redux/
│   │   ├── store.js
│   │   └── slices/
│   │       ├── tasksSlice.js
│   │       ├── themeSlice.js
│   │       └── uiSlice.js
│   ├── styles/
│   │   ├── App.css
│   │   └── themes.css
│   ├── utils/
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── App.jsx
│   ├── index.js
│   └── index.css
└── package.json
```

## 🎮 Usage

### Adding a Task
1. Type your task in the input field
2. Select a category (optional)
3. Choose a priority level
4. Set a due date (optional)
5. Press Enter or click the + button

### Managing Tasks
- **Complete**: Click the checkbox
- **Edit**: Click the "Edit" button
- **Add Notes**: Click the "Notes" button
- **Delete**: Click the "Delete" button
- **Reorder**: Drag and drop tasks

### Filtering & Search
- Use the search box to find specific tasks
- Click filter buttons to view All/Active/Completed tasks
- Use bulk actions to complete or delete all tasks at once

### Themes
- Click the theme toggle button (bottom left)
- Cycles through: Light → Dark → Winter → Light

### Keyboard Shortcuts
- Press the ⌨️ button (bottom right) to view all shortcuts

## 🏗️ Redux Store Structure

### State Shape
```javascript
{
  tasks: {
    tasks: [],
    filter: 'all',
    searchQuery: '',
    deletedTask: null
  },
  theme: {
    current: 'light'
  },
  ui: {
    shortcutsModalOpen: false,
    notesModalOpen: false,
    currentEditingNotes: null,
    undoToastVisible: false
  }
}
```

## 🎨 Customization

### Adding New Categories
Edit `src/utils/constants.js`:
```javascript
export const CATEGORIES = [
  // ... existing categories
  { value: 'shopping', label: 'Shopping' }
];
```

Then add CSS in `src/styles/App.css`:
```css
.tag-shopping { 
  background: #e1f5fe; 
  color: #0277bd; 
}
```

### Creating New Themes
Add theme styles in `src/styles/themes.css`:
```css
body.spring-mode {
  background: linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 50%, #81c784 100%);
}
/* Add other spring-mode styles... */
```

## 📱 Responsive Design

The app is fully responsive and works seamlessly on:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)

## 🐛 Known Issues

- None at the moment! 🎉

## 🚀 Future Enhancements

- [ ] Cloud sync across devices
- [ ] Task sharing via link
- [ ] Recurring tasks
- [ ] Subtasks/checklists
- [ ] More theme options
- [ ] Custom backgrounds
- [ ] Task reminders/notifications
- [ ] CSV/PDF export options

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Abdullah Malik**
- Created with ❤️ and ☕

## 🙏 Acknowledgments

- Inspired by beautiful autumn aesthetics
- Built with modern React best practices
- Redux Toolkit for elegant state management

---

**Enjoy organizing your tasks with Autumn Breeze! 🍂✨**
