import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import PMS from './PMS';
import POS from './POS';
import Login from './Login';

const Sidebar = ({ onLogout }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{ width: '250px', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderRight: '1px solid var(--glass-border)', background: 'var(--glass-bg)', backdropFilter: 'blur(10px)' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.8rem' }}>🏨</span> Zylos Hospitality
        </h2>
      </div>
      
      <Link to="/" className={`btn ${isActive('/') ? 'btn-primary' : 'btn-outline'}`} style={{ justifyContent: 'flex-start' }}>
        📊 Dashboard
      </Link>
      <Link to="/pms" className={`btn ${isActive('/pms') ? 'btn-primary' : 'btn-outline'}`} style={{ justifyContent: 'flex-start' }}>
        🛏️ Recepción
      </Link>
      <Link to="/pos" className={`btn ${isActive('/pos') ? 'btn-primary' : 'btn-outline'}`} style={{ justifyContent: 'flex-start' }}>
        🍽️ Restaurante
      </Link>
      
      <button onClick={onLogout} className="btn btn-outline" style={{ marginTop: 'auto', color: 'var(--danger)' }}>
        🚪 Cerrar Sesión
      </button>
    </nav>
  );
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogin = (newToken) => setToken(newToken);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
  };

  if (!token) return <Login onLogin={handleLogin} />;

  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar onLogout={handleLogout} />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pms" element={<PMS />} />
            <Route path="/pos" element={<POS />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
