import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { useAuth } from './AuthContext.jsx';

const HealthContext = createContext();

export const HealthProvider = ({ children }) => {
  const { token } = useAuth();
  const [dietPlan, setDietPlan] = useState(null);
  const [todayLog, setTodayLog] = useState({ waterGlasses: 0, completedMeals: [], weightKg: 70 });
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [healthError, setHealthError] = useState(null);

  const fetchHealthData = async () => {
    if (!token) return;
    setLoadingHealth(true);
    try {
      const [dietRes, logRes] = await Promise.all([
        api.getCurrentDietPlan().catch(() => null),
        api.getTodayLog().catch(() => null)
      ]);
      
      if (dietRes && dietRes.data) {
        setDietPlan(dietRes.data);
      }
      if (logRes && logRes.log) {
        setTodayLog(logRes.log);
      }
    } catch (err) {
      console.error('Error loading health context:', err);
      setHealthError(err.message);
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
  }, [token]);

  const generateNewPlan = async (params) => {
    setLoadingHealth(true);
    setHealthError(null);
    try {
      const res = await api.generateDietPlan(params);
      setDietPlan(res.data);
      return res.data;
    } catch (err) {
      setHealthError(err.message);
      throw err;
    } finally {
      setLoadingHealth(false);
    }
  };

  const updateWaterIntake = async (glasses) => {
    try {
      const res = await api.updateWater(glasses);
      setTodayLog(prev => ({ ...prev, waterGlasses: res.waterGlasses }));
    } catch (err) {
      console.error('Failed to update water:', err);
    }
  };

  const toggleMealItem = async (mealName) => {
    try {
      const res = await api.toggleMeal(mealName);
      setTodayLog(prev => ({ ...prev, completedMeals: res.completedMeals }));
    } catch (err) {
      console.error('Failed to toggle meal:', err);
    }
  };

  const recordWeight = async (weightKg) => {
    try {
      const res = await api.logWeight(weightKg);
      setTodayLog(prev => ({ ...prev, weightKg: res.weightKg }));
    } catch (err) {
      console.error('Failed to log weight:', err);
    }
  };

  return (
    <HealthContext.Provider value={{
      dietPlan,
      todayLog,
      loadingHealth,
      healthError,
      fetchHealthData,
      generateNewPlan,
      updateWaterIntake,
      toggleMealItem,
      recordWeight
    }}>
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => useContext(HealthContext);
