import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Plus, GitBranch, Users, Trophy } from "lucide-react";
import { useState } from "react";

interface Repository {
  id: number;
  name: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  required_level: number;
  admin_id: string;
  contributors: number;
  pr_count: number;
}

const Projects = () => {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    difficulty: "beginner" as const
  });

  const mockProjects: Repository[] = [
    {
      id: 1,
      name: "OpenUniverse Core",
      description: "Main platform repository with contribution features",
      difficulty: "intermediate",
      required_level: 1,
      admin_id: "admin1",
      contributors: 24,
      pr_count: 156
    },
    {
      id: 2,
      name: "React UI Kit",
      description: "Reusable component library for OpenUniverse projects",
      difficulty: "beginner",
      required_level: 1,
      admin_id: "admin2",
      contributors: 18,
      pr_count: 89
    },
    {
      id: 3,
      name: "Advanced Analytics Engine",
      description: "High-performance analytics and metrics calculation system",
      difficulty: "advanced",
      required_level: 5,
      admin_id: "admin1",
      contributors: 12,
      pr_count: 45
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return { bg: "rgba(93, 154, 158, 0.15)", text: "#5D9A9E" };
      case "intermediate":
        return { bg: "rgba(212, 168, 83, 0.15)", text: "#D4A853" };
      case "advanced":
        return { bg: "rgba(220, 120, 120, 0.15)", text: "#DC7878" };
      default:
        return { bg: "var(--bg-overlay)", text: "var(--text-secondary)" };
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.description) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost/backend/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        setShowCreateForm(false);
        setFormData({ name: "", description: "", difficulty: "beginner" });
        // Refresh projects list
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <div style={{ minHeight: "100vh", paddingTop: "4rem", paddingBottom: "4rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem" }}>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "3rem"
          }}
        >
          <div>
            <h1 style={{
              fontSize: "2rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
              color: "var(--text-primary)"
            }}>
              🚀 Projects
            </h1>
            <p style={{ color: "var(--text-muted)" }}>
              {isAdmin ? "Manage your repositories" : "Browse available projects"}
            </p>
          </div>

          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateForm(!showCreateForm)}
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
              <Plus size={18} />
              Create Project
            </motion.button>
          )}
        </motion.div>

        {/* Create Form */}
        {isAdmin && showCreateForm && (
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
            <h3 style={{ marginTop: 0, color: "var(--text-primary)" }}>New Project</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input
                type="text"
                placeholder="Project Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  padding: "0.8rem",
                  background: "var(--input-bg)",
                  border: "var(--input-border)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-primary)"
                }}
              />
              <textarea
                placeholder="Project Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{
                  padding: "0.8rem",
                  background: "var(--input-bg)",
                  border: "var(--input-border)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-primary)",
                  minHeight: "100px",
                  resize: "none",
                  fontFamily: "inherit"
                }}
              />
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                style={{
                  padding: "0.8rem",
                  background: "var(--input-bg)",
                  border: "var(--input-border)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-primary)"
                }}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
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
                  Create
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowCreateForm(false)}
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

        {/* Projects Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "2rem"
        }}>
          {mockProjects.map((project, index) => {
            const diffColor = getDifficultyColor(project.difficulty);
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                style={{
                  background: "var(--bg-overlay)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.8rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      margin: "0 0 0.25rem 0",
                      color: "var(--text-primary)"
                    }}>
                      {project.name}
                    </h3>
                    <p style={{
                      margin: 0,
                      fontSize: "0.85rem",
                      color: "var(--text-muted)"
                    }}>
                      by {project.admin_id === "admin1" ? "OpenUniverse" : "Community"}
                    </p>
                  </div>
                  <span style={{
                    padding: "0.4rem 0.8rem",
                    background: diffColor.bg,
                    color: diffColor.text,
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "capitalize"
                  }}>
                    {project.difficulty}
                  </span>
                </div>

                <p style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  {project.description}
                </p>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem",
                  paddingTop: "0.5rem",
                  borderTop: "1px solid rgba(255, 255, 255, 0.1)"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "var(--text-muted)",
                    fontSize: "0.85rem"
                  }}>
                    <Users size={16} />
                    {project.contributors} contributors
                  </div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "var(--text-muted)",
                    fontSize: "0.85rem"
                  }}>
                    <GitBranch size={16} />
                    {project.pr_count} PRs
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    marginTop: "0.5rem",
                    padding: "0.7rem 1.5rem",
                    background: "var(--color-accent)",
                    color: "var(--bg-dark)",
                    border: "none",
                    borderRadius: "var(--radius-full)",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  {isAdmin ? "Manage" : "View Details"}
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {mockProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              color: "var(--text-muted)"
            }}
          >
            <Trophy size={48} style={{ margin: "0 auto 1rem", opacity: 0.5 }} />
            <p>No projects available yet. Check back soon!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Projects;
