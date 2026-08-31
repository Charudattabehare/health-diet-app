import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import BmiGauge from '../components/BmiGauge.jsx';

export default function Home({ setActivePage }) {
  const { user } = useAuth();
  const [calcHeight, setCalcHeight] = useState(170);
  const [calcWeight, setCalcWeight] = useState(72);
  const [calcAge, setCalcAge] = useState(25);
  const [calcGender, setCalcGender] = useState('male');
  const [calcGoal, setCalcGoal] = useState('weight_loss');

  // Quick preview BMI
  const heightM = calcHeight / 100;
  const previewBmi = parseFloat((calcWeight / (heightM * heightM)).toFixed(1));
  const previewStatus = previewBmi < 18.5 ? 'Underweight' : previewBmi < 25 ? 'Normal Weight' : previewBmi < 30 ? 'Overweight' : 'Obese';
  const previewColor = previewBmi < 18.5 ? 'amber' : previewBmi < 25 ? 'emerald' : previewBmi < 30 ? 'amber' : 'rose';

  // Preview calories
  let bmr = 10 * calcWeight + 6.25 * calcHeight - 5 * calcAge + (calcGender === 'male' ? 5 : -161);
  let tdee = Math.round(bmr * 1.55);
  let targetKcal = calcGoal === 'weight_loss' ? Math.round(tdee - 500) : Math.round(tdee + 500);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">
            ✨ SCIENTIFIC DIET & EXERCISE ENGINE
          </span>
          <h1 className="hero-title">
            Achieve Your Target Weight with <span className="gradient-text">Precision Nutrition</span> & Workouts
          </h1>
          <p className="hero-description">
            Whether your objective is <strong>Weight Loss</strong> through sustainable caloric deficits or <strong>Weight Gain</strong> via lean muscle hyper-trophy, NutriFit360 generates personalized meal plans and workout schedules tailored to your body metrics.
          </p>

          <div className="hero-cta-group">
            {user ? (
              <button className="cta-primary-btn" onClick={() => setActivePage('dashboard')}>
                🚀 Go to My Dashboard
              </button>
            ) : (
              <>
                <button className="cta-primary-btn" onClick={() => setActivePage('register')}>
                  ⚡ Create Account & Plan
                </button>
                <button className="cta-secondary-btn" onClick={() => setActivePage('login')}>
                  🔑 Log In with 6-Digit PIN
                </button>
              </>
            )}
          </div>

          <div className="security-note font-medium">
            🔒 Protected with 6-Digit Password PIN condition & Secure JWT Authentication
          </div>
        </div>

        {/* Hero Interactive Calculator Box */}
        <div className="hero-preview-card">
          <h3 className="preview-card-title">Instant Health & Diet Estimator</h3>
          <div className="calc-inputs-grid">
            <div className="calc-field">
              <label>Goal</label>
              <select value={calcGoal} onChange={(e) => setCalcGoal(e.target.value)}>
                <option value="weight_loss">🔥 Weight Loss (-500 kcal)</option>
                <option value="weight_gain">💪 Weight Gain (+500 kcal)</option>
              </select>
            </div>

            <div className="calc-field">
              <label>Gender</label>
              <select value={calcGender} onChange={(e) => setCalcGender(e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="calc-field">
              <label>Height: {calcHeight} cm</label>
              <input 
                type="range" 
                min="120" 
                max="220" 
                value={calcHeight} 
                onChange={(e) => setCalcHeight(Number(e.target.value))} 
              />
            </div>

            <div className="calc-field">
              <label>Weight: {calcWeight} kg</label>
              <input 
                type="range" 
                min="40" 
                max="180" 
                value={calcWeight} 
                onChange={(e) => setCalcWeight(Number(e.target.value))} 
              />
            </div>
          </div>

          <div className="preview-results-row">
            <div className="result-chip">
              <span className="res-label">Estimated Target</span>
              <span className="res-val text-emerald-400">{targetKcal} kcal/day</span>
            </div>
            <div className="result-chip">
              <span className="res-label">Daily Deficit/Surplus</span>
              <span className="res-val">{calcGoal === 'weight_loss' ? '-500 kcal' : '+500 kcal'}</span>
            </div>
          </div>

          <BmiGauge bmi={previewBmi} status={previewStatus} color={previewColor} />

          <button 
            className="generate-full-plan-btn"
            onClick={() => setActivePage(user ? 'diet' : 'register')}
          >
            Get Detailed Meal & Exercise Plan →
          </button>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="features-grid-section">
        <h2 className="section-heading text-center">Comprehensive MERN Health Platform</h2>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🥗</div>
            <h3>Custom Diet Generator</h3>
            <p>Calculates daily calorie requirements and macro ratios (Protein, Carbs, Fats) tailored specifically for Weight Gain or Weight Loss based on your dietary preferences (Veg, Non-Veg, Keto, Vegan).</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🏋️‍♂️</div>
            <h3>Guided Exercise Engine</h3>
            <p>Complete workout routines specifying exact exercise types, sets, reps, duration (mins), target calorie burn, and weekly frequency to maximize physical results.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💧</div>
            <h3>Hydration & Meal Tracker</h3>
            <p>Interactive dashboard to log daily water consumption glass by glass, track weight changes, and mark off completed meals and workouts throughout the day.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>6-Digit PIN Security & JWT</h3>
            <p>Full-stack Node/Express/MongoDB authentication system with strict 6-digit password verification and JWT token authorization for secure user profiles.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
