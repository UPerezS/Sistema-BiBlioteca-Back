const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3500;

app.use(cors());
app.use(express.json());

// Definición de las Rutas que se usarán.
const db = require('./database/db');
const authRoutes = require('./routes/authRoutes');
const librosRouter = require('./routes/librosRoutes');
const prestamosRouter = require('./routes/prestamosRoutes');

// Aquí se agregarán las Rutas.
app.use('/auth', authRoutes);
app.use('/api', librosRouter);
app.use('/api_prestamos', prestamosRouter);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});