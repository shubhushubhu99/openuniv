import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Users, TrendingUp, BookOpen, ChevronDown } from "lucide-react";
import { useState } from "react";

interface Post {
  id: number;
  author: string;
  title: string;
  content: string;
  replies: number;
  views: number;
  date: string;
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const Community = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  // Statistics
  const stats = [
    { icon: MessageSquare, label: "Total Posts", value: "2,847", color: "rgba(212,168,83,0.15)" },
    { icon: BookOpen, label: "Total Replies", value: "12,394", color: "rgba(107,155,181,0.15)" },
    { icon: Users, label: "Active Members", value: "1,523", color: "rgba(93,154,158,0.15)" },
    { icon: TrendingUp, label: "Discussions", value: "856", color: "rgba(220,120,120,0.15)" },
  ];

  // Recent posts
  const recentPosts: Post[] = [
    {
      id: 1,
      author: "Alex Johnson",
      title: "Best practices for contributing to open source projects",
      content: "Share your experience with the community. Here are some key tips I've learned over the years...",
      replies: 24,
      views: 342,
      date: "2 hours ago"
    },
    {
      id: 2,
      author: "Sarah Chen",
      title: "How to set up your development environment",
      content: "A comprehensive guide for beginners to get started with open source contribution.",
      replies: 18,
      views: 256,
      date: "5 hours ago"
    },
    {
      id: 3,
      author: "Marcus Williams",
      title: "Advanced Git workflows for collaborative development",
      content: "Deep dive into Git workflows that teams use for managing large-scale projects.",
      replies: 32,
      views: 512,
      date: "1 day ago"
    },
    {
      id: 4,
      author: "Emma Rodriguez",
      title: "Debugging tips for JavaScript developers",
      content: "Collection of useful debugging strategies and tools that can save you hours.",
      replies: 41,
      views: 678,
      date: "2 days ago"
    },
  ];

