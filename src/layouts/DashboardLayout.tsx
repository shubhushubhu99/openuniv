import { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Target,
  Trophy,
  Medal,
  User as UserIcon,
  GitBranch,
  Package
} from "lucide-react";

const sidebarItemsBase = [
  { key: "dashboard", label: "Dashboard", Icon: LayoutDashboard, to: "/my-space" },
  { key: "leaderboard", label: "Leaderboard", Icon: Trophy, to: "/my-space/leaderboard" },
  { key: "profile", label: "Profile", Icon: UserIcon, to: "/my-space/profile" }
];

const contributorItems = [
  { key: "missions", label: "Missions", Icon: Target, to: "/my-space/missions" },
  { key: "pull-requests", label: "Pull Requests", Icon: GitBranch, to: "/my-space/pull-requests" },
  { key: "achievements", label: "Achievements", Icon: Medal, to: "/my-space/achievements" }
];

const adminItems = [
  { key: "projects", label: "Projects", Icon: Package, to: "/my-space/projects" },
  { key: "pull-requests", label: "PR Reviews", Icon: GitBranch, to: "/my-space/pull-requests" },
];

const DashboardLayout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarItems = [
    ...sidebarItemsBase,
    ...(user?.role === "contributor" ? contributorItems : adminItems)
  ];

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div
      className="dashboard-page"
      style={{
        minHeight: "100vh",
        background: "var(--bg-layer-1)",
        color: "var(--text-primary)"
      }}
    >
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
        <div
          className={`dashboard-sidebar ${sidebarOpen ? "dashboard-sidebar--open" : ""}`}
        >
          <nav className="dashboard-sidebar-nav" aria-label="Dashboard navigation">
            {sidebarItems.map(({ key, label, Icon, to }) => (
              <NavLink
                key={key}
                to={to}
                end={to === "/my-space"}
                className={({ isActive }) =>
                  isActive ? "sidebar-link active" : "sidebar-link"
                }
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={18} className="sidebar-link-icon" aria-hidden />
                <span className="sidebar-link-label">{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="dashboard-main">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
