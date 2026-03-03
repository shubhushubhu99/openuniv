import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "6rem 2rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start"
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "100%",
          maxWidth: "600px",
          background: "var(--bg-overlay)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "var(--radius-xl)",
          padding: "3rem",
          border: "var(--border-subtle)",
          boxShadow: "var(--shadow-card)"
        }}
      >
        {/* Avatar */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "2rem"
          }}
        >
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background: "var(--color-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              fontWeight: 700,
              color: "var(--bg-dark)",
              marginBottom: "1rem"
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>

          <h2 style={{ marginBottom: "0.3rem", color: "var(--text-primary)" }}>{user.name}</h2>
          <p style={{ color: "var(--text-muted)" }}>{user.email}</p>
        </div>

        {/* Info Section */}
        <div style={{ display: "grid", gap: "1.2rem" }}>
          <InfoRow label="Department" value={user.department} />
          <InfoRow label="Year" value={user.year} />
          <InfoRow label="XP" value={`${user.xp} XP`} />
          <InfoRow label="Level" value={`Level ${user.level}`} />
        </div>
      </motion.div>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "0.8rem 1rem",
      background: "var(--bg-overlay-strong)",
      borderRadius: "var(--radius-md)",
      border: "var(--border-subtle)"
    }}
  >
    <span style={{ color: "var(--text-muted)" }}>{label}</span>
    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{value}</span>
  </div>
);

export default Profile;