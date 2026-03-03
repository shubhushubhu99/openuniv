import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch dashboard stats
  const fetchStats = () => {
    fetch("http://localhost/backend/dashboard-data", {
      credentials: "include"
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setStats(data.data);
      })
      .catch(() => {
        setStats(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // 🔥 Add XP Handler
  const handleAddXp = async () => {
    await fetch("http://localhost/backend/add-xp", {
      method: "POST",
      credentials: "include"
    });

    fetchStats(); // refresh stats after XP update
  };

  if (loading) {
    return (
      <div style={{ padding: "120px", textAlign: "center" }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "80vh",
        padding: "3rem 2rem",
        display: "flex",
        justifyContent: "center"
      }}
    >
      {stats && (
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            padding: "2.5rem",
            borderRadius: "20px",
            maxWidth: "600px",
            width: "100%",
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(255,255,255,0.08)"
          }}
        >
          <h2 style={{ marginBottom: "1rem" }}>
            Welcome, {stats.name}
          </h2>

          <p style={{ marginBottom: "0.5rem" }}>
            <strong>Level:</strong> {stats.level}
          </p>

          <p style={{ marginBottom: "1rem" }}>
            <strong>Total XP:</strong> {stats.xp}
          </p>

          {/* XP Progress Bar */}
          <div
            style={{
              background: "#1D546D",
              height: "12px",
              borderRadius: "10px",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                width: `${stats.xp % 100}%`,
                background: "#5F9598",
                height: "100%",
                transition: "width 0.6s ease"
              }}
            />
          </div>

          <p style={{ marginTop: "0.8rem", opacity: 0.7 }}>
            {100 - (stats.xp % 100)} XP to next level
          </p>

          {/* 🔥 Add XP Button */}
          <button
            onClick={handleAddXp}
            style={{
              marginTop: "1.5rem",
              padding: "0.6rem 1.5rem",
              background: "#5F9598",
              border: "none",
              borderRadius: "30px",
              cursor: "pointer",
              fontWeight: 600
            }}
          >
            +10 XP
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;