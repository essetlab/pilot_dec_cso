import type { ReactNode } from 'react';

type MainScreenCanvasProps = {
  children: ReactNode;
  className?: string;
};

export default function MainScreenCanvas({
  children,
  className = '',
}: MainScreenCanvasProps) {
  return (
    <main className={`player-main-content ${className}`.trim()} aria-label="Course screen content">
      <div className="main-screen-canvas">
        <div className="main-screen-canvas__content">
          {children}
        </div>
      </div>
    </main>
  );
}
