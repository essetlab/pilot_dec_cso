import { useEffect, useRef } from 'react';

interface AccessibilityModalProps {
  onClose: () => void;
}

export default function AccessibilityModal({ onClose }: AccessibilityModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Escape key closes modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    
    // Focus traps to close button for accessibility
    closeButtonRef.current?.focus();
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div 
      className="modal-backdrop" 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}
    >
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="a11y-modal-title"
        style={{
          backgroundColor: 'var(--color-surface-player)',
          border: '1px solid var(--color-border-dark)',
          borderRadius: '12px',
          maxWidth: '560px',
          width: '100%',
          padding: '2rem',
          color: 'var(--color-text-player)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 id="a11y-modal-title" style={{ fontSize: '1.5rem', fontFamily: 'var(--font-family-headings)', color: '#fff' }}>
            ♿ Accessibility & Safe Learning Options
          </h3>
          <button 
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-secondary-text)',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.2rem'
            }}
          >
            &times;
          </button>
        </div>

        <div style={{ fontSize: '0.95rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto', maxHeight: '60vh' }}>
          <section>
            <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.5rem' }}>Keyboard Navigation</h4>
            <p>
              This course player is fully navigable using standard keyboard commands. Use <kbd style={{ background: '#334155', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.8rem' }}>Tab</kbd> to traverse buttons, select boxes, and text input boxes. Hit <kbd style={{ background: '#334155', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.8rem' }}>Space</kbd> or <kbd style={{ background: '#334155', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.8rem' }}>Enter</kbd> to activate.
            </p>
          </section>

          <section>
            <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.5rem' }}>Captions & Transcripts</h4>
            <p>
              Media blocks do not auto-play. Full captions can be toggled using the <strong>Transcript / Captions</strong> panel. A text-alternative transcript box is available under all video blocks in the player.
            </p>
          </section>

          <section>
            <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.5rem' }}>Screen-Reader Support</h4>
            <p>
              Every visual block is configured with rich alt-text alternatives described inside the sequence files. Layouts are constructed semantically to support logical headings reading sequences.
            </p>
          </section>

          <section>
            <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.5rem' }}>Low-Bandwidth Modes</h4>
            <p>
              Heavy video files can be bypassed. We prioritize text-based learning streams, simple illustrations, and downloadable tools to reduce data usage.
            </p>
          </section>

          <section style={{ borderTop: '1px solid var(--color-border-dark)', paddingTop: '1rem', marginTop: '0.5rem' }}>
            <h4 style={{ color: 'var(--color-accent-green)', fontWeight: 600, marginBottom: '0.5rem' }}>🔒 Safe & Private Learning Rules</h4>
            <p>
              Your learning portfolio is stored entirely locally on your device. Do not enter any real community names, staff details, complaints, safeguarding data, or politically sensitive matters in text areas. Keep your notes general and fictional.
            </p>
          </section>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={onClose}
            style={{
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              padding: '0.6rem 1.5rem',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color var(--transition-fast)'
            }}
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
}
