import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Add error handling
try {
  const root = createRoot(document.getElementById('root'));
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error('React rendering error:', error);
  // Fallback to simple display
  document.getElementById('root').innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: sans-serif;">
      <h1 style="color: #FF5A5F;">🏠 Salasilah Keluarga</h1>
      <p>Sorry, there was an error loading the app.</p>
      <p>Error: ${error.message}</p>
      <button onclick="location.reload()" style="padding: 10px 20px; background: #FF5A5F; color: white; border: none; border-radius: 8px; cursor: pointer;">
        Reload App
      </button>
    </div>
  `;
}
