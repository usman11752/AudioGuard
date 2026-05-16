import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './Pages/Dashboard/Dashboard';
import LiveAnalysis from './Pages/LiveAnalysis/LiveAnalysis';
import History from './Pages/History/History';
import About from './Pages/About/About';
import Settings from './Pages/About/Settings/Setting';
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
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/live" element={<LiveAnalysis />} />
          <Route path="/history" element={<History />} />
          <Route path="/about" element={<About />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;