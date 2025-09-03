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
      if (state.activeTask) {
        // If there's an active task, move it to completed tasks
        const completedTask = {
          ...state.activeTask,
          endTime: Date.now(),
          status: "completed",
        };
        state.completedTasks.unshift(completedTask);
      }
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
