import React, { useState } from 'react';
import { familyStorage } from '../utils/storage';
import { FaUsers, FaTree, FaSitemap, FaBirthdayCake } from 'react-icons/fa';
import MemberForm from './MemberForm';
import './Dashboard.css';

const Dashboard = ({ members, onAddMember, userName }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  
  const stats = familyStorage.getStatistics();
  const upcomingBirthdays = familyStorage.getUpcomingBirthdays();

  const handleAddFirstMember = () => {
    setShowAddForm(true);
  };

  const handleFormSubmit = (memberData) => {
    onAddMember(memberData);
    setShowAddForm(false);
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
  };

  return (
    <div className="dashboard">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h2>Selamat Datang ke Salasilah Keluarga Anda!</h2>
        <p>Mulakan dengan menambah ahli keluarga pertama sebagai akar pokok keluarga anda.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>Jumlah Ahli</h3>
            <p className="stat-number">{stats.totalMembers}</p>
            <p className="stat-detail">
              {stats.lelakiCount} Lelaki • {stats.perempuanCount} Perempuan
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaTree />
          </div>
          <div className="stat-content">
            <h3>Generasi Aktif</h3>
            <p className="stat-number">{stats.activeGenerations}</p>
            <p className="stat-detail">Lapisan keluarga yang aktif</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaSitemap />
          </div>
          <div className="stat-content">
            <h3>Cabang Keluarga</h3>
            <p className="stat-number">{stats.familyBranches}</p>
            <p className="stat-detail">Pohon keluarga berbeza</p>
          </div>
        </div>
      </div>

      {/* Main CTA - Add First Member if empty */}
      {members.length === 0 && !showAddForm && (
        <div className="empty-state">
          <div className="empty-content">
            <h3>📭 Tiada Data Keluarga</h3>
            <p>Mulakan salasilah keluarga anda dengan menambah ahli pertama sebagai akar pokok.</p>
            <button 
              className="cta-button"
              onClick={handleAddFirstMember}
            >
              + Tambah Ahli Pertama (Akar)
            </button>
          </div>
        </div>
      )}

      {/* Add Member Form */}
      {showAddForm && (
        <div className="add-form-section">
          <h3>Tambah Ahli Keluarga Pertama</h3>
          <MemberForm 
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isRoot={true}
          />
        </div>
      )}

      {/* Upcoming Birthdays */}
      {upcomingBirthdays.length > 0 && (
        <div className="birthdays-section">
          <div className="section-header">
            <FaBirthdayCake className="section-icon" />
            <h3>Hari Jadi Akan Datang</h3>
          </div>
          <div className="birthdays-list">
            {upcomingBirthdays.map(member => {
              const birthDate = new Date(member.tarikh_lahir);
              const today = new Date();
              const currentYearBirthday = new Date(
                today.getFullYear(),
                birthDate.getMonth(),
                birthDate.getDate()
              );
              const daysUntil = Math.ceil((currentYearBirthday - today) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={member.id} className="birthday-card">
                  <div className="birthday-avatar">
                    {member.gambar_profil_url ? (
                      <img src={member.gambar_profil_url} alt={member.nama_penuh} />
                    ) : (
                      <div className="avatar-placeholder">
                        {member.nama_penuh.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="birthday-info">
                    <h4>{member.nama_penuh}</h4>
                    <p>
                      {birthDate.toLocaleDateString('ms-MY', { 
                        day: 'numeric', 
                        month: 'long' 
                      })}
                      {daysUntil === 0 ? ' (Hari ini!)' : ` (${daysUntil} hari lagi)`}
                    </p>
                    <p className="birthday-age">
                      Akan berusia {familyStorage.calculateAge(member.tarikh_lahir) + 1} tahun
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {members.length > 0 && (
        <div className="quick-actions">
          <h3>Tindakan Pantas</h3>
          <div className="action-buttons">
            <button 
              className="action-btn"
              onClick={() => setShowAddForm(true)}
            >
              + Tambah Ahli Baru
            </button>
            <button 
              className="action-btn secondary"
              onClick={() => {
                // Export data
                const data = familyStorage.getAllMembers();
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'salasilah-keluarga-backup.json';
                a.click();
              }}
            >
              💾 Backup Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;