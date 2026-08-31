import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useHealth } from '../context/HealthContext.jsx';
import BmiGauge from '../components/BmiGauge.jsx';
import WaterTracker from '../components/WaterTracker.jsx';
import WeightChart from '../components/WeightChart.jsx';
import DietCard from '../components/DietCard.jsx';
import Sidebar from '../components/Sidebar.jsx';

export default function Dashboard({ activePage, setActivePage }) {
  const { user } = useAuth();
  const { dietPlan, todayLog, updateWaterIntake, toggleMealItem, recordWeight } = useHealth();

  const plan = dietPlan || {
    healthGoal: 'weight_loss',
    targetCalories: 1950,
    bmi: 22.5,
    bmiStatus: 'Normal Weight',
    bmiColor: 'emerald',
    currentWeightKg: 70,
    targetWeightKg: 65,
    macros: { proteinGrams: 150, carbsGrams: 220, fatGrams: 55 },
    mealPlan: [
      { name: 'Oatmeal & Berries with Almond Milk', time: '08:00 AM', kcal: 450, protein: '15g', carbs: '45g', fat: '7g', description: 'Rolled oats cooked in almond milk, topped with fresh blueberries, chia seeds.' },
      { name: 'Greek Yogurt & Walnuts', time: '11:00 AM', kcal: 250, protein: '18g', carbs: '12g', fat: '6g', description: 'Plain low-fat Greek yogurt with a sprinkle of crushed walnuts.' },
      { name: 'Quinoa Paneer / Tofu Salad Bowl', time: '01:30 PM', kcal: 550, protein: '28g', carbs: '40g', fat: '12g', description: 'Grilled paneer/tofu over quinoa, mixed greens, cherry tomatoes.' }
    ]
  };

  const isLoss = plan.healthGoal === 'weight_loss';
  const completedMealsCount = todayLog.completedMeals?.length || 0;
  const totalMealsCount = plan.mealPlan?.length || 5;
  const mealProgressPct = Math.round((completedMealsCount / totalMealsCount) * 100);

  return (
    <div className="dashboard-layout">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <main className="dashboard-main-content">
        {/* Top Welcome Banner */}
        <div className="dash-welcome-banner">
          <div className="welcome-text">
            <h2>Welcome back, <span className="highlight-name">{user?.name || 'Health Enthusiast'}</span>! 👋</h2>
            <p>Here is your personalized daily nutrition & exercise tracking overview.</p>
          </div>

          <div className="banner-goal-tag">
            <span className="goal-icon-large">{isLoss ? '🔥' : '💪'}</span>
            <div>
              <span className="tag-label">Active Program</span>
              <span className="tag-val">{isLoss ? 'Weight Loss Deficit Plan' : 'Weight Gain Surplus Plan'}</span>
            </div>
          </div>
        </div>

        {/* Top Metrics Cards Row */}
        <div className="metrics-cards-grid">
          {/* Calorie Card */}
          <div className="metric-card kcal-card">
            <div className="metric-icon-wrap">🔥</div>
            <div className="metric-details">
              <span className="metric-label">Target Energy</span>
              <span className="metric-value">{plan.targetCalories} <span className="unit">kcal/day</span></span>
              <span className="metric-sub">{isLoss ? '500 kcal Deficit' : '500 kcal Surplus'}</span>
            </div>
          </div>

          {/* Protein Card */}
          <div className="metric-card protein-card">
            <div className="metric-icon-wrap">🥩</div>
            <div className="metric-details">
              <span className="metric-label">Daily Protein Target</span>
              <span className="metric-value">{plan.macros?.proteinGrams || 150} <span className="unit">g</span></span>
              <span className="metric-sub">Builds muscle tissue</span>
            </div>
          </div>

          {/* Carbs Card */}
          <div className="metric-card carbs-card">
            <div className="metric-icon-wrap">🌾</div>
            <div className="metric-details">
              <span className="metric-label">Daily Carbs Target</span>
              <span className="metric-value">{plan.macros?.carbsGrams || 220} <span className="unit">g</span></span>
              <span className="metric-sub">Sustained energy</span>
            </div>
          </div>

          {/* Fat Card */}
          <div className="metric-card fat-card">
            <div className="metric-icon-wrap">🥑</div>
            <div className="metric-details">
              <span className="metric-label">Healthy Fats Target</span>
              <span className="metric-value">{plan.macros?.fatGrams || 55} <span className="unit">g</span></span>
              <span className="metric-sub">Hormonal balance</span>
            </div>
          </div>
        </div>

        {/* Main Grid: BMI & Hydration & Weight */}
        <div className="dash-grid-two-col">
          <div className="left-col">
            <BmiGauge 
              bmi={plan.bmi || 22.5} 
              status={plan.bmiStatus || 'Normal Weight'} 
              color={plan.bmiColor || 'emerald'} 
            />

            <WaterTracker 
              glasses={todayLog.waterGlasses || 0} 
              onUpdate={updateWaterIntake} 
            />
          </div>

          <div className="right-col">
            <WeightChart 
              currentWeight={todayLog.weightKg || plan.currentWeightKg || 70} 
              targetWeight={plan.targetWeightKg || 65} 
              onSaveWeight={recordWeight} 
            />

            {/* Quick Action Box */}
            <div className="quick-recalc-card">
              <div className="card-info">
                <h4>Re-Calculate Health Plan?</h4>
                <p>Updated your weight, height, or diet preference? Recalculate your exact macros & meal schedule.</p>
              </div>
              <button 
                className="recalc-btn"
                onClick={() => setActivePage('diet')}
              >
                ⚙️ Customize Plan Settings
              </button>
            </div>
          </div>
        </div>

        {/* Daily Meal Schedule Checklist Section */}
        <div className="dash-section-box">
          <div className="section-header-row">
            <div>
              <h3>Today's Meal & Nutrition Log</h3>
              <p>Check off your meals as you consume them throughout the day.</p>
            </div>
            <div className="meal-progress-badge">
              <span>Progress: {completedMealsCount} / {totalMealsCount} ({mealProgressPct}%)</span>
            </div>
          </div>

          <div className="meals-horizontal-scroll">
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
      </main>
    </div>
  );
}
