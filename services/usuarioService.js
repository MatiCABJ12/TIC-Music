import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "./database.js";

// Crea el usuario con la contraseña hasheada.
// Si el nombre ya existe, Postgres tira el error 23505 (lo maneja el controller).
export const crearUsuario = async (nombre, password) => {
    const passwordHasheada = await bcrypt.hash(password, 10);

    const result = await query(
        `INSERT INTO usuario (nombre, password, escuchas)
         VALUES ($1, $2, 0)
         RETURNING nombre, escuchas, rol`,
        [nombre, passwordHasheada]
    );

    return result.rows[0];
};

// Devuelve { token, usuario } si las credenciales son correctas, o null si no.
export const autenticarUsuario = async (nombre, password) => {
    const result = await query(
        `SELECT id, nombre, password, rol
         FROM usuario
         WHERE nombre = $1`,
        [nombre]
    );

    if (result.rows.length === 0) {
        return null;
    }

    const usuario = result.rows[0];

    const contrasenaValida = await bcrypt.compare(password, usuario.password);

    if (!contrasenaValida) {
        return null;
    }

    const token = jwt.sign(
        {
            id: usuario.id,
            nombre: usuario.nombre,
            rol: usuario.rol
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    return {
        token,
        usuario: {
            nombre: usuario.nombre,
            rol: usuario.rol
        }
    };
};