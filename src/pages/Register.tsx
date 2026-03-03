import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { User, Wrench, CheckCircle, Rocket, Check, Shield, Mail, ArrowRight, Zap } from "lucide-react";

const ApplyNow = () => {
  const [role, setRole] = useState<"contributor" | "admin" | "">("");
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    github: "",
    experience: "",
    reason: "",
    // Admin-specific fields
    hasContributed: "",
    contributionDescription: "",
    teamManagement: "",
    teamManagementDescription: "",
    motivation: ""
  });

  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  // Detect mobile screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const newErrors: { [key: string]: boolean } = {};
    
    // Validate role selection
    if (!role) {
      setMessage("Please select a role");
      setIsLoading(false);
      return;
    }

    // Validate base fields (always required)
    if (!formData.name) newErrors.name = true;
    if (!formData.email) newErrors.email = true;
    if (!formData.github) newErrors.github = true;
    if (!formData.reason) newErrors.reason = true;

    if (!formData.name || !formData.email || !formData.github || !formData.reason) {
      setErrors(newErrors);
      setMessage("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    // Additional validation for Project Admin role only
    if (role === "admin") {
      if (!formData.teamManagement) {
        setMessage("Please answer the team management question");
        setIsLoading(false);
        return;
      }
      if (formData.teamManagement === "yes" && !formData.teamManagementDescription) {
        setMessage("Please describe your team management experience");
        setIsLoading(false);
        return;
      }
    }

    try {
      const submitData: any = {
        full_name: formData.name,
        email: formData.email,
        github_url: formData.github,
        role: role === "admin" ? "Project Admin" : "Contributor",
        reason: formData.reason
      };

      // Add admin-specific fields if applicable
      if (role === "admin") {
        submitData.managed_team = formData.teamManagement === "yes" ? "Yes" : "No";
        submitData.team_experience = formData.teamManagementDescription || "";
      }

      const response = await fetch("http://localhost/openuniverse/backend/apply.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setMessage("Application submitted! We'll review it and send you credentials soon.");
        setFormData({ 
          name: "", 
          email: "", 
          github: "", 
          experience: "", 
          reason: "",
          hasContributed: "",
          contributionDescription: "",
          teamManagement: "",
          teamManagementDescription: "",
          motivation: ""
        });
        setRole("");
        setErrors({});
      } else {
        setMessage(data.message || "Something went wrong. Please try again.");
      }

    } catch (error) {
      setMessage("Server error. Please try again later.");
      console.error("Submit error:", error);
    } finally {
      setIsLoading(false);
    }
  };

return (
  <div
    style={{
      minHeight: "80vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: isMobile ? "1rem" : "2rem"
    }}
  >

    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        width: "100%",
        maxWidth: isMobile ? "600px" : "1200px",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1.2fr",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        background: "rgba(255, 255, 255, 0.02)",
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
      }}
    >

      {/* LEFT PANEL (Desktop Only) */}
      {!isMobile && (
        <div
          style={{
            padding: "3rem",
            background:
              "linear-gradient(135deg, rgba(212,168,83,0.2), rgba(93,154,158,0.2))",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "2rem"
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <div style={{ 
                padding: "0.5rem",
                background: "rgba(212, 168, 83, 0.3)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Rocket size={24} style={{ color: "var(--color-accent)" }} />
              </div>
              <h2 style={{ fontSize: "2rem", fontWeight: 700, margin: 0 }}>
                Join OpenUniverse
              </h2>
            </div>
          </div>

          <p style={{ color: "var(--text-muted)", lineHeight: 1.8, margin: 0, fontSize: "1rem" }}>
            Become part of an elite open source ecosystem.
            Contribute to real-world projects, manage teams,
            and build your developer reputation.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Check size={20} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
              <span>Real Open Source Exposure</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Check size={20} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
              <span>Leadership Opportunities</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Check size={20} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
              <span>Recognition & Leaderboard</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Check size={20} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
              <span>Community Growth</span>
            </div>
          </div>
        </div>
      )}
      
      {/* RIGHT PANEL - Form Content */}
      <div
        style={{
          padding: isMobile ? "2rem 1.5rem" : "3rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          overflow: "auto",
          maxHeight: isMobile ? "none" : "90vh"
        }}
      >
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div style={{ 
              padding: "0.5rem",
              background: "rgba(212, 168, 83, 0.2)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Zap size={24} style={{ color: "var(--color-accent)" }} />
            </div>
            <h2 style={{ margin: 0, color: "var(--text-primary)", fontSize: "1.5rem" }}>
              Apply Now
            </h2>
          </div>
          <p style={{ textAlign: "center", color: "var(--text-muted)", margin: 0, fontSize: "0.95rem" }}>
            Join our community as a contributor or project admin
          </p>
        </div>

        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: "1.2rem",
              background: "rgba(93, 154, 158, 0.15)",
              border: "1px solid rgba(93, 154, 158, 0.4)",
              borderRadius: "var(--radius-lg)",
              marginBottom: "1.5rem",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem"
            }}
          >
            <CheckCircle size={20} style={{ flexShrink: 0, marginTop: "0.1rem", color: "var(--color-accent-teal)" }} />
            <div>{message}</div>
          </motion.div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Role Selection Section */}
          <div style={{
            padding: "1.5rem",
            background: "linear-gradient(135deg, rgba(212,168,83,0.08), rgba(93,154,158,0.08))",
            border: "1px solid rgba(212, 168, 83, 0.2)",
            borderRadius: "var(--radius-lg)",
            marginBottom: "0.5rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <User size={18} style={{ color: "var(--color-accent)" }} />
              <label style={{ display: "block", color: "var(--text-secondary)", fontSize: "0.9rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>
                Select Your Role
              </label>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1rem" }}>
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setRole("contributor")}
                style={{
                  padding: "1.3rem 1rem",
                  borderRadius: "var(--radius-lg)",
                  border: role === "contributor" 
                    ? "2px solid var(--color-accent)" 
                    : "1px solid rgba(255, 255, 255, 0.2)",
                  background: role === "contributor" 
                    ? "linear-gradient(135deg, rgba(212, 168, 83, 0.25), rgba(212, 168, 83, 0.15))" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  fontWeight: 600,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.6rem",
                  boxShadow: role === "contributor" ? "0 8px 16px rgba(212, 168, 83, 0.15)" : "none"
                }}
              >
                <User size={24} style={{ color: role === "contributor" ? "var(--color-accent)" : "var(--text-secondary)" }} />
                <span>Contributor</span>
                <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>Contribute to projects</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setRole("admin")}
                style={{
                  padding: "1.3rem 1rem",
                  borderRadius: "var(--radius-lg)",
                  border: role === "admin" 
                    ? "2px solid var(--color-accent)" 
                    : "1px solid rgba(255, 255, 255, 0.2)",
                  background: role === "admin" 
                    ? "linear-gradient(135deg, rgba(212, 168, 83, 0.25), rgba(212, 168, 83, 0.15))" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  fontWeight: 600,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.6rem",
                  boxShadow: role === "admin" ? "0 8px 16px rgba(212, 168, 83, 0.15)" : "none"
                }}
              >
                <Wrench size={24} style={{ color: role === "admin" ? "var(--color-accent)" : "var(--text-secondary)" }} />
                <span>Project Admin</span>
                <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>Lead & manage projects</span>
              </motion.button>
            </div>
          </div>

          {/* Basic Information Section */}
          <div style={{
            padding: "1.5rem",
            background: "linear-gradient(135deg, rgba(93,154,158,0.08), rgba(212,168,83,0.08))",
            border: "1px solid rgba(93, 154, 158, 0.2)",
            borderRadius: "var(--radius-lg)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <Mail size={18} style={{ color: "var(--color-accent)" }} />
              <label style={{ display: "block", color: "var(--text-secondary)", fontSize: "0.9rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>
                Basic Information
              </label>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                style={{
                  ...inputStyle,
                  borderColor: errors.name ? "rgba(239, 68, 68, 0.5)" : "var(--input-border)",
                  backgroundColor: errors.name ? "rgba(239, 68, 68, 0.05)" : "var(--input-bg)",
                  boxShadow: errors.name ? "0 0 0 3px rgba(239, 68, 68, 0.1)" : "none"
                }}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.value) setErrors({...errors, name: false});
                }}
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                style={{
                  ...inputStyle,
                  borderColor: errors.email ? "rgba(239, 68, 68, 0.5)" : "var(--input-border)",
                  backgroundColor: errors.email ? "rgba(239, 68, 68, 0.05)" : "var(--input-bg)",
                  boxShadow: errors.email ? "0 0 0 3px rgba(239, 68, 68, 0.1)" : "none"
                }}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.value) setErrors({...errors, email: false});
                }}
              />

              <input
                type="text"
                name="github"
                placeholder="GitHub Profile URL"
                value={formData.github}
                style={{
                  ...inputStyle,
                  borderColor: errors.github ? "rgba(239, 68, 68, 0.5)" : "var(--input-border)",
                  backgroundColor: errors.github ? "rgba(239, 68, 68, 0.05)" : "var(--input-bg)",
                  boxShadow: errors.github ? "0 0 0 3px rgba(239, 68, 68, 0.1)" : "none"
                }}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.value) setErrors({...errors, github: false});
                }}
              />

              <textarea
                name="reason"
                placeholder="Why do you want to join OpenUniverse?"
                value={formData.reason}
                style={{
                  ...inputStyle,
                  minHeight: "100px",
                  resize: "none",
                  fontFamily: "inherit",
                  borderRadius: "var(--radius-lg)",
                  borderColor: errors.reason ? "rgba(239, 68, 68, 0.5)" : "var(--input-border)",
                  backgroundColor: errors.reason ? "rgba(239, 68, 68, 0.05)" : "var(--input-bg)",
                  boxShadow: errors.reason ? "0 0 0 3px rgba(239, 68, 68, 0.1)" : "none"
                }}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.value) setErrors({...errors, reason: false});
                }}
              />
            </div>
          </div>

          {/* Admin-Specific Questions */}
          {role === "admin" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                padding: "1.5rem",
                background: "linear-gradient(135deg, rgba(212,168,83,0.08), rgba(93,154,158,0.08))",
                border: "1px solid rgba(212, 168, 83, 0.2)",
                borderRadius: "var(--radius-lg)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
                <Shield size={18} style={{ color: "var(--color-accent)" }} />
                <label style={{ display: "block", color: "var(--text-secondary)", fontSize: "0.9rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>
                  Project Admin Assessment
                </label>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                {/* Question: Team Management */}
                <div>
                  <label style={{ display: "block", marginBottom: "0.75rem", color: "var(--text-secondary)", fontSize: "0.95rem", fontWeight: 500 }}>
                    Have you managed a team or led a project before?
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "0.75rem" }}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setFormData({ ...formData, teamManagement: "yes" });
                      }}
                      style={{
                        padding: "0.8rem",
                        borderRadius: "var(--radius-lg)",
                        border: formData.teamManagement === "yes" 
                          ? "2px solid var(--color-accent)" 
                          : "1px solid rgba(255, 255, 255, 0.15)",
                        background: formData.teamManagement === "yes" 
                          ? "rgba(212, 168, 83, 0.2)" 
                          : "rgba(255, 255, 255, 0.05)",
                        color: "var(--text-primary)",
                        cursor: "pointer",
                        fontWeight: 600,
                        transition: "all 0.3s ease"
                      }}
                    >
                      Yes
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setFormData({ ...formData, teamManagement: "no", teamManagementDescription: "" });
                      }}
                      style={{
                        padding: "0.8rem",
                        borderRadius: "var(--radius-lg)",
                        border: formData.teamManagement === "no" 
                          ? "2px solid var(--color-accent)" 
                          : "1px solid rgba(255, 255, 255, 0.15)",
                        background: formData.teamManagement === "no" 
                          ? "rgba(212, 168, 83, 0.2)" 
                          : "rgba(255, 255, 255, 0.05)",
                        color: "var(--text-primary)",
                        cursor: "pointer",
                        fontWeight: 600,
                        transition: "all 0.3s ease"
                      }}
                    >
                      No
                    </motion.button>
                  </div>
                </div>

                {/* Team Management Detail: If Yes, ask for description */}
                {formData.teamManagement === "yes" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ width: "100%", boxSizing: "border-box" }}
                  >
                    <textarea
                      name="teamManagementDescription"
                      placeholder="Describe your team management or project leadership experience"
                      value={formData.teamManagementDescription}
                      style={{
                        ...inputStyle,
                        minHeight: "80px",
                        resize: "none",
                        fontFamily: "inherit",
                        borderRadius: "var(--radius-lg)",
                        width: "100%",
                        boxSizing: "border-box"
                      }}
                      onChange={handleChange}
                    />
                  </motion.div>
                )}

              </div>
            </motion.div>
          )}

          <motion.button
            whileHover={!isLoading ? { scale: 1.02, boxShadow: "0 20px 40px rgba(212, 168, 83, 0.35)" } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={handleSubmit}
            disabled={isLoading || submitted}
            style={{
              background: isLoading || submitted ? "linear-gradient(135deg, rgba(212,168,83,0.6), rgba(212,168,83,0.5))" : "linear-gradient(135deg, var(--color-accent), rgba(212,168,83,0.9))",
              color: "var(--bg-dark)",
              padding: "1.1rem 2rem",
              borderRadius: "var(--radius-lg)",
              border: "1px solid rgba(212, 168, 83, 0.3)",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: isLoading || submitted ? "not-allowed" : "pointer",
              width: "100%",
              marginTop: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              opacity: isLoading || submitted ? 0.8 : 1
            }}
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{ display: "flex" }}
                >
                  <Zap size={20} />
                </motion.div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <ArrowRight size={20} />
                <span>Submit Application</span>
              </>
            )}
          </motion.button>

          {message && !submitted && (
            <p style={{ textAlign: "center", marginTop: "0.5rem", color: "var(--text-muted)" }}>
              {message}
            </p>
          )}
        </div>
      </div>
      </motion.div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "0.95rem 1.2rem",
  borderRadius: "var(--radius-full)",
  border: "1px solid var(--input-border)",
  background: "var(--input-bg)",
  color: "var(--text-primary)",
  outline: "none",
  fontFamily: "inherit",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  fontSize: "0.95rem",
  letterSpacing: "0.3px"
};

export default ApplyNow;
