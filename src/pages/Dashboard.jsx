import { useSelector } from "react-redux";
import Timer from "../components/Timer";
import TaskInput from "../components/TaskInput";
import CompletedList from "../components/CompletedList";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useLocalStorage } from "../hooks/useLocalStorage";

const Dashboard = () => {
  useLocalStorage(); // Initialize localStorage
  const { activeTask, isLoading } = useSelector((state) => state.tasks);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary">OneTask</h1>
          <p className="text-lg text-base-content/70">
            Focus on one task at a time
          </p>
        </header>

        <main className="bg-base-100 rounded-box shadow-xl p-6">
          {activeTask ? <Timer task={activeTask} /> : <TaskInput />}
          <CompletedList />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
