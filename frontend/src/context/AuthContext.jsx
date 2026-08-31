import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('health_app_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('health_app_token');
      if (storedToken) {
        try {
          const data = await api.getMe();
          setUser(data.user);
          setToken(storedToken);
        } catch (err) {
          console.warn('Stored token invalid:', err.message);
          localStorage.removeItem('health_app_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, passwordPin) => {
    setAuthError(null);
    try {
      const data = await api.login(email, passwordPin);
      localStorage.setItem('health_app_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  const register = async (name, email, passwordPin, goal) => {
    setAuthError(null);
    try {
      const data = await api.register(name, email, passwordPin, goal);
      localStorage.setItem('health_app_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('health_app_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, authError, login, register, logout, setAuthError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
