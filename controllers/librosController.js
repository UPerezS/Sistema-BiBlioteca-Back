const db = require('../database/db');

exports.insertarLibro = (req, res) => {
  const { titulo_libro, autor, fecha_publicacion, genero, estatus_prestamo, estatus, imagen } = req.body;
  const insertQuery = 'INSERT INTO libros (titulo_libro, autor, fecha_publicacion, genero, estatus_prestamo, estatus, imagen) VALUES (?, ?, ?, ?, ?, ?, ?)';

  db.query(insertQuery, [titulo_libro, autor, fecha_publicacion, genero, estatus_prestamo, estatus, imagen], (err, result) => {
    if (err) {
      console.error('Error al insertar el libro:', err);
      res.status(500).json({ message: 'Error interno del servidor' });
      return;
    }
    console.log('Libro insertado correctamente:', result);
    res.status(200).json({ message: 'Libro insertado correctamente', libroId: result.insertId });
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


function formatDate(fecha) {
  const parts = fecha.split('/');
  return `${parts[0]}-${parts[1]}-${parts[2]}`;
}

exports.actualizarLibro = (req, res) => {
  const id = req.params.id;
  const { titulo_libro, autor, fecha_publicacion, genero, estatus_prestamo, estatus } = req.body;

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