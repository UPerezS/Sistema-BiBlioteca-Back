const express = require('express');
const router = express.Router();
const librosController = require('../controllers/librosController');


// Ruta para insertar un nuevo libro
router.post('/libros', librosController.insertarLibro);
router.get('/libros', librosController.obtenerLibros);
// Ruta para actualizar un libro por su ID
router.put('/libros/:id', librosController.actualizarLibro);
// Ruta para eliminar un libro por su ID
router.delete('/libros/:id', librosController.eliminarLibro);

module.exports = router;
