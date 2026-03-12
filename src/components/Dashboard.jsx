import React, { useState } from 'react';
import { familyStorage } from '../utils/storage';
import { FiUsers, FiGitBranch, FiCalendar, FiPlus, FiDownload } from 'react-icons/fi';
import { MdCake, MdPersonAdd, MdFamilyRestroom } from 'react-icons/md';
import MemberForm from './MemberForm';

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

  // Export data function
  const handleExportData = () => {
    const data = familyStorage.getAllMembers();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `salasilah-keluarga-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Welcome Section */}
      <div className="card mb-4">
        <div className="text-center">
          <h2 className="text-primary mb-2">Selamat Datang, {userName}! 👋</h2>
          <p className="text-secondary">
            {members.length === 0 
              ? "Mulakan salasilah keluarga anda dengan menambah ahli pertama."
              : `Anda mempunyai ${members.length} ahli keluarga dalam salasilah.`}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-3 mb-4">
        <div className="card text-center">
          <div className="mb-3">
            <FiUsers size={32} className="text-primary" />
          </div>
          <h3 className="mb-1">{stats.totalMembers}</h3>
          <p className="text-light">Jumlah Ahli</p>
          <div className="mt-2" style={{ fontSize: '0.8rem' }}>
            <span className="status-badge status-active mr-1">{stats.lelakiCount} L</span>
            <span className="status-badge status-inactive">{stats.perempuanCount} P</span>
          </div>
        </div>

        <div className="card text-center">
          <div className="mb-3">
            <MdFamilyRestroom size={32} className="text-secondary" />
          </div>
          <h3 className="mb-1">{stats.activeGenerations}</h3>
          <p className="text-light">Generasi</p>
          <div className="mt-2" style={{ fontSize: '0.8rem' }}>
            <span className="text-light">Lapisan aktif</span>
          </div>
        </div>

        <div className="card text-center">
          <div className="mb-3">
            <FiGitBranch size={32} className="text-accent" />
          </div>
          <h3 className="mb-1">{stats.familyBranches}</h3>
          <p className="text-light">Cabang</p>
          <div className="mt-2" style={{ fontSize: '0.8rem' }}>
            <span className="text-light">Pohon keluarga</span>
          </div>
        </div>
      </div>

      {/* Empty State - Add First Member */}
      {members.length === 0 && !showAddForm && (
        <div className="card empty-state">
          <div className="text-center p-5">
            <MdPersonAdd size={64} className="empty-state-icon text-light" />
            <h3 className="mb-3">Mulakan Salasilah Anda</h3>
            <p className="mb-4">
              Tambah ahli keluarga pertama sebagai akar pokok keluarga anda.
              Dari sini, anda boleh tambah pasangan, anak, dan cabang keluarga.
            </p>
            <button 
              className="btn btn-primary"
              onClick={handleAddFirstMember}
              style={{ minWidth: '200px' }}
            >
              <FiPlus /> Tambah Ahli Pertama
            </button>
          </div>
        </div>
      )}

      {/* Add Member Form */}
      {showAddForm && (
        <div className="card">
          <div className="section-header mb-4">
            <h3>{members.length === 0 ? 'Tambah Ahli Pertama' : 'Tambah Ahli Baru'}</h3>
            <button 
              className="btn btn-outline"
              onClick={handleFormCancel}
            >
              Batal
            </button>
          </div>
          <MemberForm 
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isRoot={members.length === 0}
          />
        </div>
      )}

      {/* Upcoming Birthdays */}
      {upcomingBirthdays.length > 0 && (
        <div className="card mb-4">
          <div className="section-header mb-4">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <MdCake className="text-primary" />
              <h3>Hari Jadi Akan Datang</h3>
            </div>
            <FiCalendar className="text-light" />
          </div>
          
          <div className="grid">
            {upcomingBirthdays.slice(0, 3).map(member => {
              const birthDate = new Date(member.tarikh_lahir);
              const today = new Date();
              const currentYearBirthday = new Date(
                today.getFullYear(),
                birthDate.getMonth(),
                birthDate.getDate()
              );
              const daysUntil = Math.ceil((currentYearBirthday - today) / (1000 * 60 * 60 * 24));
              const age = familyStorage.calculateAge(member.tarikh_lahir);
              
              return (
                <div key={member.id} className="directory-item">
                  <div style={{ marginRight: 'var(--space-md)' }}>
                    {member.gambar_profil_url ? (
                      <img 
                        src={member.gambar_profil_url} 
                        alt={member.nama_penuh}
                        className="avatar"
                      />
                    ) : (
                      <div 
                        className="avatar"
                        style={{ 
                          background: 'linear-gradient(135deg, var(--airbnb-primary), var(--airbnb-accent))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      >
                        {member.nama_penuh.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 className="mb-1">{member.nama_penuh}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                      <span className="text-light">
                        {birthDate.toLocaleDateString('ms-MY', { 
                          day: 'numeric', 
                          month: 'long' 
                        })}
                      </span>
                      <span className={`status-badge ${daysUntil === 0 ? 'status-active' : 'status-inactive'}`}>
                        {daysUntil === 0 ? 'Hari ini!' : `${daysUntil} hari`}
                      </span>
                    </div>
                    <p className="text-light mt-1">
                      Akan berusia {age + 1} tahun
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {upcomingBirthdays.length > 3 && (
            <div className="text-center mt-3">
              <button 
                className="btn btn-outline"
                onClick={() => {
                  // Navigate to directory filtered by birthdays
                  alert(`Ada ${upcomingBirthdays.length - 3} lagi hari jadi akan datang. Lihat dalam Direktori.`);
                }}
              >
                Lihat {upcomingBirthdays.length - 3} lagi
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      {members.length > 0 && (
        <div className="card">
          <h3 className="mb-4">Tindakan Pantas</h3>
          <div className="grid grid-2">
            <button 
              className="btn btn-outline"
              onClick={() => setShowAddForm(true)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-sm)' }}
            >
              <FiPlus /> Tambah Ahli
            </button>
            
            <button 
              className="btn btn-outline"
              onClick={handleExportData}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-sm)' }}
            >
              <FiDownload /> Backup
            </button>
          </div>
          
          {/* Quick Stats */}
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            <div className="grid grid-3 text-center">
              <div>
                <div className="text-primary" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {stats.averageAge > 0 ? stats.averageAge.toFixed(1) : 'N/A'}
                </div>
                <div className="text-light" style={{ fontSize: '0.8rem' }}>Umur Purata</div>
              </div>
              
              <div>
                <div className="text-secondary" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {stats.oldestAge > 0 ? stats.oldestAge : 'N/A'}
                </div>
                <div className="text-light" style={{ fontSize: '0.8rem' }}>Tertua</div>
              </div>
              
              <div>
                <div className="text-accent" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {stats.youngestAge > 0 ? stats.youngestAge : 'N/A'}
                </div>
                <div className="text-light" style={{ fontSize: '0.8rem' }}>Termuda</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips & Guidance */}
      <div className="card mt-4">
        <h3 className="mb-3">💡 Tips Penggunaan</h3>
        <div className="grid">
          <div className="card" style={{ background: 'rgba(0, 166, 153, 0.05)' }}>
            <h4 className="mb-2">Mulakan dengan Akar</h4>
            <p className="text-light" style={{ fontSize: '0.9rem' }}>
              Tambah datuk/nenek sebagai akar pokok, kemudian tambah anak dan cucu.
            </p>
          </div>
          
          <div className="card" style={{ background: 'rgba(255, 90, 95, 0.05)' }}>
            <h4 className="mb-2">Kemas kini Maklumat</h4>
            <p className="text-light" style={{ fontSize: '0.9rem' }}>
              Sentiasa kemas kini no telefon dan lokasi untuk komunikasi mudah.
            </p>
          </div>
          
          <div className="card" style={{ background: 'rgba(255, 180, 0, 0.05)' }}>
            <h4 className="mb-2">Backup Berkala</h4>
            <p className="text-light" style={{ fontSize: '0.9rem' }}>
              Export data anda secara berkala untuk simpanan selamat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;