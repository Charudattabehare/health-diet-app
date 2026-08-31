import React from 'react';

export default function BmiGauge({ bmi = 22.5, status = 'Normal Weight', color = 'emerald' }) {
  const clampedBmi = Math.min(Math.max(bmi, 15), 35);
  const percentage = (clampedBmi - 15) / (35 - 15);
  const rotationDeg = -90 + percentage * 180;

  const colorClasses = {
    emerald: 'text-emerald-400 border-emerald-500 bg-emerald-500/10',
    amber: 'text-amber-400 border-amber-500 bg-amber-500/10',
    rose: 'text-rose-400 border-rose-500 bg-rose-500/10'
  };

  return (
    <div className="bmi-gauge-card">
      <div className="bmi-header">
        <span className="bmi-title">Body Mass Index (BMI)</span>
        <span className={`bmi-status-badge ${colorClasses[color] || colorClasses.emerald}`}>
          {status}
        </span>
      </div>

      <div className="bmi-arc-container">
        <svg viewBox="0 0 200 110" className="bmi-arc-svg">
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            d="M 20 100 A 80 80 0 0 1 50 48"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="16"
          />
          <path
            d="M 50 48 A 80 80 0 0 1 110 22"
            fill="none"
            stroke="#10b981"
            strokeWidth="16"
          />
          <path
            d="M 110 22 A 80 80 0 0 1 156 52"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="16"
          />
          <path
            d="M 156 52 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#f43f5e"
            strokeWidth="16"
          />

          <g transform={`rotate(${rotationDeg}, 100, 100)`}>
            <line x1="100" y1="100" x2="100" y2="32" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
            <circle cx="100" cy="100" r="7" fill="#ffffff" />
          </g>
        </svg>

        <div className="bmi-value-display">
          <span className="bmi-number">{bmi}</span>
          <span className="bmi-unit">kg/m²</span>
        </div>
      </div>

      <div className="bmi-scale-labels">
        <span>15</span>
        <span className="text-emerald-400">18.5 (Ideal)</span>
        <span className="text-amber-400">25.0</span>
        <span>35+</span>
      </div>
    </div>
  );
}
