const db = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'cama8836@gmail.com',
      pass: 'apzd dshh jndn ujsy'
    },
    tls: {
      rejectUnauthorized: false
    }
});

exports.registrar = (req, res) => {
    const { nombre, apellido_pa, apellido_ma, correo, contrasena, direccion, telefono, rol, estatus } = req.body;

    if (!nombre || !apellido_pa || !apellido_ma || !correo || !contrasena || !direccion || !telefono) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    bcrypt.hash(contrasena, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error al hashear la contraseña:', err.message);
            return res.status(500).json({ error: 'Error interno del servidor al registrar el usuario' });
        }

        // Datos del nuevo usuario
        const newUser = {
            nombre,
            apellido_pa,
            apellido_ma,
            correo,
            contrasena: hashedPassword,
            direccion,
            telefono,
            rol,
            estatus
        };

        // Registro del usuario en la base de datos
        db.query('INSERT INTO usuarios SET ?', newUser, (dbErr, result) => {
            if (dbErr) {
                console.error('Error al registrar el usuario:', dbErr.message);
                return res.status(500).json({ error: 'Error interno del servidor al registrar el usuario' });
            }

            res.status(201).json({ message: 'Usuario registrado con éxito', userId: result.insertId });
        });
    });
};

exports.login = (req, res) => {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
        return res.status(400).json({ message: 'Por favor, proporcione correo y contraseña' });
    }

    const query = 'SELECT * FROM usuarios WHERE correo = ?';
    db.query(query, [correo], (err, results) => {
        if (err) {
            console.error('Error al consultar la base de datos: ' + err.message);
            return res.status(500).json({ message: 'Error en el servidor' });
        }

        if (results.length > 0) {
            const storedHashedPassword = results[0].contrasena;

            // Comparar el hash de la contraseña proporcionada con el hash almacenado
            bcrypt.compare(contrasena, storedHashedPassword, (compareErr, isMatch) => {
                if (compareErr) {
                    console.error('Error al comparar contraseñas:', compareErr);
                    return res.status(500).json({ message: 'Error interno del servidor' });
                }

                if (isMatch) {
                    const idUsuario = results[0].id_usuario;
                    const rolUsuario = results[0].rol;
                    const correoUsuario = results[0].correo;

                    // Generar un token
                    const token = jwt.sign({ idUsuario, rolUsuario }, 'SQL', { expiresIn: '5m' });

                    req.session.idUsuario = idUsuario; // Agrega el ID de usuario a la sesión

                    const mailOptions = {
                        from: 'cama8836@gmail.com', // Reemplaza con tu dirección de correo electrónico
                        to: correoUsuario,
                        subject: 'Verificación de Correo Electrónico',
                        text: `¡Bienvenido!\n\nTu Token de verificación Fue:\n\n${token}`
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.error('Error al enviar el correo electrónico:', error);
                            return res.status(500).json({ message: 'Error al enviar el correo electrónico' });
                        }

                        console.log('Correo electrónico enviado:', info.response);

                        return res.status(200).json({
                            message: 'Inicio de sesión exitoso',
                            token,
                            usuario: {
                                idUsuario,
                                rolUsuario,
                                nombre: results[0].nombre,
                                correo: results[0].correo
                            }
                        });
                    });
                } else {
                    return res.status(401).json({ message: 'Credenciales incorrectas' });
                }
            });
        } else {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }
    });
};