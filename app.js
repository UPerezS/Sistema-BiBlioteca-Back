//app.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3500;
const fs = require('fs');
const https = require('https');

app.use(cors());
app.use(express.json());

const allowedOrigins = ['https://localhost:4200', 'http://localhost:4200', 'https://3.20.43.248', 'https://ec2-3-20-43-248.us-east-2.compute.amazonaws.com'];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};
app.use(cors(corsOptions));

// Definición de las Rutas que se usarán.
const db = require('./database/db');
const authRoutes = require('./routes/authRoutes');
const librosRouter = require('./routes/librosRoutes');
const prestamosRouter = require('./routes/prestamosRoutes');

// Aquí se agregarán las Rutas.
app.use('/auth', authRoutes);
app.use('/api', librosRouter);
app.use('/api_prestamos', prestamosRouter);

try {
    const privateKey = fs.readFileSync('./https/nginx.key', 'utf8');
    const certificate = fs.readFileSync('./https/nginx.crt', 'utf8');

    const credentials = {
        key: privateKey,
        cert: certificate
    };

    var httpsServer = https.createServer(credentials, app);
    httpsServer.listen(PORT, () => {
        console.log(`HTTPS Server is running on port ${PORT}`);
    });
    
} catch (e) {
    console.log('\x1b[33m%s\x1b[0m', 'No se pudo deployar en un servidor HTTPS, se usará HTTP');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}