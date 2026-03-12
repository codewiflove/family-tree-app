import React, { useState } from 'react';
import './MemberForm.css';

const MemberForm = ({ onSubmit, onCancel, isRoot = false, relationshipType, parentMember }) => {
  const [formData, setFormData] = useState({
    nama_penuh: '',
    jantina: 'Lelaki',
    tarikh_lahir: '',
    no_telefon: '',
    pekerjaan: '',
    lokasi: '',
    gambar_profil_url: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nama_penugh.trim()) {
      newErrors.nama_penuh = 'Nama penuh diperlukan';
    }
    
    if (!formData.tarikh_lahir) {
      newErrors.tarikh_lahir = 'Tarikh lahir diperlukan';
    } else {
      const birthDate = new Date(formData.tarikh_lahir);
      const today = new Date();
      if (birthDate > today) {
        newErrors.tarikh_lahir = 'Tarikh lahir tidak boleh di masa depan';
      }
    }
    
    if (formData.no_telefon && !/^[0-9+\-\s()]+$/.test(formData.no_telefon)) {
      newErrors.no_telefon = 'Nombor telefon tidak sah';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const getTitle = () => {
    if (isRoot) return 'Tambah Ahli Pertama (Akar)';
    if (relationshipType === 'child') return `Tambah Anak untuk ${parentMember?.nama_penuh}`;
    if (relationshipType === 'spouse') return `Tambah Pasangan untuk ${parentMember?.nama_penuh}`;
    return 'Tambah Ahli Keluarga';
  };

  return (
    <form className="member-form" onSubmit={handleSubmit}>
      <h3>{getTitle()}</h3>
      
      <div className="form-group">
        <label htmlFor="nama_penuh">Nama Penuh *</label>
        <input
          type="text"
          id="nama_penuh"
          name="nama_penuh"
          value={formData.nama_penuh}
          onChange={handleChange}
          placeholder="Contoh: Ahmad bin Abdullah"
          className={errors.nama_penuh ? 'error' : ''}
        />
        {errors.nama_penuh && <span className="error-message">{errors.nama_penuh}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="jantina">Jantina *</label>
          <select
            id="jantina"
            name="jantina"
            value={formData.jantina}
            onChange={handleChange}
          >
            <option value="Lelaki">Lelaki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tarikh_lahir">Tarikh Lahir *</label>
          <input
            type="date"
            id="tarikh_lahir"
            name="tarikh_lahir"
            value={formData.tarikh_lahir}
            onChange={handleChange}
            className={errors.tarikh_lahir ? 'error' : ''}
          />
          {errors.tarikh_lahir && <span className="error-message">{errors.tarikh_lahir}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="no_telefon">No Telefon</label>
        <input
          type="tel"
          id="no_telefon"
          name="no_telefon"
          value={formData.no_telefon}
          onChange={handleChange}
          placeholder="Contoh: +60123456789"
          className={errors.no_telefon ? 'error' : ''}
        />
        {errors.no_telefon && <span className="error-message">{errors.no_telefon}</span>}
        <small className="hint">Untuk panggilan dan WhatsApp</small>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="pekerjaan">Pekerjaan</label>
          <input
            type="text"
            id="pekerjaan"
            name="pekerjaan"
            value={formData.pekerjaan}
            onChange={handleChange}
            placeholder="Contoh: Guru, Doktor, Usahawan"
          />
        </div>

        <div className="form-group">
          <label htmlFor="lokasi">Lokasi</label>
          <input
            type="text"
            id="lokasi"
            name="lokasi"
            value={formData.lokasi}
            onChange={handleChange}
            placeholder="Contoh: Kuala Terengganu, Terengganu"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="gambar_profil_url">URL Gambar Profil</label>
        <input
          type="url"
          id="gambar_profil_url"
          name="gambar_profil_url"
          value={formData.gambar_profil_url}
          onChange={handleChange}
          placeholder="https://example.com/gambar.jpg"
        />
        <small className="hint">
          Boleh gunakan URL gambar dari internet atau kosongkan untuk avatar default
        </small>
      </div>

      {/* Preview */}
      {formData.nama_penuh && (
        <div className="form-preview">
          <h4>Pratonton:</h4>
          <div className="preview-card">
            <div className="preview-avatar">
              {formData.gambar_profil_url ? (
                <img src={formData.gambar_profil_url} alt="Preview" />
              ) : (
                <div className={`avatar-preview ${formData.jantina === 'Perempuan' ? 'female' : 'male'}`}>
                  {formData.nama_penugh.charAt(0)}
                </div>
              )}
            </div>
            <div className="preview-info">
              <p><strong>{formData.nama_penuh}</strong></p>
              <p>{formData.jantina} • {formData.pekerjaan || 'Tiada maklumat pekerjaan'}</p>
              <p>{formData.lokasi || 'Tiada maklumat lokasi'}</p>
            </div>
          </div>
        </div>
      )}

      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Batal
        </button>
        <button type="submit" className="submit-btn">
          {isRoot ? 'Mulakan Pokok Keluarga' : 'Tambah Ahli'}
        </button>
      </div>

      <div className="form-help">
        <p><strong>Tip:</strong> Semua data akan disimpan secara tempatan dalam penyemak imbas anda.</p>
        <p>Medan bertanda * adalah wajib diisi.</p>
      </div>
    </form>
  );
};

export default MemberForm;