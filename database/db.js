const mysql = require('mysql2');

// Configura la conexión a la base de datos
const db = mysql.createConnection({
  host: 'mysql-db',
  user: 'root',
  password: 'root',
  database: 'BD_Sistema_BiBlioteca',
  ssl:{
    rejectUnauthorized: false
  }
});

db.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos');
});

module.exports = db;