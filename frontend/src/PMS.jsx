import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PMS = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtenemos las habitaciones desde el backend
    axios.get('http://localhost:3000/api/pms/rooms')
      .then(response => {
        setRooms(response.data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Limpia': return <span className="badge badge-success">Limpia</span>;
      case 'Sucia': return <span className="badge badge-danger">Sucia</span>;
      case 'Inspeccionada': return <span className="badge badge-warning">Insp</span>;
      default: return <span className="badge badge-neutral">{status}</span>;
    }
  };

  return (
    <div className="container animate-fade-in">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', color: 'white' }}>Recepción</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Gestión de estado de habitaciones</p>
        </div>
        <button className="btn btn-primary">Nuevo Check-In</button>
      </div>

      {loading ? (
        <p style={{ color: 'white' }}>Cargando habitaciones...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
          {rooms.map(room => (
            <div key={room.id} className="glass-card" style={{ padding: '1.2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
              <h2 style={{ color: 'white', fontSize: '1.8rem', margin: 0 }}>{room.room_number}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>{room.room_type} ({room.capacity} pax)</p>
              {getStatusBadge(room.status)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PMS;
