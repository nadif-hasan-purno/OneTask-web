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
      setProgress((prev) => (timeLeft / task.duration) * 100);
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
            strokeDasharray={`${2 * Math.PI * 45}%`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}%`}
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
