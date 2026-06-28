import { useEffect } from 'react';

interface HelpOverlayProps {
  onClose: () => void;
}

export default function HelpOverlay({ onClose }: HelpOverlayProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      className="help-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        zIndex: 9999,
        color: '#fff',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer'
      }}
    >
      {/* Target Highlights and Arrows */}
      <div style={{ position: 'absolute', top: '15px', left: '20px', textAlign: 'left' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>⬆️</div>
        <strong>Course Info</strong>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: '240px' }}>Displays the current module and screen progression details.</p>
      </div>

      <div style={{ position: 'absolute', top: '15px', right: '20px', textAlign: 'right' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>⬆️</div>
        <strong>Player Navigation Controls</strong>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: '300px' }}>Move forward or backward screen by screen. Exit returns you to the platform catalog, saving your progress state.</p>
      </div>

      <div style={{ position: 'absolute', top: '100px', left: '20px', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>⬅️</span>
          <div>
            <strong>Interactive Tool Panel</strong>
            <ul style={{ fontSize: '0.85rem', color: '#94a3b8', paddingLeft: '1.25rem', marginTop: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <li><strong>Menu:</strong> Jumps to any screen in the sequence.</li>
              <li><strong>Glossary:</strong> Look up rights-holders, duty-bearers, and core definitions.</li>
              <li><strong>Resources:</strong> Download worksheets or guidelines offline.</li>
              <li><strong>Accessibility:</strong> Adjust layouts, alt text guidelines, or low-bandwidth settings.</li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '150px', left: '20px', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>⬅️</span>
          <div>
            <strong>Media Controls</strong>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: '260px' }}>
              Toggle transcripts/captions, play/pause, sound, or reset/replay the current screen interactive state.
            </p>
          </div>
        </div>
      </div>

      {/* Main prompt box */}
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#1e293b',
          border: '2px solid var(--color-primary)',
          borderRadius: '12px',
          padding: '2.5rem',
          maxWidth: '520px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          cursor: 'default'
        }}
      >
        <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>💡</span>
        <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-family-headings)', marginBottom: '0.75rem' }}>
          Focused Course Player Guide
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: '1.5' }}>
          This overlay highlights the controls of the HRBA course player shell. Click anywhere or press <kbd style={{ background: '#334155', padding: '0.15rem 0.35rem', borderRadius: '4px', fontSize: '0.8rem' }}>Enter</kbd> to dismiss this guide.
        </p>
        <button 
          onClick={onClose}
          style={{
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            padding: '0.75rem 2rem',
            borderRadius: '6px',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.2)',
            transition: 'background-color var(--transition-fast)'
          }}
        >
          Got it! Start Learning
        </button>
      </div>
    </div>
  );
}
