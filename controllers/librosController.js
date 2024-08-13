const db = require ('../database/db');

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

exports.actualizarLibro = (req, res) => {
  const id = req.params.id;
  const { titulo_libro, autor, fecha_publicacion, genero, estatus_prestamo, estatus } = req.body;

  let fechaPublicacionFormatted = null;
  if (fecha_publicacion) {
    const date = new Date(fecha_publicacion);
    fechaPublicacionFormatted = date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  }

  const updateQuery = `
    UPDATE libros 
    SET titulo_libro = ?, autor = ?, fecha_publicacion = ?, genero = ?, estatus_prestamo = ?, estatus = ?
    WHERE id_libro = ?
  `;
  const values = [titulo_libro, autor, fechaPublicacionFormatted, genero, estatus_prestamo, estatus, id];

  db.query(updateQuery, values, (err, result) => {
    if (err) {
      console.error("Error al actualizar el libro:", err);
      res.status(500).json({ message: "Error interno al actualizar el libro" });
      return;
    }

    if (result.affectedRows === 0) {
      console.log("No se encontró ningún libro con ese ID para actualizar");
      res.status(404).json({ message: "No se encontró ningún libro con ese ID para actualizar" });
      return;
    }

    console.log("Libro actualizado correctamente");
    res.status(200).json({ message: "Libro actualizado correctamente" });
  });
};

exports.eliminarLibro = (req, res) => {
  const id = req.params.id;
  
  const updateQuery = `UPDATE libros SET estatus = ? WHERE id_libro = ?`;
  const values = [false, id];

  db.query(updateQuery, values, (err, result) => {
    if (err) {
      console.error("Error al desactivar el libro:", err);
      res.status(500).json({ message: "Error interno al desactivar el libro" });
      return;
    }

    if (result.affectedRows === 0) {
      console.log("No se encontró ningún libro con ese ID para desactivar");
      res.status(404).json({ message: "No se encontró ningún libro con ese ID para desactivar" });
      return;
    }

    console.log("Libro desactivado correctamente");
    res.status(200).json({ message: "Libro desactivado correctamente" });
  });
};

exports.filtrarLibros = (req, res) => {
  const { titulo, autor, genero } = req.query;
  let selectQuery = 'SELECT * FROM libros WHERE 1=1';
  const queryParams = [];

  if (titulo) {
    selectQuery += ' AND titulo_libro LIKE ?';
    queryParams.push(`%${titulo}%`);
  }

  if (autor) {
    selectQuery += ' AND autor LIKE ?';
    queryParams.push(`%${autor}%`);
  }

  if (genero) {
    selectQuery += ' AND genero LIKE ?';
    queryParams.push(`%${genero}%`);
  }

  db.query(selectQuery, queryParams, (err, results) => {
    if (err) {
      console.error('Error al filtrar los libros:', err);
      res.status(500).send('Error interno del servidor');
      return;
    }
    res.status(200).json(results);
  });

};