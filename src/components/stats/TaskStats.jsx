import { useSelector } from "react-redux";

const TaskStats = () => {
  const { completedTasks } = useSelector((state) => state.tasks);

  // Calculate statistics
  const calculateStats = () => {
    const stats = {
      totalTasks: completedTasks.length,
      totalTime: 0,
      completedEarly: 0,
      averageDuration: 0,
      tasksPerDay: {},
      completionRate: 0,
    };

    completedTasks.forEach((task) => {
      // Calculate actual duration in minutes
      const actualDuration = Math.floor(
        (task.endTime - task.startTime) / 1000 / 60
      );
      const plannedDuration = Math.floor(task.duration / 60);

      // Add to total time (in minutes)
      stats.totalTime += actualDuration;

      // Check if completed early
      if (actualDuration < plannedDuration) {
        stats.completedEarly++;
      }

      // Group by date for daily stats
      const date = new Date(task.startTime).toLocaleDateString();
      stats.tasksPerDay[date] = (stats.tasksPerDay[date] || 0) + 1;
    });

    // Calculate average duration if there are tasks
    if (stats.totalTasks > 0) {
      stats.averageDuration = Math.round(stats.totalTime / stats.totalTasks);
    }

    return stats;
  };

  const stats = calculateStats();

  // Get the dates with most and least tasks
  const getMostProductiveDay = () => {
    const days = Object.entries(stats.tasksPerDay);
    if (days.length === 0) return null;
    return days.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
  };

  const mostProductiveDay = getMostProductiveDay();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Overall Stats Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Overall Statistics</h2>
          <div className="stats stats-vertical shadow">
            <div className="stat">
              <div className="stat-title">Total Tasks</div>
              <div className="stat-value">{stats.totalTasks}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Total Time</div>
              <div className="stat-value">
                {Math.floor(stats.totalTime / 60)}h {stats.totalTime % 60}m
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Completed Early</div>
              <div className="stat-value text-success">
                {stats.completedEarly}
              </div>
              <div className="stat-desc">
                {stats.totalTasks > 0
                  ? `${Math.round(
                      (stats.completedEarly / stats.totalTasks) * 100
                    )}% of tasks`
                  : "No tasks yet"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time Management Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Time Management</h2>
          <div className="stats stats-vertical shadow">
            <div className="stat">
              <div className="stat-title">Average Duration</div>
              <div className="stat-value">{stats.averageDuration} minutes</div>
            </div>
            {mostProductiveDay && (
              <div className="stat">
                <div className="stat-title">Most Productive Day</div>
                <div className="stat-value text-primary">
                  {stats.tasksPerDay[mostProductiveDay]} tasks
                </div>
                <div className="stat-desc">{mostProductiveDay}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Daily Progress Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Last 7 Days</h2>
          <div className="h-48 overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Tasks</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats.tasksPerDay)
                  .sort((a, b) => new Date(b[0]) - new Date(a[0]))
                  .slice(0, 7)
                  .map(([date, count]) => (
                    <tr key={date}>
                      <td>{date}</td>
                      <td>{count}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskStats;
