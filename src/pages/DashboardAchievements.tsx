import { Medal } from "lucide-react";

const DashboardAchievements = () => (
  <div className="dashboard-placeholder">
    <h1 style={{ marginTop: 0, marginBottom: "1rem", fontSize: "1.8rem", fontWeight: 700 }}>
      Achievements
    </h1>
    <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
      Unlock badges and celebrate your milestones.
    </p>
    <div
      className="dashboard-card"
      style={{
        background: "var(--bg-overlay)",
        padding: "2rem",
        borderRadius: "var(--radius-lg)",
        border: "var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem"
      }}
    >
      <Medal size={48} style={{ color: "var(--color-accent)", opacity: 0.8 }} />
      <p style={{ color: "var(--text-secondary)" }}>
        Your achievements and badges will appear here.
      </p>
    </div>
  </div>
);

export default DashboardAchievements;
