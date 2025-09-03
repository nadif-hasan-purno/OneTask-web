import TaskStats from "../components/stats/TaskStats";

const Statistics = () => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary">
            Productivity Dashboard
          </h1>
          <p className="text-lg text-base-content/70">
            Track your focus and task completion metrics
          </p>
        </header>

        <TaskStats />
      </div>
    </div>
  );
};

export default Statistics;
