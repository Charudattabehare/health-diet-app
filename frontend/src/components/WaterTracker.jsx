import React from 'react';

export default function WaterTracker({ glasses = 0, onUpdate }) {
  const targetGlasses = 14; // 3.5 Liters
  const currentLiters = (glasses * 0.25).toFixed(1);
  const percentage = Math.min(Math.round((glasses / targetGlasses) * 100), 100);

  return (
    <div className="water-tracker-card">
      <div className="water-header">
        <div className="water-title-wrap">
          <span className="water-icon">💧</span>
          <div>
            <h4 className="water-title">Daily Hydration Log</h4>
            <p className="water-subtitle">Target: 3.5 L (14 Glasses / 250ml each)</p>
          </div>
        </div>
        <div className="water-counter">
          <span className="current-liters">{currentLiters} L</span>
          <span className="target-pct">{percentage}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="water-progress-bar-bg">
        <div 
          className="water-progress-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Interactive Glasses Grid */}
      <div className="glasses-grid">
        {Array.from({ length: targetGlasses }).map((_, idx) => {
          const isFilled = idx < glasses;
          return (
            <button
              key={idx}
              className={`glass-btn ${isFilled ? 'filled' : ''}`}
              onClick={() => onUpdate(isFilled ? idx : idx + 1)}
              title={isFilled ? `Glass ${idx + 1} drank` : `Click to log glass ${idx + 1}`}
            >
              <svg width="22" height="28" viewBox="0 0 24 30" fill="none">
                <path
                  d="M4 4 L6 26 C6 27.1 6.9 28 8 28 L16 28 C17.1 28 18 27.1 18 26 L20 4 Z"
                  stroke={isFilled ? '#38bdf8' : 'rgba(255,255,255,0.2)'}
                  strokeWidth="2"
                  fill={isFilled ? 'rgba(56, 189, 248, 0.35)' : 'none'}
                />
                {isFilled && (
                  <path
                    d="M 6 14 Q 12 11 18 14 L 17.5 25 C 17.5 26 16.8 26.5 16 26.5 L 8 26.5 C 7.2 26.5 6.5 26 6.5 25 Z"
                    fill="#38bdf8"
                  />
                )}
              </svg>
              <span className="glass-num">{idx + 1}</span>
            </button>
          );
        })}
      </div>

      <div className="water-actions">
        <button 
          className="water-btn-sub"
          onClick={() => onUpdate(Math.max(0, glasses - 1))}
          disabled={glasses <= 0}
        >
          - Remove Glass
        </button>
        <button 
          className="water-btn-add"
          onClick={() => onUpdate(glasses + 1)}
        >
          + Drink Glass (+250ml)
        </button>
      </div>
    </div>
  );
}
