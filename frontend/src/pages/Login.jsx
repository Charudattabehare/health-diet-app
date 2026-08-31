import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import PinInput from '../components/PinInput.jsx';

export default function Login({ setActivePage }) {
  const { login, authError, setAuthError, register } = useAuth();
  const [email, setEmail] = useState('');
  const [passwordPin, setPasswordPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setAuthError('Please enter your email address');
      return;
    }
    if (passwordPin.length !== 6) {
      setAuthError('Password condition failed: Please enter a 6-digit PIN');
      return;
    }

    setLoading(true);
    try {
      await login(email, passwordPin);
      setActivePage('dashboard');
    } catch (err) {
      // Error handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = async () => {
    setEmail('demo@health.com');
    setPasswordPin('123456');
    setAuthError(null);
    setLoading(true);
    try {
      await login('demo@health.com', '123456');
      setActivePage('dashboard');
    } catch (err) {
      try {
        await register('Demo Member', 'demo@health.com', '123456', 'weight_loss');
        setActivePage('dashboard');
      } catch (regErr) {
        setAuthError('Demo account creation failed: ' + regErr.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">🔑</div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Log in to your NutriFit360 health dashboard</p>
        </div>

        {authError && (
          <div className="auth-error-banner">
            <span className="error-icon">⚠️</span>
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="user@example.com"
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

          <button 
            type="submit" 
            className="auth-submit-btn" 
            disabled={loading || passwordPin.length !== 6}
          >
            {loading ? 'Authenticating...' : 'Sign In with 6-Digit PIN →'}
          </button>
        </form>

        <div className="demo-shortcut-box">
          <span className="demo-text">Want to test instantly?</span>
          <button className="demo-btn" onClick={handleDemoFill}>
            ⚡ One-Click Demo Login (PIN: 123456)
          </button>
        </div>

        <div className="auth-footer-text">
          Don't have an account?{' '}
          <button className="link-btn" onClick={() => setActivePage('register')}>
            Sign Up Now
          </button>
        </div>
      </div>
    </div>
  );
}
