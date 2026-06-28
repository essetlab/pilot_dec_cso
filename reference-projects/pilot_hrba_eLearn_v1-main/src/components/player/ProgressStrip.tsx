interface ProgressStripProps {
  percentage: number;
}

export default function ProgressStrip({ percentage }: ProgressStripProps) {
  // Ensure percentage stays between 0 and 100
  const widthPercent = Math.max(0, Math.min(100, percentage));

  return (
    <div
      className="player-progress-strip"
      style={{
        width: '100%',
        backgroundColor: '#1e293b',
        height: '4px',
        overflow: 'hidden'
      }}
    >
      <div 
        style={{
          width: `${widthPercent}%`,
          backgroundColor: 'var(--color-primary-light)',
          height: '100%',
          transition: 'width 0.4s ease-out'
        }}
      ></div>
    </div>
  );
}
