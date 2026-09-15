import { query } from "./database.js";

const createUsuario = async (req, res) => {
    // Completar con la consulta que crea una canción
    
     const { userid, nombre, password } = req.body;
     const result = await query("INSERT INTO usuario (userid, nombre, password, escuchas) VALUES ($1, $2, $3, 0)", [userid, nombre, password]);
     res.status(201).json({ userid, nombre, password, escuchas: 0});
     // HASHEAR LA CONTRA Y JWTEAR, OSEA CREAR UN TOKEN PARA EL USUARIO (NO SE LO DAMOS POR AHORA, AUNQUE DEBERIAMOS)
}

export {createUsuario};


const getMati = async (req, res) => {
    // COMPARAR CONTRASEÑA CON EL HASH Y DARLE EL TOKEN
    
     const { userid, password } = req.body;
     const result = await query("INSERT INTO usuario (userid, password) VALUES ($1, $2)", [userid, password]);
     res.status(201).json({ userid, password});
}

export {getMati};