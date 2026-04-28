const express = require('express');
const router = express.Router();
const pmsController = require('../controllers/pmsController');

// Rutas de PMS (Gestión Hotelera)
// GET /api/pms/rooms -> Lista de habitaciones
router.get('/rooms', pmsController.getRooms);

// GET /api/pms/reservations/active -> Lista de huéspedes actuales
router.get('/reservations/active', pmsController.getActiveReservations);

module.exports = router;
