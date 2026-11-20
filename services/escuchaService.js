import { query } from "./database.js";

// Canciones que escuchó un usuario, con su cantidad de reproducciones.
export const listarEscuchas = async (usuarioId) => {
    const result = await query(
        `SELECT c.id, c.nombre, e.reproducciones
         FROM escucha e
         JOIN cancion c ON c.id = e.cancion_id
         WHERE e.usuario_id = $1`,
        [usuarioId]
    );

    return result.rows;
};

// Registra una escucha: si el usuario ya había escuchado la canción suma 1,
// si no, crea el registro con 1 reproducción. Después revisa si ya es fan.
// Si la canción no existe, Postgres tira el error 23503 (lo maneja el controller).
export const registrarEscucha = async (usuarioId, cancionId) => {
    // ¿Este usuario ya había escuchado esta canción?
    const existente = await query(
        `SELECT id FROM escucha
         WHERE usuario_id = $1 AND cancion_id = $2`,
        [usuarioId, cancionId]
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
            [usuarioId, cancionId]
        );
    }

    // EJERCICIO 6: si escuchó más de 10 canciones, es fan
    const cantidad = await query(
        `SELECT COUNT(*) FROM escucha
         WHERE usuario_id = $1`,
        [usuarioId]
    );

    if (Number(cantidad.rows[0].count) > 10) {
        await query(
            `UPDATE usuario
             SET fan = true
             WHERE id = $1`,
            [usuarioId]
        );
    }

    return result.rows[0];
};