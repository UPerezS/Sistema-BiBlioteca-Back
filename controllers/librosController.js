const db = require('../database/db'); // Ajusta la ruta según tu estructura de archivos

// Controlador para insertar un nuevo libro
exports.insertarLibro = (req, res) => {
  const { titulo_libro, autor, fecha_publicacion, genero, estatus_prestamo, estatus } = req.body;
  const insertQuery = 'INSERT INTO libros (titulo_libro, autor, fecha_publicacion, genero, estatus_prestamo, estatus) VALUES (?, ?, ?, ?, ?, ?)';

  db.query(insertQuery, [titulo_libro, autor, fecha_publicacion, genero, estatus_prestamo, estatus], (err, result) => {
    if (err) {
      console.error('Error al insertar el libro:', err);
      res.status(500).send('Error interno del servidor');
      return;
    }
    console.log('Libro insertado correctamente:', result);
    res.status(200).send('Libro insertado correctamente');
  });
};

exports.obtenerLibros = (req, res) => {
  const selectQuery = 'SELECT * FROM libros';

  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error('Error al obtener los libros:', err);
      res.status(500).send('Error interno del servidor');
      return;
    }
    res.status(200).json(results);
  });
};
