export function StatsBar({ stats, loading }) {
  return (
    <div className="stats-bar">
      <div className="stat-card">
        <span className="stat-label">Open</span>
        <span className="stat-value open">
          {loading ? "—" : stats?.open ?? 0}
        </span>
      </div>
      <div className="stat-card">
        <span className="stat-label">In Progress</span>
        <span className="stat-value progress">
          {loading ? "—" : stats?.in_progress ?? 0}
        </span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Close</span>
        <span className="stat-value closed">
          {loading ? "—" : stats?.closed ?? 0}
        </span>
      </div>
    </div>
  );
}
