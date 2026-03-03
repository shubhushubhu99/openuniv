import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Section } from "../components/ui/Section";

const Home = () => {
  return (
    <div className="home-page">
      {/* ================= HERO SECTION ================= */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="hero-inner"
      >
        {/* Glow */}
        <div className="hero-glow" aria-hidden />

        <h1 className="hero-title">Level Up Your Skills</h1>

        <p className="hero-subtitle">
          OpenUniverse is a college innovation ecosystem where students
          compete, build projects, and grow their technical skills.
        </p>

        <div className="hero-buttons">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="btn btn-primary"
          >
            Get Started
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="btn btn-outline"
          >
            Learn More
          </motion.button>
        </div>
      </motion.div>

      {/* ================= FEATURES SECTION ================= */}
      <Section className="features-grid" id="features">
        {[
          {
            title: "Daily Challenges",
            desc: "Solve curated problems daily and increase your XP."
          },
          {
            title: "Skill Leaderboard",
            desc: "Compete with classmates and climb the ranks."
          },
          {
            title: "Project Showcase",
            desc: "Build and display your real-world projects."
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -12, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
            viewport={{ once: true }}
            className="card"
          >
            <h3 className="card-title">{feature.title}</h3>
            <p className="card-desc">{feature.desc}</p>
          </motion.div>
        ))}
      </Section>

      {/* ================= STATS SECTION ================= */}
      <Section className="stats-section">
        {[
          { number: "150+", label: "Active Students" },
          { number: "320+", label: "Problems Solved" },
          { number: "45+", label: "Projects Built" }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="stat-item"
          >
            <h2 className="stat-number">{stat.number}</h2>
            <p className="stat-label">{stat.label}</p>
          </motion.div>
        ))}
      </Section>

      {/* ================= HOW IT WORKS ================= */}
      <Section className="how-it-works" id="how-it-works">
        <h2 className="how-it-works-title">How OpenUniverse Works</h2>

        <div className="how-it-works-grid">
          {[
            {
              title: "1. Register",
              desc: "Create your profile and join your campus community."
            },
            {
              title: "2. Solve & Build",
              desc: "Complete daily challenges and build real-world projects."
            },
            {
              title: "3. Compete",
              desc: "Climb the leaderboard and showcase your skills."
            }
          ].map((step, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="card"
            >
              <h3>{step.title}</h3>
              <p className="card-desc">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default Home;
