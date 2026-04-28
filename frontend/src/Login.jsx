import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', { username, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        onLogin(res.data.token, res.data.user);
      }
    } catch (err) {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', width: '400px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: 'white' }}>🏨 Zylos Hospitality</h1>
        {error && <p style={{ color: 'var(--danger)', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <input 
            className="glass-card" 
            style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)' }}
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input 
            className="glass-card" 
            type="password"
            style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)' }}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '1rem' }}>Ingresar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
