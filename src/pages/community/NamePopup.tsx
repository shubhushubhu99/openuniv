import React, { useState, useEffect } from 'react';
import { User, ChevronRight } from 'lucide-react';

interface NamePopupProps {
  onNameSet: (name: string) => void;
}

export const NamePopup: React.FC<NamePopupProps> = ({ onNameSet }) => {
  const [name, setName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('community_username');
    if (!savedName) {
      setIsOpen(true);
    } else {
      onNameSet(savedName);
    }
  }, [onNameSet]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('community_username', name.trim());
      onNameSet(name.trim());
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      fontFamily: 'inherit'
    }}>
      <div style={{
        background: 'linear-gradient(145deg, rgba(20,20,25,0.95), rgba(15,15,20,0.95))',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        padding: '32px',
        width: '90%',
        maxWidth: '400px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '100px',
          height: '100px',
          background: 'var(--color-primary, #6b9ca4)',
          filter: 'blur(60px)',
          opacity: 0.3,
          borderRadius: '50%'
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '64px', height: '64px', borderRadius: '50%', 
              background: 'rgba(255,255,255,0.05)', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', 
              margin: '0 auto 16px auto', border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <User size={32} color="var(--color-primary, #6b9ca4)" />
            </div>
            <h2 style={{ color: 'var(--text-primary, #fff)', margin: '0 0 8px 0', fontSize: '1.5rem' }}>Join the Discussion</h2>
            <p style={{ color: 'var(--text-secondary, #aaa)', margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>
              Please enter your name to post and comment in the community.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What should we call you?"
                autoFocus
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary, #6b9ca4)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
              />
            </div>
            <button 
              type="submit"
              disabled={!name.trim()}
              style={{
                background: name.trim() ? 'var(--color-primary, #c6f08c)' : 'rgba(255,255,255,0.1)',
                color: name.trim() ? '#000' : 'rgba(255,255,255,0.3)',
                padding: '14px',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: name.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              Continue <ChevronRight size={18} />
            </button>
          </form>
          
          <p style={{ 
            color: 'var(--text-muted, #666)', 
            fontSize: '0.75rem', 
            textAlign: 'center', 
            margin: '8px 0 0 0' 
          }}>
            Your name will be stored locally and can be replaced with real authentication later.
          </p>
        </div>
      </div>
    </div>
  );
};
