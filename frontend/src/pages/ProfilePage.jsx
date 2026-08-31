import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useHealth } from '../context/HealthContext.jsx';
import Sidebar from '../components/Sidebar.jsx';

export default function ProfilePage({ activePage, setActivePage }) {
  const { user, logout } = useAuth();
  const { dietPlan } = useHealth();

  const plan = dietPlan || {};

  return (
    <div className="dashboard-layout">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <main className="dashboard-main-content">
        <div className="page-header-box">
          <span className="page-tag font-semibold">USER PROFILE & SECURITY</span>
          <h2 className="page-title font-bold">My Account Settings</h2>
          <p className="page-sub">Manage your security credentials and health parameters.</p>
        </div>

        <div className="profile-grid">
          {/* Account & Security Card */}
          <div className="profile-card">
            <div className="card-header">
              <span className="icon">🛡️</span>
              <h3>Account Security</h3>
            </div>

            <div className="profile-details-list">
              <div className="detail-item">
                <span className="lbl">Full Name</span>
                <span className="val font-semibold">{user?.name || 'Health User'}</span>
              </div>

              <div className="detail-item">
                <span className="lbl">Registered Email</span>
                <span className="val font-mono">{user?.email || 'user@example.com'}</span>
              </div>

              <div className="detail-item">
                <span className="lbl">Password Auth Condition</span>
                <span className="val text-emerald-400 font-semibold">✓ Verified 6-Digit PIN</span>
              </div>

              <div className="detail-item">
                <span className="lbl">Session Token</span>
                <span className="val text-cyan-400 font-mono">JWT Bearer Secured</span>
              </div>

              <div className="detail-item">
                <span className="lbl">Database Connection</span>
                <span className="val text-purple-400 font-semibold">MongoDB / Resilient Store</span>
              </div>
            </div>

            <button className="logout-profile-btn" onClick={logout}>
              Sign Out of Account
            </button>
          </div>

          {/* Health Parameters Card */}
          <div className="profile-card">
            <div className="card-header">
              <span className="icon">📊</span>
              <h3>Current Health Parameters</h3>
            </div>

            <div className="profile-details-list">
              <div className="detail-item">
                <span className="lbl">Active Goal</span>
                <span className="val goal-text">
                  {plan.healthGoal === 'weight_gain' ? '💪 Weight Gain (+500 kcal)' : '🔥 Weight Loss (-500 kcal)'}
                </span>
              </div>

              <div className="detail-item">
                <span className="lbl">Height / Weight</span>
                <span className="val">{plan.heightCm || 175} cm / {plan.currentWeightKg || 70} kg</span>
              </div>

              <div className="detail-item">
                <span className="lbl">Target Weight</span>
                <span className="val text-emerald-400 font-bold">{plan.targetWeightKg || 65} kg</span>
              </div>

              <div className="detail-item">
                <span className="lbl">BMI Score</span>
                <span className="val font-bold">{plan.bmi || 22.5} ({plan.bmiStatus || 'Normal'})</span>
              </div>

              <div className="detail-item">
                <span className="lbl">Diet Preference</span>
                <span className="val capitalize">{plan.dietPreference || 'Vegetarian'}</span>
              </div>
            </div>

            <button 
              className="update-params-btn"
              onClick={() => setActivePage('diet')}
            >
              ⚙️ Update Metrics & Diet Schedule
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
