import { query } from "./database.js";

export const crearCancion = async (nombre) => {
    const result = await query(
        `INSERT INTO cancion (nombre)
         VALUES ($1)
         RETURNING id, nombre`,
        [nombre]
    );

    return result.rows[0];
};

// Devuelve la canción actualizada, o null si no existe ese id.
export const actualizarCancion = async (id, nombre) => {
    const result = await query(
        `UPDATE cancion
         SET nombre = $1
         WHERE id = $2
         RETURNING id, nombre`,
        [nombre, id]
    );

    return result.rows[0] ?? null;
};

// Devuelve la canción borrada, o null si no existe ese id.
export const borrarCancion = async (id) => {
    const result = await query(
        `DELETE FROM cancion
         WHERE id = $1
         RETURNING id, nombre`,
        [id]
    );

    return result.rows[0] ?? null;
};