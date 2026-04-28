const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pmsRoutes = require('./routes/pmsRoutes');
const posRoutes = require('./routes/posRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas de los módulos
app.use('/api/auth', authRoutes);
app.use('/api/pms', pmsRoutes);
app.use('/api/pos', posRoutes);

// Ruta de prueba de salud (Health check)
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'ERP Hospitality API is running',
        timestamp: new Date()
    });
});

// Arrancar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor ERP corriendo en http://localhost:${PORT}`);
});
