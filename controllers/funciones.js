import "dotenv/config";
import * as usuarioService from "../services/usuarioService.js";
import * as cancionService from "../services/cancionService.js";
import * as escuchaService from "../services/escuchaService.js";


const createUsuario = async (req, res) => {
    try {
        const { nombre, password } = req.body ?? {};

        if (!nombre || !password) {
            return res.status(400).json({
                error: "Faltan datos: nombre y contraseña son obligatorios"
            });
        }

        const usuario = await usuarioService.crearUsuario(nombre, password);

        res.status(201).json(usuario);

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
        const { nombre, password } = req.body ?? {};

        if (!nombre || !password) {
            return res.status(400).json({
                error: "Faltan datos: nombre y contraseña son obligatorios"
            });
        }

        const sesion = await usuarioService.autenticarUsuario(nombre, password);

        if (!sesion) {
            return res.status(401).json({
                error: "Nombre de usuario o contraseña incorrectos"
            });
        }

        res.json(sesion);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
};


const escucho = async (req, res) => {
    try {
        const canciones = await escuchaService.listarEscuchas(req.user.id);

        // Si todavía no escuchó nada, devuelve 0 en vez de una lista vacía
        if (canciones.length === 0) {
            return res.json(0);
        }

        res.json(canciones);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


// EJERCICIO 5

const createCancion = async (req, res) => { // UN ADMIN CREA UNA CANCION
    try {
        const { nombre } = req.body ?? {};

        if (!nombre) {
            return res.status(400).json({ error: "Falta el nombre de la canción" });
        }

        const cancion = await cancionService.crearCancion(nombre);

        res.status(201).json(cancion);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


const updateCancion = async (req, res) => { // EL ADMIN MODIFICA EL NOMBRE DE LA CANCION
    try {
        const { id, nombre } = req.body ?? {};

        if (!id || !nombre) {
            return res.status(400).json({ error: "Faltan datos: id y nombre son obligatorios" });
        }

        const cancion = await cancionService.actualizarCancion(id, nombre);

        if (!cancion) {
            return res.status(404).json({ error: "No existe una canción con ese id" });
        }

        res.json(cancion);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


const deleteCancion = async (req, res) => { // EL ADMIN BORRA UNA CANCION
    try {
        const { id } = req.body ?? {};

        if (!id) {
            return res.status(400).json({ error: "Falta el id de la canción" });
        }

        const cancion = await cancionService.borrarCancion(id);

        if (!cancion) {
            return res.status(404).json({ error: "No existe una canción con ese id" });
        }

        res.json({ mensaje: "Canción borrada", cancion });

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
        const { id } = req.body ?? {};    // id de la canción
        const usuarioId = req.user.id;    // sale del token, NO del body

        if (!id) {
            return res.status(400).json({ error: "Falta el id de la canción" });
        }

        const escucha = await escuchaService.registrarEscucha(usuarioId, id);

        res.status(201).json(escucha);

    } catch (error) {
        console.error(error);

        if (error.code === "23503") {
            return res.status(404).json({ error: "La canción no existe" });
        }

        res.status(500).json({ error: error.message });
    }
};


export {  createUsuario, getMati, escucho, createCancion, updateCancion, deleteCancion, registrarEscucha };