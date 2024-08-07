const express = require('express');
const router = express.Router();
const prestamosController = require('../controllers/prestamosController');

router.post('/prestamos', prestamosController.registrarPrestamo);
router.put('/prestamos/:id_prestamo', prestamosController.devolverLibro);
router.get('/prestamos/:id_usuario', prestamosController.historialPrestamos);
router.get('/prestamos', prestamosController.todosPrestamos);

module.exports = router;