import React from 'react';
import './App.css';

function AppSimple() {
  return (
    <div className="container">
      <h1 style={{ color: 'var(--airbnb-primary)', textAlign: 'center', marginTop: '50px' }}>
        🏠 Salasilah Keluarga
      </h1>
      <p style={{ textAlign: 'center', color: 'var(--airbnb-light)' }}>
        Aplikasi untuk mengurus salasilah keluarga anda
      </p>
      <div className="card" style={{ maxWidth: '500px', margin: '30px auto' }}>
        <h2>Test Interface</h2>
        <p>Jika anda nampak ini, React dan CSS berfungsi dengan baik.</p>
        <button 
          className="btn btn-primary" 
          style={{ marginTop: '20px' }}
          onClick={() => alert('Button berfungsi!')}
        >
          Test Button
        </button>
      </div>
      <div style={{ textAlign: 'center', marginTop: '30px', color: 'var(--airbnb-light)', fontSize: '0.9rem' }}>
        <p>App sedang dimuatkan... Jika blank screen masih ada, ada masalah JavaScript.</p>
      </div>
    </div>
  );
}

export default AppSimple;