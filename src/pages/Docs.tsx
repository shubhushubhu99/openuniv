import { motion } from "framer-motion";
import { ChevronRight, BookOpen, GitBranch, Zap, Award, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

interface DocSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string;
  details: string[];
}

const Docs = () => {
  const [activeSection, setActiveSection] = useState("contribution");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect Android device and mobile screen size
  useEffect(() => {
    // Detect Android
    const ua = navigator.userAgent.toLowerCase();
    setIsAndroid(ua.includes("android"));

    // Detect mobile screen size
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSectionSelect = (sectionId: string) => {
    setActiveSection(sectionId);
    // Close sidebar on mobile after selecting
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const docSections: DocSection[] = [
    {
      id: "contribution",
      title: "Contribution Guide",
      icon: <BookOpen size={24} />,
      content: "Learn how to start contributing to OpenUniverse projects",
      details: [
        "Fork the repository you want to contribute to",
        "Create a new branch for your feature (git checkout -b feature/AmazingFeature)",
        "Make your changes and commit them (git commit -m 'Add AmazingFeature')",
        "Push to your fork (git push origin feature/AmazingFeature)",
        "Open a Pull Request with a clear description",
        "Respond to feedback from reviewers",
        "Once approved, your contribution is merged!"
      ]
    },
    {
      id: "pr-guidelines",
      title: "PR Guidelines",
      icon: <GitBranch size={24} />,
      content: "Best practices for pull requests",
      details: [
        "Keep PRs focused on a single feature or fix",
        "Write a clear and descriptive title",
        "Include a summary of changes in the description",
        "Reference any related issues (fixes #123)",
        "Include screenshots or code examples if relevant",
        "Ensure your code follows the project's style guide",
        "Add tests for new features",
        "Update documentation as needed"
      ]
    },
    {
      id: "scoring",
      title: "Scoring Rules",
      icon: <Zap size={24} />,
      content: "How points are calculated for contributions",
      details: [
        "Base points per difficulty level:",
        "  • Beginner: 10 points",
        "  • Intermediate: 25 points",
        "  • Advanced: 50 points",
        "Effort bonus: (lines_added + lines_deleted) / 20 points",
        "Total points: Base points + Effort bonus",
        "Admin reward: Gets 20% of contributor's earned points",
        "Points are awarded when PR is accepted and merged"
      ]
    },
    {
      id: "levels",
      title: "Level System",
      icon: <Award size={24} />,
      content: "Understand how the leveling system works",
      details: [
        "Every 100 points earned = 1 level up",
        "Track your progress in the dashboard",
        "Unlock special badges at milestone levels",
        "Leaderboard ranks users by total points",
        "Levels reset annually (optional seasonal resets)",
        "Your level reflects your contribution experience",
        "Higher levels unlock access to advanced projects",
        "Achievement system rewards consistent contributors"
      ]
    }
  ];

  const activeDoc = docSections.find(d => d.id === activeSection) || docSections[0];

  return (
    <div style={{ minHeight: "100vh", paddingBottom: "4rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "3rem", textAlign: "center" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <BookOpen size={isMobile ? 32 : 40} style={{ color: "var(--color-accent)" }} />
            <h1 style={{
              fontSize: isMobile ? "1.8rem" : "2.5rem",
              fontWeight: 700,
              margin: 0,
              color: "var(--text-primary)"
            }}>
              Documentation
            </h1>
          </div>
          <p style={{
            fontSize: "1rem",
            color: "var(--text-muted)",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            Everything you need to know to contribute effectively to OpenUniverse
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile && !sidebarOpen ? "1fr" : (isMobile ? "1fr" : "250px 1fr"),
          gap: isMobile ? "0" : "2rem",
          alignItems: "start",
          position: "relative"
        }}>
          
          {/* Backdrop - Only on mobile when sidebar is open */}
          {isMobile && sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(4px)",
                zIndex: 20,
                cursor: "pointer"
              }}
            />
          )}
          
          {/* Hamburger Menu - Only show on Android or mobile */}
          {isAndroid && isMobile && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-md)",
                background: "rgba(212, 168, 83, 0.15)",
                border: "1px solid rgba(212, 168, 83, 0.3)",
                color: "var(--color-accent)",
                cursor: "pointer",
                marginBottom: "1rem",
                position: "relative",
                zIndex: 25
              }}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          )}
          
          {/* Sidebar */}
          {(!isMobile || sidebarOpen) && (
            <motion.div
              initial={{ opacity: isMobile ? 0 : 0, x: isMobile ? 0 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                ...(isMobile && {
                  position: "fixed",
                  top: "80px",
                  left: "1rem",
                  right: "1rem",
                  maxHeight: "calc(100vh - 120px)",
                  overflowY: "auto",
                  background: "var(--bg-layer-1)",
                  padding: "1.5rem 1rem",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  zIndex: 30,
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)"
                })
              }}
            >
              {docSections.map((doc) => (
                <motion.button
                  key={doc.id}
                  whileHover={{ x: isMobile ? 0 : 4 }}
                  onClick={() => handleSectionSelect(doc.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.9rem 1rem",
                    borderRadius: "var(--radius-md)",
                    border: activeSection === doc.id
                      ? "1px solid var(--color-accent)"
                      : "1px solid transparent",
                    background: activeSection === doc.id
                      ? "rgba(212, 168, 83, 0.15)"
                      : "transparent",
                    color: activeSection === doc.id
                      ? "var(--text-primary)"
                      : "var(--text-secondary)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.3s ease",
                    fontSize: "0.95rem",
                    fontWeight: activeSection === doc.id ? 600 : 500
                  }}
                >
                  <span style={{ color: "var(--color-accent)" }}>
                    {doc.icon}
                  </span>
                  <span style={{ flex: 1 }}>{doc.title}</span>
                  {activeSection === doc.id && <ChevronRight size={18} />}
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: "var(--bg-overlay)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "var(--radius-lg)",
              padding: isMobile ? "1.5rem" : "2rem",
              marginTop: isMobile && sidebarOpen ? "1rem" : "0"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", flexDirection: isMobile ? "column" : "row", textAlign: isMobile ? "center" : "left" }}>
              <span style={{ 
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                minWidth: "40px",
                background: "rgba(212, 168, 83, 0.2)",
                borderRadius: "var(--radius-md)",
                color: "var(--color-accent)"
              }}>
                {activeDoc.icon}
              </span>
              <div>
                <h2 style={{
                  fontSize: isMobile ? "1.4rem" : "1.8rem",
                  fontWeight: 700,
                  margin: 0,
                  color: "var(--text-primary)"
                }}>
                  {activeDoc.title}
                </h2>
                <p style={{
                  color: "var(--text-muted)",
                  margin: "0.25rem 0 0 0",
                  fontSize: "0.95rem"
                }}>
                  {activeDoc.content}
                </p>
              </div>
            </div>

            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.8rem"
            }}>
              {activeDoc.details.map((detail, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                    paddingLeft: detail.startsWith("  •") ? (isMobile ? "1rem" : "1.5rem") : "0"
                  }}
                >
                  {!detail.startsWith("  •") && (
                    <span style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: "20px",
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: "var(--color-accent)",
                      color: "var(--bg-dark)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      marginTop: "0.1rem"
                    }}>
                      {index + 1}
                    </span>
                  )}
                  <span style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.95rem",
                    lineHeight: 1.6
                  }}>
                    {detail.replace("  • ", "")}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Code Example or Additional Info */}
            {activeSection === "pr-guidelines" && (
              <div style={{
                marginTop: "2rem",
                padding: "1.5rem",
                background: "var(--bg-layer-2)",
                borderRadius: "var(--radius-md)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                fontFamily: "monospace",
                overflowX: "auto"
              }}>
                <p style={{ color: "var(--color-accent)", marginBottom: "0.5rem", fontSize: "0.85rem" }}>
                  EXAMPLE: Good PR Title
                </p>
                <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: isMobile ? "0.8rem" : "0.95rem" }}>
                  "Fix: Resolve login timeout issue for slow networks"
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            marginTop: "3rem",
            padding: isMobile ? "1.5rem" : "2rem",
            background: "var(--bg-overlay)",
            border: "1px solid rgba(93, 154, 158, 0.3)",
            borderRadius: "var(--radius-lg)",
            textAlign: "center"
          }}
        >
          <h3 style={{
            fontSize: isMobile ? "1.1rem" : "1.3rem",
            fontWeight: 700,
            marginBottom: "1.5rem",
            color: "var(--text-primary)"
          }}>
            Need Help?
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem"
          }}>
            <motion.a
              whileHover={{ y: -4 }}
              href="#"
              style={{
                padding: "1rem",
                background: "rgba(93, 154, 158, 0.15)",
                border: "1px solid rgba(93, 154, 158, 0.3)",
                borderRadius: "var(--radius-md)",
                color: "var(--text-primary)",
                textDecoration: "none",
                fontWeight: 500
              }}
            >
              GitHub Issues
            </motion.a>
            <motion.a
              whileHover={{ y: -4 }}
              href="#"
              style={{
                padding: "1rem",
                background: "rgba(93, 154, 158, 0.15)",
                border: "1px solid rgba(93, 154, 158, 0.3)",
                borderRadius: "var(--radius-md)",
                color: "var(--text-primary)",
                textDecoration: "none",
                fontWeight: 500
              }}
            >
              Community Discord
            </motion.a>
            <motion.a
              whileHover={{ y: -4 }}
              href="#"
              style={{
                padding: "1rem",
                background: "rgba(93, 154, 158, 0.15)",
                border: "1px solid rgba(93, 154, 158, 0.3)",
                borderRadius: "var(--radius-md)",
                color: "var(--text-primary)",
                textDecoration: "none",
                fontWeight: 500
              }}
            >
              Email Support
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Docs;
