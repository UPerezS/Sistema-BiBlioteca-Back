const db = require('../database/db');

exports.registrarPrestamo = (req, res) => {
  const { id_usuario, id_libro } = req.body;

  // Verificar si el libro está disponible
  db.query('SELECT estatus_prestamo FROM libros WHERE id_libro = ?', [id_libro], (err, result) => {
    if (err) {
      console.error('Error al verificar disponibilidad del libro:', err);
      res.status(500).json({ message: 'Error interno del servidor' });
      return;
    }
  
    if (!result[0]) {
      res.status(404).json({ message: 'Libro no encontrado' });
      return;
    }
  
    if (result[0].estatus_prestamo) { // Cambiar la condición para que sea true
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
      db.query('UPDATE libros SET estatus_prestamo = ? WHERE id_libro = ?', [1, id_libro], (err, result) => { // Cambiar el valor a 1
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
  let id_libro; // Definir la variable id_libro en un ámbito superior

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

    id_libro = result[0].id_libro; // Asignar el valor de id_libro

    // Actualizar fecha de devolución
    db.query('UPDATE prestamos SET fecha_devolucion = ? WHERE id_prestamo = ?', [new Date(), id_prestamo], (err, result) => {
      if (err) {
        console.error('Error al actualizar fecha de devolución:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
        return;
      }

      // Actualizar estatus del libro
      db.query('UPDATE libros SET estatus_prestamo = ? WHERE id_libro = ?', [0, id_libro], (err, result) => { // Cambiar el valor a 0
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

exports.historialPrestamos = (req, res) => {
    const id_usuario = req.params.id_usuario; // Obtener el ID del usuario de los parámetros de la ruta
  
    // Consultar el historial de préstamos del usuario
    db.query('SELECT p.id_prestamo, p.fecha_prestamo, p.fecha_devolucion, l.titulo_libro FROM prestamos p INNER JOIN libros l ON p.id_libro = l.id_libro WHERE p.id_usuario = ?', [id_usuario], (err, result) => {
      if (err) {
        console.error('Error al obtener historial de préstamos:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
        return;
      }
  
      res.status(200).json(result);
    });
  };

  exports.todosPrestamos = (req, res) => {
    // Consultar todos los préstamos
    db.query('SELECT p.id_prestamo, p.fecha_prestamo, p.fecha_devolucion, u.nombre AS usuario, l.titulo_libro AS libro FROM prestamos p INNER JOIN usuarios u ON p.id_usuario = u.id_usuario INNER JOIN libros l ON p.id_libro = l.id_libro', (err, result) => {
      if (err) {
        console.error('Error al obtener todos los préstamos:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
        return;
      }
  
      res.status(200).json(result);
    });
  };