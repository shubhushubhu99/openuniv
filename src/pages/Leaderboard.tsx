import { motion } from "framer-motion";
import { useState } from "react";
import { Crown, Medal } from "lucide-react";

interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  role: "contributor" | "admin";
  points: number;
  level: number;
  prs?: number;
  projects?: number;
}

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState<"contributors" | "admins">("contributors");

  const contributorsData: LeaderboardEntry[] = [
    { id: "1", rank: 1, name: "Alex Chen", role: "contributor", points: 1450, level: 14, prs: 52 },
    { id: "2", rank: 2, name: "Sarah Johnson", role: "contributor", points: 1320, level: 13, prs: 48 },
    { id: "3", rank: 3, name: "Marcus Rodriguez", role: "contributor", points: 1180, level: 11, prs: 45 },
    { id: "4", rank: 4, name: "Emma Wilson", role: "contributor", points: 950, level: 9, prs: 38 },
    { id: "5", rank: 5, name: "Priya Kumar", role: "contributor", points: 850, level: 8, prs: 34 },
    { id: "6", rank: 6, name: "David Lee", role: "contributor", points: 720, level: 7, prs: 29 },
    { id: "7", rank: 7, name: "Sophie Laurent", role: "contributor", points: 680, level: 6, prs: 27 },
    { id: "8", rank: 8, name: "James O'Brien", role: "contributor", points: 620, level: 6, prs: 24 },
    { id: "9", rank: 9, name: "Olivia Chang", role: "contributor", points: 540, level: 5, prs: 21 },
    { id: "10", rank: 10, name: "Lucas Martinez", role: "contributor", points: 480, level: 4, prs: 19 }
  ];

  const adminsData: LeaderboardEntry[] = [
    { id: "a1", rank: 1, name: "Dr. Amit Patel", role: "admin", points: 5200, level: 52, projects: 8 },
    { id: "a2", rank: 2, name: "Lisa Anderson", role: "admin", points: 4800, level: 48, projects: 6 },
    { id: "a3", rank: 3, name: "Michael Zhang", role: "admin", points: 4200, level: 42, projects: 5 },
    { id: "a4", rank: 4, name: "Jennifer Brown", role: "admin", points: 3600, level: 36, projects: 4 },
    { id: "a5", rank: 5, name: "Carlos Gonzalez", role: "admin", points: 3100, level: 31, projects: 4 }
  ];

  const displayData = activeTab === "contributors" ? contributorsData : adminsData;

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown size={20} style={{ color: "#FFD700" }} />;
    if (rank === 2) return <Medal size={20} style={{ color: "#C0C0C0" }} />;
    if (rank === 3) return <Medal size={20} style={{ color: "#CD7F32" }} />;
    return <span style={{ fontWeight: 700, color: "var(--color-accent)", fontSize: "1.1rem" }}>{rank}</span>;
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: "4rem", paddingBottom: "4rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 2rem" }}>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "2rem", textAlign: "center" }}
        >
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
            color: "var(--text-primary)"
          }}>
            🏆 Leaderboard
          </h1>
          <p style={{
            fontSize: "1rem",
            color: "var(--text-muted)"
          }}>
            Top contributors and project admins
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
            justifyContent: "center"
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setActiveTab("contributors")}
            style={{
              padding: "0.8rem 1.5rem",
              borderRadius: "var(--radius-full)",
              border: activeTab === "contributors" ? "2px solid var(--color-accent)" : "1px solid rgba(255, 255, 255, 0.2)",
              background: activeTab === "contributors" ? "rgba(212, 168, 83, 0.15)" : "transparent",
              color: activeTab === "contributors" ? "var(--color-accent)" : "var(--text-secondary)",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            👨‍💻 Top Contributors
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setActiveTab("admins")}
            style={{
              padding: "0.8rem 1.5rem",
              borderRadius: "var(--radius-full)",
              border: activeTab === "admins" ? "2px solid var(--color-accent)" : "1px solid rgba(255, 255, 255, 0.2)",
              background: activeTab === "admins" ? "rgba(212, 168, 83, 0.15)" : "transparent",
              color: activeTab === "admins" ? "var(--color-accent)" : "var(--text-secondary)",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            🛠️ Top Project Admins
          </motion.button>
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: "var(--bg-overlay)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden"
          }}
        >
          {/* Header Row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "60px 1fr 120px 100px 100px",
            gap: "1rem",
            padding: "1.5rem",
            background: "rgba(255, 255, 255, 0.03)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            fontWeight: 600,
            fontSize: "0.9rem",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}>
            <div>Rank</div>
            <div>Name</div>
            <div>Points</div>
            <div>Level</div>
            <div>{activeTab === "contributors" ? "PRs" : "Projects"}</div>
          </div>

          {/* Data Rows */}
          {displayData.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr 120px 100px 100px",
                gap: "1rem",
                padding: "1.5rem",
                borderBottom: index < displayData.length - 1 ? "1px solid rgba(255, 255, 255, 0.05)" : "none",
                alignItems: "center",
                background: entry.rank <= 3 ? `rgba(212, 168, 83, ${0.05 * (4 - entry.rank)})` : "transparent"
              }}
            >
              {/* Rank */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem"
              }}>
                {getRankIcon(entry.rank)}
              </div>

              {/* Name */}
              <div style={{
                color: "var(--text-primary)",
                fontWeight: entry.rank <= 3 ? 700 : 500
              }}>
                {entry.name}
              </div>

              {/* Points */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "var(--color-accent)",
                fontWeight: 600
              }}>
                ⚡ {entry.points}
              </div>

              {/* Level */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "rgba(212, 168, 83, 0.2)",
                color: "var(--color-accent)",
                fontWeight: 700
              }}>
                {entry.level}
              </div>

              {/* PRs or Projects */}
              <div style={{
                color: "var(--text-secondary)",
                textAlign: "center"
              }}>
                {activeTab === "contributors" ? `${entry.prs} PRs` : `${entry.projects} projects`}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
            marginTop: "3rem"
          }}
        >
          <div style={{
            padding: "1.5rem",
            background: "var(--bg-overlay)",
            border: "1px solid rgba(93, 154, 158, 0.3)",
            borderRadius: "var(--radius-lg)"
          }}>
            <p style={{ margin: "0 0 0.5rem 0", color: "var(--text-muted)", fontSize: "0.85rem" }}>
              🎯 TOP CONTRIBUTOR
            </p>
            <p style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700, color: "var(--text-primary)" }}>
              {contributorsData[0]?.name}
            </p>
            <p style={{ margin: "0.5rem 0 0 0", color: "var(--color-accent)", fontWeight: 600 }}>
              {contributorsData[0]?.points} points
            </p>
          </div>

          <div style={{
            padding: "1.5rem",
            background: "var(--bg-overlay)",
            border: "1px solid rgba(107, 155, 181, 0.3)",
            borderRadius: "var(--radius-lg)"
          }}>
            <p style={{ margin: "0 0 0.5rem 0", color: "var(--text-muted)", fontSize: "0.85rem" }}>
              🏆 TOP ADMIN
            </p>
            <p style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700, color: "var(--text-primary)" }}>
              {adminsData[0]?.name}
            </p>
            <p style={{ margin: "0.5rem 0 0 0", color: "var(--color-accent-cool)", fontWeight: 600 }}>
              {adminsData[0]?.points} points
            </p>
          </div>

          <div style={{
            padding: "1.5rem",
            background: "var(--bg-overlay)",
            border: "1px solid rgba(212, 168, 83, 0.3)",
            borderRadius: "var(--radius-lg)"
          }}>
            <p style={{ margin: "0 0 0.5rem 0", color: "var(--text-muted)", fontSize: "0.85rem" }}>
              📈 TOTAL CONTRIBUTORS
            </p>
            <p style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700, color: "var(--text-primary)" }}>
              {contributorsData.length}+
            </p>
            <p style={{ margin: "0.5rem 0 0 0", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
              Actively contributing
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;
