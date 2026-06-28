import CourseRoadmap from './CourseRoadmap';
import { HRBA_COURSE_MODULES } from '../../data/hrbaCourseModules';

interface PlatformShellProps {
  completedModules: string[];
  screenProgress: Record<string, string[]>;
  currentModuleId: string | null;
  currentScreenId: string | null;
  onLaunchModule: (moduleId: string, reviewMode: boolean) => void;
}

export default function PlatformShell({
  completedModules,
  screenProgress,
  currentModuleId,
  currentScreenId,
  onLaunchModule,
}: PlatformShellProps) {
  const module5 = HRBA_COURSE_MODULES[4];

  return (
    <div className="platform-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Layer 1 Platform Header */}
      <header
        className="platform-header"
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          paddingBottom: '1.5rem', 
          borderBottom: '1px solid var(--color-border)',
          marginBottom: '2rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div 
            style={{ 
              width: '45px', 
              height: '45px', 
              backgroundColor: 'var(--color-primary)', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#fff', 
              fontWeight: 800,
              fontSize: '1.1rem'
            }}
          >
            DEC
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', color: 'var(--color-deep-navy)', fontFamily: 'var(--font-family-headings)', fontWeight: 800 }}>
              CSO Learning Hub
            </h1>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)', fontWeight: 500 }}>
              Ethical & Rights-Based Capacity Platform
            </span>
          </div>
        </div>

        <nav className="platform-header__nav" style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
          <span style={{ cursor: 'pointer', color: 'var(--color-primary)' }}>Catalogue</span>
          <span style={{ cursor: 'pointer', color: 'var(--color-secondary-text)' }}>My Portfolio</span>
          <span style={{ cursor: 'pointer', color: 'var(--color-secondary-text)' }}>Focal Support</span>
        </nav>
      </header>

      {/* Main LMS overview banner */}
      <main style={{ flexGrow: 1 }}>
        <div
          className="platform-course-hero"
          style={{ 
            background: 'linear-gradient(135deg, var(--color-deep-navy) 0%, var(--color-primary) 100%)', 
            color: '#ffffff', 
            padding: '2.5rem', 
            borderRadius: '16px', 
            marginBottom: '2rem', 
            boxShadow: '0 10px 20px -5px rgba(15, 23, 42, 0.15)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'relative', zIndex: 2 }}>
            <span
              style={{ 
                textTransform: 'uppercase', 
                fontSize: '0.7rem', 
                fontWeight: 800, 
                letterSpacing: '0.1em', 
                backgroundColor: 'rgba(255,255,255,0.15)', 
                color: 'var(--color-accent-green)',
                padding: '0.3rem 0.8rem', 
                borderRadius: '9999px' 
              }}
            >
              Flagship Course Enrolled
            </span>
            <h2 style={{ fontSize: '2.25rem', marginTop: '1rem', marginBottom: '0.75rem', fontFamily: 'var(--font-family-headings)', fontWeight: 800 }}>
              Applying the Human Rights-Based Approach in CSO Practice
            </h2>
            <p style={{ fontSize: '1rem', maxWidth: '760px', opacity: 0.9, lineHeight: '1.6' }}>
              This specialized training program guides local civil society organization team members through five practical modules on safe HRBA learning, foundations, project design, implementation, and MEAL.
            </p>
          </div>
          
          {/* Subtle design accents */}
          <div className="platform-course-hero__accent" style={{ position: 'absolute', right: '-40px', bottom: '-40px', width: '200px', height: '200px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.03)', zIndex: 1 }}></div>
        </div>

        <section className="course-progress-panel" aria-label="Course progress update">
          <div className="course-progress-panel__icon" aria-hidden="true">✓</div>
          <div className="course-progress-panel__copy">
            <h3>Great progress! You’ve completed Module 4.</h3>
            <p>
              You have successfully completed “Applying HRBA During Implementation”.
              You’re now continuing with Module 5: HRBA in Monitoring, Evaluation, Accountability, and Learning.
            </p>
          </div>
          <button
            type="button"
            className="course-progress-panel__cta"
            onClick={() => onLaunchModule(module5.moduleId, false)}
          >
            Continue to Module 5
            <span aria-hidden="true">›</span>
          </button>
        </section>

        {/* Roadmap component */}
        <CourseRoadmap 
          completedModules={completedModules}
          screenProgress={screenProgress}
          currentModuleId={currentModuleId}
          currentScreenId={currentScreenId}
          onLaunchModule={onLaunchModule}
        />
      </main>

      {/* Footer */}
      <footer 
        style={{ 
          marginTop: '4rem', 
          paddingTop: '1.5rem', 
          borderTop: '1px solid var(--color-border)', 
          textAlign: 'center', 
          color: 'var(--color-secondary-text)', 
          fontSize: '0.8rem' 
        }}
      >
        <p>&copy; {new Date().getFullYear()} CSO Learning Hub. Developed in strict compliance with DEC HRBA specifications.</p>
        <p style={{ marginTop: '0.25rem', color: '#9ca3af', fontSize: '0.75rem' }}>Private local-only storage active. No external databases queried.</p>
      </footer>
    </div>
  );
}
