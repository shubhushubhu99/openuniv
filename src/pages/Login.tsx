import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Wrench, LogIn } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<"Contributor" | "Project Admin" | "">("");
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (!role) {
      setMessage("Please select a role");
      return;
    }

    if (!formData.email || !formData.password) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost/openuniverse/backend/login.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: role
        })
      });

      const data = await response.json();

      if (data.success) {
        // Ensure user object has proper types
        const userData = {
          ...data.user,
          id: String(data.user.id),
          role: data.user.role as "contributor" | "admin"
        };
        
        login(userData);

        // Both Contributor and Project Admin redirect to /my-space
        // Admin-specific features are handled within the dashboard
        navigate("/my-space");
      } else {
        setMessage(data.message || "Login failed");
      }

    } catch (error) {
      setMessage("Server error");
    }
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: "100%",
          maxWidth: "450px",
          padding: "3rem",
          borderRadius: "var(--radius-xl)",
          background: "var(--bg-overlay)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "var(--border-subtle)",
          boxShadow: "var(--shadow-card)"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            marginBottom: "1rem"
          }}
        >
          <LogIn size={28} style={{ color: "var(--color-accent)" }} />
          <h2 style={{ margin: 0, color: "var(--text-primary)" }}>
            Login
          </h2>
        </div>

        <p
          style={{
            textAlign: "center",
            color: "var(--text-muted)",
            marginBottom: "2rem"
          }}
        >
          Select your role to continue
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Role Selection */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setRole("Contributor")}
              style={{
                padding: "1rem",
                borderRadius: "var(--radius-lg)",
                border:
                  role === "Contributor"
                    ? "2px solid var(--color-accent)"
                    : "1px solid rgba(255, 255, 255, 0.15)",
                background:
                  role === "Contributor"
                    ? "rgba(212, 168, 83, 0.2)"
                    : "rgba(255, 255, 255, 0.05)",
                color: "var(--text-primary)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.9rem",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem"
              }}
            >
              <User
                size={18}
                style={{
                  color:
                    role === "Contributor"
                      ? "var(--color-accent)"
                      : "var(--text-secondary)"
                }}
              />
              Contributor
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setRole("Project Admin")}
              style={{
                padding: "1rem",
                borderRadius: "var(--radius-lg)",
                border:
                  role === "Project Admin"
                    ? "2px solid var(--color-accent)"
                    : "1px solid rgba(255, 255, 255, 0.15)",
                background:
                  role === "Project Admin"
                    ? "rgba(212, 168, 83, 0.2)"
                    : "rgba(255, 255, 255, 0.05)",
                color: "var(--text-primary)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.9rem",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem"
              }}
            >
              <Wrench
                size={18}
                style={{
                  color:
                    role === "Project Admin"
                      ? "var(--color-accent)"
                      : "var(--text-secondary)"
                }}
              />
              Project Admin
            </motion.button>
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            style={inputStyle}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            style={inputStyle}
            onChange={handleChange}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--bg-dark)",
              padding: "0.9rem",
              borderRadius: "var(--radius-full)",
              border: "none",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Login
          </motion.button>

          {message && (
            <p style={{ textAlign: "center", color: "salmon" }}>
              {message}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  padding: "0.9rem 1.2rem",
  borderRadius: "var(--radius-full)",
  border: "var(--input-border)",
  background: "var(--input-bg)",
  color: "var(--text-primary)",
  outline: "none"
};

export default Login;