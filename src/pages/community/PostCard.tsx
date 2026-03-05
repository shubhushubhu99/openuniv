import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, ArrowUp, ArrowDown, Share2, MoreHorizontal, Trash2, Flag } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { Post } from "../../types/community";
import { ShareModal } from "./ShareModal";

interface PostCardProps {
  post: Post;
  userName: string;
  onClick: () => void;
  onRefresh?: () => void;
}

const backendUrl = "http://localhost/Open-universe/openuniv/backend/api/community.php";

export const PostCard = ({ post, userName, onClick, onRefresh }: PostCardProps) => {
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    
    try {
      const res = await fetch(`${backendUrl}?action=delete_post`, {
        method: "POST",
        body: JSON.stringify({ id: post.id, author_name: userName })
      });
      const json = await res.json();
      if (json.success && onRefresh) {
        onRefresh();
      } else {
        alert(json.message || "Failed to delete post");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReport = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
    
    if (!userName) {
      alert("Please join the community to report posts.");
      return;
    }

    const reason = window.prompt("Why are you reporting this post?");
    if (!reason) return;

    try {
      const res = await fetch(`${backendUrl}?action=report_item`, {
        method: "POST",
        body: JSON.stringify({ item_type: "post", item_id: post.id, reporter_name: userName, reason })
      });
      const json = await res.json();
      if (json.success) {
        alert("Report submitted successfully. Our moderators will review it.");
      } else {
        alert("Failed to submit report.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleVote = async (amount: number) => {
    try {
      await fetch(`${backendUrl}?action=vote`, {
        method: "POST",
        body: JSON.stringify({ type: "post", id: post.id, amount })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (voteStatus === 'up') {
      setUpvotes(upvotes - 1);
      setVoteStatus(null);
      handleVote(-1);
    } else {
      setUpvotes(voteStatus === 'down' ? upvotes + 2 : upvotes + 1);
      setVoteStatus('up');
      handleVote(voteStatus === 'down' ? 2 : 1);
    }
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (voteStatus === 'down') {
      setUpvotes(upvotes + 1);
      setVoteStatus(null);
      handleVote(1);
    } else {
      setUpvotes(voteStatus === 'up' ? upvotes - 2 : upvotes - 1);
      setVoteStatus('down');
      handleVote(voteStatus === 'up' ? -2 : -1);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      style={{
        display: "flex",
        background: "rgba(30, 30, 30, 0.4)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "12px",
        cursor: "pointer",
        transition: "border-color 0.2s ease",
        marginBottom: "1rem"
      }}
      onMouseOver={(e) => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)"}
      onMouseOut={(e) => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)"}
    >
      {/* Vote Column */}
      <div style={{
        width: "48px",
        background: "rgba(0, 0, 0, 0.2)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "12px 4px",
        gap: "4px"
      }}>
        <button
          onClick={handleUpvote}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: voteStatus === 'up' ? "var(--color-primary)" : "var(--text-muted)",
            padding: "4px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <ArrowUp size={20} />
        </button>
        <span style={{
          fontSize: "0.9rem",
          fontWeight: 700,
          color: voteStatus === 'up' ? "var(--color-primary)" : voteStatus === 'down' ? "#ef4444" : "var(--text-primary)"
        }}>
          {upvotes}
        </span>
        <button
          onClick={handleDownvote}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: voteStatus === 'down' ? "#ef4444" : "var(--text-muted)",
            padding: "4px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <ArrowDown size={20} />
        </button>
      </div>

      {/* Main Content */}
      <div style={{ padding: "16px", flex: 1 }}>
        {/* Meta Info */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "8px",
          fontSize: "0.85rem",
          color: "var(--text-muted)",
          flexWrap: "wrap"
        }}>
          {post.author.avatar ? (
             <img src={post.author.avatar} alt={post.author.name} style={{ width: 24, height: 24, borderRadius: "50%" }} />
          ) : (
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", color: "#000", fontWeight: "bold" }}>
              {post.author.name.charAt(0)}
            </div>
          )}
          <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{post.author.name}</span>
          {post.author.role && (
            <span style={{
              background: "rgba(255, 255, 255, 0.1)",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "0.7rem",
              color: "var(--text-secondary)"
            }}>
              {post.author.role}
            </span>
          )}
          <span>•</span>
          <span>{post.timestamp}</span>
        </div>

        {/* Title & Tags */}
        <h3 style={{
          fontSize: "1.2rem",
          fontWeight: 600,
          color: "var(--text-primary)",
          marginBottom: "8px",
          lineHeight: "1.4"
        }}>
          {post.title}
        </h3>
        
        {post.tags && post.tags.length > 0 && (
          <div style={{ display: "flex", gap: "6px", marginBottom: "12px", flexWrap: "wrap" }}>
            {post.tags.map(tag => (
              <span key={tag} style={{
                background: "rgba(93, 154, 158, 0.15)",
                color: "var(--color-accent)",
                padding: "2px 8px",
                borderRadius: "12px",
                fontSize: "0.75rem",
                fontWeight: 500
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Content Preview */}
        <p style={{
          fontSize: "0.95rem",
          color: "var(--text-secondary)",
          lineHeight: "1.5",
          marginBottom: "16px",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}>
          {post.content}
        </p>

        {/* Action Bar */}
        <div style={{
          display: "flex",
          gap: "16px",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          paddingTop: "12px"
        }}>
          <button style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: "4px",
            transition: "background 0.2s ease"
          }}
            onMouseOver={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"}
            onMouseOut={(e) => e.currentTarget.style.background = "none"}
          >
            <MessageSquare size={16} />
            {post.commentCount} Comments
          </button>
          <button style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: "4px",
            transition: "background 0.2s ease"
          }}
            onMouseOver={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"}
            onMouseOut={(e) => e.currentTarget.style.background = "none"}
            onClick={(e) => { e.stopPropagation(); setShowShareModal(true); }}
          >
            <Share2 size={16} />
            Share
          </button>
          <div style={{ position: "relative", marginLeft: "auto" }} ref={dropdownRef}>
            <button style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: showDropdown ? "rgba(255, 255, 255, 0.05)" : "none",
                border: "none",
                color: "var(--text-muted)",
                fontSize: "0.85rem",
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: "4px",
                transition: "background 0.2s ease"
              }}
              onMouseOver={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"}
              onMouseOut={(e) => e.currentTarget.style.background = showDropdown ? "rgba(255, 255, 255, 0.05)" : "none"}
              onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
            >
              <MoreHorizontal size={16} />
            </button>
            
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  transition={{ duration: 0.1 }}
                  style={{
                    position: "absolute", right: 0, top: "100%", marginTop: "4px",
                    background: "rgba(30, 30, 35, 0.95)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px", padding: "4px", width: "150px", zIndex: 10,
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)", backdropFilter: "blur(10px)"
                  }}
                >
                  {userName === post.author.name && (
                    <button 
                      onClick={handleDelete}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: "8px", 
                        background: "none", border: "none", color: "#ef4444", padding: "8px 12px", 
                        borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem", textAlign: "left"
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"}
                      onMouseOut={(e) => e.currentTarget.style.background = "none"}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  )}
                  <button 
                    onClick={handleReport}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: "8px", 
                      background: "none", border: "none", color: "var(--text-secondary)", padding: "8px 12px", 
                      borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem", textAlign: "left"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"}
                    onMouseOut={(e) => e.currentTarget.style.background = "none"}
                  >
                    <Flag size={14} /> Report
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
    <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} postId={post.id} postTitle={post.title} />
  </>
  );
};
