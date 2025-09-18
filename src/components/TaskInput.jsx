import { useState } from "react";
import { useDispatch } from "react-redux";
import { startNewTask } from "../store/slices/tasksSlice";

const TaskInput = () => {
  const [taskText, setTaskText] = useState("");
  const [duration, setDuration] = useState("25");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskText.trim() && duration) {
      dispatch(
        startNewTask({
          text: taskText.trim(),
          durationMinutes: parseInt(duration),
        })
      );
      setTaskText("");
      setDuration("25");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-base-200 rounded-box shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Start a New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">What would you like to focus on?</span>
          </label>
          <input
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="Enter your task..."
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Duration (in minutes)</span>
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Enter duration in minutes"
            className="input input-bordered w-full"
            min="1"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Start Task
        </button>
      </form>
    </div>
  );
};

export default TaskInput;
