import React from 'react';
import { familyStorage } from '../utils/storage';
import { FaPhone, FaWhatsapp, FaMapMarkerAlt, FaBriefcase, FaBirthdayCake, FaVenus, FaMars } from 'react-icons/fa';
import './MemberCard.css';

const MemberCard = ({ member }) => {
  const age = familyStorage.calculateAge(member.tarikh_lahir);
  
  const handleCall = () => {
    if (member.no_telefon) {
      window.open(`tel:${member.no_telefon}`, '_blank');
    }
  };

  const handleWhatsApp = () => {
    if (member.no_telefon) {
      const message = `Hai ${member.nama_penuh}!`;
      window.open(`https://wa.me/${member.no_telefon.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  return (
    <div className="member-card">
      {/* Header with avatar and basic info */}
      <div className="card-header">
        <div className="member-avatar">
          {member.gambar_profil_url ? (
            <img src={member.gambar_profil_url} alt={member.nama_penuh} />
          ) : (
            <div className={`avatar-placeholder ${member.jantina === 'Perempuan' ? 'female' : 'male'}`}>
              {member.nama_penugh.charAt(0)}
            </div>
          )}
        </div>
        <div className="member-basic-info">
          <h3>{member.nama_penuh}</h3>
          <div className="member-meta">
            <span className={`gender-badge ${member.jantina === 'Perempuan' ? 'female' : 'male'}`}>
              {member.jantina === 'Perempuan' ? <FaVenus /> : <FaMars />}
              {member.jantina}
            </span>
            <span className="age-badge">{age} tahun</span>
          </div>
        </div>
      </div>

      {/* Details section */}
      <div className="card-details">
        {member.pekerjaan && (
          <div className="detail-item">
            <FaBriefcase className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">Pekerjaan</span>
              <span className="detail-value">{member.pekerjaan}</span>
            </div>
          </div>
        )}

        {member.lokasi && (
          <div className="detail-item">
            <FaMapMarkerAlt className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">Lokasi</span>
              <span className="detail-value">{member.lokasi}</span>
            </div>
          </div>
        )}

        {member.tarikh_lahir && (
          <div className="detail-item">
            <FaBirthdayCake className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">Tarikh Lahir</span>
              <span className="detail-value">
                {new Date(member.tarikh_lahir).toLocaleDateString('ms-MY', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        )}

        {member.no_telefon && (
          <div className="detail-item">
            <FaPhone className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">Telefon</span>
              <span className="detail-value">{member.no_telefon}</span>
            </div>
          </div>
        )}
      </div>

      {/* Communication buttons */}
      {member.no_telefon && (
        <div className="card-actions">
          <button className="action-btn call" onClick={handleCall}>
            <FaPhone /> Panggilan
          </button>
          <button className="action-btn whatsapp" onClick={handleWhatsApp}>
            <FaWhatsapp /> WhatsApp
          </button>
        </div>
      )}

      {/* Additional info */}
      <div className="card-footer">
        <p className="member-id">
          <small>ID: {member.id}</small>
        </p>
        {member.parent_id && (
          <p className="parent-info">
            <small>Anak kepada: {familyStorage.getMember(member.parent_id)?.nama_penuh || 'Tidak diketahui'}</small>
          </p>
        )}
        {member.spouse_id && (
          <p className="spouse-info">
            <small>Pasangan: {familyStorage.getMember(member.spouse_id)?.nama_penuh || 'Tidak diketahui'}</small>
          </p>
        )}
      </div>
    </div>
  );
};

export default MemberCard;