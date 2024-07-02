const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Directorio donde se almacenarán los archivos subidos

// Ejemplo de una lista de libros (simulado como una variable en memoria)
let books = [];

// Ruta para obtener todos los libros
router.get('/books', (req, res) => {
  res.json(books);
});

// Ruta para subir un libro
router.post('/books', upload.single('file'), (req, res) => {
  const { title, author } = req.body;
  const file = req.file;

  // Aquí podrías guardar el archivo y los detalles en una base de datos o en algún almacenamiento persistente

  books.push({ title, author, filePath: file.path }); // Añadir libro a la lista (en este caso, al array)

  res.status(201).json({ message: 'Libro subido correctamente' });
});

// Ruta para borrar un libro por su título
router.delete('/books/:title', (req, res) => {
  const titleToDelete = req.params.title;

  // Filtrar el array de libros para eliminar el libro con el título especificado
  books = books.filter(book => book.title !== titleToDelete);

  res.json({ message: 'Libro eliminado correctamente' });
});

// Ruta para actualizar un libro por su título
router.put('/books/:title', (req, res) => {
  const titleToUpdate = req.params.title;
  const { author } = req.body;

  // Encontrar el libro por su título y actualizar el autor
  books.forEach(book => {
    if (book.title === titleToUpdate) {
      book.author = author;
    }
  });

  res.json({ message: 'Libro actualizado correctamente' });
});

module.exports = router;
