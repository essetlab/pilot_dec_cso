interface PlayerHeaderProps {
  moduleTitle: string;
  screenTitle: string;
  currentIndex: number;
  totalScreens: number;
  onPrev: () => void;
  onNext: () => void;
  onExit: () => void;
  prevDisabled: boolean;
  nextDisabled: boolean;
}

export default function PlayerHeader({
  moduleTitle,
  screenTitle,
  currentIndex,
  totalScreens,
  onPrev,
  onNext,
  onExit,
  prevDisabled,
  nextDisabled
}: PlayerHeaderProps) {
  return (
    <header className="player-header">
      <div className="player-header-info">
        <img
          src="/assets/brand/logos/dec-logo.png"
          alt="Development Expertise Center"
          className="player-header-logo"
        />
        <div className="player-header-divider" aria-hidden="true"></div>
        <div className="player-header-copy">
          <h2 className="player-header-title">
            {moduleTitle}
          </h2>
          <div className="player-header-meta">
            <span className="player-header-screen-title">
              {screenTitle}
            </span>
            <span className="player-header-meta-dot" aria-hidden="true">&bull;</span>
            <span className="player-header-screen-count">Screen {currentIndex} of {totalScreens}</span>
          </div>
        </div>
      </div>

      <nav className="player-header-nav" aria-label="Screen navigation">
        <button 
          type="button"
          onClick={onPrev}
          disabled={prevDisabled}
          aria-label="Previous screen"
          className="player-header-button player-header-button--secondary"
        >
          Prev
        </button>
        <button 
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          aria-label="Next screen"
          className="player-header-button player-header-button--primary"
        >
          Next
        </button>
        <button
          type="button"
          onClick={onExit}
          aria-label="Return to course page"
          className="player-header-button player-header-button--exit"
        >
          Course
        </button>
      </nav>
    </header>
  );
}
