import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import DietCard from '../components/DietCard.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { exportPlanAsJson, printHealthPlan } from '../utils/exportUtils.js';

export default function DietPlanPage({ activePage, setActivePage }) {
  const { user } = useAuth();
  const { dietPlan, generateNewPlan, todayLog, toggleMealItem } = useHealth();

  const [healthGoal, setHealthGoal] = useState(dietPlan?.healthGoal || 'weight_loss');
  const [age, setAge] = useState(dietPlan?.age || 25);
  const [gender, setGender] = useState(dietPlan?.gender || 'male');
  const [heightCm, setHeightCm] = useState(dietPlan?.heightCm || 175);
  const [currentWeightKg, setCurrentWeightKg] = useState(dietPlan?.currentWeightKg || 70);
  const [targetWeightKg, setTargetWeightKg] = useState(dietPlan?.targetWeightKg || (healthGoal === 'weight_loss' ? 65 : 75));
  const [activityLevel, setActivityLevel] = useState(dietPlan?.activityLevel || 'moderate');
  const [dietPreference, setDietPreference] = useState(dietPlan?.dietPreference || 'vegetarian');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await generateNewPlan({
        age,
        gender,
        heightCm,
        currentWeightKg,
        targetWeightKg,
        activityLevel,
        dietPreference,
        healthGoal
      });
    } catch (err) {
      alert('Error updating plan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const plan = dietPlan || {};
  const isLoss = (plan.healthGoal || healthGoal) === 'weight_loss';

  return (
    <div className="dashboard-layout">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <main className="dashboard-main-content">
        <div className="page-header-box flex justify-between items-center">
          <div>
            <span className="page-tag font-semibold">NUTRITION ENGINE</span>
            <h2 className="page-title font-bold">Personalized Diet Generator</h2>
            <p className="page-sub">
              Customize your goal for <strong>Weight Loss</strong> or <strong>Weight Gain</strong> and generate an exact daily meal plan.
            </p>
          </div>

          {plan.targetCalories && (
            <div className="export-action-btns no-print">
              <button 
                className="export-btn print-btn" 
                onClick={printHealthPlan}
                title="Print or Save as PDF"
              >
                📄 Save as PDF / Print
              </button>
              <button 
                className="export-btn json-btn" 
                onClick={() => exportPlanAsJson(plan, user)}
                title="Download JSON file"
              >
                📥 Download JSON Data
              </button>
            </div>
          )}
        </div>

        {/* Printable Header Banner (Only visible during print) */}
        <div className="printable-only-header">
          <h1>NutriFit360 - Official Personal Health Plan</h1>
          <p>Prepared for: {user?.name || 'Valued User'} | Date: {new Date().toLocaleDateString()}</p>
          <hr />
        </div>

        {/* Form Controls to Recalculate */}
        <div className="diet-form-card no-print">
          <form onSubmit={handleSubmit} className="diet-generator-form">
            <div className="form-row goal-row">
              <label className="row-label">Select Primary Objective</label>
              <div className="goal-toggle-btns">
                <button
                  type="button"
                  className={`goal-btn ${healthGoal === 'weight_loss' ? 'active loss' : ''}`}
                  onClick={() => { setHealthGoal('weight_loss'); setTargetWeightKg(Math.max(40, currentWeightKg - 5)); }}
                >
                  🔥 Weight Loss (Caloric Deficit)
                </button>
                <button
                  type="button"
                  className={`goal-btn ${healthGoal === 'weight_gain' ? 'active gain' : ''}`}
                  onClick={() => { setHealthGoal('weight_gain'); setTargetWeightKg(currentWeightKg + 5); }}
                >
                  💪 Weight Gain (Caloric Surplus)
                </button>
              </div>
            </div>

            <div className="form-grid-4col">
              <div className="form-group">
                <label>Age (years)</label>
                <input
                  type="number"
                  min="12"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="form-group">
                <label>Height (cm)</label>
                <input
                  type="number"
                  min="100"
                  max="250"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Current Weight (kg)</label>
                <input
                  type="number"
                  min="30"
                  max="250"
                  value={currentWeightKg}
                  onChange={(e) => setCurrentWeightKg(Number(e.target.value))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Target Weight (kg)</label>
                <input
                  type="number"
                  min="30"
                  max="250"
                  value={targetWeightKg}
                  onChange={(e) => setTargetWeightKg(Number(e.target.value))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Activity Level</label>
                <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
                  <option value="sedentary">Sedentary (Desk Job)</option>
                  <option value="light">Lightly Active (1-2 days workout)</option>
                  <option value="moderate">Moderately Active (3-5 days workout)</option>
                  <option value="active">Very Active (6-7 days intense)</option>
                </select>
              </div>

              <div className="form-group col-span-2">
                <label>Dietary Preference</label>
                <select value={dietPreference} onChange={(e) => setDietPreference(e.target.value)}>
                  <option value="vegetarian">🥬 Vegetarian</option>
                  <option value="non_vegetarian">🍗 Non-Vegetarian</option>
                  <option value="vegan">🌱 Vegan (Plant-Based)</option>
                  <option value="keto">🥑 Keto (High Fat, Low Carb)</option>
                  <option value="high_protein">🥩 High Protein</option>
                </select>
              </div>
            </div>

            <button type="submit" className="generate-submit-btn" disabled={loading}>
              {loading ? 'Generating Custom Diet Plan...' : '⚡ Generate My Personalized Diet Plan →'}
            </button>
          </form>
        </div>

        {/* Plan Output Summary */}
        {plan.targetCalories && (
          <>
            <div className="diet-summary-banner">
              <div className="summary-left">
                <h3>Daily Energy Target: <span className="kcal-text">{plan.targetCalories} kcal</span></h3>
                <p>Calculated TDEE: {plan.tdee || 2400} kcal | Goal: {isLoss ? 'Caloric Deficit' : 'Caloric Surplus'}</p>
              </div>

              <div className="macro-pills-row">
                <div className="macro-badge p">
                  <span>Protein</span>
                  <strong>{plan.macros?.proteinGrams || 150}g</strong>
                </div>
                <div className="macro-badge c">
                  <span>Carbs</span>
                  <strong>{plan.macros?.carbsGrams || 220}g</strong>
                </div>
                <div className="macro-badge f">
                  <span>Fats</span>
                  <strong>{plan.macros?.fatGrams || 55}g</strong>
                </div>
              </div>
            </div>

            {/* Daily Meals Breakdown */}
            <div className="meals-section font-sans">
              <h3 className="section-title">Your 5-Meal Daily Diet Schedule</h3>
              <div className="meals-grid-cards">
                {plan.mealPlan && plan.mealPlan.map((meal, idx) => (
                  <DietCard
                    key={idx}
                    meal={meal}
                    isCompleted={todayLog.completedMeals?.includes(meal.name)}
                    onToggle={() => toggleMealItem(meal.name)}
                  />
                ))}
              </div>
            </div>

            {/* WHAT DIET SHOULD DO Section */}
            <div className="guidelines-section-card">
              <div className="guidelines-header">
                <span className="icon">💡</span>
                <div>
                  <h3>What Your Diet Should Do ({isLoss ? 'Weight Loss Guidelines' : 'Weight Gain Guidelines'})</h3>
                  <p>Essential science-based rules for maximum success with this diet plan.</p>
                </div>
              </div>

              <div className="guidelines-list">
                {plan.dietGuidelines && plan.dietGuidelines.map((rule, idx) => (
                  <div key={idx} className="rule-item">
                    <span className="rule-number">{idx + 1}</span>
                    <div>
                      <h4 className="rule-title">{rule.title}</h4>
                      <p className="rule-desc">{rule.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
