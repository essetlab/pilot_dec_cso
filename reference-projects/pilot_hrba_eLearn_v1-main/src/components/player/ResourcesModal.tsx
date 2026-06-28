import { useEffect, useRef } from 'react';

interface ResourcesModalProps {
  onClose: () => void;
}

interface ResourceItem {
  title: string;
  description: string;
  fileSize: string;
  type: string;
}

const resourcesData: ResourceItem[] = [
  {
    title: 'CSO HRBA Self-Assessment Sheet (Printable)',
    description: 'Printable PDF worksheet containing the 16 self-assessment statements and scoring matrix for manual offline discussion with team members.',
    fileSize: '342 KB',
    type: 'PDF Worksheet'
  },
  {
    title: 'CSO Safe Learning Guidelines & Protocol',
    description: 'Full documentation on anonymization protocols, safety rules, and context protection guidelines for local civil society teams.',
    fileSize: '180 KB',
    type: 'PDF Document'
  },
  {
    title: 'Module 1 Course Journey Roadmap Diagram',
    description: 'A high-resolution image file summarizing the 7 learning journey steps of the HRBA CSO Course.',
    fileSize: '1.2 MB',
    type: 'PNG Image'
  },
  {
    title: 'Applying HRBA in CSO Practice: Master specification brief',
    description: 'The master specs brief detailing product boundaries, components, structures, and implementation rules.',
    fileSize: '1.4 MB',
    type: 'PDF Specs Document'
  }
];

export default function ResourcesModal({ onClose }: ResourcesModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const simulateDownload = (title: string) => {
    alert(`Simulating download of resource:\n"${title}"\n\nFor the prototype, this acts as a placeholder download trigger.`);
  };

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
        aria-labelledby="resources-modal-title"
        style={{
          backgroundColor: 'var(--color-surface-player)',
          border: '1px solid var(--color-border-dark)',
          borderRadius: '12px',
          maxWidth: '580px',
          width: '100%',
          padding: '2rem',
          color: 'var(--color-text-player)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '85vh'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 id="resources-modal-title" style={{ fontSize: '1.5rem', fontFamily: 'var(--font-family-headings)', color: '#fff' }}>
            📥 Downloadable Resources
          </h3>
          <button 
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close resources"
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

        <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
          {resourcesData.map((item, idx) => (
            <div 
              key={idx} 
              style={{
                padding: '1rem',
                borderRadius: '8px',
                backgroundColor: '#1e293b',
                border: '1px solid var(--color-border-dark)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div>
                <strong style={{ fontSize: '1rem', color: '#fff', display: 'block', marginBottom: '0.25rem' }}>{item.title}</strong>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.4rem', lineHeight: '1.4' }}>{item.description}</p>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-accent-green)', fontWeight: 600 }}>{item.type}</span>
                  <span style={{ color: '#64748b', fontSize: '0.8rem' }}>&bull;</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.fileSize}</span>
                </div>
              </div>
              <button 
                onClick={() => simulateDownload(item.title)}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid var(--color-primary)',
                  color: 'var(--color-primary)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--color-primary)';
                }}
              >
                Download
              </button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--color-border-dark)', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
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
            Close Resources
          </button>
        </div>
      </div>
    </div>
  );
}
