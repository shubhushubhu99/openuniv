import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ArrowDown, MessageSquare, MoreHorizontal, Trash2, Flag } from "lucide-react";
import { timeAgo } from "../Community";

interface CommentNodeProps {
  comment: any;
  allComments: any[];
  depth?: number;
  postId: string;
  userName: string;
  onCommentAdded: () => void;
}

const backendUrl = "http://localhost/Open-universe/openuniv/backend/api/community.php";

export const CommentNode = ({ comment, allComments, depth = 0, postId, userName, onCommentAdded }: CommentNodeProps) => {
  const [upvotes, setUpvotes] = useState(Number(comment.upvotes));
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
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
  
  const childComments = allComments.filter(c => c.parent_id === comment.id);

  const handleVote = async (amount: number) => {
    try {
      await fetch(`${backendUrl}?action=vote`, {
        method: "POST",
        body: JSON.stringify({ type: "comment", id: comment.id, amount })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpvote = () => {
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

  const handleDownvote = () => {
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

  const handleReplySubmit = async () => {
    if (!replyText.trim() || !userName) return;
    
    try {
      const res = await fetch(`${backendUrl}?action=create_comment`, {
        method: "POST",
        body: JSON.stringify({
          post_id: postId,
          parent_id: comment.id,
          author_name: userName,
          content: replyText
        })
      });
      const json = await res.json();
      if (json.success) {
        setReplyText("");
        setShowReplyForm(false);
        onCommentAdded(); // Re-fetch comments map
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    setShowDropdown(false);
    
    try {
      const res = await fetch(`${backendUrl}?action=delete_comment`, {
        method: "POST",
        body: JSON.stringify({ id: comment.id, author_name: userName, post_id: postId })
      });
      const json = await res.json();
      if (json.success) {
        onCommentAdded(); // Re-fetch comments map
      } else {
        alert(json.message || "Failed to delete comment");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReport = async () => {
    if (!userName) {
      alert("Please join the community to report comments.");
      return;
    }
    setShowDropdown(false);

    const reason = window.prompt("Why are you reporting this comment?");
    if (!reason) return;

    try {
      const res = await fetch(`${backendUrl}?action=report_item`, {
        method: "POST",
        body: JSON.stringify({ item_type: "comment", item_id: comment.id, reporter_name: userName, reason })
      });
      const json = await res.json();
      if (json.success) {
        alert("Report submitted successfully.");
      } else {
        alert("Failed to submit report.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Max depth before we stop indenting
  const maxIndentationDepth = 6;
  const currentIndentation = Math.min(depth, maxIndentationDepth);
  
  // Define colors for the vertical thread lines (Reddit style)
  const threadColors = [
    "rgba(255, 255, 255, 0.1)", // depth 0 
    "rgba(93, 154, 158, 0.3)",  // depth 1 (accent)
    "rgba(212, 168, 83, 0.3)",  // depth 2
    "rgba(220, 120, 120, 0.3)", // depth 3
    "rgba(107, 155, 181, 0.3)", // depth 4
  ];
  const threadColor = threadColors[depth % threadColors.length];

  return (
    <div style={{ 
      display: "flex", 
      marginTop: "12px",
      paddingLeft: depth === 0 ? "0" : "8px",
      position: "relative"
    }}>
      {/* Thread vertical line */}
      {depth > 0 && !isCollapsed && (
        <div style={{
          position: "absolute",
          left: "0",
          top: "30px",
          bottom: "10px",
          width: "2px",
          background: threadColor,
          borderRadius: "2px",
          cursor: "pointer"
        }}
        onClick={() => setIsCollapsed(true)}
        onMouseOver={(e) => e.currentTarget.style.background = "var(--color-primary)"}
        onMouseOut={(e) => e.currentTarget.style.background = threadColor}
        title="Collapse thread"
        />
      )}

      {/* Comment Content */}
      <div style={{ flex: 1, paddingLeft: depth > 0 ? "16px" : "0" }}>
        
        {/* Author & Meta */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          {isCollapsed ? (
            <button 
              onClick={() => setIsCollapsed(false)}
              style={{
                background: "none", border: "none", color: "var(--color-primary)",
                cursor: "pointer", fontSize: "16px", padding: "0 4px", fontWeight: "bold"
              }}
            >
              +
            </button>
          ) : (
            <>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", color: "#000", fontWeight: "bold" }}>
                  {comment.author_name.charAt(0).toUpperCase()}
                </div>
            </>
          )}

          <span style={{ color: "var(--text-primary)", fontWeight: 500, fontSize: "0.85rem" }}>
            {comment.author_name}
          </span>
          
          <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>•</span>
          <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{timeAgo(comment.created_at)}</span>
        </div>

        {!isCollapsed && (
          <>
            {/* Body */}
            <div style={{ 
              fontSize: "0.95rem", 
              color: "var(--text-secondary)", 
              lineHeight: "1.5",
              marginBottom: "8px",
              paddingLeft: "28px", // align with text, avoid avatar
              whiteSpace: "pre-wrap"
            }}>
              {comment.content}
            </div>

            {/* Actions */}
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "12px",
              paddingLeft: "28px",
              marginBottom: "8px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <button
                  onClick={handleUpvote}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: voteStatus === 'up' ? "var(--color-primary)" : "var(--text-muted)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "2px"
                  }}
                >
                  <ArrowUp size={16} />
                </button>
                <span style={{ 
                  fontSize: "0.85rem", fontWeight: 600,
                  color: voteStatus === 'up' ? "var(--color-primary)" : voteStatus === 'down' ? "#ef4444" : "var(--text-primary)" 
                }}>
                  {upvotes}
                </span>
                <button
                  onClick={handleDownvote}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: voteStatus === 'down' ? "#ef4444" : "var(--text-muted)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "2px"
                  }}
                >
                  <ArrowDown size={16} />
                </button>
              </div>

              <button 
                onClick={() => setShowReplyForm(!showReplyForm)}
                style={{
                  display: "flex", alignItems: "center", gap: "4px",
                  background: "none", border: "none",
                  color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 500, cursor: "pointer",
                  padding: "4px 8px", borderRadius: "4px"
                }}
                onMouseOver={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"}
                onMouseOut={(e) => e.currentTarget.style.background = "none"}
              >
                <MessageSquare size={14} /> Reply
              </button>
              
              <div style={{ position: "relative" }} ref={dropdownRef}>
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{
                    background: showDropdown ? "rgba(255, 255, 255, 0.05)" : "none", border: "none",
                    color: "var(--text-muted)", display: "flex", alignItems: "center", cursor: "pointer",
                    padding: "4px", borderRadius: "4px", transition: "background 0.2s"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"}
                  onMouseOut={(e) => e.currentTarget.style.background = showDropdown ? "rgba(255, 255, 255, 0.05)" : "none"}
                >
                  <MoreHorizontal size={14} />
                </button>
                
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -5 }}
                      transition={{ duration: 0.1 }}
                      style={{
                        position: "absolute", left: 0, top: "100%", marginTop: "4px",
                        background: "rgba(30,30,35,0.95)", border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px", padding: "4px", minWidth: "120px", zIndex: 10,
                        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)", backdropFilter: "blur(10px)"
                      }}
                    >
                      {userName === comment.author_name && (
                        <button
                          onClick={handleDelete}
                          style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "#ef4444", padding: "6px 8px", borderRadius: "4px", cursor: "pointer", fontSize: "0.80rem", textAlign: "left" }}
                          onMouseOver={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"}
                          onMouseOut={(e) => e.currentTarget.style.background = "none"}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      )}
                      <button
                        onClick={handleReport}
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "var(--text-secondary)", padding: "6px 8px", borderRadius: "4px", cursor: "pointer", fontSize: "0.80rem", textAlign: "left" }}
                        onMouseOver={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"}
                        onMouseOut={(e) => e.currentTarget.style.background = "none"}
                      >
                        <Flag size={12} /> Report
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Reply Form */}
            {showReplyForm && (
              <div style={{ paddingLeft: "28px", marginBottom: "16px", marginTop: "8px" }}>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="What are your thoughts?"
                  style={{
                    width: "100%",
                    minHeight: "80px",
                    background: "rgba(0, 0, 0, 0.2)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    padding: "12px",
                    color: "var(--text-primary)",
                    fontSize: "0.95rem",
                    fontFamily: "inherit",
                    resize: "vertical",
                    marginBottom: "8px",
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                  <button 
                    onClick={() => setShowReplyForm(false)}
                    style={{
                      background: "none", border: "none", color: "var(--text-muted)",
                      padding: "6px 12px", borderRadius: "20px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleReplySubmit}
                    disabled={!replyText.trim() || !userName}
                    style={{
                      background: replyText.trim() && userName ? "#f5f5f5" : "rgba(255,255,255,0.1)",
                      color: replyText.trim() && userName ? "#000" : "rgba(255,255,255,0.3)",
                      border: "none", padding: "6px 16px", borderRadius: "20px", cursor: replyText.trim() ? "pointer" : "default",
                      fontSize: "0.85rem", fontWeight: 600, transition: "all 0.2s"
                    }}
                  >
                    Reply
                  </button>
                </div>
              </div>
            )}

            {/* Recursively render replies */}
            {childComments.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {childComments.map((child) => (
                  <CommentNode 
                    key={child.id} 
                    comment={child} 
                    allComments={allComments}
                    depth={currentIndentation + 1} 
                    postId={postId}
                    userName={userName}
                    onCommentAdded={onCommentAdded}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
