import React, { useState } from 'react';

export default function WeightChart({ currentWeight = 70, targetWeight = 65, onSaveWeight }) {
  const [inputWeight, setInputWeight] = useState(currentWeight);
  const [isEditing, setIsEditing] = useState(false);

  const diff = (currentWeight - targetWeight).toFixed(1);
  const isLossGoal = currentWeight > targetWeight;

  const handleSave = (e) => {
    e.preventDefault();
    if (inputWeight > 0) {
      onSaveWeight(Number(inputWeight));
      setIsEditing(false);
    }
  };

  return (
    <div className="weight-card">
      <div className="weight-header">
        <div>
          <h4 className="weight-title">Weight Tracking Progress</h4>
          <p className="weight-subtitle">
            {isLossGoal 
              ? `${Math.abs(diff)} kg remaining to reach target` 
              : `${Math.abs(diff)} kg gain required to reach target`}
          </p>
        </div>
        <button className="edit-weight-btn" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel' : '⚡ Log Today\'s Weight'}
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSave} className="weight-log-form">
          <input
            type="number"
            step="0.1"
            min="30"
            max="250"
            value={inputWeight}
            onChange={(e) => setInputWeight(e.target.value)}
            className="weight-input"
            placeholder="Enter weight in kg"
            required
          />
          <button type="submit" className="save-weight-btn">Save Log</button>
        </form>
      )}

      <div className="weight-display-grid">
        <div className="weight-stat-box current">
          <span className="stat-label">Current Weight</span>
          <span className="stat-val">{currentWeight} <span className="unit">kg</span></span>
        </div>

        <div className="weight-arrow">
          <span>➔</span>
        </div>

        <div className="weight-stat-box target">
          <span className="stat-label">Target Goal</span>
          <span className="stat-val">{targetWeight} <span className="unit">kg</span></span>
        </div>
      </div>

      {/* Simulated 7-day progress bar chart */}
      <div className="weight-bars-container">
        <span className="bars-title">7-Day Weight Log Trend</span>
        <div className="bars-flex">
          {[
            { day: 'Mon', w: currentWeight + (isLossGoal ? 1.2 : -1.2) },
            { day: 'Tue', w: currentWeight + (isLossGoal ? 0.9 : -0.9) },
            { day: 'Wed', w: currentWeight + (isLossGoal ? 0.6 : -0.6) },
            { day: 'Thu', w: currentWeight + (isLossGoal ? 0.4 : -0.4) },
            { day: 'Fri', w: currentWeight + (isLossGoal ? 0.2 : -0.2) },
            { day: 'Sat', w: currentWeight + (isLossGoal ? 0.1 : -0.1) },
            { day: 'Today', w: currentWeight }
          ].map((item, index) => {
            const heightPct = Math.min(Math.max(((item.w - 40) / 60) * 100, 20), 100);
            return (
              <div key={index} className="bar-col">
                <span className="bar-val">{item.w.toFixed(1)}</span>
                <div className="bar-track">
                  <div 
                    className={`bar-fill ${index === 6 ? 'today' : ''}`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className="bar-day">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
