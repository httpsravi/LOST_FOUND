import React, { useState } from 'react';
import Dashboard from './Dashboard';
import UploadItem from './UploadItem';
import ClaimItem from './ClaimItem';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleItemUploaded = () => {
    setRefreshTrigger(prev => prev + 1);
    setCurrentView('dashboard');
  };

  const handleViewUpload = () => {
    setCurrentView('upload');
  };

  const handleViewClaim = () => {
    setCurrentView('claim');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>Lost & Found</h1>
          <p className="subtitle">Find or Report Your Lost Items</p>
        </div>
        {currentView !== 'dashboard' && (
          <button className="back-to-home-btn" onClick={handleBackToDashboard}>
            ← Back to Dashboard
          </button>
        )}
      </header>

      <div className="main-content">
        {currentView === 'dashboard' && (
          <Dashboard onViewUpload={handleViewUpload} onViewClaim={handleViewClaim} />
        )}
        {currentView === 'upload' && (
          <UploadItem onItemUploaded={handleItemUploaded} />
        )}
        {currentView === 'claim' && (
          <ClaimItem refreshTrigger={refreshTrigger} />
        )}
      </div>

      <footer className="app-footer">
        <p>&copy; 2026 Lost & Found. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
