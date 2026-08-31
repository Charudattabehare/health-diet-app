import React, { useState } from 'react';

export default function ExerciseCard({ exercise }) {
  const [done, setDone] = useState(false);

  if (!exercise) return null;

  const typeColors = {
    'Cardio': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    'Resistance Training': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'Compound Strength': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    'Hypertrophy Strength': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'LISS Cardio': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    'Flexibility': 'bg-teal-500/20 text-teal-300 border-teal-500/30'
  };

  return (
    <div className={`exercise-card ${done ? 'completed' : ''}`}>
      <div className="exercise-card-header">
        <span className={`exercise-type-tag ${typeColors[exercise.type] || 'bg-blue-500/20 text-blue-300'}`}>
          {exercise.type}
        </span>
        <button 
          className={`workout-toggle-btn ${done ? 'active' : ''}`}
          onClick={() => setDone(!done)}
        >
          {done ? '✓ Done' : '+ Start Workout'}
        </button>
      </div>

      <h4 className="exercise-name">{exercise.name}</h4>
      <p className="exercise-desc">{exercise.description}</p>

      <div className="exercise-stats-row">
        <div className="stat-pill">
          <span className="icon">⏱️</span>
          <span>{exercise.durationMins} Mins</span>
        </div>
        <div className="stat-pill">
          <span className="icon">🔥</span>
          <span>~{exercise.caloriesBurned} kcal</span>
        </div>
        <div className="stat-pill">
          <span className="icon">⚡</span>
          <span>{exercise.intensity}</span>
        </div>
      </div>

      <div className="exercise-sets-box">
        <span className="sets-label">Target Sets / Protocol:</span>
        <span className="sets-value">{exercise.setsReps}</span>
      </div>
    </div>
  );
}
