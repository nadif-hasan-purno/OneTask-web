import { useSelector, useDispatch } from "react-redux";
import { clearCompletedTasks } from "../store/slices/tasksSlice";

const CompletedList = () => {
  const { completedTasks } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  if (completedTasks.length === 0) {
    return null;
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDuration = (startTime, endTime) => {
    const duration = Math.floor((endTime - startTime) / 1000); // in seconds
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Completed Tasks</h2>
        <button
          onClick={() => dispatch(clearCompletedTasks())}
          className="btn btn-ghost btn-sm"
        >
          Clear History
        </button>
      </div>

      <div className="space-y-4">
        {completedTasks.map((task) => (
          <div
            key={task.id}
            className="bg-base-200 p-4 rounded-box shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-medium">{task.text}</h3>
              <p className="text-sm opacity-70">
                Completed at {formatDate(task.endTime)}
              </p>
            </div>
            <div className="badge badge-primary">
              {formatDuration(task.startTime, task.endTime)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedList;
