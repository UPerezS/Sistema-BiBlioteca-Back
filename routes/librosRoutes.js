//librosRoutes.js
const express = require('express');
const router = express.Router();
const librosController = require('../controllers/librosController');

router.post('/libros', librosController.insertarLibro);
router.get('/libros', librosController.obtenerLibros);
router.put('/libros/:id', librosController.actualizarLibro);
router.delete('/libros/:id', librosController.eliminarLibro);

module.exports = router;
