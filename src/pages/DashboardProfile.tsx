import { User as UserIcon } from "lucide-react";

const DashboardProfile = () => (
  <div className="dashboard-placeholder">
    <h1 style={{ marginTop: 0, marginBottom: "1rem", fontSize: "1.8rem", fontWeight: 700 }}>
      Profile
    </h1>
    <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
      Manage your account and preferences.
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
      <UserIcon size={48} style={{ color: "var(--color-accent)", opacity: 0.8 }} />
      <p style={{ color: "var(--text-secondary)" }}>
        Profile settings and stats will appear here.
      </p>
    </div>
  </div>
);

export default DashboardProfile;
