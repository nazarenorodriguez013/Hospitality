import React, { useState, useEffect } from 'react';
import axios from 'axios';

const POS = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtenemos el menú desde el backend
    axios.get('http://localhost:3000/api/pos/menu')
      .then(response => {
        setCategories(response.data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching menu:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container animate-fade-in">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', color: 'white' }}>Punto de Venta</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Menú y Comandero</p>
        </div>
        <button className="btn btn-outline">Ver Mesas</button>
      </div>

      {loading ? (
        <p style={{ color: 'white' }}>Cargando menú...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {categories.map(category => (
            <div key={category.id} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
              <h2 style={{ color: 'white', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.8rem', marginBottom: '1rem' }}>
                {category.name}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {category.products.map(product => (
                  <div key={product.id} className="glass-card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ color: 'white', margin: 0, fontSize: '0.95rem' }}>{product.name}</h4>
                      <span className="badge badge-success" style={{ marginTop: '0.5rem', fontSize: '0.7rem' }}>${product.price}</span>
                    </div>
                    <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer' }}>+</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default POS;
