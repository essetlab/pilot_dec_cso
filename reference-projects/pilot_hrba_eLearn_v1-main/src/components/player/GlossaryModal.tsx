import { useState, useEffect, useRef } from 'react';

interface GlossaryModalProps {
  onClose: () => void;
}

interface GlossaryItem {
  term: string;
  definition: string;
  category: string;
}

const glossaryData: GlossaryItem[] = [
  {
    term: 'Rights-Holders',
    definition: 'All people are rights-holders who possess rights, voice, agency, and legitimate claims. CSOs support them in recognizing and claiming these rights safely.',
    category: 'Actors'
  },
  {
    term: 'Duty-Bearers',
    definition: 'Institutions, public offices, authorities, or service providers with legal or moral obligations to respect, protect, and fulfill the rights of communities.',
    category: 'Actors'
  },
  {
    term: 'Participation',
    definition: 'A core HRBA principle. Ensuring that people affected by a CSO decision have a real, meaningful say early in planning and implementing programs.',
    category: 'Principles'
  },
  {
    term: 'Accountability',
    definition: 'The obligation of CSOs and duty-bearers to explain selections, criteria, funding, and results, and to offer safe, trusted complaints channels to hear concerns.',
    category: 'Principles'
  },
  {
    term: 'Empowerment',
    definition: 'Supporting rights-holders to understand rights, speak for themselves, and directly engage local authorities, rather than relying on CSOs to speak for them.',
    category: 'Principles'
  },
  {
    term: 'Legality',
    definition: 'Ensuring that CSO activities align with human rights standards, international treaty guidance, and national laws without compromising safety.',
    category: 'Principles'
  },
  {
    term: 'Non-Discrimination & Equality',
    definition: 'Deliberately checking who is excluded from services or benefits, disaggregating data safely, and adjusting program outreach to reach the most vulnerable.',
    category: 'Principles'
  },
  {
    term: 'CSO Support Role',
    definition: 'CSOs act as a bridge. They document barriers, facilitate dialogues, and empower rights-holders to claims, but they are not the primary duty-bearer.',
    category: 'Actors'
  }
];

export default function GlossaryModal({ onClose }: GlossaryModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const filteredData = glossaryData.filter(
    (item) =>
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        aria-labelledby="glossary-modal-title"
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 id="glossary-modal-title" style={{ fontSize: '1.5rem', fontFamily: 'var(--font-family-headings)', color: '#fff' }}>
            📖 HRBA Course Glossary
          </h3>
          <button 
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close glossary"
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

        <div style={{ marginBottom: '1.5rem' }}>
          <input 
            type="text" 
            placeholder="Search key terms or definitions..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '6px',
              border: '1px solid var(--color-border-dark)',
              backgroundColor: '#0f172a',
              color: '#fff',
              outline: 'none',
              fontSize: '0.95rem'
            }}
          />
        </div>

        <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
          {filteredData.length > 0 ? (
            filteredData.map((item, idx) => (
              <div 
                key={idx} 
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  backgroundColor: '#1e293b',
                  borderLeft: '4px solid var(--color-primary)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
                  <strong style={{ fontSize: '1.1rem', color: '#fff' }}>{item.term}</strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-primary-light)', backgroundColor: 'rgba(59, 153, 212, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 600 }}>{item.category}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: '1.4' }}>{item.definition}</p>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--color-secondary-text)', padding: '2rem 0' }}>
              No terms matching your search criteria.
            </div>
          )}
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
            Close Glossary
          </button>
        </div>
      </div>
    </div>
  );
}
