const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('health_app_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
  // Auth API
  async register(name, email, passwordPin, goal) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, passwordPin, goal })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async login(email, passwordPin) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, passwordPin })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { ...getAuthHeader() }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Auth check failed');
    return data;
  },

  // Diet API
  async generateDietPlan(params) {
    const res = await fetch(`${API_BASE_URL}/diet/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(params)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to generate diet plan');
    return data;
  },

  async getCurrentDietPlan() {
    const res = await fetch(`${API_BASE_URL}/diet/current`, {
      headers: { ...getAuthHeader() }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch current diet plan');
    return data;
  },

  // Logs API
  async getTodayLog() {
    const res = await fetch(`${API_BASE_URL}/logs/today`, {
      headers: { ...getAuthHeader() }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch today log');
    return data;
  },

  async updateWater(glasses) {
    const res = await fetch(`${API_BASE_URL}/logs/water`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ glasses })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update water');
    return data;
  },

  async toggleMeal(mealName) {
    const res = await fetch(`${API_BASE_URL}/logs/meal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ mealName })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to toggle meal');
    return data;
  },

  async logWeight(weightKg) {
    const res = await fetch(`${API_BASE_URL}/logs/weight`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ weightKg })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to log weight');
    return data;
  }
};
