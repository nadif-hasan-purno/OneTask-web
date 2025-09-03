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
