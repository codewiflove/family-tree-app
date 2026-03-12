import React, { useState } from 'react';
import { familyStorage } from '../utils/storage';
import { FaPhone, FaWhatsapp, FaVenus, FaMars, FaEdit, FaTrash } from 'react-icons/fa';
import './Directory.css';

const Directory = ({ members, onUpdateMember, onDeleteMember }) => {
  const [filter, setFilter] = useState('all'); // all, lelaki, perempuan
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and search members
  const filteredMembers = members.filter(member => {
    // Gender filter
    if (filter !== 'all' && member.jantina !== filter) {
      return false;
    }
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        member.nama_penuh.toLowerCase().includes(searchLower) ||
        member.pekerjaan.toLowerCase().includes(searchLower) ||
        member.lokasi.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // Sort by name
  const sortedMembers = [...filteredMembers].sort((a, b) => 
    a.nama_penuh.localeCompare(b.nama_penuh)
  );

  // Group by first letter
  const groupedMembers = sortedMembers.reduce((groups, member) => {
    const firstLetter = member.nama_penugh.charAt(0).toUpperCase();
    if (!groups[firstLetter]) {
      groups[firstLetter] = [];
    }
    groups[firstLetter].push(member);
    return groups;
  }, {});

  const handleCall = (phoneNumber) => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`, '_blank');
    }
  };

  const handleWhatsApp = (phoneNumber, name) => {
    if (phoneNumber) {
      const message = `Hai ${name}!`;
      window.open(`https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  const handleEdit = (member) => {
    const updatedData = {
      nama_penuh: prompt('Nama Penuh:', member.nama_penuh) || member.nama_penuh,
      tarikh_lahir: prompt('Tarikh Lahir (YYYY-MM-DD):', member.tarikh_lahir) || member.tarikh_lahir,
      no_telefon: prompt('No Telefon:', member.no_telefon) || member.no_telefon,
      pekerjaan: prompt('Pekerjaan:', member.pekerjaan) || member.pekerjaan,
      lokasi: prompt('Lokasi (Daerah/Negeri):', member.lokasi) || member.lokasi,
      gambar_profil_url: prompt('URL Gambar Profil:', member.gambar_profil_url) || member.gambar_profil_url
    };
    
    onUpdateMember(member.id, updatedData);
  };

  const handleDelete = (member) => {
    if (window.confirm(`Adakah anda pasti mahu padam ${member.nama_penuh}?`)) {
      onDeleteMember(member.id);
    }
  };

  return (
    <div className="directory">
      {/* Header with filters */}
      <div className="directory-header">
        <h2>📋 Direktori Ahli Keluarga</h2>
        <p className="directory-subtitle">
          {members.length} ahli keluarga • {familyStorage.getStatistics().lelakiCount} Lelaki • {familyStorage.getStatistics().perempuanCount} Perempuan
        </p>
        
        <div className="directory-controls">
          {/* Search */}
          <div className="search-box">
            <input
              type="text"
              placeholder="Cari nama, pekerjaan atau lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          {/* Gender Filters */}
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Semua
            </button>
            <button 
              className={`filter-btn ${filter === 'Lelaki' ? 'active' : ''}`}
              onClick={() => setFilter('Lelaki')}
            >
              <FaMars /> Lelaki
            </button>
            <button 
              className={`filter-btn ${filter === 'Perempuan' ? 'active' : ''}`}
              onClick={() => setFilter('Perempuan')}
            >
              <FaVenus /> Perempuan
            </button>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="members-list">
        {Object.keys(groupedMembers).length > 0 ? (
          Object.entries(groupedMembers).map(([letter, letterMembers]) => (
            <div key={letter} className="letter-section">
              <div className="letter-header">
                <h3>{letter}</h3>
                <span className="letter-count">{letterMembers.length} ahli</span>
              </div>
              
              <div className="members-grid">
                {letterMembers.map(member => {
                  const age = familyStorage.calculateAge(member.tarikh_lahir);
                  
                  return (
                    <div key={member.id} className="member-card">
                      {/* Member Header */}
                      <div className="member-header">
                        <div className="member-avatar">
                          {member.gambar_profil_url ? (
                            <img src={member.gambar_profil_url} alt={member.nama_penuh} />
                          ) : (
                            <div className={`avatar-placeholder ${member.jantina === 'Perempuan' ? 'female' : 'male'}`}>
                              {member.nama_penugh.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="member-info">
                          <h4>{member.nama_penuh}</h4>
                          <div className="member-meta">
                            <span className={`gender-badge ${member.jantina === 'Perempuan' ? 'female' : 'male'}`}>
                              {member.jantina === 'Perempuan' ? <FaVenus /> : <FaMars />}
                              {member.jantina}
                            </span>
                            <span className="age-badge">{age} tahun</span>
                          </div>
                        </div>
                        <div className="member-actions">
                          <button 
                            className="action-icon edit"
                            onClick={() => handleEdit(member)}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="action-icon delete"
                            onClick={() => handleDelete(member)}
                            title="Padam"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      
                      {/* Member Details */}
                      <div className="member-details">
                        {member.pekerjaan && (
                          <div className="detail-item">
                            <span className="detail-label">Pekerjaan:</span>
                            <span className="detail-value">{member.pekerjaan}</span>
                          </div>
                        )}
                        
                        {member.lokasi && (
                          <div className="detail-item">
                            <span className="detail-label">Lokasi:</span>
                            <span className="detail-value">{member.lokasi}</span>
                          </div>
                        )}
                        
                        {member.no_telefon && (
                          <div className="detail-item">
                            <span className="detail-label">Telefon:</span>
                            <span className="detail-value">{member.no_telefon}</span>
                          </div>
                        )}
                        
                        {member.tarikh_lahir && (
                          <div className="detail-item">
                            <span className="detail-label">Tarikh Lahir:</span>
                            <span className="detail-value">
                              {new Date(member.tarikh_lahir).toLocaleDateString('ms-MY', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Communication Buttons */}
                      {member.no_telefon && (
                        <div className="communication-buttons">
                          <button 
                            className="comm-btn call"
                            onClick={() => handleCall(member.no_telefon)}
                          >
                            <FaPhone /> Panggilan
                          </button>
                          <button 
                            className="comm-btn whatsapp"
                            onClick={() => handleWhatsApp(member.no_telefon, member.nama_penuh)}
                          >
                            <FaWhatsapp /> WhatsApp
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-directory">
            <div className="empty-content">
              <h3>📭 Tiada Ahli Keluarga</h3>
              <p>
                {searchTerm || filter !== 'all' 
                  ? 'Tiada ahli keluarga yang sepadan dengan carian anda.'
                  : 'Belum ada ahli keluarga dalam direktori. Kembali ke Dashboard untuk menambah ahli pertama.'}
              </p>
              {searchTerm && (
                <button 
                  className="clear-search-btn"
                  onClick={() => {
                    setSearchTerm('');
                    setFilter('all');
                  }}
                >
                  Kosongkan Carian
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Export Options */}
      {members.length > 0 && (
        <div className="export-section">
          <h4>Eksport Data</h4>
          <div className="export-buttons">
            <button 
              className="export-btn"
              onClick={() => {
                const data = familyStorage.getAllMembers();
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'direktori-keluarga.json';
                a.click();
              }}
            >
              💾 JSON
            </button>
            <button 
              className="export-btn"
              onClick={() => {
                const members = familyStorage.getAllMembers();
                const csv = [
                  ['Nama', 'Jantina', 'Umur', 'Telefon', 'Pekerjaan', 'Lokasi', 'Tarikh Lahir'],
                  ...members.map(m => [
                    m.nama_penuh,
                    m.jantina,
                    familyStorage.calculateAge(m.tarikh_lahir),
                    m.no_telefon,
                    m.pekerjaan,
                    m.lokasi,
                    m.tarikh_lahir
                  ])
                ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
                
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'direktori-keluarga.csv';
                a.click();
              }}
            >
              📊 CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Directory;