import { motion } from "framer-motion";
import { Calendar, Users, Trophy, BookOpen, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";

interface Event {
  id: number;
  title: string;
  description: string;
  start_date: string | null;
  end_date: string | null;
  type: "hackathon" | "drive" | "workshop";
  participants: number;
  computed_status: "upcoming" | "ongoing" | "completed";
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost/openuniverse/backend/events/get_events.php")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEvents(data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case "hackathon":
        return <Trophy size={20} />;
      case "drive":
        return <BookOpen size={20} />;
      case "workshop":
        return <GraduationCap size={20} />;
      default:
        return <Calendar size={20} />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "hackathon":
        return "rgba(212,168,83,0.15)";
      case "drive":
        return "rgba(93,154,158,0.15)";
      case "workshop":
        return "rgba(107,155,181,0.15)";
      default:
        return "var(--bg-overlay)";
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "ongoing":
        return {
          bg: "rgba(34,197,94,0.15)",
          color: "#22c55e",
          border: "1px solid rgba(34,197,94,0.4)"
        };
      case "upcoming":
        return {
          bg: "rgba(59,130,246,0.15)",
          color: "#3b82f6",
          border: "1px solid rgba(59,130,246,0.4)"
        };
      case "completed":
        return {
          bg: "rgba(156,163,175,0.15)",
          color: "#9ca3af",
          border: "1px solid rgba(156,163,175,0.4)"
        };
      default:
        return {
          bg: "rgba(107,114,128,0.15)",
          color: "#6b7280",
          border: "1px solid rgba(107,114,128,0.4)"
        };
    }
  };

  const formatDateRange = (start: string | null, end: string | null) => {
    if (!start || !end) return "Date not announced";
    return `${start} → ${end}`;
  };

  return (
    <div style={{ minHeight: "100vh", paddingBottom: "4rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "3rem", textAlign: "center" }}
        >
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: 700,
            marginBottom: "1rem",
            color: "var(--text-primary)"
          }}>
            📅 Events
          </h1>
          <p style={{
            fontSize: "1.1rem",
            color: "var(--text-muted)",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            Join our community events and level up your contribution journey.
          </p>
        </motion.div>

        {/* Skeleton Loader */}
        {loading && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "2rem"
          }}>
            {[1,2,3].map((item) => (
              <div
                key={item}
                style={{
                  height: "260px",
                  borderRadius: "16px",
                  background: "linear-gradient(90deg, #1f2937 25%, #374151 50%, #1f2937 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s infinite"
                }}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && events.length === 0 && (
          <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
            No events available right now.
          </div>
        )}

        {/* Events Grid */}
        {!loading && events.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "2rem"
          }}>
            {events.map((event, index) => {
              const statusStyle = getStatusStyles(event.computed_status);
              const isCompleted = event.computed_status === "completed";

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  style={{
                    background: getEventColor(event.type),
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "16px",
                    padding: "1.8rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem"
                  }}
                >
                  {/* Badges */}
                  <div style={{ display: "flex", gap: "0.6rem" }}>
                    <span style={{
                      fontSize: "0.7rem",
                      padding: "0.35rem 0.9rem",
                      borderRadius: "999px",
                      background: "rgba(212,168,83,0.15)",
                      color: "#D4A853",
                      border: "1px solid rgba(212,168,83,0.4)"
                    }}>
                      {event.type.toUpperCase()}
                    </span>

                    <span style={{
                      fontSize: "0.7rem",
                      padding: "0.35rem 0.9rem",
                      borderRadius: "999px",
                      background: statusStyle.bg,
                      color: statusStyle.color,
                      border: statusStyle.border
                    }}>
                      {event.computed_status.toUpperCase()}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.2rem", fontWeight: 600 }}>
                    {event.title}
                  </h3>

                  <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>
                    {event.description}
                  </p>

                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.6rem",
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    paddingTop: "0.6rem"
                  }}>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <Calendar size={16} />
                      {formatDateRange(event.start_date, event.end_date)}
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <Users size={16} />
                      {event.participants} participants
                    </div>
                  </div>

                  {/* Buttons */}
                  <div style={{ display: "flex", gap: "0.8rem", marginTop: "0.8rem" }}>
                    {!isCompleted ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          flex: 1,
                          padding: "0.7rem",
                          borderRadius: "999px",
                          border: "none",
                          background: "var(--color-accent)",
                          fontWeight: 600,
                          cursor: "pointer"
                        }}
                      >
                        Register Now
                      </motion.button>
                    ) : (
                      <button
                        disabled
                        style={{
                          flex: 1,
                          padding: "0.7rem",
                          borderRadius: "999px",
                          background: "rgba(156,163,175,0.2)",
                          color: "#9ca3af",
                          border: "1px solid rgba(156,163,175,0.3)",
                          cursor: "not-allowed"
                        }}
                      >
                        Registration Closed
                      </button>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        flex: 1,
                        padding: "0.7rem",
                        borderRadius: "999px",
                        background: "transparent",
                        border: "1px solid var(--color-accent)",
                        color: "var(--color-accent)",
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      View Details
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default Events;