import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Users, GitBranch, Code, Eye } from "lucide-react";
import { Section } from "../components/ui/Section";
import { Card } from "../components/ui/Card";

interface Repo {
  id: number;
  name: string;
  admin: string;
  listed_by: string;
  description: string;
  stars: string;
  contributors: number;
  status: string;
}

const ActiveRepo = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost/openuniverse/backend/repo/get_repositories.php")
      .then((res) => res.json())
      .then((data) => {
        setRepos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to load repositories.");
        setLoading(false);
      });
  }, []);

  return (
    <Section className="active-repo-section">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: "3rem", textAlign: "center" }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
          }}
        >
          <GitBranch size={32} style={{ color: "var(--color-accent)" }} />
          Active Repositories
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          Explore live and actively maintained projects inside OpenUniverse.
        </p>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <p style={{ textAlign: "center", color: "var(--text-muted)" }}>
          Loading repositories...
        </p>
      )}

      {/* Error State */}
      {error && (
        <p style={{ textAlign: "center", color: "red" }}>
          {error}
        </p>
      )}

      {/* Repository Grid */}
      {!loading && !error && (
        <div className="active-repo-grid">
          {repos.map((repo) => (
            <motion.div
              key={repo.id}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Card>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      flex: 1,
                    }}
                  >
                    <Code size={20} style={{ color: "var(--color-accent)" }} />
                    <h3 className="card-title" style={{ margin: 0 }}>
                      {repo.name}
                    </h3>
                  </div>

                  <span
                    style={{
                      fontSize: "0.75rem",
                      padding: "0.375rem 0.75rem",
                      borderRadius: "9999px",
                      background: "rgba(34, 197, 94, 0.15)",
                      color: "#22c55e",
                      flexShrink: 0,
                    }}
                  >
                    {repo.status}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    marginBottom: "1rem",
                  }}
                >
                  <p style={{ margin: "0.25rem 0" }}>
                    <strong>Admin:</strong> {repo.admin}
                  </p>
                  <p style={{ margin: "0.25rem 0" }}>
                    <strong>Listed By:</strong> {repo.listed_by}
                  </p>
                </div>

                <p className="card-desc" style={{ marginBottom: "1.25rem" }}>
                  {repo.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "1.5rem",
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                    }}
                  >
                    <Star size={16} /> {repo.stars}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                    }}
                  >
                    <Users size={16} /> {repo.contributors}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    className="btn btn-primary"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Eye size={16} />
                    View Repo
                  </button>
                  <button className="btn btn-outline">
                    Details
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </Section>
  );
};

export default ActiveRepo;