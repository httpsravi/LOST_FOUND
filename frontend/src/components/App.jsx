import React, { useState } from 'react';
import UploadItem from './UploadItem';
import ClaimItem from './ClaimItem';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleItemUploaded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Lost & Found</h1>
        <p className="subtitle">Find or Report Your Lost Items</p>
      </header>

      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => handleTabChange('upload')}
        >
          📤 Report Lost Item
        </button>
        <button
          className={`tab-button ${activeTab === 'claim' ? 'active' : ''}`}
          onClick={() => handleTabChange('claim')}
        >
          ✋ Claim Lost Item
        </button>
      </div>

      <div className="tabs-content">
        {activeTab === 'upload' && (
          <UploadItem onItemUploaded={handleItemUploaded} />
        )}
        {activeTab === 'claim' && (
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
