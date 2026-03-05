import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Share2 } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postTitle?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, postId, postTitle }) => {
  const [copied, setCopied] = useState(false);
  
  // Construct a shareable URL to this specific post
  const shareUrl = `${window.location.origin}${window.location.pathname}?post=${postId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            style={{
              background: "linear-gradient(145deg, rgba(30,30,35,0.95), rgba(20,20,25,0.95))", 
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px", width: "90%", maxWidth: "450px", padding: "24px",
              boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "1.2rem", margin: 0, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
                <Share2 size={20} color="var(--color-primary)" />
                Share Post
              </h3>
              <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}>
                <X size={20} />
              </button>
            </div>

            {postTitle && (
              <div style={{ marginBottom: "16px", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                {postTitle.length > 60 ? `${postTitle.substring(0, 60)}...` : postTitle}
              </div>
            )}

            <div style={{
              display: "flex", alignItems: "center", gap: "8px", 
              background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", 
              borderRadius: "8px", padding: "8px", marginBottom: "20px"
            }}>
              <input 
                type="text" 
                readOnly 
                value={shareUrl} 
                style={{
                  flex: 1, background: "transparent", border: "none", color: "var(--text-muted)",
                  fontSize: "0.9rem", outline: "none", textOverflow: "ellipsis"
                }}
              />
              <button 
                onClick={handleCopy}
                style={{
                  background: copied ? "#10b981" : "var(--color-primary)",
                  color: "#000", border: "none", borderRadius: "6px", padding: "8px 16px",
                  fontSize: "0.85rem", fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s"
                }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "16px" }}>
               <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.9rem", cursor: "pointer", fontWeight: 500, marginLeft: "auto" }}>
                 Close
               </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
