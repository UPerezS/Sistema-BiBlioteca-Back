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


// Función para actualizar un libro por su ID
// Función para formatear la fecha a 'YYYY-MM-DD'
function formatDate(fecha) {
  // Suponiendo que 'fecha' es un string en formato 'YYYY/MM/DD':
  const parts = fecha.split('/');
  return `${parts[0]}-${parts[1]}-${parts[2]}`;
}

exports.actualizarLibro = (req, res) => {
  const id = req.params.id;
  const { titulo_libro, autor, fecha_publicacion, genero, estatus_prestamo, estatus } = req.body;

  // Formatear la fecha a 'YYYY-MM-DD'
  const fechaPublicacionFormatted = formatDate(fecha_publicacion);

  const updateQuery = `UPDATE libros 
                       SET titulo_libro = ?, autor = ?, fecha_publicacion = ?, genero = ?, estatus_prestamo = ?, estatus = ?
                       WHERE id_libro = ?`;
  const values = [titulo_libro, autor, fechaPublicacionFormatted, genero, estatus_prestamo, estatus, id];

  db.query(updateQuery, values, (err, result) => {
    if (err) {
      console.error("Error al actualizar el libro:", err);
      res.status(500).send("Error interno al actualizar el libro");
      return;
    }

    if (result.affectedRows === 0) {
      console.log("No se encontró ningún libro con ese ID para actualizar");
      res.status(404).send("No se encontró ningún libro con ese ID para actualizar");
      return;
    }

    console.log("Libro actualizado correctamente");
    res.status(200).send("Libro actualizado correctamente");
  });
};



exports.eliminarLibro = (req, res) => {
  const id = req.params.id;

  const deleteQuery = `DELETE FROM libros WHERE id_libro = ?`;

  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error("Error al eliminar el libro:", err);
      res.status(500).send("Error interno al eliminar el libro");
      return;
    }
    console.log("Libro eliminado correctamente");
    res.status(200).send("Libro eliminado correctamente");
  });
};