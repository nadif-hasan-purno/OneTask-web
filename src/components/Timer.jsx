import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { completeTask } from "../store/slices/tasksSlice";
import notificationSound from '../assets/notification.mp3';

const Timer = ({ task }) => {
  const [endTime, setEndTime] = useState(Date.now() + task.duration * 1000);
  const [timeLeft, setTimeLeft] = useState(task.duration);
  const [progress, setProgress] = useState(100);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const audioRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    audioRef.current = new Audio(notificationSound);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = Math.round((endTime - Date.now()) / 1000);
      if (newTimeLeft <= 0) {
        setTimeLeft(0);
        setProgress(0);
        const audio = audioRef.current;
        if (audio) {
          audio.loop = true;
          audio.play();
        }
        setIsSoundPlaying(true);
        clearInterval(timer);
      } else {
        setTimeLeft(newTimeLeft);
        setProgress((newTimeLeft / task.duration) * 100);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [endTime, task.duration]);

  const stopSoundAndCompleteTask = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsSoundPlaying(false);
    dispatch(completeTask({ endTime }));
  };

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

      {!isSoundPlaying ? (
        <button
          onClick={() => dispatch(completeTask())}
          className="btn btn-secondary mt-6"
        >
          Complete Task Early
        </button>
      ) : (
        <button
          onClick={stopSoundAndCompleteTask}
          className="btn btn-error mt-4"
        >
          Stop Sound and Finish
        </button>
      )}
    </div>
  );
};

export default Timer;