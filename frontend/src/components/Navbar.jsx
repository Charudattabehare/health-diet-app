import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useHealth } from '../context/HealthContext.jsx';

export default function Navbar({ activePage, setActivePage }) {
  const { user, logout } = useAuth();
  const { dietPlan } = useHealth();

  const goalName = dietPlan?.healthGoal === 'weight_gain' 
    ? '💪 Weight Gain Mode' 
    : '🔥 Weight Loss Mode';

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="nav-brand" onClick={() => setActivePage('home')}>
          <div className="brand-icon font-bold text-xl">
            🌱
          </div>
          <div className="brand-text">
            <span className="brand-title">NutriFit<span className="brand-accent">360</span></span>
            <span className="brand-subtitle">Smart Diet & Exercise Platform</span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="nav-links">
          <button 
            className={`nav-link ${activePage === 'home' ? 'active' : ''}`}
            onClick={() => setActivePage('home')}
          >
            Home
          </button>
          {user && (
            <>
              <button 
                className={`nav-link ${activePage === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActivePage('dashboard')}
              >
                Dashboard
              </button>
              <button 
                className={`nav-link ${activePage === 'diet' ? 'active' : ''}`}
                onClick={() => setActivePage('diet')}
              >
                Diet Plan
              </button>
              <button 
                className={`nav-link ${activePage === 'exercise' ? 'active' : ''}`}
                onClick={() => setActivePage('exercise')}
              >
                Exercise Guide
              </button>
              <button 
                className={`nav-link ${activePage === 'profile' ? 'active' : ''}`}
                onClick={() => setActivePage('profile')}
              >
                My Profile
              </button>
            </>
          )}
        </nav>

        {/* Right Action Buttons */}
        <div className="nav-actions">
          {user ? (
            <div className="user-profile-menu">
              <span className="goal-badge">
                {goalName}
              </span>
              <div className="user-info-chip">
                <div className="avatar">{user.name ? user.name[0].toUpperCase() : 'U'}</div>
                <span className="user-name">{user.name}</span>
              </div>
              <button className="logout-btn" onClick={logout} title="Sign Out">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-btns">
              <button className="login-nav-btn" onClick={() => setActivePage('login')}>
                Log In
              </button>
              <button className="signup-nav-btn" onClick={() => setActivePage('register')}>
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
