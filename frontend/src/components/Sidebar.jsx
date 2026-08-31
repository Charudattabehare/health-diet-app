import React from 'react';
import { useHealth } from '../context/HealthContext.jsx';

export default function Sidebar({ activePage, setActivePage }) {
  const { dietPlan } = useHealth();

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-section">
        <h5 className="sidebar-heading">HEALTH CORE</h5>
        <button 
          className={`sidebar-btn ${activePage === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActivePage('dashboard')}
        >
          <span className="icon">📊</span>
          <span>Overview Stats</span>
        </button>
        <button 
          className={`sidebar-btn ${activePage === 'diet' ? 'active' : ''}`}
          onClick={() => setActivePage('diet')}
        >
          <span className="icon">🥗</span>
          <span>Meal & Diet Schedule</span>
        </button>
        <button 
          className={`sidebar-btn ${activePage === 'exercise' ? 'active' : ''}`}
          onClick={() => setActivePage('exercise')}
        >
          <span className="icon">🏋️‍♂️</span>
          <span>Workout Routine</span>
        </button>
        <button 
          className={`sidebar-btn ${activePage === 'profile' ? 'active' : ''}`}
          onClick={() => setActivePage('profile')}
        >
          <span className="icon">⚙️</span>
          <span>Health Settings</span>
        </button>
      </div>

      {dietPlan && (
        <div className="sidebar-plan-summary">
          <div className="summary-card">
            <span className="summary-title">ACTIVE TARGET</span>
            <div className="summary-kcal">
              {dietPlan.targetCalories || 2000} <span className="unit">kcal/day</span>
            </div>
            <div className="summary-macros-mini">
              <span>P: {dietPlan.macros?.proteinGrams || 150}g</span>
              <span>C: {dietPlan.macros?.carbsGrams || 220}g</span>
              <span>F: {dietPlan.macros?.fatGrams || 60}g</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
