const express = require('express');
const router = express.Router();
const posController = require('../controllers/posController');
const posTransactionController = require('../controllers/posTransactionController');
const { authenticateToken } = require('../controllers/authController');

// Rutas protegidas
router.use(authenticateToken);

router.get('/menu', posController.getMenu);
router.get('/tables', posController.getTables);
router.post('/orders', posTransactionController.createOrder);

module.exports = router;
