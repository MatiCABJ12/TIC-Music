import "dotenv/config";
import { query } from "./database.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const createUsuario = async (req, res) => {
    try {
        const { nombre, password } = req.body;

        if (!nombre || !password) {
            return res.status(400).json({
                error: "Faltan datos: nombre y contraseña son obligatorios"
            });
        }

        const passwordHasheada = await bcrypt.hash(password, 10);

        const result = await query(
            `INSERT INTO usuario (nombre, password, escuchas)
             VALUES ($1, $2, 0)
             RETURNING nombre, escuchas`,
            [nombre, passwordHasheada]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);

        if (error.code === "23505") {
            return res.status(409).json({
                error: "Ese nombre de usuario ya está registrado"
            });
        }

        res.status(500).json({
            error: error.message
        });
    }
};

export { createUsuario };

const getMati = async (req, res) => {
    try {
        const { nombre, password } = req.body;

        if (!nombre || !password) {
            return res.status(400).json({
                error: "Faltan datos: nombre y contraseña son obligatorios"
            });
        }

        const result = await query(
            `SELECT id, nombre, password
             FROM usuario
             WHERE nombre = $1`,
            [nombre]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                error: "Nombre de usuario o contraseña incorrectos"
            });
        }

        const usuario = result.rows[0];

        const contrasenaValida = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!contrasenaValida) {
            return res.status(401).json({
                error: "Nombre de usuario o contraseña incorrectos"
            });
        }

        
        const token = jwt.sign(
            {
                id: usuario.id,
                nombre: usuario.nombre
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            token,
            usuario: {
                nombre: usuario.nombre
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
};

export { getMati };

const escucho = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({
            error: "Falta un token"
        });
    }

    let verificacion;

    try {
        verificacion = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

    } catch (error) {
        return res.status(401).json({
            error: "El token no ha sido verificado correctamente o ha expirado"
        });
    }

    try {
        const result = await query(
            `SELECT c.id, c.nombre, e.reproducciones
             FROM escucha e
             JOIN cancion c ON c.id = e.cancion_id
             WHERE e.usuario_id = $1`,
            [verificacion.id]
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
};

export { escucho };
