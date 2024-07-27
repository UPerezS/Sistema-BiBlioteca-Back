const express = require('express');
const router = express.Router();
const prestamosController = require('../controllers/prestamosController');

router.post('/prestamos', prestamosController.registrarPrestamo);
router.put('/prestamos/:id_prestamo', prestamosController.devolverLibro);

module.exports = router;