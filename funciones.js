import { query } from "./database.js";

const createUsuario = async (req, res) => {
    // Completar con la consulta que crea una canción
    try{
     const { userid, nombre, password } = req.body;


     if (!userid || !nombre || !password) {
        return res.status(400).json({ error: 'Faltan datos: nombre, mail y contrasena son obligatorios' });
      }
    const passwordHasheada = await bcrypt.hash(password, 10);

    const result = await query("INSERT INTO usuario (id, nombre, password, escuchas) VALUES ($1, $2, $3, 0)", [userid, nombre, passwordHasheada]);

    res.status(201).json(resultado.rows[0]);
    

     // HASHEAR LA CONTRA Y JWTEAR, OSEA CREAR UN TOKEN PARA EL USUARIO (NO SE LO DAMOS POR AHORA, AUNQUE DEBERIAMOS)
}
catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Ese mail o nombre de usuario ya está registrado' });
    }
    res.status(500).json({ error: error.message });
  }



}

export {createUsuario};


const getMati = async (req, res) => {
    // COMPARAR CONTRASEÑA CON EL HASH Y DARLE EL TOKEN
    
    try{
        const { userid, password } = req.body;
        if (!userid || !password) {
            return res.status(401).json({ error: 'Faltan datos: mail y password son obligatorios' });
        }      

        const result = await query("SELECT id, password FROM usuario WHERE id = $1", [userid]);

        if (resultado.rows.length === 0) {
            return res.status(400).json({ error: 'Mail o contraseña incorrectos' });
          }

        const usuario = resultado.rows[0];
        const contrasenaValida = await bcrypt.compare(password, usuario.password);
      
        if (!contrasenaValida) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
          }
        
        const token = jwt.sign(
            { id: usuario.id, nombre: usuario.nombre },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
          );
      
      
          res.json({
            token,
            usuario: {
              id_usuario: usuario.id_usuario,
              nombre: usuario.nombre,
              mail: usuario.mail,
              puntos_totales: usuario.puntos_totales,
            },
          });
      
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      } 
     
}

export {getMati};