import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import LandingPage from './Pages/Landing/LandingPage';
import Dashboard from './Pages/Dashboard/Dashboard';
import LiveAnalysis from './Pages/LiveAnalysis/LiveAnalysis';
import History from './Pages/History/History';
import Settings from './Pages/Settings/Setting';
import Login from './Pages/Auth/Login';
import Signup from './Pages/Auth/Signup';
import './App.css';

function App() {
  useEffect(() => {
    const stored = localStorage.getItem('appSettings');
    if (stored) {
      try {
        const savedSettings = JSON.parse(stored);
        if (savedSettings.darkMode) {
          document.body.classList.add('settings-dark-mode');
        } else {
          document.body.classList.remove('settings-dark-mode');
        }
      } catch (error) {
        console.warn('Unable to parse saved settings', error);
      }
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Standalone pages — no sidebar/navbar */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard pages — wrapped in Layout (sidebar + navbar) */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="live"      element={<LiveAnalysis />} />
              <Route path="history"   element={<History />} />
              <Route path="settings"  element={<Settings />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;