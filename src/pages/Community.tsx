import { motion, AnimatePresence } from "framer-motion";
import { Search, Flame, Plus, MessageSquare, TrendingUp, X, Clock, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { PostCard } from "./community/PostCard";
import { PostDetail } from "./community/PostDetail";
import { NamePopup } from "./community/NamePopup";
import type { Post } from "../types/community";

const backendUrl = "http://localhost/Open-universe/openuniv/backend/api/community.php";

export const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

const Community = () => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [userName, setUserName] = useState<string>('');
  const [sortParam, setSortParam] = useState<'hot' | 'new' | 'top'>('hot');
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [sidebarData, setSidebarData] = useState({
    stats: { members: 15300, online: 342 },
    trending: [] as any[]
  });

  const fetchSidebarData = async () => {
    try {
      const res = await fetch(`${backendUrl}?action=get_sidebar_data`);
      const json = await res.json();
      if (json.success) {
        setSidebarData(json.data);
      }
    } catch(err) {
      console.error(err);
    }
  };

  const fetchPosts = async (pageNum = 1) => {
    if (pageNum > 1) setLoadingMore(true);
    try {
      const res = await fetch(`${backendUrl}?action=get_posts&sort=${sortParam}&page=${pageNum}&limit=10&search=${encodeURIComponent(searchQuery)}`);
      const json = await res.json();
      if (json.success) {
        const parsedPosts = json.data.map((p: any) => ({
          id: p.id.toString(),
          author: { name: p.author_name },
          title: p.title || p.content.substring(0, 30),
          content: p.content,
          tags: [p.category],
          upvotes: Number(p.upvotes),
          commentCount: Number(p.comment_count),
          timestamp: timeAgo(p.created_at)
        }));
        
        if (pageNum === 1) {
          setPosts(parsedPosts);
        } else {
          setPosts(prev => [...prev, ...parsedPosts]);
        }
        
        setHasMore(json.hasMore);

        // Check if URL has a direct link to a post (only on initial load)
        if (pageNum === 1) {
          const urlParams = new URLSearchParams(window.location.search);
          const directPostId = urlParams.get('post');
          if (directPostId && !selectedPost) {
            const targetPost = parsedPosts.find((p: Post) => p.id === directPostId);
            if (targetPost) setSelectedPost(targetPost);
            
            // Clear URL parameter without reloading
            const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.pushState({ path: newUrl }, '', newUrl);
          }
        }
      }
    } catch(err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    const timeout = setTimeout(() => {
      fetchPosts(1);
    }, 300); // 300ms debounce for search typing
    return () => clearTimeout(timeout);
  }, [sortParam, searchQuery]); // Re-fetch when sorting or search changes

  const loadMorePosts = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  useEffect(() => {
    fetchSidebarData();
  }, []);

  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    try {
      const res = await fetch(`${backendUrl}?action=create_post`, {
        method: "POST",
        body: JSON.stringify({
          author_name: userName,
          title: newPostTitle,
          content: newPostContent,
          category: "Discussion"
        })
      });
      const json = await res.json();
      if (json.success) {
        setShowCreateModal(false);
        setNewPostTitle("");
        setNewPostContent("");
        setPage(1);
        fetchPosts(1); // Refresh
        fetchSidebarData(); // Refresh stats
      }
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: "100vh", paddingBottom: "4rem" }}>
      <NamePopup onNameSet={setUserName} />

      {/* Header Banner */}
      <div style={{
        background: "linear-gradient(135deg, rgba(30,30,30,1) 0%, rgba(20,20,20,1) 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "3rem 0",
        marginBottom: "2rem"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 800, margin: "0 0 0.5rem 0", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "12px" }}>
              <MessageSquare size={36} color="var(--color-primary)" />
              Discussions
            </h1>
            <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", margin: 0 }}>
              The hub for developers to share, help, and grow together. {userName && `Welcome, ${userName}!`}
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <button style={{
              display: "flex", alignItems: "center", gap: "8px", background: "#f5f5f5", color: "#000",
              border: "none", padding: "12px 24px", borderRadius: "999px", fontSize: "1rem", fontWeight: 700,
              cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s"
            }}
             onClick={() => setShowCreateModal(true)}
             onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(212,168,83,0.3)' }}
             onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <Plus size={20} />
              Create Post
            </button>
          </motion.div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem", display: "flex", gap: "2rem", flexDirection: "row", alignItems: "flex-start" }}>
        
        {/* Main Feed Content (Left Column) */}
        <div style={{ flex: "1 1 min(100%, 800px)", minWidth: 0 }}>
          <AnimatePresence mode="wait">
            {selectedPost ? (
              <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <PostDetail post={selectedPost} onBack={() => { setSelectedPost(null); fetchPosts(); }} userName={userName} />
              </motion.div>
            ) : (
              <motion.div key="feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Feed Controls */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                  <div style={{ display: "flex", gap: "12px", background: "rgba(30,30,30,0.5)", padding: "4px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <button 
                      onClick={() => setSortParam('hot')}
                      style={{ display: "flex", alignItems: "center", gap: "6px", background: sortParam === 'hot' ? "rgba(255,255,255,0.1)" : "transparent", border: "none", color: sortParam === 'hot' ? "var(--text-primary)" : "var(--text-muted)", padding: "8px 16px", borderRadius: "6px", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                    >
                      <Flame size={18} color={sortParam === 'hot' ? "var(--color-accent)" : "currentColor"} /> Hot
                    </button>
                    <button 
                      onClick={() => setSortParam('new')}
                      style={{ display: "flex", alignItems: "center", gap: "6px", background: sortParam === 'new' ? "rgba(255,255,255,0.1)" : "transparent", border: "none", color: sortParam === 'new' ? "var(--text-primary)" : "var(--text-muted)", padding: "8px 16px", borderRadius: "6px", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                    >
                      <Clock size={16} /> New
                    </button>
                    <button 
                      onClick={() => setSortParam('top')}
                      style={{ display: "flex", alignItems: "center", gap: "6px", background: sortParam === 'top' ? "rgba(255,255,255,0.1)" : "transparent", border: "none", color: sortParam === 'top' ? "var(--text-primary)" : "var(--text-muted)", padding: "8px 16px", borderRadius: "6px", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                    >
                      <Award size={18} color={sortParam === 'top' ? "var(--color-primary)" : "currentColor"} /> Top
                    </button>
                  </div>
                  
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <div style={{ position: "relative" }}>
                      <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search posts..." 
                        style={{ background: "rgba(30,30,30,0.5)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "10px 12px 10px 40px", color: "var(--text-primary)", fontSize: "0.9rem", width: "250px", outline: "none" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Posts List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {posts.length === 0 ? (
                    <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", background: "rgba(30,30,30,0.4)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <MessageSquare size={48} style={{ opacity: 0.5, marginBottom: "1rem" }} />
                      <h3>No posts yet</h3>
                      <p>Be the first to start a discussion!</p>
                    </div>
                  ) : (
                    posts.map((post) => (
                      <PostCard key={post.id} post={post} userName={userName} onClick={() => setSelectedPost(post)} onRefresh={fetchPosts} />
                    ))
                  )}
                  {hasMore && posts.length > 0 && (
                    <button 
                      onClick={loadMorePosts} 
                      disabled={loadingMore}
                      style={{ 
                        marginTop: "1rem", width: "100%", padding: "12px", borderRadius: "8px", 
                        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", 
                        color: "var(--text-primary)", fontWeight: 600, cursor: loadingMore ? "default" : "pointer", 
                        transition: "all 0.2s", opacity: loadingMore ? 0.5 : 1
                      }}
                      onMouseOver={(e) => { if(!loadingMore) e.currentTarget.style.background = "rgba(255,255,255,0.1)" }}
                      onMouseOut={(e) => { if(!loadingMore) e.currentTarget.style.background = "rgba(255,255,255,0.05)" }}
                    >
                      {loadingMore ? "Loading..." : "Load More Posts"}
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar (Right Column) */}
        {!selectedPost && (
          <div style={{ width: "300px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "1.5rem" }} className="community-sidebar">
            {/* About Community Card */}
            <div style={{ background: "rgba(30,30,30,0.4)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", overflow: "hidden" }}>
              <div style={{ background: "var(--color-primary)", height: "8px" }} />
              <div style={{ padding: "1.5rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 0.5rem 0" }}>About Community</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.5", margin: "0 0 1.5rem 0" }}>
                  Welcome to the OpenUniverse community! This is the place to discuss development, help others, and share your open-source journey.
                </p>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                   <div>
                     <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)" }}>{(sidebarData.stats.members / 1000).toFixed(1)}k</div>
                     <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Members</div>
                   </div>
                   <div>
                     <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)" }}>
                       <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }}></span>
                       {sidebarData.stats.online}
                     </div>
                     <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Online</div>
                   </div>
                </div>

                <button style={{ width: "100%", background: "transparent", color: "var(--text-primary)", border: "1px solid var(--text-muted)", padding: "10px", borderRadius: "999px", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }}
                  onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                  onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                >
                  Join Community
                </button>
              </div>
            </div>

            {/* Trending Topics Card */}
            <div style={{ background: "rgba(30,30,30,0.4)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 1rem 0", display: "flex", alignItems: "center", gap: "8px" }}>
                <TrendingUp size={18} color="var(--color-primary)" />
                Trending Topics
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {sidebarData.trending.map((topic, idx) => (
                  <div key={topic.id} style={{ display: "flex", flexDirection: "column", gap: "4px", cursor: "pointer" }} className="trending-item">
                    <div style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {idx + 1}. {topic.title}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {topic.postsCount} comments
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)",
              display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              style={{
                background: "rgba(20,20,20,1)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px", width: "90%", maxWidth: "600px", padding: "24px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "1.5rem", margin: 0, color: "var(--text-primary)" }}>Create Post</h2>
                <button onClick={() => setShowCreateModal(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                  <X size={24} />
                </button>
              </div>

              <input 
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                placeholder="Title"
                style={{
                  width: "100%", padding: "14px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px", color: "var(--text-primary)", fontSize: "1.1rem", marginBottom: "16px", outline: "none",
                  boxSizing: 'border-box'
                }}
              />
              <textarea 
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="What are your thoughts?"
                style={{
                  width: "100%", padding: "14px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px", color: "var(--text-primary)", fontSize: "1rem", minHeight: "150px", outline: "none",
                  resize: "vertical", fontFamily: "inherit", boxSizing: 'border-box'
                }}
              />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
                <button onClick={() => setShowCreateModal(false)} style={{ background: "none", border: "1px solid rgba(255,255,255,0.2)", padding: "10px 20px", borderRadius: "8px", color: "var(--text-primary)", fontWeight: 600, cursor: "pointer" }}>
                  Cancel
                </button>
                <button onClick={handleCreatePost} disabled={!newPostTitle.trim() || !newPostContent.trim()} style={{ background: "#f5f5f5", border: "none", padding: "10px 24px", borderRadius: "8px", color: "#000", fontWeight: 700, cursor: (!newPostTitle.trim() || !newPostContent.trim()) ? "default" : "pointer", opacity: (!newPostTitle.trim() || !newPostContent.trim()) ? 0.5 : 1 }}>
                  Post
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 900px) {
          .community-sidebar {
            display: none !important;
          }
        }
        .trending-item:hover div:first-child {
          color: var(--color-primary) !important;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Community;