  // FAQ
  const faqItems: FAQItem[] = [
    {
      id: 1,
      question: "How do I start contributing to the OpenUniverse platform?",
      answer: "To get started, create an account on our platform, browse the available projects, and submit your first pull request. You can find beginner-friendly issues labeled 'good-first-issue' in any project."
    },
    {
      id: 2,
      question: "What are the requirements to become a project maintainer?",
      answer: "You need at least 50 successful contributions, a strong community reputation, and demonstrated code quality. Apply through your dashboard after meeting these criteria."
    },
    {
      id: 3,
      question: "How is XP calculated and How can I level up faster?",
      answer: "XP is awarded based on contributions, code reviews, and community engagement. You can level up faster by tackling harder problems, helping others in discussions, and being consistent with your contributions."
    },
    {
      id: 4,
      question: "Can I participate in events even if I'm a beginner?",
      answer: "Absolutely! We have events tailored for all skill levels - beginner to advanced. Check the Events section to find hackathons, workshops, and drives suited to your experience level."
    },
    {
      id: 5,
      question: "How do I report bugs or suggest new features?",
      answer: "You can create a new discussion post in the Community section or open an issue on the specific project repository. Our team reviews all suggestions and prioritizes them based on community feedback."
    },
    {
      id: 6,
      question: "Is there a Code of Conduct I should follow?",
      answer: "Yes, we have a community Code of Conduct that all members must follow. It ensures a respectful, inclusive, and welcoming environment for everyone. You can find it in the Docs section."
    },
  ];

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
            fontSize: "clamp(2rem, 5vw, 2.5rem)",
            fontWeight: 700,
            marginBottom: "1rem",
            color: "var(--text-primary)"
          }}>
            💬 Community
          </h1>
          <p style={{
            fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
            color: "var(--text-muted)",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            Connect with developers, share knowledge, and collaborate on projects. Join our thriving community of open-source enthusiasts.
          </p>
        </motion.div>

        {/* Statistics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.5rem",
            marginBottom: "3rem"
          }}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ y: -4 }}
                style={{
                  background: stat.color,
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.8rem"
                }}
              >
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Icon size={22} style={{ color: "var(--color-accent)" }} />
                </div>
                <div>
                  <p style={{
                    fontSize: "0.85rem",
                    color: "var(--text-muted)",
                    margin: "0 0 0.3rem 0"
                  }}>
                    {stat.label}
                  </p>
                  <h3 style={{
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    margin: 0,
                    color: "var(--text-primary)"
                  }}>
                    {stat.value}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Recent Posts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: "3rem" }}
        >
          <h2 style={{
            fontSize: "clamp(1.5rem, 4vw, 1.8rem)",
            fontWeight: 700,
            marginBottom: "2rem",
            color: "var(--text-primary)"
          }}>
            Recent Discussions
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {recentPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                whileHover={{ x: 4 }}
                style={{
                  background: "rgba(212,168,83,0.08)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
              >
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.8rem"
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "1rem",
                    flexWrap: "wrap"
                  }}>
                    <div>
                      <p style={{
                        fontSize: "0.85rem",
                        color: "var(--text-muted)",
                        margin: "0 0 0.4rem 0"
                      }}>
                        Posted by <span style={{ color: "var(--color-accent)" }}>{post.author}</span> • {post.date}
                      </p>
                      <h3 style={{
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        margin: 0,
                        color: "var(--text-primary)"
                      }}>
                        {post.title}
                      </h3>
                    </div>
                  </div>

                  <p style={{
                    fontSize: "0.95rem",
                    color: "var(--text-secondary)",
                    margin: 0,
                    lineHeight: "1.5"
                  }}>
                    {post.content}
                  </p>

                  {/* Post Stats */}
                  <div style={{
                    display: "flex",
                    gap: "1.5rem",
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    paddingTop: "0.8rem",
                    flexWrap: "wrap"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                      <MessageSquare size={16} />
                      {post.replies} replies
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                      <TrendingUp size={16} />
                      {post.views} views
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 style={{
            fontSize: "clamp(1.5rem, 4vw, 1.8rem)",
            fontWeight: 700,
            marginBottom: "2rem",
            color: "var(--text-primary)"
          }}>
            Frequently Asked Questions
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {faqItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <motion.button
                  onClick={() => setExpandedFAQ(expandedFAQ === item.id ? null : item.id)}
                  style={{
                    width: "100%",
                    background: "rgba(93,154,158,0.1)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "16px",
                    padding: "1.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.3s ease",
                    gap: "1rem"
                  }}
                  whileHover={{
                    background: "rgba(93,154,158,0.15)",
                  }}
                >
                  <h3 style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    margin: 0,
                    color: "var(--text-primary)",
                    flex: 1
                  }}>
                    {item.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: expandedFAQ === item.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={20} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {expandedFAQ === item.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        overflow: "hidden",
                        borderLeft: "2px solid var(--color-accent)"
                      }}
                    >
                      <div style={{
                        padding: "1rem 1.5rem",
                        background: "rgba(93,154,158,0.05)",
                        borderRight: "1px solid rgba(255,255,255,0.08)",
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                        borderBottomLeftRadius: "16px",
                        borderBottomRightRadius: "16px"
                      }}>
                        <p style={{
                          fontSize: "0.95rem",
                          color: "var(--text-secondary)",
                          margin: 0,
                          lineHeight: "1.6"
                        }}>
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            marginTop: "4rem",
            marginBottom: "2rem",
            textAlign: "center"
          }}
        >
          <div style={{
            background: "linear-gradient(135deg, rgba(212,168,83,0.15) 0%, rgba(93,154,158,0.15) 100%)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "2.5rem",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            <h3 style={{
              fontSize: "1.4rem",
              fontWeight: 700,
              marginBottom: "0.8rem",
              color: "var(--text-primary)"
            }}>
              Join the Conversation
            </h3>
            <p style={{
              fontSize: "0.95rem",
              color: "var(--text-muted)",
              marginBottom: "1.5rem",
              margin: "0 0 1.5rem 0"
            }}>
              Have a question or want to share your experience? Start a new discussion or reply to existing threads.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "0.8rem 2rem",
                borderRadius: "999px",
                border: "none",
                background: "var(--color-accent)",
                color: "var(--color-primary)",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: "pointer"
              }}
            >
              Start a Discussion
            </motion.button>
          </div>
        </motion.div>

      </div>

      {/* Shimmer Animation */}
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Community;
