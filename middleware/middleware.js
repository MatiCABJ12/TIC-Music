import jwt from "jsonwebtoken";


export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
if (!authHeader)  {
    return res.status(401).send({error: 'No llego ningun token en los headers'});
}
const token = authHeader.split(' ')[1];
try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; //modifica el req agregando todo lo que viene en el token (id, nombre, rol)
    next();
 } // Pasa al proximo middleware  
 catch (err) {
    console.error(err);
    return res.status(401).send({error: 'Unauthorized'});
 }
}

export const verifyAdmin = (req, res, next) => {
    if (req.user.rol !== "Admin") {
        return res.status(403).send({ error: "Se necesita rol admin" });
    }
    next();
};