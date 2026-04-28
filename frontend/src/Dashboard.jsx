import React from 'react';

const Dashboard = () => {
  return (
    <div className="container animate-fade-in">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '0.5rem' }}>Buenos días, Admin 👋</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Aquí está el resumen operativo de hoy.</p>
        </div>
        <button className="btn btn-primary">Generar Reporte</button>
      </div>

      <div className="grid-auto" style={{ marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Ocupación Actual</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>85%</p>
          <p style={{ color: 'var(--success)', fontSize: '0.85rem', marginTop: '0.5rem' }}>+5% desde ayer</p>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>RevPAR</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>$124.50</p>
          <p style={{ color: 'var(--success)', fontSize: '0.85rem', marginTop: '0.5rem' }}>+12% vs mes pasado</p>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Ventas Restaurante</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>$3,450</p>
          <p style={{ color: 'var(--warning)', fontSize: '0.85rem', marginTop: '0.5rem' }}>-2% desde ayer</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
