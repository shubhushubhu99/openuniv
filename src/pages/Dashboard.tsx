import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Activity,
  BarChart3,
  Clock,
  Crown,
  LayoutDashboard,
  Medal,
  Target,
  TrendingUp,
  Trophy,
  User as UserIcon,
  Zap
} from "lucide-react";

const XP_PER_LEVEL = 100;

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost/openuniverse/backend/dashboard-data.php", {
        credentials: "include",
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

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const handleAddXp = async () => {
    await fetch("http://localhost/openuniverse/backend/add-xp.php", {
      method: "POST",
      credentials: "include",
    });
    fetchStats();
  };

  if (loading) {
    return (
      <div style={{ padding: "100px", textAlign: "center", color: "var(--text-muted)" }}>
        Loading OpenUniverse...
      </div>
    );
  }

  if (!stats) {
    return <div style={{ padding: "100px", color: "var(--text-muted)" }}>Failed to load dashboard</div>;
  }

  const currentLevelXp = stats.xp % XP_PER_LEVEL;
  const xpToNext = XP_PER_LEVEL - currentLevelXp;
  const progress = (currentLevelXp / XP_PER_LEVEL) * 100;

  const sidebarItems = [
    { key: "dashboard", label: "Dashboard", Icon: LayoutDashboard, active: true },
    { key: "missions", label: "Missions", Icon: Target, active: false },
    { key: "leaderboard", label: "Leaderboard", Icon: Trophy, active: false },
    { key: "achievements", label: "Achievements", Icon: Medal, active: false },
    { key: "profile", label: "Profile", Icon: UserIcon, active: false }
  ] as const;

  return (
    <div className="dashboard-page" style={{ minHeight: "100vh", background: "var(--bg-layer-1)", color: "var(--text-primary)" }}>
      {/* Mobile: sidebar toggle only (no duplicate brand title) */}
      <div className="dashboard-mobile-bar">
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            background: "var(--bg-overlay)",
            border: "var(--border-default)",
            padding: "6px 12px",
            borderRadius: "var(--radius-sm)",
            color: "var(--text-primary)",
            cursor: "pointer"
          }}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile: backdrop (closes sidebar on click) */}
      {sidebarOpen && (
        <div
          className="dashboard-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close menu"
        />
      )}

      <div className="dashboard-body">
        {/* Sidebar: overlay on mobile, in-flow on desktop */}
        <div
          className={`dashboard-sidebar ${sidebarOpen ? "dashboard-sidebar--open" : ""}`}
        >
          <nav className="dashboard-sidebar-nav" aria-label="Dashboard navigation">
            {sidebarItems.map(({ key, label, Icon, active }) => (
              <button
                key={key}
                type="button"
                className={`dashboard-sidebar-item ${
                  active ? "dashboard-sidebar-item--active" : ""
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={18} className="dashboard-sidebar-item-icon" />
                <span className="dashboard-sidebar-item-label">{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
          <h1 style={{ marginTop: 0, marginBottom: "1.5rem", fontSize: "1.8rem", fontWeight: 700 }}>
            Welcome back, {stats.name} 👋
          </h1>

          {/* Stats Grid */}
          <div className="dashboard-stats-grid">
            <StatCard
              title="Level"
              value={stats.level}
              icon={<TrendingUp size={18} className="dashboard-stat-icon" />}
            />
            <StatCard
              title="Total XP"
              value={stats.xp}
              icon={<Zap size={18} className="dashboard-stat-icon" />}
            />
            <StatCard
              title="Rank"
              value={stats.rank || "N/A"}
              icon={<Crown size={18} className="dashboard-stat-icon" />}
            />
            <StatCard
              title="Active Missions"
              value={stats.active || 0}
              icon={<Activity size={18} className="dashboard-stat-icon" />}
            />
          </div>

          {/* Progress Card */}
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
              {xpToNext} XP to reach Level {stats.level + 1}
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
              +10 XP
            </button>
          </div>

          {/* Activity */}
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
              <span>Recent Activity</span>
            </h3>
            <p style={{ marginTop: "1rem", color: "var(--text-muted)" }}>
              You earned XP from completing a mission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

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

export default Dashboard;