import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import FamilyTree from './components/FamilyTree';
import Directory from './components/Directory';
import { familyStorage } from './utils/storage';
import { loadSampleData } from './utils/sampleData';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [members, setMembers] = useState([]);
  const [userName, setUserName] = useState('Pengguna');

  // Load data on initial render
  useEffect(() => {
    // Load sample data if no data exists
    loadSampleData();
    
    const loadedMembers = familyStorage.getAllMembers();
    setMembers(loadedMembers);
    
    // Try to get user name from localStorage or use default
    const savedName = localStorage.getItem('family_tree_user_name') || 'Pengguna';
    setUserName(savedName);
  }, []);

  // Handle adding new member
  const handleAddMember = (newMember) => {
    const memberWithId = {
      ...newMember,
      id: familyStorage.generateId()
    };
    familyStorage.addMember(memberWithId);
    setMembers([...members, memberWithId]);
  };

  // Handle updating member
  const handleUpdateMember = (id, updates) => {
    const updated = familyStorage.updateMember(id, updates);
    if (updated) {
      setMembers(members.map(m => m.id === id ? updated : m));
    }
  };

  // Handle deleting member
  const handleDeleteMember = (id) => {
    familyStorage.deleteMember(id);
    setMembers(members.filter(m => m.id !== id));
  };

  // Update user name
  const handleUpdateUserName = (name) => {
    setUserName(name);
    localStorage.setItem('family_tree_user_name', name);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1>🌳 Salasilah Keluarga</h1>
          <div className="user-greeting">
            <span>Hai, {userName}!</span>
            <button 
              className="edit-name-btn"
              onClick={() => {
                const newName = prompt('Masukkan nama anda:', userName);
                if (newName && newName.trim()) {
                  handleUpdateUserName(newName.trim());
                }
              }}
            >
              ✏️
            </button>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <nav className="app-nav">
          <button 
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`nav-btn ${activeTab === 'family-tree' ? 'active' : ''}`}
            onClick={() => setActiveTab('family-tree')}
          >
            🌳 Pokok Keluarga
          </button>
          <button 
            className={`nav-btn ${activeTab === 'directory' ? 'active' : ''}`}
            onClick={() => setActiveTab('directory')}
          >
            📋 Direktori
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {activeTab === 'dashboard' && (
          <Dashboard 
            members={members}
            onAddMember={handleAddMember}
            userName={userName}
          />
        )}
        
        {activeTab === 'family-tree' && (
          <FamilyTree 
            members={members}
            onAddMember={handleAddMember}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
          />
        )}
        
        {activeTab === 'directory' && (
          <Directory 
            members={members}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>© 2024 Salasilah Keluarga MVP - Dibangunkan dengan ❤️ untuk keluarga Malaysia</p>
        <p className="footer-note">
          Data disimpan secara tempatan dalam penyemak imbas anda. Tiada login diperlukan.
        </p>
      </footer>
    </div>
  );
}

export default App;