import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare, ArrowUp, ArrowDown, Share2, MoreHorizontal, Trash2, Flag } from "lucide-react";
import type { Post } from "../../types/community";
import { CommentNode } from "./CommentNode";
import { ShareModal } from "./ShareModal";

interface PostDetailProps {
  post: Post;
  userName: string;
  onBack: () => void;
}

const backendUrl = "http://localhost/Open-universe/openuniv/backend/api/community.php";

export const PostDetail = ({ post, userName, onBack }: PostDetailProps) => {
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);
  const [replyText, setReplyText] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchComments = async (pageNum = 1) => {
    if (pageNum > 1) setLoadingMore(true);
    try {
      const res = await fetch(`${backendUrl}?action=get_comments&post_id=${post.id}&page=${pageNum}&limit=50`);
      const json = await res.json();
      if (json.success) {
        if (pageNum === 1) {
          setComments(json.data);
        } else {
          // ensure no duplicates just in case root ID fetch grabs children we already have
          const newComments = json.data.filter((nc: any) => !comments.find(oc => oc.id === nc.id));
          setComments(prev => [...prev, ...newComments]);
        }
        setHasMore(json.hasMore);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchComments(1);
  }, [post.id]);

  const loadMoreComments = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchComments(nextPage);
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

  const handleAddComment = async () => {
    if (!replyText.trim() || !userName) return;
    
    try {
      const res = await fetch(`${backendUrl}?action=create_comment`, {
        method: "POST",
        body: JSON.stringify({
          post_id: post.id,
          author_name: userName,
          content: replyText
        })
      });
      const json = await res.json();
      if (json.success) {
        setReplyText("");
        // if we just added a comment, realistically we want to see it immediately.
        // Reloading page 1 will wipe things, so either we reload everything or just fetch page 1.
        // Let's reset the pagination
        setPage(1);
        fetchComments(1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    
    try {
      const res = await fetch(`${backendUrl}?action=delete_post`, {
        method: "POST",
        body: JSON.stringify({ id: post.id, author_name: userName })
      });
      const json = await res.json();
      if (json.success) {
        onBack(); // Leave the detail view since it's deleted
      } else {
        alert(json.message || "Failed to delete post");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReport = async () => {
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
        alert("Report submitted successfully.");
      } else {
        alert("Failed to submit report.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Build tree from flat comments
  const renderCommentsTree = () => {
    // Top-level comments have null parent_id
    const rootComments = comments.filter(c => c.parent_id === null);
    
    return rootComments.map(comment => (
      <CommentNode 
        key={comment.id}
        comment={comment}
        allComments={comments}
        depth={0}
        postId={post.id}
        userName={userName}
        onCommentAdded={fetchComments}
      />
    ));
  };

  return (
    <>
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      style={{
        background: "rgba(30, 30, 30, 0.4)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "12px"
      }}
    >
      {/* Header Back Button */}
      <div style={{
        padding: "12px 16px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        display: "flex",
        alignItems: "center",
        background: "rgba(0, 0, 0, 0.2)"
      }}>
        <button
          onClick={onBack}
          style={{
            display: "flex", alignItems: "center", gap: "8px", background: "none",
            border: "none", color: "var(--text-primary)", fontSize: "0.95rem", fontWeight: 600,
            cursor: "pointer", padding: "8px 12px", borderRadius: "8px", transition: "background 0.2s"
          }}
          onMouseOver={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"}
          onMouseOut={(e) => e.currentTarget.style.background = "none"}
        >
          <ArrowLeft size={18} />
          Back to Discussions
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {/* Vote Column */}
        <div style={{
          width: "48px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "16px 4px",
          gap: "4px",
          flexShrink: 0
        }}>
          <button
            onClick={handleUpvote}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: voteStatus === 'up' ? "var(--color-primary)" : "var(--text-muted)",
              padding: "4px", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center"
            }}
          >
            <ArrowUp size={24} />
          </button>
          <span style={{ fontSize: "1rem", fontWeight: 700, color: voteStatus === 'up' ? "var(--color-primary)" : voteStatus === 'down' ? "#ef4444" : "var(--text-primary)" }}>
            {upvotes}
          </span>
          <button
            onClick={handleDownvote}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: voteStatus === 'down' ? "#ef4444" : "var(--text-muted)",
              padding: "4px", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center"
            }}
          >
            <ArrowDown size={24} />
          </button>
        </div>

        {/* Post Main Content */}
        <div style={{ padding: "16px 16px 16px 0", flex: 1, minWidth: "250px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
            {post.author.avatar ? (
                <img src={post.author.avatar} alt={post.author.name} style={{ width: 24, height: 24, borderRadius: "50%" }} />
            ) : (
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", color: "#000", fontWeight: "bold" }}>
                {post.author.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{post.author.name}</span>
            <span>•</span>
            <span>{post.timestamp}</span>
          </div>

          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "12px", lineHeight: "1.4" }}>
            {post.title}
          </h1>
          
          {post.tags && post.tags.length > 0 && (
            <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
              {post.tags.map(tag => (
                <span key={tag} style={{ background: "rgba(93, 154, 158, 0.15)", color: "var(--color-accent)", padding: "2px 8px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 500 }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "24px", whiteSpace: "pre-wrap" }}>
            {post.content}
          </div>

          {/* Action Bar */}
          <div style={{ display: "flex", gap: "16px", marginBottom: "24px", color: "var(--text-muted)" }}>
             <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", fontWeight: 500 }}>
                <MessageSquare size={16} /> {post.commentCount} Comments
             </span>
             <button
               onClick={() => setShowShareModal(true)}
               style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.85rem", cursor: "pointer", padding: "4px 8px", borderRadius: "4px", transition: "background 0.2s ease" }}
               onMouseOver={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"}
               onMouseOut={(e) => e.currentTarget.style.background = "none"}
             >
               <Share2 size={16} /> Share
             </button>

             <div style={{ position: "relative", marginLeft: "auto" }}>
               <button
                 onClick={() => setShowDropdown(!showDropdown)}
                 style={{ display: "flex", alignItems: "center", gap: "6px", background: showDropdown ? "rgba(255, 255, 255, 0.05)" : "none", border: "none", color: "var(--text-muted)", fontSize: "0.85rem", cursor: "pointer", padding: "4px 8px", borderRadius: "4px", transition: "background 0.2s ease" }}
                 onMouseOver={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"}
                 onMouseOut={(e) => e.currentTarget.style.background = showDropdown ? "rgba(255, 255, 255, 0.05)" : "none"}
               >
                 <MoreHorizontal size={16} /> More
               </button>

               {showDropdown && (
                 <div style={{
                   position: "absolute", right: 0, top: "100%", marginTop: "4px",
                   background: "rgba(30,30,35,0.95)", border: "1px solid rgba(255,255,255,0.1)",
                   borderRadius: "8px", padding: "4px", minWidth: "150px", zIndex: 10,
                   boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)", backdropFilter: "blur(10px)"
                 }}>
                   {userName === post.author.name && (
                     <button
                       onClick={() => { setShowDropdown(false); handleDelete(); }}
                       style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "#ef4444", padding: "8px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem", textAlign: "left" }}
                       onMouseOver={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"}
                       onMouseOut={(e) => e.currentTarget.style.background = "none"}
                     >
                       <Trash2 size={14} /> Delete Post
                     </button>
                   )}
                   <button
                     onClick={() => { setShowDropdown(false); handleReport(); }}
                     style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "var(--text-secondary)", padding: "8px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem", textAlign: "left" }}
                     onMouseOver={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"}
                     onMouseOut={(e) => e.currentTarget.style.background = "none"}
                   >
                     <Flag size={14} /> Report Post
                   </button>
                 </div>
               )}
             </div>
          </div>

          {/* Add Comment Input */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: "8px" }}>
              Comment as <span style={{ color: "#f97316", fontWeight: "bold" }}>{userName || "Guest"}</span>
            </div>
            <div style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", overflow: "hidden", background: "rgba(0,0,0,0.2)"}}>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="What are your thoughts?"
                style={{
                  width: "100%", minHeight: "120px", background: "transparent", border: "none", padding: "16px", boxSizing: "border-box",
                  color: "var(--text-primary)", fontSize: "0.95rem", fontFamily: "inherit", resize: "vertical", outline: "none"
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", padding: "8px 16px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <button 
                  onClick={handleAddComment}
                  disabled={!replyText.trim()}
                  style={{
                    background: replyText.trim() ? "#f5f5f5" : "rgba(255,255,255,0.1)",
                    color: replyText.trim() ? "#000" : "rgba(255,255,255,0.3)",
                    border: "none", padding: "8px 24px", borderRadius: "20px", cursor: replyText.trim() ? "pointer" : "default",
                    fontSize: "0.9rem", fontWeight: 600, transition: "all 0.2s"
                  }}
                >
                  Comment
                </button>
              </div>
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.08)", margin: "0 0 24px 0" }} />

          {/* Comments Section */}
          <div>
            {renderCommentsTree()}
            
            {hasMore && comments.length > 0 && (
              <button 
                onClick={loadMoreComments} 
                disabled={loadingMore}
                style={{ 
                  marginTop: "1.5rem", width: "100%", padding: "12px", borderRadius: "8px", 
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", 
                  color: "var(--text-primary)", fontWeight: 600, cursor: loadingMore ? "default" : "pointer", 
                  transition: "all 0.2s", opacity: loadingMore ? 0.5 : 1
                }}
                onMouseOver={(e) => { if(!loadingMore) e.currentTarget.style.background = "rgba(255,255,255,0.1)" }}
                onMouseOut={(e) => { if(!loadingMore) e.currentTarget.style.background = "rgba(255,255,255,0.05)" }}
              >
                {loadingMore ? "Loading..." : "Load More Comments"}
              </button>
            )}
          </div>

        </div>
      </div>
    </motion.div>
    <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} postId={post.id} postTitle={post.title} />
    </>
  );
};
