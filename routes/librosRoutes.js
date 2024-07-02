const express = require('express');
const bodyParser = require('body-parser');
const booksController = require('./booksController');

const app = express();

// Middleware para parsear cuerpos de peticiones JSON y formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Usar el controlador de libros
app.use('/api', booksController);

// Puerto en el que escucha el servidor
const port = process.env.PORT || 3000;

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
