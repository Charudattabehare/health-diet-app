import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { HealthProvider } from './context/HealthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DietPlanPage from './pages/DietPlanPage.jsx';
import ExercisePage from './pages/ExercisePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import './styles/index.css';

function MainAppContent() {
  const [activePage, setActivePage] = useState('home');
  const { user } = useAuth();

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'home':
        return <Home setActivePage={setActivePage} />;
      case 'login':
        return <Login setActivePage={setActivePage} />;
      case 'register':
        return <Register setActivePage={setActivePage} />;
      case 'dashboard':
        return user ? <Dashboard activePage={activePage} setActivePage={setActivePage} /> : <Login setActivePage={setActivePage} />;
      case 'diet':
        return user ? <DietPlanPage activePage={activePage} setActivePage={setActivePage} /> : <Login setActivePage={setActivePage} />;
      case 'exercise':
        return user ? <ExercisePage activePage={activePage} setActivePage={setActivePage} /> : <Login setActivePage={setActivePage} />;
      case 'profile':
        return user ? <ProfilePage activePage={activePage} setActivePage={setActivePage} /> : <Login setActivePage={setActivePage} />;
      default:
        return <Home setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="app-wrapper">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      {renderCurrentPage()}
      <footer className="global-footer text-center py-6 text-xs text-slate-500 border-t border-slate-800 mt-12">
        <p>© 2026 NutriFit360 MERN Health Care Platform. All Rights Reserved. Protected by 6-Digit Password PIN & JWT Token.</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HealthProvider>
        <MainAppContent />
      </HealthProvider>
    </AuthProvider>
  );
}
