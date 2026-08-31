import React from 'react';

export default function DietCard({ meal, isCompleted, onToggle }) {
  if (!meal) return null;

  return (
    <div className={`diet-card ${isCompleted ? 'completed' : ''}`}>
      <div className="diet-card-header">
        <div className="meal-time-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {meal.time || 'Schedule'}
        </div>
        <button 
          className={`meal-check-btn ${isCompleted ? 'checked' : ''}`}
          onClick={onToggle}
          title={isCompleted ? 'Mark as incomplete' : 'Mark meal completed'}
        >
          {isCompleted ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <span className="check-circle" />
          )}
        </button>
      </div>

      <h4 className="meal-title">{meal.name}</h4>
      <p className="meal-description">{meal.description}</p>

      <div className="meal-macros-grid">
        <div className="macro-chip kcal">
          <span className="label">Energy</span>
          <span className="val">{meal.kcal} kcal</span>
        </div>
        <div className="macro-chip protein">
          <span className="label">Protein</span>
          <span className="val">{meal.protein}</span>
        </div>
        <div className="macro-chip carbs">
          <span className="label">Carbs</span>
          <span className="val">{meal.carbs}</span>
        </div>
        <div className="macro-chip fat">
          <span className="label">Fats</span>
          <span className="val">{meal.fat}</span>
        </div>
      </div>
    </div>
  );
}
