const express = require('express');
const router = express.Router();
const librosController = require('../controllers/librosController');


// Ruta para insertar un nuevo libro
router.post('/libros', librosController.insertarLibro);
router.get('/libros', librosController.obtenerLibros);

module.exports = router;
