import React from 'react';
import { useHealth } from '../context/HealthContext.jsx';
import ExerciseCard from '../components/ExerciseCard.jsx';
import Sidebar from '../components/Sidebar.jsx';

export default function ExercisePage({ activePage, setActivePage }) {
  const { dietPlan } = useHealth();

  const plan = dietPlan || {};
  const workout = plan.workoutPlan || {
    weeklyFrequency: '4 - 5 Days per Week',
    sessionDuration: '45 - 60 Minutes',
    targetCalorieBurn: '350 - 500 kcal per session',
    focusArea: 'Fat Loss & Lean Muscle Retention',
    exercises: [
      { name: 'Morning HIIT Cardio & Jump Rope', type: 'Cardio', durationMins: 20, caloriesBurned: 180, intensity: 'High', setsReps: '30s Work / 15s Rest x 15 Rounds', description: 'Alternate jump rope, mountain climbers, and high knees.' },
      { name: 'Bodyweight & Dumbbell Circuit', type: 'Resistance Training', durationMins: 25, caloriesBurned: 200, intensity: 'Moderate-High', setsReps: '4 Sets x 12-15 Reps', description: 'Goblet squats, push-ups, dumbbell bent-over rows, and lunges.' },
      { name: 'Brisk Incline Treadmill Walk', type: 'LISS Cardio', durationMins: 15, caloriesBurned: 100, intensity: 'Moderate', setsReps: '15 Mins @ 10% Incline', description: 'Low-impact steady-state cardio.' }
    ]
  };

  const isLoss = plan.healthGoal === 'weight_loss';

  return (
    <div className="dashboard-layout">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <main className="dashboard-main-content">
        <div className="page-header-box">
          <span className="page-tag">WORKOUT ROUTINE ENGINE</span>
          <h2 className="page-title font-bold">Personalized Exercise Guide</h2>
          <p className="page-sub">
            Targeted physical training routine engineered for <strong>{isLoss ? 'Fat Loss & EPOC Afterburn' : 'Hypertrophy & Muscle Mass Gain'}</strong>.
          </p>
        </div>

        {/* Workout Plan Metrics Banner */}
        <div className="workout-metrics-banner">
          <div className="banner-item">
            <span className="icon font-bold">📅</span>
            <div>
              <span className="lbl">Recommended Frequency</span>
              <span className="val">{workout.weeklyFrequency}</span>
            </div>
          </div>

          <div className="banner-item">
            <span className="icon font-bold">⏱️</span>
            <div>
              <span className="lbl">Session Duration</span>
              <span className="val">{workout.sessionDuration}</span>
            </div>
          </div>

          <div className="banner-item">
            <span className="icon font-bold">🔥</span>
            <div>
              <span className="lbl">Target Session Burn</span>
              <span className="val">{workout.targetCalorieBurn}</span>
            </div>
          </div>

          <div className="banner-item">
            <span className="icon font-bold">🎯</span>
            <div>
              <span className="lbl">Primary Focus</span>
              <span className="val">{workout.focusArea}</span>
            </div>
          </div>
        </div>

        {/* Exercises List */}
        <div className="exercise-section">
          <h3 className="section-title">Recommended Workout Schedule</h3>
          <div className="exercise-cards-grid">
            {workout.exercises && workout.exercises.map((ex, idx) => (
              <ExerciseCard key={idx} exercise={ex} />
            ))}
          </div>
        </div>

        {/* HOW MUCH EXERCISE SHOULD DO Section */}
        <div className="guidelines-section-card workout-rules">
          <div className="guidelines-header">
            <span className="icon font-bold">🏋️</span>
            <div>
              <h3>How Much Exercise Should You Do? ({isLoss ? 'Weight Loss Protocol' : 'Weight Gain Protocol'})</h3>
              <p>Key guidelines regarding frequency, workout split, intensity, and recovery.</p>
            </div>
          </div>

          <div className="guidelines-list">
            {plan.exerciseGuidelines ? (
              plan.exerciseGuidelines.map((rule, idx) => (
                <div key={idx} className="rule-item">
                  <span className="rule-number">{idx + 1}</span>
                  <div>
                    <h4 className="rule-title">{rule.title}</h4>
                    <p className="rule-desc">{rule.desc}</p>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="rule-item">
                  <span className="rule-number">1</span>
                  <div>
                    <h4 className="rule-title">Frequency & Duration</h4>
                    <p className="rule-desc">Perform 4 to 5 days of structured exercise per week, keeping each workout between 45 and 60 minutes to prevent excess cortisol release.</p>
                  </div>
                </div>
                <div className="rule-item">
                  <span className="rule-number">2</span>
                  <div>
                    <h4 className="rule-title">Cardio vs Resistance Ratio</h4>
                    <p className="rule-desc">{isLoss ? 'Combine 50% Cardio (HIIT/LISS) with 50% Resistance Training to burn calories while preserving metabolic lean muscle.' : 'Focus 80% on Compound Strength lifts (Squats, Deadlifts, Presses) and keep cardio light (20%) to preserve energy for muscle building.'}</p>
                  </div>
                </div>
                <div className="rule-item">
                  <span className="rule-number">3</span>
                  <div>
                    <h4 className="rule-title">Sleep & Recovery Protocol</h4>
                    <p className="rule-desc">Allow 48 hours of rest for major muscle groups before re-training them. Ensure 7 to 9 hours of quality sleep every night for tissue repair.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
