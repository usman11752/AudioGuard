import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './sidebar';
import './Layout.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`layout ${darkMode ? 'dark' : ''}`}>
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="layout-main">
        <Sidebar sidebarOpen={sidebarOpen} />
        <main className={`layout-content ${!sidebarOpen ? 'expanded' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;