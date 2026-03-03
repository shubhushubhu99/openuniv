import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Activity,
  BarChart3,
  Clock,
  Crown,
  TrendingUp,
  Zap,
  Package,
  Users,
  GitBranch
} from "lucide-react";

const XP_PER_LEVEL = 100;

const StatCard = ({
  title,
  value,
  icon
}: {
  title: string;
  value: number | string;
  icon?: ReactNode;
}) => (
  <div className="dashboard-stat-card">
    <div className="dashboard-stat-header">
      {icon && <span className="dashboard-stat-icon-wrap">{icon}</span>}
      <p className="dashboard-stat-label">{title}</p>
    </div>
    <h2 className="dashboard-stat-value">{value}</h2>
  </div>
);

const DashboardHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost/openuniverse/backend/dashboard-data.php", {
        credentials: "include"
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setStats(data.data);
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleAddXp = async () => {
    await fetch("http://localhost/openuniverse/backend/add-xp.php", {
      method: "POST",
      credentials: "include"
    });
    fetchStats();
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "100px",
          textAlign: "center",
          color: "var(--text-muted)"
        }}
      >
        Loading OpenUniverse...
      </div>
    );
  }

  if (!stats) {
    return (
      <div
        style={{ padding: "100px", color: "var(--text-muted)" }}
      >
        Failed to load dashboard
      </div>
    );
  }

  const currentLevelXp = stats.xp % XP_PER_LEVEL;
  const xpToNext = XP_PER_LEVEL - currentLevelXp;
  const progress = (currentLevelXp / XP_PER_LEVEL) * 100;
  const isContributor = user?.role === "contributor";

  return (
    <>
      <h1
        style={{
          marginTop: 0,
          marginBottom: "1.5rem",
          fontSize: "1.8rem",
          fontWeight: 700
        }}
      >
        Welcome back, {stats.name} 👋
      </h1>

      {/* Role-specific Stats */}
      <div className="dashboard-stats-grid">
        {isContributor ? (
          <>
            <StatCard
              title="Level"
              value={stats.level}
              icon={<TrendingUp size={18} className="dashboard-stat-icon" />}
            />
            <StatCard
              title="Total Points"
              value={stats.xp}
              icon={<Zap size={18} className="dashboard-stat-icon" />}
            />
            <StatCard
              title="Rank"
              value={stats.rank || "N/A"}
              icon={<Crown size={18} className="dashboard-stat-icon" />}
            />
            <StatCard
              title="Active PRs"
              value={stats.active || 0}
              icon={<Activity size={18} className="dashboard-stat-icon" />}
            />
          </>
        ) : (
          <>
            <StatCard
              title="Total Projects"
              value={stats.projects || 0}
              icon={<Package size={18} className="dashboard-stat-icon" />}
            />
            <StatCard
              title="Total Contributors"
              value={stats.contributors || 0}
              icon={<Users size={18} className="dashboard-stat-icon" />}
            />
            <StatCard
              title="Admin Points"
              value={stats.admin_points || 0}
              icon={<Zap size={18} className="dashboard-stat-icon" />}
            />
            <StatCard
              title="Pending Reviews"
              value={stats.pending_prs || 0}
              icon={<GitBranch size={18} className="dashboard-stat-icon" />}
            />
          </>
        )}
      </div>

      {/* Contributor View */}
      {isContributor && (
        <>
          <div
            className="dashboard-card"
            style={{
              background: "var(--bg-overlay)",
              padding: "1.8rem",
              borderRadius: "var(--radius-lg)",
              marginBottom: "1.5rem",
              border: "var(--border-subtle)",
              backdropFilter: "blur(20px)"
            }}
          >
            <h3 className="dashboard-section-title">
              <BarChart3 size={18} className="dashboard-section-icon" />
              <span>Level Progress</span>
            </h3>
            <div
              style={{
                background: "var(--bg-layer-2)",
                height: "12px",
                borderRadius: "10px",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  background: "var(--color-accent)",
                  height: "100%",
                  transition: "width 0.6s ease"
                }}
              />
            </div>
            <p style={{ marginTop: "0.8rem", color: "var(--text-muted)" }}>
              {xpToNext} points to reach Level {stats.level + 1}
            </p>
            <button
              onClick={handleAddXp}
              style={{
                marginTop: "1.5rem",
                padding: "0.6rem 1.5rem",
                background: "var(--color-accent)",
                border: "none",
                borderRadius: "var(--radius-full)",
                cursor: "pointer",
                fontWeight: 600,
                color: "var(--bg-dark)"
              }}
            >
              +10 Points (Demo)
            </button>
          </div>

          <div
            className="dashboard-card"
            style={{
              background: "var(--bg-overlay)",
              padding: "1.8rem",
              borderRadius: "var(--radius-lg)",
              border: "var(--border-subtle)",
              backdropFilter: "blur(20px)"
            }}
          >
            <h3 className="dashboard-section-title">
              <Clock size={18} className="dashboard-section-icon" />
              <span>Quick Actions</span>
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
              <button
                style={{
                  padding: "1rem",
                  background: "rgba(93, 154, 158, 0.2)",
                  border: "1px solid rgba(93, 154, 158, 0.3)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  fontWeight: 500
                }}
              >
                📝 Submit PR
              </button>
              <button
                style={{
                  padding: "1rem",
                  background: "rgba(212, 168, 83, 0.2)",
                  border: "1px solid rgba(212, 168, 83, 0.3)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  fontWeight: 500
                }}
              >
                📚 View Docs
              </button>
            </div>
          </div>
        </>
      )}

      {/* Admin View */}
      {!isContributor && (
        <>
          <div
            className="dashboard-card"
            style={{
              background: "var(--bg-overlay)",
              padding: "1.8rem",
              borderRadius: "var(--radius-lg)",
              marginBottom: "1.5rem",
              border: "var(--border-subtle)",
              backdropFilter: "blur(20px)"
            }}
          >
            <h3 className="dashboard-section-title">
              <BarChart3 size={18} className="dashboard-section-icon" />
              <span>Admin Statistics</span>
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "1rem" }}>
              <div>
                <p style={{ margin: "0 0 0.5rem 0", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  Revenue from Contributors
                </p>
                <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "var(--color-accent)" }}>
                  +{Math.floor((stats.admin_points || 0) * 0.2)} points
                </p>
              </div>
              <div>
                <p style={{ margin: "0 0 0.5rem 0", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  Merged PRs
                </p>
                <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "var(--color-accent)" }}>
                  {stats.merged_prs || 0}
                </p>
              </div>
            </div>
          </div>

          <div
            className="dashboard-card"
            style={{
              background: "var(--bg-overlay)",
              padding: "1.8rem",
              borderRadius: "var(--radius-lg)",
              border: "var(--border-subtle)",
              backdropFilter: "blur(20px)"
            }}
          >
            <h3 className="dashboard-section-title">
              <Clock size={18} className="dashboard-section-icon" />
              <span>Quick Actions</span>
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
              <button
                style={{
                  padding: "1rem",
                  background: "rgba(93, 154, 158, 0.2)",
                  border: "1px solid rgba(93, 154, 158, 0.3)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  fontWeight: 500
                }}
              >
                ➕ Create Project
              </button>
              <button
                style={{
                  padding: "1rem",
                  background: "rgba(212, 168, 83, 0.2)",
                  border: "1px solid rgba(212, 168, 83, 0.3)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  fontWeight: 500
                }}
              >
                ✅ Review PRs
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DashboardHome;
