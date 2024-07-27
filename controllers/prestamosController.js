const db = require('../database/db');

exports.registrarPrestamo = (req, res) => {
  const { id_usuario, id_libro } = req.body;

  // Verificar si el libro está disponible
  db.query('SELECT estatus FROM libros WHERE id_libro = ?', [id_libro], (err, result) => {
    if (err) {
      console.error('Error al verificar disponibilidad del libro:', err);
      res.status(500).json({ message: 'Error interno del servidor' });
      return;
    }
  
    if (!result[0]) {
      res.status(404).json({ message: 'Libro no encontrado' });
      return;
    }
  
    if (!result[0].estatus) {
      res.status(400).json({ message: 'El libro no está disponible' });
      return;
    }
  

    // Registrar préstamo
    const prestamo = {
      id_usuario,
      id_libro,
      fecha_prestamo: new Date(),
      fecha_devolucion: null
    };

    db.query('INSERT INTO prestamos SET ?', prestamo, (err, result) => {
      if (err) {
        console.error('Error al registrar préstamo:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
        return;
      }

      // Actualizar estatus del libro
      db.query('UPDATE libros SET estatus = ? WHERE id_libro = ?', [0, id_libro], (err, result) => {
        if (err) {
          console.error('Error al actualizar estatus del libro:', err);
          res.status(500).json({ message: 'Error interno del servidor' });
          return;
        }
      
        res.status(201).json({ message: 'Préstamo registrado con éxito' });
      });
    });
  });
};

exports.devolverLibro = (req, res) => {
  const { id_prestamo } = req.params;

  // Verificar si el préstamo existe
  db.query('SELECT * FROM prestamos WHERE id_prestamo = ?', [id_prestamo], (err, result) => {
    if (err) {
      console.error('Error al verificar préstamo:', err);
      res.status(500).json({ message: 'Error interno del servidor' });
      return;
    }

    if (!result[0]) {
      res.status(404).json({ message: 'Préstamo no encontrado' });
      return;
    }

    // Actualizar fecha de devolución
    db.query('UPDATE prestamos SET fecha_devolucion = ? WHERE id_prestamo = ?', [new Date(), id_prestamo], (err, result) => {
      if (err) {
        console.error('Error al actualizar fecha de devolución:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
        return;
      }

      // Actualizar estatus del libro
      db.query('UPDATE libros SET estatus = ? WHERE id_libro = ?', [1, result[0] ? result[0].id_libro : null], (err, result) => {
        if (err) {
          console.error('Error al actualizar estatus del libro:', err);
          res.status(500).json({ message: 'Error interno del servidor' });
          return;
        }
      
        res.status(200).json({ message: 'Libro devuelto con éxito' });
      });
    });
  });
};