import "dotenv/config";
import { query } from "../services/database.js";
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


const getMati = async (req, res) => {
    try {
        const { nombre, password } = req.body;

        if (!nombre || !password) {
            return res.status(400).json({
                error: "Faltan datos: nombre y contraseña son obligatorios"
            });
        }

        const result = await query(
            `SELECT id, nombre, password, rol
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
             nombre: usuario.nombre,
             rol: usuario.rol
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            token,
            usuario: {
            nombre: usuario.nombre,
            rol: usuario.rol
}
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
};


const escucho = async (req, res) => {
    try {
        const result = await query(
            `SELECT c.id, c.nombre, e.reproducciones
             FROM escucha e
             JOIN cancion c ON c.id = e.cancion_id
             WHERE e.usuario_id = $1`,
            [req.user.id]
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};



// EJERCICIO 5 NUEVAS FUNCIONES

const createCancion = async (req, res) => { // UN ADMIN CREA UNA CANCION
    try {
        const { nombre } = req.body;

        if (!nombre) {
            return res.status(400).json({ error: "Falta el nombre de la canción" });
        }

        const result = await query(
            `INSERT INTO cancion (nombre)
             VALUES ($1)
             RETURNING id, nombre`,
            [nombre]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};



const updateCancion = async (req, res) => { // EL ADMIN MODIFICA EL NOMBRE DE LA CANCION
    try {
        const { id, nombre } = req.body;

        if (!id || !nombre) {
            return res.status(400).json({ error: "Faltan datos: id y nombre son obligatorios" });
        }

        const result = await query(
            `UPDATE cancion
             SET nombre = $1
             WHERE id = $2
             RETURNING id, nombre`,
            [nombre, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No existe una canción con ese id" });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


const deleteCancion = async (req, res) => { // EL ADMIN BORRA UNA CANCION
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ error: "Falta el id de la canción" });
        }

        const result = await query(
            `DELETE FROM cancion
             WHERE id = $1
             RETURNING id, nombre`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No existe una canción con ese id" });
        }

        res.json({ mensaje: "Canción borrada", cancion: result.rows[0] });

    } catch (error) {
        console.error(error);

        if (error.code === "23503") {
            return res.status(409).json({ error: "No se puede borrar: la canción tiene escuchas registradas" });
        }

        res.status(500).json({ error: error.message });
    }
};


const registrarEscucha = async (req, res) => {
    try {
        const { id } = req.body;          // id de la canción
        const usuarioId = req.user.id;    // sale del token, NO del body

        if (!id) {
            return res.status(400).json({ error: "Falta el id de la canción" });
        }

        // ¿Este usuario ya había escuchado esta canción?
        const existente = await query(
            `SELECT id FROM escucha
             WHERE usuario_id = $1 AND cancion_id = $2`,
            [usuarioId, id]
        );

        let result;

        if (existente.rows.length > 0) {
            // Ya la escuchó: le sumo 1 a reproducciones
            result = await query(
                `UPDATE escucha
                 SET reproducciones = reproducciones + 1
                 WHERE id = $1
                 RETURNING *`,
                [existente.rows[0].id]
            );
        } else {
            // Primera vez: creo el registro con 1 reproducción
            result = await query(
                `INSERT INTO escucha (usuario_id, cancion_id, reproducciones)
                 VALUES ($1, $2, 1)
                 RETURNING *`,
                [usuarioId, id]
            );
        }

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);

        if (error.code === "23503") {
            return res.status(404).json({ error: "La canción no existe" });
        }

        res.status(500).json({ error: error.message });
    }
};


// CHEQUEA LOS NUMEROS DE ALGUNAS RESPUESTAS TIPO 409
// LA ULTIMA FUNCION NO LA ENTENDI, VERIFICALA
// FALTA EL EJERCICIO 6
// HOSTEARLO EN VERCELL Y PONERLO LINDO
//CHEQUEAR EL TEMA DE LOS ROLES

export {  createUsuario, getMati, escucho, createCancion, updateCancion, deleteCancion, registrarEscucha };