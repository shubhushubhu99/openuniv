import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { GitBranch } from "lucide-react";

interface PR {
  id: number;
  commit_summary: string;
  lines_added: number;
  lines_deleted: number;
  files_changed: number;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  project_name: string;
}

const PullRequests = () => {
  const { user } = useAuth();
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [formData, setFormData] = useState({
    project_id: "",
    commit_summary: "",
    lines_added: 0,
    lines_deleted: 0,
    files_changed: 0
  });

  const mockPRs: PR[] = [
    {
      id: 1,
      commit_summary: "Add dark mode support to UI components",
      lines_added: 245,
      lines_deleted: 18,
      files_changed: 12,
      status: "accepted",
      created_at: "2024-03-10",
      project_name: "React UI Kit"
    },
    {
      id: 2,
      commit_summary: "Fix authentication token refresh issue",
      lines_added: 89,
      lines_deleted: 34,
      files_changed: 5,
      status: "accepted",
      created_at: "2024-03-08",
      project_name: "OpenUniverse Core"
    },
    {
      id: 3,
      commit_summary: "Optimize database queries for leaderboard",
      lines_added: 156,
      lines_deleted: 42,
      files_changed: 3,
      status: "pending",
      created_at: "2024-03-15",
      project_name: "Advanced Analytics"
    }
  ];

  const handleSubmit = async () => {
    if (!formData.project_id || !formData.commit_summary) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost/backend/pr/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        setShowSubmitForm(false);
        setFormData({
          project_id: "",
          commit_summary: "",
          lines_added: 0,
          lines_deleted: 0,
          files_changed: 0
        });
      }
    } catch (error) {
      console.error("Error submitting PR:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return { bg: "rgba(93, 154, 158, 0.15)", text: "#5D9A9E", icon: "✓" };
      case "pending":
        return { bg: "rgba(212, 168, 83, 0.15)", text: "#D4A853", icon: "⏳" };
      case "rejected":
        return { bg: "rgba(220, 120, 120, 0.15)", text: "#DC7878", icon: "✕" };
      default:
        return { bg: "var(--bg-overlay)", text: "var(--text-secondary)", icon: "?" };
    }
  };

  const isContributor = user?.role === "contributor";

  return (
    <div style={{ minHeight: "100vh", paddingTop: "4rem", paddingBottom: "4rem" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 2rem" }}>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem"
          }}
        >
          <div>
            <h1 style={{
              fontSize: "2rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
              color: "var(--text-primary)"
            }}>
              📝 Pull Requests
            </h1>
            <p style={{ color: "var(--text-muted)" }}>
              {isContributor ? "Submit and track your contributions" : "Review pending pull requests"}
            </p>
          </div>

          {isContributor && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSubmitForm(!showSubmitForm)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.8rem 1.5rem",
                background: "var(--color-accent)",
                color: "var(--bg-dark)",
                border: "none",
                borderRadius: "var(--radius-full)",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              <GitBranch size={18} />
              Submit PR
            </motion.button>
          )}
        </motion.div>

        {/* Submit Form */}
        {isContributor && showSubmitForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "var(--bg-overlay)",
              border: "1px solid rgba(212, 168, 83, 0.3)",
              borderRadius: "var(--radius-lg)",
              padding: "2rem",
              marginBottom: "2rem"
            }}
          >
            <h3 style={{ marginTop: 0, color: "var(--text-primary)" }}>Submit Pull Request</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <select
                value={formData.project_id}
                onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                style={{
                  padding: "0.8rem",
                  background: "var(--input-bg)",
                  border: "var(--input-border)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-primary)"
                }}
              >
                <option value="">Select Project</option>
                <option value="1">React UI Kit</option>
                <option value="2">OpenUniverse Core</option>
                <option value="3">Advanced Analytics</option>
              </select>

              <input
                type="text"
                placeholder="Commit Summary"
                value={formData.commit_summary}
                onChange={(e) => setFormData({ ...formData, commit_summary: e.target.value })}
                style={{
                  padding: "0.8rem",
                  background: "var(--input-bg)",
                  border: "var(--input-border)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-primary)"
                }}
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                <input
                  type="number"
                  placeholder="Lines Added"
                  value={formData.lines_added}
                  onChange={(e) => setFormData({ ...formData, lines_added: parseInt(e.target.value) || 0 })}
                  style={{
                    padding: "0.8rem",
                    background: "var(--input-bg)",
                    border: "var(--input-border)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--text-primary)"
                  }}
                />
                <input
                  type="number"
                  placeholder="Lines Deleted"
                  value={formData.lines_deleted}
                  onChange={(e) => setFormData({ ...formData, lines_deleted: parseInt(e.target.value) || 0 })}
                  style={{
                    padding: "0.8rem",
                    background: "var(--input-bg)",
                    border: "var(--input-border)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--text-primary)"
                  }}
                />
                <input
                  type="number"
                  placeholder="Files Changed"
                  value={formData.files_changed}
                  onChange={(e) => setFormData({ ...formData, files_changed: parseInt(e.target.value) || 0 })}
                  style={{
                    padding: "0.8rem",
                    background: "var(--input-bg)",
                    border: "var(--input-border)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--text-primary)"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleSubmit}
                  style={{
                    flex: 1,
                    padding: "0.8rem",
                    background: "var(--color-accent)",
                    color: "var(--bg-dark)",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Submit PR
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowSubmitForm(false)}
                  style={{
                    flex: 1,
                    padding: "0.8rem",
                    background: "transparent",
                    color: "var(--text-secondary)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "var(--radius-md)",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* PRs List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {mockPRs.map((pr, index) => {
            const statusColor = getStatusColor(pr.status);
            const effort = (pr.lines_added + pr.lines_deleted) / 20;
            return (
              <motion.div
                key={pr.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ x: 4 }}
                style={{
                  background: "var(--bg-overlay)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "1.2rem" }}>
                      {statusColor.icon}
                    </span>
                    <h3 style={{
                      margin: 0,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      color: "var(--text-primary)"
                    }}>
                      {pr.commit_summary}
                    </h3>
                  </div>
                  <div style={{
                    display: "flex",
                    gap: "1.5rem",
                    fontSize: "0.9rem",
                    color: "var(--text-muted)"
                  }}>
                    <span>📦 {pr.project_name}</span>
                    <span>➕ {pr.lines_added} lines</span>
                    <span>➖ {pr.lines_deleted} lines</span>
                    <span>📄 {pr.files_changed} files</span>
                    <span>⚡ {effort} points (effort)</span>
                  </div>
                </div>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "0.75rem"
                }}>
                  <span style={{
                    padding: "0.4rem 0.8rem",
                    background: statusColor.bg,
                    color: statusColor.text,
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    textTransform: "capitalize"
                  }}>
                    {pr.status}
                  </span>
                  <span style={{
                    fontSize: "0.8rem",
                    color: "var(--text-muted)"
                  }}>
                    {pr.created_at}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PullRequests;
