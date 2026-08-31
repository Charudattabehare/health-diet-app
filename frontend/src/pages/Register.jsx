import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import PinInput from '../components/PinInput.jsx';

export default function Register({ setActivePage }) {
  const { register, authError, setAuthError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [passwordPin, setPasswordPin] = useState('');
  const [goal, setGoal] = useState('weight_loss');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      setAuthError('Please fill in all fields');
      return;
    }
    if (passwordPin.length !== 6) {
      setAuthError('Password condition failed: Please enter a 6-digit PIN');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, passwordPin, goal);
      setActivePage('diet'); // Go to diet plan setup after register
    } catch (err) {
      // Handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">🚀</div>
          <h2 className="auth-title">Create Free Account</h2>
          <p className="auth-subtitle">Get personalized diet & workout plans in seconds</p>
        </div>

        {authError && (
          <div className="auth-error-banner">
            <span className="error-icon">⚠️</span>
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <PinInput 
              pin={passwordPin} 
              setPin={setPasswordPin} 
              label="6-Digit Password PIN" 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Primary Health Objective</label>
            <div className="goal-selector-grid">
              <button
                type="button"
                className={`goal-option-btn ${goal === 'weight_loss' ? 'active' : ''}`}
                onClick={() => setGoal('weight_loss')}
              >
                <span className="goal-icon">🔥</span>
                <span className="goal-title">Weight Loss</span>
                <span className="goal-sub">Burn fat & caloric deficit</span>
              </button>

              <button
                type="button"
                className={`goal-option-btn ${goal === 'weight_gain' ? 'active' : ''}`}
                onClick={() => setGoal('weight_gain')}
              >
                <span className="goal-icon">💪</span>
                <span className="goal-title">Weight Gain</span>
                <span className="goal-sub">Build muscle & caloric surplus</span>
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="auth-submit-btn" 
            disabled={loading || passwordPin.length !== 6}
          >
            {loading ? 'Creating Profile...' : 'Complete Sign Up & Start Plan →'}
          </button>
        </form>

        <div className="auth-footer-text">
          Already registered?{' '}
          <button className="link-btn" onClick={() => setActivePage('login')}>
            Log In Here
          </button>
        </div>
      </div>
    </div>
  );
}
