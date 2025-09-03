# Copilot Instructions: Focused Task Timer App (Frontend-Only with Redux Toolkit)

## 🎯 Project Goal

Create a **frontend-only**, single-task productivity application using React with Redux Toolkit for state management. The app will enforce focus by allowing users to work on only one task at a time with a timer. All task data will be saved in the browser's **Local Storage**.

## 🛠️ Tech Stack

- **Frontend**: React (Vite) - Already Set Up ✅
- **Styling**: Tailwind CSS + DaisyUI - Already Set Up ✅
- **State Management**: Redux Toolkit with persistence
- **Storage**: Browser's **Local Storage API**

---

### 🚀 Step-by-Step Implementation Guide

#### 1. Project Structure Enhancement

Create the following folder structure to organize your components:

```
/src
|-- /components          # Reusable UI components
|   |-- /ui             # Basic UI components (Button, Modal, Card)
|   |-- Timer.jsx       # Timer component with circular progress
|   |-- TaskInput.jsx   # Task creation form
|   |-- CompletedList.jsx # List of completed tasks
|-- /store              # Redux store configuration
|   |-- index.js        # Store setup
|   |-- /slices         # Redux slices
|   |   |-- tasksSlice.js # Tasks management slice
|-- /utils              # Utility functions
|   |-- storage.js      # LocalStorage helpers
|-- /hooks              # Custom hooks
|   |-- useLocalStorage.js # Local storage hook
|-- /pages              # Page components
|   |-- Dashboard.jsx   # Main application page
|-- App.jsx
|-- main.jsx
```

#### 2. Install Redux Toolkit

```bash
npm install @reduxjs/toolkit react-redux
```

#### 3. Local Storage Utilities

```javascript
// src/utils/storage.js
export const loadState = (key) => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Error loading state from localStorage:", err);
    return undefined;
  }
};

export const saveState = (key, state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch (err) {
    console.error("Error saving state to localStorage:", err);
  }
};

export const clearState = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error("Error clearing state from localStorage:", err);
  }
};
```

#### 4. Redux Tasks Slice

```javascript
// src/store/slices/tasksSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  activeTask: null,
  completedTasks: [],
  isLoading: true,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    startNewTask: (state, action) => {
      const { text, durationMinutes } = action.payload;
      state.activeTask = {
        id: uuidv4(),
        text,
        duration: durationMinutes * 60,
        startTime: Date.now(),
        status: "active",
      };
    },
    completeTask: (state) => {
      if (state.activeTask) {
        const completedTask = {
          ...state.activeTask,
          endTime: Date.now(),
          status: "completed",
        };
        state.completedTasks.unshift(completedTask);
        state.activeTask = null;
      }
    },
    clearCompletedTasks: (state) => {
      state.completedTasks = [];
    },
    setTasksState: (state, action) => {
      return { ...state, ...action.payload, isLoading: false };
    },
  },
});

export const {
  setLoading,
  startNewTask,
  completeTask,
  clearCompletedTasks,
  setTasksState,
} = tasksSlice.actions;

export default tasksSlice.reducer;
```

#### 5. Store Configuration with Persistence

```javascript
// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./slices/tasksSlice";
import { loadState, saveState } from "../utils/storage";

const preloadedState = {
  tasks: loadState("focused_tasks_data") || {
    activeTask: null,
    completedTasks: [],
    isLoading: true,
  },
};

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
  preloadedState,
});

// Subscribe to store changes to save to localStorage
store.subscribe(() => {
  const state = store.getState();
  saveState("focused_tasks_data", state.tasks);
});

export default store;
```

#### 6. Custom Hook for Local Storage (Optional)

```javascript
// src/hooks/useLocalStorage.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTasksState } from "../store/slices/tasksSlice";
import { loadState } from "../utils/storage";

export const useLocalStorage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Load initial state from localStorage
    const savedState = loadState("focused_tasks_data");
    if (savedState) {
      dispatch(setTasksState(savedState));
    } else {
      dispatch(
        setTasksState({
          activeTask: null,
          completedTasks: [],
          isLoading: false,
        })
      );
    }
  }, [dispatch]);
};
```

#### 7. Updated Dashboard Component

```javascript
// src/pages/Dashboard.jsx
import { useSelector, useDispatch } from "react-redux";
import Timer from "../components/Timer";
import TaskInput from "../components/TaskInput";
import CompletedList from "../components/CompletedList";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useLocalStorage } from "../hooks/useLocalStorage";

const Dashboard = () => {
  useLocalStorage(); // Initialize localStorage
  const { activeTask, isLoading } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary">
            Focused Task Timer
          </h1>
          <p className="text-lg text-base-content/70">One task at a time</p>
        </header>

        <main className="bg-base-100 rounded-box shadow-xl p-6">
          {activeTask ? <Timer task={activeTask} /> : <TaskInput />}

          <div className="divider"></div>

          <CompletedList />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
```

#### 8. Updated Timer Component

```javascript
// src/components/Timer.jsx
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { completeTask } from "../store/slices/tasksSlice";

const Timer = ({ task }) => {
  const [timeLeft, setTimeLeft] = useState(task.duration);
  const [progress, setProgress] = useState(100);
  const dispatch = useDispatch();

  useEffect(() => {
    if (timeLeft <= 0) {
      dispatch(completeTask());
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
      setProgress((timeLeft / task.duration) * 100);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, task.duration, dispatch]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="text-2xl font-semibold mb-4">{task.text}</div>

      <div className="relative w-64 h-64">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold">{formatTime(timeLeft)}</span>
        </div>

        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className="text-base-200"
          />

          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className="text-primary transition-all duration-1000"
            strokeDasharray={2 * Math.PI * 45}
            strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
          />
        </svg>
      </div>

      <button
        onClick={() => dispatch(completeTask())}
        className="btn btn-secondary mt-6"
      >
        Complete Task Early
      </button>
    </div>
  );
};

export default Timer;
```

#### 9. Update App.jsx

```javascript
// src/App.jsx
import { Provider } from "react-redux";
import store from "./store";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Provider store={store}>
      <Dashboard />
    </Provider>
  );
}

export default App;
```

#### 10. Final Polish

- Use DaisyUI components for consistent styling
- Implement smooth transitions and animations
- Add responsive design considerations
- Create a clean, minimalistic interface with a calming color palette
- Add error boundaries for better error handling
- Implement proper loading states throughout the application

---

**Next Steps:**

1. Create the TaskInput component with a form to capture task details
2. Implement the CompletedList component to show history
3. Add additional utility functions as needed
4. Create additional UI components (buttons, modals, cards)
5. Add sound notifications for timer completion
6. Implement pause/resume functionality for the timer

Remember to use your existing Tailwind CSS and DaisyUI setup to maintain visual consistency throughout the application.
