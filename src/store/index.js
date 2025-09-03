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
