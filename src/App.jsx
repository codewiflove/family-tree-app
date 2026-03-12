import React, { useState, useEffect } from 'react';
import { FiHome, FiUsers, FiList, FiUser } from 'react-icons/fi';
import { MdFamilyRestroom, MdCake, MdPhone, MdWhatsapp } from 'react-icons/md';
import Dashboard from './components/Dashboard';
import FamilyTree from './components/FamilyTree';
import Directory from './components/Directory';
import { familyStorage } from './utils/storage';
import { loadSampleData } from './utils/sampleData';
import './App.css';

function App() {
  console.log('App component rendering...');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [members, setMembers] = useState([]);
  const [userName, setUserName] = useState('Ahli Keluarga');
  const [showNameModal, setShowNameModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');

  // Load data on initial render
  useEffect(() => {
    // Load sample data if no data exists
    loadSampleData();
    
    const loadedMembers = familyStorage.getAllMembers();
    setMembers(loadedMembers);
    
    // Try to get user name from localStorage or use default
    const savedName = localStorage.getItem('family_tree_user_name') || 'Ahli Keluarga';
    setUserName(savedName);
    setNewUserName(savedName);
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
  const handleUpdateUserName = () => {
    if (newUserName.trim()) {
      setUserName(newUserName.trim());
      localStorage.setItem('family_tree_user_name', newUserName.trim());
      setShowNameModal(false);
    }
  };

  // Calculate statistics
  const totalMembers = members.length;
  const activeGenerations = new Set(members.map(m => {
    const age = m.tarikh_lahir ? Math.floor((new Date() - new Date(m.tarikh_lahir)) / (365.25 * 24 * 60 * 60 * 1000)) : 0;
    return Math.floor(age / 20); // Group by 20-year generations
  })).size;
  
  const familyBranches = new Set(members.filter(m => m.parent_id === null).map(m => m.id)).size;

  return (
    <div className="container">
      {/* Airbnb-style Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">🏠 Salasilah</div>
          <div 
            className="user-greeting"
            onClick={() => setShowNameModal(true)}
            style={{ cursor: 'pointer' }}
          >
            <FiUser />
            <span>{userName}</span>
          </div>
        </div>
      </header>

      {/* Quick Stats Bar (Airbnb-style) */}
      <div className="grid grid-3 mt-3">
        <div className="metrics-card">
          <div className="text-center">
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{totalMembers}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Ahli</div>
          </div>
        </div>
        
        <div className="metrics-card" style={{ background: 'linear-gradient(135deg, var(--airbnb-secondary), #00C2B2)' }}>
          <div className="text-center">
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{activeGenerations}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Generasi</div>
          </div>
        </div>
        
        <div className="metrics-card" style={{ background: 'linear-gradient(135deg, var(--airbnb-accent), #FFC233)' }}>
          <div className="text-center">
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{familyBranches}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Cabang</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="app-main">
        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <Dashboard 
            members={members}
            onAddMember={handleAddMember}
            userName={userName}
          />
        )}
        
        {activeTab === 'family-tree' && (
          <div className="card">
            <h3>🌳 Pokok Keluarga</h3>
            <p>Fitur pokok keluarga sedang dimuatkan...</p>
            <p>Jumlah ahli: {members.length}</p>
            <button 
              className="btn btn-primary mt-3"
              onClick={() => alert('Fitur pokok keluarga akan datang!')}
            >
              Lihat Demo
            </button>
          </div>
          // <FamilyTree 
          //   members={members}
          //   onAddMember={handleAddMember}
          //   onUpdateMember={handleUpdateMember}
          //   onDeleteMember={handleDeleteMember}
          // />
        )}
        
        {activeTab === 'directory' && (
          <Directory 
            members={members}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
          />
        )}
      </main>

      {/* Bottom Navigation (Mobile-First) */}
      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <FiHome className="nav-icon" />
          <span className="nav-label">Utama</span>
        </button>
        
        <button 
          className={`nav-item ${activeTab === 'family-tree' ? 'active' : ''}`}
          onClick={() => setActiveTab('family-tree')}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <MdFamilyRestroom className="nav-icon" />
          <span className="nav-label">Salasilah</span>
        </button>
        
        <button 
          className={`nav-item ${activeTab === 'directory' ? 'active' : ''}`}
          onClick={() => setActiveTab('directory')}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <FiList className="nav-icon" />
          <span className="nav-label">Direktori</span>
        </button>
        
        <button 
          className="nav-item"
          onClick={() => {
            // Quick add member action
            const name = prompt('Nama ahli baru:');
            if (name && name.trim()) {
              handleAddMember({
                nama_penuh: name.trim(),
                jantina: 'Lelaki',
                tarikh_lahir: new Date().toISOString().split('T')[0],
                no_telefon: '',
                pekerjaan: '',
                lokasi: '',
                gambar_profil_url: '',
                parent_id: null,
                spouse_id: null
              });
            }
          }}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <FiUsers className="nav-icon" />
          <span className="nav-label">Tambah</span>
        </button>
      </nav>

      {/* Name Update Modal */}
      {showNameModal && (
        <div className="modal-overlay" onClick={() => setShowNameModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="mb-4">Kemas Nama Anda</h3>
            <div className="input-group">
              <input
                type="text"
                className="input-field"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="Masukkan nama anda"
                autoFocus
              />
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
              <button 
                className="btn btn-outline"
                onClick={() => setShowNameModal(false)}
                style={{ flex: 1 }}
              >
                Batal
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleUpdateUserName}
                style={{ flex: 1 }}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Birthday Notifications */}
      {members.some(m => {
        if (!m.tarikh_lahir) return false;
        const today = new Date();
        const bday = new Date(m.tarikh_lahir);
        return bday.getMonth() === today.getMonth() && bday.getDate() === today.getDate();
      }) && (
        <div className="toast">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <MdCake />
            <span>Ada ahli keluarga yang berhari jadi hari ini! 🎂</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;