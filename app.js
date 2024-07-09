//app.js
const express = require('express');
const cors = require('cors');
const app = express();
const librosRouter= require ('./routes/librosRoutes');

const Libro= require ('./controllers/librosController');
const port = process.env.PORT || 3500;

app.use(cors());
app.use(express.json());

// Definición de las Rutas que se usarán.
const db = require('./database/db');
const authRoutes = require('./routes/authRoutes');

// Aquí se agregarán las Rutas.
app.use('/auth', authRoutes);
app.use('/api', librosRouter);

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});