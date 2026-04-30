import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard';
import UploadItem from './UploadItem';
import ClaimItem from './ClaimItem';
import Login from './Login';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ On app load: restore user session AND set JWT token in axios headers
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        // Restore JWT token for all future axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setCurrentView('dashboard');
  };

  const handleItemUploaded = () => {
    setRefreshTrigger((prev) => prev + 1);
    setCurrentView('dashboard');
  };

  if (loading) return <div className="loading-container">Loading...</div>;
  if (!user) return <Login onLoginSuccess={handleLoginSuccess} />;

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>Lost & Found</h1>
          <p className="subtitle">Find or Report Your Lost Items</p>
        </div>
        <div className="header-actions">
          {currentView !== 'dashboard' && (
            <button className="back-to-home-btn" onClick={() => setCurrentView('dashboard')}>
              ← Back to Dashboard
            </button>
          )}
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      <div className="main-content">
        {currentView === 'dashboard' && (
          <Dashboard onViewUpload={() => setCurrentView('upload')} onViewClaim={() => setCurrentView('claim')} user={user} />
        )}
        {currentView === 'upload' && (
          <UploadItem onItemUploaded={handleItemUploaded} user={user} />
        )}
        {currentView === 'claim' && (
          <ClaimItem refreshTrigger={refreshTrigger} user={user} />
        )}
      </div>

      <footer className="app-footer">
        <p>&copy; 2026 Lost & Found. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
