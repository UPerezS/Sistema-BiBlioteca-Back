const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3500;

app.use(cors());
app.use(express.json());

//Definición de las Rutas que se usaran.

//Aqui se Agregaran las Rutas.

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});